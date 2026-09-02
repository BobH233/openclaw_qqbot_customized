import { PluginRuntime, ChannelOnboardingAdapter, OpenClawConfig, GroupPolicy as GroupPolicy$1, OpenClawPluginApi } from 'openclaw/plugin-sdk';
import { ChannelPlugin } from 'openclaw/plugin-sdk/core';
import { QQBot, ReplyTarget, MessageResponse, MediaFileType, StreamSession, MiddlewareContext, QQBotInboundMessage, RefIndexStore, RefEntry } from '@tencent-connect/qqbot-nodejs';

/** 普通文本消息 */
declare const MSG_TYPE_TEXT = 0;
/** 引用（回复）消息 */
declare const MSG_TYPE_QUOTE = 103;
/**
 * QQ Bot 配置类型
 */
interface QQBotConfig {
    appId: string;
    clientSecret?: string;
    clientSecretFile?: string;
}
/**
 * 解析后的 QQ Bot 账户
 */
interface ResolvedQQBotAccount {
    accountId: string;
    name?: string;
    enabled: boolean;
    appId: string;
    clientSecret: string;
    secretSource: "config" | "file" | "env" | "none";
    /** 系统提示词 */
    systemPrompt?: string;
    /** 是否支持 markdown 消息（默认 true） */
    markdownSupport: boolean;
    /** User-Agent 尾部追加内容 */
    userAgentSuffix: string;
    /**
     * 单条消息最大处理时间（ms）。超时后 concurrencyGuard 会 abort 处理链，
     * 释放锁并排空缓冲消息。0 表示不限制。默认 0（不限制）。
     */
    processingTimeoutMs: number;
    config: QQBotAccountConfig;
}
/** 群消息策略：open=全响应 | allowlist=白名单 | disabled=不响应 */
type GroupPolicy = "open" | "allowlist" | "disabled";
/** 工具策略：full=全部 | restricted=限制敏感工具 | none=禁止 */
type ToolPolicy = "full" | "restricted" | "none";
/** 单个群的配置 */
interface GroupConfig {
    /** 是否需要 @机器人才响应（默认 true） */
    requireMention?: boolean;
    /**
     * 是否忽略 @了其他用户但没有 @机器人的消息（默认 false）。
     * 开启后，消息中 @了其他人但未 @bot 时直接丢弃（不记录历史、不触发 AI）。
     */
    ignoreOtherMentions?: boolean;
    /** 群聊中 AI 可使用的工具范围（默认 restricted） */
    toolPolicy?: ToolPolicy;
    /** 群名称 */
    name?: string;
    /** 群消息行为 PE（未配置时使用内置默认值） */
    prompt?: string;
    /** 群历史消息缓存条数（0 禁用，默认 20） */
    historyLimit?: number;
}
/** 消息接收传输方式 */
type TransportMode = "websocket" | "webhook";
/** Webhook 传输配置 */
interface WebhookTransportConfig {
    /** 监听路径（默认 /qqbot/webhook） */
    path?: string;
}
/**
 * QQ Bot 账户配置
 */
interface QQBotAccountConfig {
    enabled?: boolean;
    name?: string;
    appId?: string;
    clientSecret?: string;
    clientSecretFile?: string;
    dmPolicy?: "open" | "pairing" | "allowlist" | "disabled";
    allowFrom?: string[];
    /** 消息接收传输方式：websocket（默认）| webhook */
    transport?: TransportMode;
    /** webhook 传输配置（transport="webhook" 时生效） */
    webhook?: WebhookTransportConfig;
    /** 群消息策略（默认 allowlist） */
    groupPolicy?: GroupPolicy;
    /** 群白名单（groupPolicy 为 allowlist 时生效） */
    groupAllowFrom?: string[];
    /** 群配置映射（按 groupOpenid 索引，"*" 为默认） */
    groups?: Record<string, GroupConfig>;
    /** 系统提示词，会添加在用户消息前面 */
    systemPrompt?: string;
    /** 是否支持 markdown 消息（默认 true，设为 false 可禁用） */
    markdownSupport?: boolean;
    /**
     * @deprecated 请使用 audioFormatPolicy.uploadDirectFormats
     * 可直接上传的音频格式（不转换为 SILK），向后兼容
     */
    voiceDirectUploadFormats?: string[];
    /**
     * 音频格式策略配置
     * 统一管理入站（STT）和出站（上传）的音频格式转换行为
     */
    audioFormatPolicy?: AudioFormatPolicy;
    /**
     * 是否启用公网 URL 直传 QQ 平台（默认 true）
     * 启用时：公网 URL 先直传给 QQ 开放平台的富媒体 API，平台自行拉取；失败后自动 fallback 到插件下载再 Base64 上传
     * 禁用时：公网 URL 始终由插件先下载到本地，再以 Base64 上传（适用于 QQ 平台无法访问目标 URL 的场景）
     */
    urlDirectUpload?: boolean;
    /**
     * /bot-upgrade 指令返回的升级指引网址
     * 默认: https://docs.qq.com/doc/DSGxOZk1oVnVKVkpq
     */
    upgradeUrl?: string;
    /**
     * /bot-upgrade 指令的行为模式
     * - "doc"：展示升级文档链接（安全模式）
     * - "hot-reload"：检测到新版本时直接执行 npm 升级脚本进行热更新（默认）
     */
    upgradeMode?: "doc" | "hot-reload";
    /**
     * /bot-upgrade 热更新时使用的 npm 包名
     * 支持 "scope/name"（自动补 @）或 "@scope/name" 格式
     * 默认: "@tencent-connect/openclaw-qqbot"
     * 示例: "ryantest/openclaw-qqbot"
     */
    upgradePkg?: string;
    /**
     * 群消息是否默认需要 @机器人才响应（默认 true）
     * 优先级低于 groups.{groupId}.requireMention 和 groups."*".requireMention
     * 设为 false 时，所有群默认无需 @ 即触发回复（仍可被群级配置覆盖）
     */
    defaultRequireMention?: boolean;
    /**
     * 出站消息合并回复（debounce）配置
     * 当短时间内收到多次 deliver 时，将文本合并为一条消息发送，避免消息轰炸
     */
    deliverDebounce?: DeliverDebounceConfig;
    /**
     * 是否启用流式消息（默认 false）
     * 启用后，AI 的回复会以流式形式逐步显示在 QQ 聊天中，
     * 用户可以看到文字逐字出现的打字机效果。
     *
     * 兼容布尔值和对象格式，对齐框架 schema：
     *   - true / false         旧版布尔格式（自动转换为对象）
     *   - { mode: "partial" }  开启（对齐 StreamingMode.partial）
     *   - { mode: "off" }      关闭
     *
     * 注意：仅 C2C（私聊）支持流式消息 API。
     */
    streaming?: boolean | {
        mode: 'partial' | 'off';
    };
    /**
     * STT (语音转文字) 配置
     * 配置后，收到语音消息时会自动调用 STT 服务转录为文字
     */
    stt?: STTChannelConfig;
    /**
     * 单条消息最大处理时间（毫秒）。
     * 超时后 concurrencyGuard 会 abort 处理链（取消 LLM 调用、工具执行等），
     * 释放并发锁并排空缓冲消息。
     *
     * 设为 0 表示不限制超时。默认 0（不限制）。
     *
     * 可通过环境变量 OPENCLAW_PROCESSING_TIMEOUT_MS 覆盖全局默认值，
     * 账户级配置优先级高于环境变量。
     */
    processingTimeoutMs?: number;
    /**
     * User-Agent 尾部追加内容（用于私有化部署标识等场景）
     * 追加在 `QQBotPlugin/{version} (Node/{nodeVersion}; {os}; OpenClaw/{version})` 之后
     */
    userAgentSuffix?: string;
}
/**
 * 出站消息合并回复配置
 */
interface DeliverDebounceConfig {
    /**
     * 是否启用合并回复（默认 true）
     */
    enabled?: boolean;
    /**
     * 合并窗口时长（毫秒），在此时间内的连续 deliver 会被合并
     * 默认 1500ms
     */
    windowMs?: number;
    /**
     * 最大等待时长（毫秒），从第一条 deliver 开始计算，超过此时间强制发送
     * 防止持续有新 deliver 导致一直不发送
     * 默认 8000ms
     */
    maxWaitMs?: number;
    /**
     * 合并文本之间的分隔符
     * 默认 "\n\n---\n\n"
     */
    separator?: string;
}
/**
 * 音频格式策略：控制哪些格式可跳过转换
 */
interface AudioFormatPolicy {
    /**
     * STT 模型直接支持的音频格式（入站：跳过 SILK→WAV 转换）
     * 如果 STT 服务支持直接处理某些格式（如 silk/amr），可将其加入此列表
     * 例如: [".silk", ".amr", ".wav", ".mp3", ".ogg"]
     * 默认为空（所有语音都先转换为 WAV 再送 STT）
     */
    sttDirectFormats?: string[];
    /**
     * QQ 平台支持直传的音频格式（出站：跳过→SILK 转换）
     * 默认为 [".wav", ".mp3", ".silk"]（QQ Bot API 原生支持的三种格式）
     * 仅当需要覆盖默认值时才配置此项
     */
    uploadDirectFormats?: string[];
    /**
     * 是否启用语音转码（默认 true）
     * 设为 false 可在环境无 ffmpeg 时跳过转码，直接以文件形式发送
     * 当禁用时，非原生格式的音频会 fallback 到 sendDocument（文件发送）
     */
    transcodeEnabled?: boolean;
}
/**
 * STT (语音转文字) 配置
 */
interface STTChannelConfig {
    /** 是否启用 STT（默认 true，配置了 baseUrl+apiKey 即自动启用） */
    enabled?: boolean;
    /** STT 服务提供商 ID（对应 models.providers 中的 key，默认 "openai"） */
    provider?: string;
    /** STT API 地址（如 https://api.openai.com/v1） */
    baseUrl?: string;
    /** STT API 密钥 */
    apiKey?: string;
    /** STT 模型名称（默认 "whisper-1"） */
    model?: string;
}
/**
 * 富媒体附件
 */
interface MessageAttachment {
    content_type: string;
    filename?: string;
    height?: number;
    width?: number;
    size?: number;
    url: string;
    voice_wav_url?: string;
    asr_refer_text?: string;
}
/**
 * C2C 消息事件
 */
interface C2CMessageEvent {
    author: {
        id: string;
        union_openid: string;
        user_openid: string;
    };
    content: string;
    id: string;
    timestamp: string;
    message_scene?: {
        source: string;
        /** ext 数组，可能包含 ref_msg_idx=REFIDX_xxx（引用的消息）和 msg_idx=REFIDX_xxx（自身索引） */
        ext?: string[];
    };
    attachments?: MessageAttachment[];
    /** 消息类型，参见 MSG_TYPE_* */
    message_type?: number;
    /** 消息元素列表，引用消息时 [0] 为被引用的原始消息 */
    msg_elements?: MsgElement[];
}
/**
 * 频道 AT 消息事件
 */
interface GuildMessageEvent {
    id: string;
    channel_id: string;
    guild_id: string;
    content: string;
    timestamp: string;
    author: {
        id: string;
        username?: string;
        bot?: boolean;
    };
    member?: {
        nick?: string;
        joined_at?: string;
    };
    attachments?: MessageAttachment[];
}
/** 消息元素结点，引用消息时 msg_elements[0] 为被引用的原始消息 */
interface MsgElement {
    /** 消息索引标识 */
    msg_idx?: string;
    /** 消息类型，参见 MSG_TYPE_* 常量 */
    message_type?: number;
    /** 文本内容 */
    content?: string;
    /** 附件列表 */
    attachments?: MessageAttachment[];
    /** 嵌套消息元素（引用消息场景下可能存在） */
    msg_elements?: MsgElement[];
}
/**
 * 群聊 AT 消息事件
 */
interface GroupMessageEvent {
    author: {
        id: string;
        member_openid: string;
        username?: string;
        bot?: boolean;
    };
    content: string;
    id: string;
    timestamp: string;
    group_id: string;
    group_openid: string;
    message_scene?: {
        source: string;
        ext?: string[];
    };
    attachments?: MessageAttachment[];
    /** @提及列表 */
    mentions?: Array<{
        scope?: "all" | "single";
        id?: string;
        user_openid?: string;
        member_openid?: string;
        nickname?: string;
        bot?: boolean;
        /** 是否 @机器人自身 */
        is_you?: boolean;
    }>;
    /** 消息类型，参见 MSG_TYPE_* */
    message_type?: number;
    /** 消息元素列表，引用消息时 [0] 为被引用的原始消息 */
    msg_elements?: MsgElement[];
}
/**
 * 按钮交互事件（INTERACTION_CREATE）
 */
interface InteractionEvent {
    /** 事件 ID，用于回应交互（PUT /interactions/{id}） */
    id: string;
    /** 事件类型：11=消息按钮 12=单聊快捷菜单 */
    type: number;
    /** 场景：c2c / group / guild */
    scene?: string;
    /** 场景类型：0=频道 1=群聊 2=单聊 */
    chat_type?: number;
    /** 触发时间 RFC3339 */
    timestamp?: string;
    /** 频道 openid（仅频道场景） */
    guild_id?: string;
    /** 子频道 openid（仅频道场景） */
    channel_id?: string;
    /** 单聊用户 openid（仅 c2c 场景） */
    user_openid?: string;
    /** 群 openid（仅群聊场景） */
    group_openid?: string;
    /** 群内触发用户 openid（仅群聊场景） */
    group_member_openid?: string;
    version: number;
    data: {
        type: number;
        resolved: {
            /** 按钮 action.data 值 */
            button_data?: string;
            /** 按钮 id */
            button_id?: string;
            /** 操作用户 userid（仅频道场景） */
            user_id?: string;
            /** 自定义菜单 id（仅菜单场景） */
            feature_id?: string;
            /** 操作的消息 id（仅频道场景） */
            message_id?: string;
            /** 配置更新：群消息模式 "mention"=@机器人时激活 "always"=总是激活 */
            require_mention?: string;
            /** 配置更新：群消息策略 */
            group_policy?: GroupPolicy;
            /** 配置更新：@文本的名称提及BOT名，多个使用,分隔 */
            mention_patterns?: string;
        };
    };
}
/**
 * 按钮 Action 类型
 * 0=跳转链接  1=回调型(INTERACTION_CREATE)  2=指令型(直接发文本)  3=mqqapi
 */
type KeyboardActionType = 0 | 1 | 2 | 3;
/** 按钮权限 */
interface KeyboardPermission {
    /** 0=全体  1=管理员  2=按钮指定  3=身份组 */
    type: 0 | 1 | 2 | 3;
    specify_role_ids?: string[];
    specify_user_ids?: string[];
}
/** 二次确认弹窗 */
interface KeyboardModal {
    content: string;
    confirm_text?: string;
    cancel_text?: string;
}
/** 按钮 Action */
interface KeyboardAction {
    type: KeyboardActionType;
    data?: string;
    /** true = 点击后直接发出（Enter）*/
    enter?: boolean;
    /** 仅指令型（type=2）：是否把指令发到输入框（reply=true）还是静默发出 */
    reply?: boolean;
    permission?: KeyboardPermission;
    click_limit?: number;
    unsupport_tips?: string;
    modal?: KeyboardModal;
}
/** 按钮渲染数据 */
interface KeyboardRenderData {
    label: string;
    visited_label?: string;
    /** 0=灰色线框  1=蓝色线框  2=推荐回复专用  3=红色字体  4=蓝色背景 */
    style?: 0 | 1 | 2 | 3 | 4;
}
/** 单个按钮 */
interface KeyboardButton {
    id: string;
    render_data?: KeyboardRenderData;
    action?: KeyboardAction;
    group_id?: string;
}
/** 一行按钮 */
interface KeyboardRow {
    buttons: KeyboardButton[];
}
/** CustomKeyboard（自定义按钮内容） */
interface CustomKeyboard {
    rows: KeyboardRow[];
}
/** MessageKeyboard（keyboard / prompt_keyboard.keyboard 共用） */
interface MessageKeyboard {
    /** 模板 ID（与 content 二选一） */
    id?: string;
    /** 自定义内容 */
    content?: CustomKeyboard;
}
/**
 * Inline Keyboard（消息内嵌按钮，需平台审核）
 * 发送字段：keyboard
 * JSON: { "keyboard": { "id": "...", "content": { "rows": [...] } } }
 */
type InlineKeyboard = MessageKeyboard;
/**
 * WebSocket 事件负载
 */
interface WSPayload {
    op: number;
    d?: unknown;
    s?: number;
    t?: string;
}
/** 流式消息输入模式 */
declare const StreamInputMode: {
    /** 每次发送的 content_raw 替换整条消息内容 */
    readonly REPLACE: "replace";
};
type StreamInputMode = (typeof StreamInputMode)[keyof typeof StreamInputMode];
/** 流式消息输入状态 */
declare const StreamInputState: {
    /** 正文生成中 */
    readonly GENERATING: 1;
    /** 正文生成结束（终结状态） */
    readonly DONE: 10;
};
type StreamInputState = (typeof StreamInputState)[keyof typeof StreamInputState];
/** 流式消息内容类型 */
declare const StreamContentType: {
    readonly MARKDOWN: "markdown";
};
type StreamContentType = (typeof StreamContentType)[keyof typeof StreamContentType];
/**
 * 流式消息请求体
 * 对应 StreamReq proto
 */
interface StreamMessageRequest {
    /** 输入模式 */
    input_mode: StreamInputMode;
    /** 输入状态 */
    input_state: StreamInputState;
    /** 内容类型 */
    content_type: StreamContentType;
    /** markdown 内容 */
    content_raw: string;
    /** 事件 ID */
    event_id: string;
    /** 原始消息 ID */
    msg_id: string;
    /** 流式消息 ID，首次发送后返回，后续分片需携带 */
    stream_msg_id?: string;
    /** 递增序号 */
    msg_seq: number;
    /** 同一条流式会话内的发送索引，从 0 开始，每次发送前递增；新流式会话重新从 0 开始 */
    index: number;
}

/**
 * QQ Bot ChannelPlugin 定义
 *
 * 薄壳编排层 — 实现 OpenClaw ChannelPlugin 接口，
 * 将各子模块（gateway/outbound/config/features）连接为完整通道插件。
 */

declare const qqbotPlugin: ChannelPlugin<ResolvedQQBotAccount>;

/**
 * QQBot 插件运行时管理。
 *
 * 日志统一由 `utils/plugin-logger.ts` 提供，此处只管理 runtime 实例。
 */

declare function setQQBotRuntime(next: PluginRuntime): void;
declare function getQQBotRuntime(): PluginRuntime;

declare function buildUserAgent(suffix?: string): string;
/**
 * 获取指定账户的 QQBot SDK 实例。
 *
 * @throws 如果该账户的 gateway 尚未启动
 *
 * @example
 * ```ts
 * const bot = getBotForAccount(accountId);
 * await bot.send({ target, content: 'hello' });
 * const guilds = await bot.api.get('/users/@me/guilds');
 * const token = await bot.api.getToken();
 * ```
 */
declare function getBotForAccount(accountId: string): QQBot;
/**
 * 尝试获取指定账户的 QQBot SDK 实例（不抛异常）。
 * 返回 null 表示 gateway 尚未启动。
 */
declare function tryGetBotForAccount(accountId: string): QQBot | null;

/**
 * QQBot CLI Onboarding Adapter
 *
 * 提供 openclaw onboard 命令的交互式配置支持。
 * 从原 src/onboarding.ts 迁移，保持接口兼容。
 */

/**
 * Onboarding adapter — 导出给 ChannelPlugin 使用
 *
 * 注：完整 onboarding 交互逻辑较复杂（约 300 行），
 * 此处仅保留 adapter 骨架，完整实现从原文件迁移。
 */
declare const qqbotOnboardingAdapter: ChannelOnboardingAdapter;

/**
 * PluginLogger — 统一日志接口
 *
 * 默认后端为 OpenClaw 框架 logger（`runtime.logging.getChildLogger`），
 * 运行时不可用时临时降级 console，就绪后自动切换缓存。
 */
interface PluginLogger {
    info(msg: string, meta?: Record<string, unknown>): void;
    warn(msg: string, meta?: Record<string, unknown>): void;
    error(msg: string, meta?: Record<string, unknown>): void;
    debug(msg: string, meta?: Record<string, unknown>): void;
    child(tag: string): PluginLogger;
}

/**
 * QQBotGateway — 封装单个 Bot 实例的完整生命周期
 */

interface GatewayCallbacks {
    onReady?: () => void;
    onError?: (error: Error) => void;
}
interface SendOptions {
    msgId?: string;
    text?: string;
}
declare class QQBotGateway {
    readonly bot: QQBot;
    private readonly account;
    private readonly runtime;
    readonly log: PluginLogger;
    private readonly textTimeout;
    private readonly mediaTimeout;
    constructor(account: ResolvedQQBotAccount, runtime: PluginRuntime, log?: PluginLogger);
    start(callbacks?: GatewayCallbacks, signal?: AbortSignal): Promise<void>;
    stop(): Promise<void>;
    sendText(target: ReplyTarget, text: string, opts?: SendOptions): Promise<MessageResponse>;
    sendMedia(target: ReplyTarget, source: string, opts?: SendOptions & {
        fileType?: MediaFileType;
    }): Promise<MessageResponse>;
    sendVoice(target: ReplyTarget, source: {
        url?: string;
        base64?: string;
        localPath?: string;
    }, opts?: SendOptions): Promise<MessageResponse>;
    sendVideo(target: ReplyTarget, source: string, opts?: SendOptions): Promise<MessageResponse>;
    sendFile(target: ReplyTarget, source: string, opts?: SendOptions & {
        fileName?: string;
    }): Promise<MessageResponse>;
    openStream(target: ReplyTarget, msgId: string): StreamSession;
    sendTyping(target: ReplyTarget): Promise<void>;
    private wrapBotSendForRefIndex;
}

type MediaKind = 'image' | 'voice' | 'video' | 'file';
interface SendResult {
    messageId?: string;
    error?: string;
    errorCode?: string;
    qqBizCode?: number;
}
declare function sendText(params: {
    to: string;
    text: string;
    accountId?: string;
    replyToId?: string;
    account: ResolvedQQBotAccount;
}): Promise<SendResult>;
declare function sendMedia(params: {
    to: string;
    text?: string;
    mediaUrl: string;
    mediaKind?: MediaKind;
    accountId?: string;
    replyToId?: string;
    account: ResolvedQQBotAccount;
}): Promise<SendResult>;

/**
 * 出站目标地址解析
 *
 * 将 OpenClaw 规范的目标地址字符串（如 qqbot:c2c:xxx / qqbot:group:xxx）
 * 转换为 SDK 的 ReplyTarget 结构。
 *
 * 也导出共享的正则常量供 channel.ts messaging 段复用。
 */

/**
 * 解析目标地址字符串为 SDK ReplyTarget
 */
declare function parseTarget(to: string): ReplyTarget;

/**
 * 消息转发 — 入站消息 → OpenClaw AI
 *
 * 核心职责：
 * 1. 从 SDK MiddlewareContext 构建 OpenClaw 标准信封
 * 2. 通过 runtime-adapter 将消息交给 AI 处理
 *
 * 架构说明：
 * - 所有 runtime.channel.* 访问均通过 runtime-adapter 隔离
 * - log: 前缀由 PluginLogger + 框架自动注入，消息体不重复 accountId
 */

/**
 * 将经过中间件处理的入站消息转发给 OpenClaw AI
 */
declare function dispatchToOpenClaw(ctx: MiddlewareContext, msg: QQBotInboundMessage, account: ResolvedQQBotAccount, runtime: PluginRuntime, log?: PluginLogger): Promise<void>;

/**
 * 持久化 RefIndex 存储
 *
 * SDK 提供的 MemoryRefIndexStore 在进程重启后即丢失，
 * 而 QQ 引用消息（REFIDX_xxx）入站事件只携带 key，必须本地缓存才能回查。
 *
 * 设计：
 *   - 内存 LRU（与 SDK 同款）保证 O(1) 读取
 *   - JSONL 追加写持久化，进程重启时按时间顺序回放重建 LRU
 *   - 写入触发 compact 阈值时重写文件（去重 + 截断到 maxEntries）
 *   - 文件路径: ~/.openclaw/qqbot/data/ref-index.jsonl
 *
 * 实现 SDK 的 RefIndexStore 接口，可直接通过 `quoteRef({ store })` 注入。
 */

interface PersistedRefIndexStoreOptions {
    /** 内存与磁盘的最大条目数。默认 2000。 */
    maxEntries?: number;
    /** 自定义存储文件路径。默认 ~/.openclaw/qqbot/data/ref-index.jsonl */
    filePath?: string;
}
/**
 * 持久化版本的 RefIndexStore
 *
 * - get：仅查内存（启动时从磁盘回放重建）
 * - set：内存 + JSONL 追加写；磁盘行数过多时触发 compact
 */
declare class PersistedRefIndexStore implements RefIndexStore {
    private readonly memory;
    private readonly maxEntries;
    private readonly filePath;
    /** 当前磁盘累计写入的行数（用于 compact 阈值判断） */
    private diskLineCount;
    /** 是否已成功初始化（磁盘回放完成） */
    private initialized;
    /** 串行化写入，防止并发 append 撕裂行 */
    private writeChain;
    constructor(options?: PersistedRefIndexStoreOptions);
    /**
     * 初始化：按时间顺序回放 JSONL 重建内存 LRU
     */
    private init;
    get(key: string): RefEntry | undefined;
    set(key: string, entry: RefEntry): void;
    private touchMemory;
    private appendToDisk;
    /**
     * 异步 compact：将内存 LRU 状态完整重写到磁盘，丢弃历史冗余。
     */
    private compact;
    /**
     * 同步 compact（仅 init 阶段使用，避免回放后立刻保留巨大磁盘文件）
     */
    private compactSync;
    /** 当前内存中的条目数 */
    get size(): number;
    /** 是否已完成初始化（磁盘回放） */
    get isInitialized(): boolean;
    /** 诊断快照 */
    stats(): {
        memoryEntries: number;
        diskLines: number;
        maxEntries: number;
        filePath: string;
    };
    /**
     * 强制将当前内存状态持久化到磁盘（进程退出前调用）
     */
    flush(): void;
}
/**
 * 获取按 accountId 隔离的持久化 RefIndexStore 单例。
 *
 * 每个账户独立存储文件，避免多账户混用同一个 refIdx 命名空间。
 */
declare function getPersistedRefIndexStore(accountId: string): PersistedRefIndexStore;
/**
 * 进程退出前 flush 所有 store
 */
declare function flushAllRefIndexStores(): void;

/**
 * QQ Bot 流式消息控制器
 *
 * 核心约束：QQ 流式 API 替换模式下，已下发文本的**前缀不可变更**。
 *
 * 状态机：
 *   IDLE → (first chunk) → STREAMING → (complete) → DONE
 *                                      → (prefix changed) → DONE
 *                                      → (new reply) → IDLE → …
 *
 * onPartialReply(text) 输入：模型全量文本，持续增长。
 * finalize()           标记：框架通知回复结束，用 lastAccepted 收尾。
 */

type StreamingPhase = 'idle' | 'streaming' | 'done' | 'failed';
interface StreamingControllerDeps {
    gateway: QQBotGateway;
    target: ReplyTarget;
    accountId: string;
    replyToId: string;
    log?: PluginLogger;
}
declare class StreamingController {
    private readonly deps;
    private phase;
    private session;
    /** QQ 已接受的最新文本 — 单源真理 */
    private lastAcceptedFull;
    /** 已成功发送的分片数（降级：=0 则走静态消息兜底） */
    private sentChunkCount;
    /** 同步标志：收到第一个 onPartialReply 即置 true（不等 async 完成） */
    private _hasStarted;
    /** 串行队列 */
    private chain;
    constructor(deps: StreamingControllerDeps);
    get currentPhase(): StreamingPhase;
    /** 是否已成功发送至少一个流式分片 */
    get hasSentChunks(): boolean;
    /** 同步标志：流式已启动（不等异步完成），用于 final 去重 */
    get hasStarted(): boolean;
    get isTerminal(): boolean;
    get shouldFallbackToStatic(): boolean;
    onPartialReply(text: string): Promise<void>;
    finalize(): Promise<void>;
    abort(reason?: string): Promise<void>;
    private handleChunk;
    private handleFinalize;
    private sendUpdate;
    private completeSession;
    private transition;
}

declare function shouldUseStreaming(account: ResolvedQQBotAccount, targetScope: 'c2c' | 'group' | 'channel'): boolean;

/**
 * 解析 mentionPatterns（agent → global → 空数组）
 *
 * 优先级：
 *   1. agents.list[agentId].groupChat.mentionPatterns
 *   2. messages.groupChat.mentionPatterns
 *   3. []
 */
declare function resolveMentionPatterns(cfg: OpenClawConfig, agentId?: string): string[];
declare const DEFAULT_ACCOUNT_ID = "default";
/** 解析群消息策略 */
declare function resolveGroupPolicy(cfg: OpenClawConfig, accountId?: string): GroupPolicy$1;
/** 解析群白名单（统一转大写） */
declare function resolveGroupAllowFrom(cfg: OpenClawConfig, accountId?: string): string[];
/** 检查指定群是否被允许（使用标准策略引擎） */
declare function isGroupAllowed(cfg: OpenClawConfig, groupOpenid: string, accountId?: string): boolean;
type ResolvedGroupConfig = Required<GroupConfig>;
declare function resolveGroupConfigFromAccount(account: ResolvedQQBotAccount, groupOpenid: string): ResolvedGroupConfig;
declare function resolveGroupConfig(cfg: OpenClawConfig, groupOpenid: string, accountId?: string): ResolvedGroupConfig;
/** 解析群历史消息缓存条数 */
declare function resolveHistoryLimit(cfg: OpenClawConfig, groupOpenid: string, accountId?: string): number;
/** 解析群行为 PE（具体群 > "*" > 默认值） */
declare function resolveGroupPrompt(cfg: OpenClawConfig, groupOpenid: string, accountId?: string): string;
/** 解析群是否需要 @机器人才响应 */
declare function resolveRequireMention(cfg: OpenClawConfig, groupOpenid: string, accountId?: string): boolean;
/** 解析群是否忽略 @了其他人（非 bot）的消息 */
declare function resolveIgnoreOtherMentions(cfg: OpenClawConfig, groupOpenid: string, accountId?: string): boolean;
/** 解析群工具策略 */
declare function resolveToolPolicy(cfg: OpenClawConfig, groupOpenid: string, accountId?: string): ToolPolicy;
/** 解析群名称（优先配置，fallback 为 openid 前 8 位） */
declare function resolveGroupName(cfg: OpenClawConfig, groupOpenid: string, accountId?: string): string;
/**
 * 解析 User-Agent 追加后缀（仅通道级：channels.qqbot.userAgentSuffix）
 */
declare function resolveUserAgentSuffix(cfg: OpenClawConfig): string;
/**
 * 列出所有 QQBot 账户 ID
 */
declare function listQQBotAccountIds(cfg: OpenClawConfig): string[];
/**
 * 获取默认账户 ID
 */
declare function resolveDefaultQQBotAccountId(cfg: OpenClawConfig): string;
/**
 * 解析单条消息处理超时时间（ms）。
 * 优先级：账户配置 > 环境变量 OPENCLAW_PROCESSING_TIMEOUT_MS > 默认
 * 返回 0 表示不限制超时。
 */
declare function resolveProcessingTimeoutMs(accountConfig?: QQBotAccountConfig): number;
/**
 * 解析 QQBot 账户配置
 */
declare function resolveQQBotAccount(cfg: OpenClawConfig, accountId?: string | null): ResolvedQQBotAccount;
/**
 * 应用账户配置
 */
declare function applyQQBotAccountConfig(cfg: OpenClawConfig, accountId: string, input: {
    appId?: string;
    clientSecret?: string;
    clientSecretFile?: string;
    name?: string;
}): OpenClawConfig;

/**
 * @tencent-connect/openclaw-qqbot
 *
 * 独立版 QQ Bot 通道插件 — 基于 @tencent-connect/qqbot-nodejs SDK 重构。
 *
 * 直接依赖：
 * - openclaw/plugin-sdk：OpenClaw 插件框架
 * - @tencent-connect/qqbot-nodejs：QQ 开放平台 Node.js SDK
 */

declare const plugin: {
    id: string;
    name: string;
    description: string;
    configSchema: unknown;
    register(api: OpenClawPluginApi): void;
};

export { type AudioFormatPolicy, type C2CMessageEvent, type CustomKeyboard, DEFAULT_ACCOUNT_ID, type DeliverDebounceConfig, type GroupConfig, type GroupMessageEvent, type GroupPolicy, type GuildMessageEvent, type InlineKeyboard, type InteractionEvent, type KeyboardAction, type KeyboardActionType, type KeyboardButton, type KeyboardModal, type KeyboardPermission, type KeyboardRenderData, type KeyboardRow, MSG_TYPE_QUOTE, MSG_TYPE_TEXT, type MessageAttachment, type MessageKeyboard, type MsgElement, PersistedRefIndexStore, type QQBotAccountConfig, type QQBotConfig, QQBotGateway, type ResolvedGroupConfig, type ResolvedQQBotAccount, type STTChannelConfig, StreamContentType, StreamInputMode, StreamInputState, type StreamMessageRequest, StreamingController, type ToolPolicy, type TransportMode, type WSPayload, type WebhookTransportConfig, applyQQBotAccountConfig, buildUserAgent, plugin as default, dispatchToOpenClaw, flushAllRefIndexStores, getBotForAccount, getPersistedRefIndexStore, getQQBotRuntime, isGroupAllowed, listQQBotAccountIds, parseTarget, qqbotOnboardingAdapter, qqbotPlugin, resolveDefaultQQBotAccountId, resolveGroupAllowFrom, resolveGroupConfig, resolveGroupConfigFromAccount, resolveGroupName, resolveGroupPolicy, resolveGroupPrompt, resolveHistoryLimit, resolveIgnoreOtherMentions, resolveMentionPatterns, resolveProcessingTimeoutMs, resolveQQBotAccount, resolveRequireMention, resolveToolPolicy, resolveUserAgentSuffix, sendMedia, sendText, setQQBotRuntime, shouldUseStreaming, tryGetBotForAccount };
