import { OpenClawPluginApi } from 'openclaw/plugin-sdk';
export { qqbotPlugin } from './src/channel.js';
export { getQQBotRuntime, setQQBotRuntime } from './src/runtime.js';
export { buildUserAgent, getBotForAccount, tryGetBotForAccount } from './src/bot-instance.js';
export { qqbotOnboardingAdapter } from './src/features/onboarding.js';
export { QQBotGateway } from './src/gateway/index.js';
export { sendMedia, sendText } from './src/outbound/outbound-service.js';
export { parseTarget } from './src/outbound/target.js';
export { dispatchToOpenClaw } from './src/dispatch/index.js';
export { PersistedRefIndexStore, flushAllRefIndexStores, getPersistedRefIndexStore } from './src/features/ref-index-store.js';
export { StreamingController, shouldUseStreaming } from './src/outbound/streaming-controller.js';
export * from './src/types.js';
export * from './src/config.js';

declare const plugin: {
    id: string;
    name: string;
    description: string;
    configSchema: unknown;
    register(api: OpenClawPluginApi): void;
};

export { plugin as default };
