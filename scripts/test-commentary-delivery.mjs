import assert from 'node:assert/strict';

const replyRuntimeModule = process.env.OPENCLAW_REPLY_RUNTIME
  ?? 'openclaw/plugin-sdk/reply-runtime';

const FIRST = '让我读取一下这个文件...';
const SECOND = '文件内容是...';
const FINAL = '我已经完成了文件的读取';

const [plugin, core] = await Promise.all([
  import('../dist/index.cjs'),
  import(replyRuntimeModule),
]);

let capturedReplyOptions;

const buildContext = (params) => ({
  Body: params.message.body,
  BodyForAgent: params.message.bodyForAgent,
  RawBody: params.message.rawBody,
  CommandBody: params.message.commandBody,
  From: params.from,
  To: params.reply.to,
  SessionKey: params.route.routeSessionKey,
  AccountId: params.route.accountId,
  ChatType: params.conversation.kind,
  SenderId: params.sender.id,
  SenderName: params.sender.name,
  Provider: params.provider,
  Surface: params.surface,
  MessageSid: params.messageId,
  Timestamp: params.timestamp,
  OriginatingChannel: params.channel,
  OriginatingTo: params.reply.originatingTo,
});

const runtime = {
  version: 'test',
  config: { current: () => ({}) },
  channel: {
    inbound: { buildContext },
    routing: {
      resolveAgentRoute: () => ({
        agentId: 'test',
        accountId: 'test',
        sessionKey: 'agent:test:qqbot-commentary-test',
      }),
    },
    session: { resolveStorePath: () => '' },
    reply: {
      dispatchReplyWithBufferedBlockDispatcher: async (params) => {
        capturedReplyOptions = params.replyOptions;
      },
    },
  },
};

const message = {
  kind: 'c2c',
  content: 'test commentary delivery',
  senderId: 'test-user',
  senderName: 'Test User',
  messageId: 'test-inbound-message',
  replyTarget: { scope: 'c2c', targetId: 'test-user' },
};
const ctx = {
  message,
  state: {},
  signal: new AbortController().signal,
};
const account = {
  accountId: 'test',
  appId: 'test-bot',
  clientSecret: 'test-only',
  markdownSupport: true,
  processingTimeoutMs: 0,
  config: {
    streaming: { mode: 'partial' },
    deliverDebounce: { enabled: false },
  },
};

await plugin.dispatchToOpenClaw(ctx, message, account, runtime);

assert.equal(capturedReplyOptions?.disableBlockStreaming, false);
assert.equal(capturedReplyOptions?.commentaryPayloadsEnabled, true);
assert.equal(capturedReplyOptions?.commentaryProgressEnabled, true);
assert.equal(capturedReplyOptions?.progressPreambleEnabled, true);
assert.equal(capturedReplyOptions?.suppressDefaultToolProgressMessages, true);
assert.equal(typeof capturedReplyOptions?.onItemEvent, 'function');

let coreDispatchSequence = 0;
const runCoreDispatch = async (replyOptions, replyResolver) => {
  const delivered = [];
  coreDispatchSequence += 1;
  await core.dispatchReplyWithBufferedBlockDispatcher({
    ctx: buildContext({
      message: {
        body: 'test',
        bodyForAgent: 'test',
        rawBody: 'test',
        commandBody: 'test',
      },
      from: 'qqbot:test-user',
      reply: { to: 'qqbot:test-user', originatingTo: 'qqbot:test-user' },
      route: { routeSessionKey: 'agent:test:qqbot-commentary-test', accountId: 'test' },
      conversation: { kind: 'direct' },
      sender: { id: 'test-user', name: 'Test User' },
      provider: 'qqbot',
      surface: 'qqbot',
      messageId: `test-core-dispatch-${coreDispatchSequence}`,
      timestamp: Date.now(),
      channel: 'qqbot',
    }),
    cfg: {},
    dispatcherOptions: {
      deliver: async (payload) => {
        if (payload.text) delivered.push(payload.text);
      },
    },
    replyOptions,
    replyResolver: replyResolver ?? (async (_ctx, opts) => {
      opts.onSourceReplyDeliveryModeResolved?.('automatic');
      await opts.onBlockReply({ text: FIRST, isCommentary: true });
      await opts.onBlockReply({ text: SECOND, isCommentary: true });
      return { text: FINAL };
    }),
  });
  return delivered;
};

const filtered = await runCoreDispatch({
  ...capturedReplyOptions,
  commentaryPayloadsEnabled: false,
});
assert.deepEqual(filtered, [FINAL]);

const delivered = await runCoreDispatch(capturedReplyOptions);
assert.deepEqual(delivered, [FIRST, SECOND, FINAL]);

const itemEvents = [];
const finalOnly = await runCoreDispatch({
  ...capturedReplyOptions,
  onItemEvent: async (item) => {
    if (item.kind === 'preamble' && item.progressText) {
      itemEvents.push(item.progressText);
      return true;
    }
    return false;
  },
}, async (_ctx, opts) => {
  opts.onSourceReplyDeliveryModeResolved?.('automatic');
  await opts.onItemEvent({ kind: 'preamble', progressText: FIRST });
  await opts.onItemEvent({ kind: 'preamble', progressText: SECOND });
  return { text: FINAL };
});
assert.deepEqual(itemEvents, [FIRST, SECOND]);
assert.deepEqual(finalOnly, [FINAL]);

console.log('PASS: delivered commentary blocks and preamble events in order');
