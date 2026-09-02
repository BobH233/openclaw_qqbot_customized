import { questionGatewayRuntime } from 'openclaw/plugin-sdk/question-gateway-runtime';
import type { PluginLogger } from '../utils/plugin-logger.js';

type QuestionScope = 'c2c' | 'group';

interface PendingQuestionTarget {
  questionId: string;
  resolving: boolean;
  cleanupTimer: ReturnType<typeof setTimeout>;
}

const QUESTION_TARGET_TTL_MS = 24 * 60 * 60 * 1000;
const STAGED_QUESTION_TTL_MS = 5 * 60 * 1000;
const pendingTargets = new Map<string, PendingQuestionTarget>();
const stagedQuestions = new Map<string, Array<{ questionId: string; expiresAtMs: number }>>();

function targetKey(accountId: string, scope: QuestionScope, targetId: string): string {
  return `${accountId}:${scope}:${targetId}`;
}

export function hasPendingQuestionTarget(params: {
  accountId: string;
  scope: QuestionScope;
  targetId: string;
}): boolean {
  return pendingTargets.has(targetKey(params.accountId, params.scope, params.targetId));
}

function stagedKey(accountId: string, text: string): string {
  return `${accountId}:${text.trim()}`;
}

export function stagePendingQuestionPayload(params: {
  payload: unknown;
  accountId: string;
  text: string;
}): boolean {
  const questionId = questionGatewayRuntime.readAskUserQuestionId(params.payload as never);
  if (!questionId) return false;

  const key = stagedKey(params.accountId, params.text);
  const now = Date.now();
  const queue = (stagedQuestions.get(key) ?? []).filter((entry) => entry.expiresAtMs > now);
  if (!queue.some((entry) => entry.questionId === questionId)) {
    queue.push({ questionId, expiresAtMs: now + STAGED_QUESTION_TTL_MS });
  }
  stagedQuestions.set(key, queue);
  return true;
}

function takeStagedQuestionId(accountId: string, text: string): string | undefined {
  const key = stagedKey(accountId, text);
  const now = Date.now();
  const queue = (stagedQuestions.get(key) ?? []).filter((entry) => entry.expiresAtMs > now);
  const entry = queue.shift();
  if (queue.length > 0) stagedQuestions.set(key, queue);
  else stagedQuestions.delete(key);
  return entry?.questionId;
}

export function registerPendingQuestionTarget(params: {
  payload?: unknown;
  text?: string;
  accountId: string;
  scope: QuestionScope;
  targetId: string;
  log?: PluginLogger;
}): boolean {
  const payloadQuestionId = params.payload
    ? questionGatewayRuntime.readAskUserQuestionId(params.payload as never)
    : undefined;
  const stagedQuestionId = params.text
    ? takeStagedQuestionId(params.accountId, params.text)
    : undefined;
  const questionId = payloadQuestionId ?? stagedQuestionId;
  if (!questionId) return false;

  const key = targetKey(params.accountId, params.scope, params.targetId);
  const existing = pendingTargets.get(key);
  if (existing?.questionId === questionId) return true;
  if (existing) clearTimeout(existing.cleanupTimer);

  const target: PendingQuestionTarget = {
    questionId,
    resolving: false,
    cleanupTimer: setTimeout(() => {
      if (pendingTargets.get(key) === target) pendingTargets.delete(key);
    }, QUESTION_TARGET_TTL_MS),
  };
  target.cleanupTimer.unref?.();
  pendingTargets.set(key, target);

  questionGatewayRuntime.registerChannelDelivery({
    questionId,
    deliveryId: `qqbot-plain-reply:${key}:${questionId}`,
    finalize: () => {
      if (pendingTargets.get(key) !== target) return;
      clearTimeout(target.cleanupTimer);
      pendingTargets.delete(key);
    },
  });

  params.log?.info(`registered QQ plain-text answer target id=${questionId}`);
  return true;
}

export async function resolvePendingQuestionTarget(params: {
  accountId: string;
  scope: QuestionScope;
  targetId: string;
  text: string;
  cfg: any;
  senderId: string;
  log?: PluginLogger;
}): Promise<boolean> {
  const key = targetKey(params.accountId, params.scope, params.targetId);
  const target = pendingTargets.get(key);
  const answer = params.text.trim();
  if (!target || target.resolving || !answer) return false;

  target.resolving = true;
  try {
    const numericChoice = /^[1-9]\d*$/.test(answer) ? Number(answer) - 1 : undefined;
    const result = await questionGatewayRuntime.resolveOption({
      cfg: params.cfg,
      questionId: target.questionId,
      senderId: params.senderId,
      clientDisplayName: `QQ Bot question (${params.senderId})`,
      ...(numericChoice === undefined
        ? { optionValue: answer }
        : { optionIndex: numericChoice }),
    });

    if (result.status === 'answered' || result.status === 'already-terminal') {
      clearTimeout(target.cleanupTimer);
      if (pendingTargets.get(key) === target) pendingTargets.delete(key);
      params.log?.info(`resolved QQ plain-text answer id=${target.questionId} status=${result.status}`);
      return true;
    }

    target.resolving = false;
    return false;
  } catch (error) {
    target.resolving = false;
    params.log?.warn(`failed to resolve QQ answer id=${target.questionId}: ${String(error)}`);
    return false;
  }
}
