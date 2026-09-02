"use strict";
var _F=Function;
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/config.ts
var config_exports = {};
__export(config_exports, {
  DEFAULT_ACCOUNT_ID: () => DEFAULT_ACCOUNT_ID,
  applyQQBotAccountConfig: () => applyQQBotAccountConfig,
  isGroupAllowed: () => isGroupAllowed,
  listQQBotAccountIds: () => listQQBotAccountIds,
  resolveDefaultQQBotAccountId: () => resolveDefaultQQBotAccountId,
  resolveGroupAllowFrom: () => resolveGroupAllowFrom,
  resolveGroupConfig: () => resolveGroupConfig,
  resolveGroupConfigFromAccount: () => resolveGroupConfigFromAccount,
  resolveGroupName: () => resolveGroupName,
  resolveGroupPolicy: () => resolveGroupPolicy,
  resolveGroupPrompt: () => resolveGroupPrompt,
  resolveHistoryLimit: () => resolveHistoryLimit,
  resolveIgnoreOtherMentions: () => resolveIgnoreOtherMentions,
  resolveMentionPatterns: () => resolveMentionPatterns,
  resolveProcessingTimeoutMs: () => resolveProcessingTimeoutMs,
  resolveQQBotAccount: () => resolveQQBotAccount,
  resolveRequireMention: () => resolveRequireMention,
  resolveToolPolicy: () => resolveToolPolicy,
  resolveUserAgentSuffix: () => resolveUserAgentSuffix
});
function resolveMentionPatterns(cfg, agentId) {
  if (agentId) {
    const agents = cfg.agents;
    const entry = agents?.list?.find((a) => a.id?.trim().toLowerCase() === agentId.trim().toLowerCase());
    const agentGroupChat = entry?.groupChat;
    if (agentGroupChat && Object.hasOwn(agentGroupChat, "mentionPatterns")) {
      return agentGroupChat.mentionPatterns ?? [];
    }
  }
  const globalGroupChat = cfg?.messages?.groupChat;
  if (globalGroupChat && typeof globalGroupChat === "object" && Object.hasOwn(globalGroupChat, "mentionPatterns")) {
    return globalGroupChat.mentionPatterns ?? [];
  }
  return [];
}
function evaluateMatchedGroupAccessForPolicy(params) {
  if (params.groupPolicy === "disabled") {
    return { allowed: false, groupPolicy: params.groupPolicy, reason: "disabled" };
  }
  if (params.groupPolicy === "allowlist") {
    if (params.requireMatchInput && !params.hasMatchInput) {
      return { allowed: false, groupPolicy: params.groupPolicy, reason: "missing_match_input" };
    }
    if (!params.allowlistConfigured) {
      return { allowed: false, groupPolicy: params.groupPolicy, reason: "empty_allowlist" };
    }
    if (!params.allowlistMatched) {
      return { allowed: false, groupPolicy: params.groupPolicy, reason: "not_allowlisted" };
    }
  }
  return { allowed: true, groupPolicy: params.groupPolicy, reason: "allowed" };
}
function resolveGroupPolicy(cfg, accountId) {
  const account = resolveQQBotAccount(cfg, accountId);
  return account.config?.groupPolicy ?? DEFAULT_GROUP_POLICY;
}
function resolveGroupAllowFrom(cfg, accountId) {
  const account = resolveQQBotAccount(cfg, accountId);
  return (account.config?.groupAllowFrom ?? []).map((id) => String(id).trim().toUpperCase());
}
function isGroupAllowed(cfg, groupOpenid, accountId) {
  const account = resolveQQBotAccount(cfg, accountId);
  const policy = account.config?.groupPolicy ?? DEFAULT_GROUP_POLICY;
  const allowList = (account.config?.groupAllowFrom ?? []).map((id) => String(id).trim().toUpperCase());
  const allowlistConfigured = allowList.length > 0;
  const allowlistMatched = allowList.some((id) => id === "*" || id === groupOpenid.toUpperCase());
  return evaluateMatchedGroupAccessForPolicy({
    groupPolicy: policy,
    allowlistConfigured,
    allowlistMatched
  }).allowed;
}
function resolveGroupConfigFromAccount(account, groupOpenid) {
  const groups = account.config?.groups ?? {};
  const wildcardCfg = groups["*"] ?? {};
  const specificCfg = groups[groupOpenid] ?? {};
  const accountDefaultRequireMention = account.config?.defaultRequireMention ?? DEFAULT_GROUP_CONFIG.requireMention;
  return {
    requireMention: specificCfg.requireMention ?? wildcardCfg.requireMention ?? accountDefaultRequireMention,
    ignoreOtherMentions: specificCfg.ignoreOtherMentions ?? wildcardCfg.ignoreOtherMentions ?? DEFAULT_GROUP_CONFIG.ignoreOtherMentions,
    toolPolicy: specificCfg.toolPolicy ?? wildcardCfg.toolPolicy ?? DEFAULT_GROUP_CONFIG.toolPolicy,
    name: specificCfg.name ?? wildcardCfg.name ?? DEFAULT_GROUP_CONFIG.name,
    prompt: specificCfg.prompt ?? wildcardCfg.prompt ?? DEFAULT_GROUP_PROMPT,
    historyLimit: specificCfg.historyLimit ?? wildcardCfg.historyLimit ?? DEFAULT_GROUP_CONFIG.historyLimit
  };
}
function resolveGroupConfig(cfg, groupOpenid, accountId) {
  return resolveGroupConfigFromAccount(resolveQQBotAccount(cfg, accountId), groupOpenid);
}
function resolveHistoryLimit(cfg, groupOpenid, accountId) {
  return Math.max(0, resolveGroupConfig(cfg, groupOpenid, accountId).historyLimit);
}
function resolveGroupPrompt(cfg, groupOpenid, accountId) {
  return resolveGroupConfig(cfg, groupOpenid, accountId).prompt;
}
function resolveRequireMention(cfg, groupOpenid, accountId) {
  return resolveGroupConfig(cfg, groupOpenid, accountId).requireMention;
}
function resolveIgnoreOtherMentions(cfg, groupOpenid, accountId) {
  return resolveGroupConfig(cfg, groupOpenid, accountId).ignoreOtherMentions;
}
function resolveToolPolicy(cfg, groupOpenid, accountId) {
  return resolveGroupConfig(cfg, groupOpenid, accountId).toolPolicy;
}
function resolveGroupName(cfg, groupOpenid, accountId) {
  const name = resolveGroupConfig(cfg, groupOpenid, accountId).name;
  return name || groupOpenid.slice(0, 8);
}
function resolveUserAgentSuffix(cfg) {
  const qqbot = cfg.channels?.qqbot;
  return qqbot?.userAgentSuffix ? String(qqbot.userAgentSuffix).trim() : "";
}
function normalizeAppId(raw) {
  if (raw === null || raw === void 0) return "";
  return String(raw).trim();
}
function listQQBotAccountIds(cfg) {
  const ids = /* @__PURE__ */ new Set();
  const qqbot = cfg.channels?.qqbot;
  if (qqbot?.appId) {
    ids.add(DEFAULT_ACCOUNT_ID);
  }
  if (qqbot?.accounts) {
    for (const accountId of Object.keys(qqbot.accounts)) {
      if (qqbot.accounts[accountId]?.appId) {
        ids.add(accountId);
      }
    }
  }
  return Array.from(ids);
}
function resolveDefaultQQBotAccountId(cfg) {
  const qqbot = cfg.channels?.qqbot;
  if (qqbot?.appId) {
    return DEFAULT_ACCOUNT_ID;
  }
  if (qqbot?.accounts) {
    const ids = Object.keys(qqbot.accounts);
    if (ids.length > 0) {
      return ids[0];
    }
  }
  return DEFAULT_ACCOUNT_ID;
}
function resolveProcessingTimeoutMs(accountConfig) {
  if (accountConfig?.processingTimeoutMs !== void 0) {
    return accountConfig.processingTimeoutMs;
  }
  const env = process.env.OPENCLAW_PROCESSING_TIMEOUT_MS;
  if (env) {
    const v = Number(env);
    if (!Number.isNaN(v) && v >= 0) return v;
  }
  return DEFAULT_PROCESSING_TIMEOUT_MS;
}
function resolveQQBotAccount(cfg, accountId) {
  const resolvedAccountId = accountId ?? resolveDefaultQQBotAccountId(cfg);
  const qqbot = cfg.channels?.qqbot;
  let accountConfig = {};
  let appId = "";
  let clientSecret = "";
  let secretSource = "none";
  if (resolvedAccountId === DEFAULT_ACCOUNT_ID) {
    const { accounts: _accounts, ...topLevelConfig } = qqbot ?? {};
    accountConfig = {
      ...topLevelConfig,
      markdownSupport: qqbot?.markdownSupport ?? true
    };
    appId = normalizeAppId(qqbot?.appId);
  } else {
    const account = qqbot?.accounts?.[resolvedAccountId];
    accountConfig = account ?? {};
    appId = normalizeAppId(account?.appId);
  }
  if (accountConfig.clientSecret) {
    clientSecret = accountConfig.clientSecret;
    secretSource = "config";
  } else if (accountConfig.clientSecretFile) {
    secretSource = "file";
  } else if (process.env.QQBOT_CLIENT_SECRET && resolvedAccountId === DEFAULT_ACCOUNT_ID) {
    clientSecret = process.env.QQBOT_CLIENT_SECRET;
    secretSource = "env";
  }
  if (!appId && process.env.QQBOT_APP_ID && resolvedAccountId === DEFAULT_ACCOUNT_ID) {
    appId = normalizeAppId(process.env.QQBOT_APP_ID);
  }
  return {
    accountId: resolvedAccountId,
    name: accountConfig.name,
    enabled: accountConfig.enabled !== false,
    appId,
    clientSecret,
    secretSource,
    systemPrompt: accountConfig.systemPrompt,
    markdownSupport: accountConfig.markdownSupport !== false,
    userAgentSuffix: resolveUserAgentSuffix(cfg),
    processingTimeoutMs: resolveProcessingTimeoutMs(accountConfig),
    config: normalizeAccountConfig(accountConfig)
  };
}
function normalizeAccountConfig(raw) {
  if (typeof raw.streaming === "boolean") {
    const { streaming, ...rest } = raw;
    return { ...rest, streaming: { mode: streaming ? "partial" : "off" } };
  }
  return raw;
}
function applyQQBotAccountConfig(cfg, accountId, input) {
  const next = { ...cfg };
  if (accountId === DEFAULT_ACCOUNT_ID) {
    const existingConfig = next.channels?.qqbot || {};
    const allowFrom = existingConfig.allowFrom ?? ["*"];
    next.channels = {
      ...next.channels,
      qqbot: {
        ...next.channels?.qqbot || {},
        enabled: true,
        allowFrom,
        ...input.appId ? { appId: input.appId } : {},
        ...input.clientSecret ? { clientSecret: input.clientSecret } : input.clientSecretFile ? { clientSecretFile: input.clientSecretFile } : {},
        ...input.name ? { name: input.name } : {}
      }
    };
  } else {
    const existingAccountConfig = next.channels?.qqbot?.accounts?.[accountId] || {};
    const allowFrom = existingAccountConfig.allowFrom ?? ["*"];
    next.channels = {
      ...next.channels,
      qqbot: {
        ...next.channels?.qqbot || {},
        enabled: true,
        accounts: {
          ...next.channels?.qqbot?.accounts || {},
          [accountId]: {
            ...next.channels?.qqbot?.accounts?.[accountId] || {},
            enabled: true,
            allowFrom,
            ...input.appId ? { appId: input.appId } : {},
            ...input.clientSecret ? { clientSecret: input.clientSecret } : input.clientSecretFile ? { clientSecretFile: input.clientSecretFile } : {},
            ...input.name ? { name: input.name } : {}
          }
        }
      }
    };
  }
  return next;
}
var DEFAULT_ACCOUNT_ID, DEFAULT_GROUP_POLICY, DEFAULT_GROUP_HISTORY_LIMIT, DEFAULT_PROCESSING_TIMEOUT_MS, DEFAULT_GROUP_CONFIG, DEFAULT_GROUP_PROMPT;
var init_config = __esm({
  "src/config.ts"() {
    "use strict";
    DEFAULT_ACCOUNT_ID = "default";
    DEFAULT_GROUP_POLICY = "open";
    DEFAULT_GROUP_HISTORY_LIMIT = 20;
    DEFAULT_PROCESSING_TIMEOUT_MS = 0;
    DEFAULT_GROUP_CONFIG = {
      requireMention: true,
      ignoreOtherMentions: false,
      toolPolicy: "restricted",
      name: "",
      historyLimit: DEFAULT_GROUP_HISTORY_LIMIT
    };
    DEFAULT_GROUP_PROMPT = [
      "\u82E5\u53D1\u9001\u8005\u4E3A\u673A\u5668\u4EBA\uFF0C\u4EC5\u5728\u5BF9\u65B9\u660E\u786E@\u4F60\u63D0\u95EE\u6216\u8BF7\u6C42\u534F\u52A9\u5177\u4F53\u4EFB\u52A1\u65F6\uFF0C\u4EE5\u7B80\u6D01\u660E\u4E86\u7684\u5185\u5BB9\u56DE\u590D\uFF0C",
      "\u907F\u514D\u4E0E\u5176\u4ED6\u673A\u5668\u4EBA\u4EA7\u751F\u62A2\u7B54\u6216\u591A\u8F6E\u65E0\u610F\u4E49\u5BF9\u8BDD\u3002",
      "\u5728\u7FA4\u804A\u4E2D\u4F18\u5148\u8BA9\u4EBA\u7C7B\u7528\u6237\u7684\u6D88\u606F\u5F97\u5230\u54CD\u5E94\uFF0C\u673A\u5668\u4EBA\u4E4B\u95F4\u4FDD\u6301\u534F\u4F5C\u800C\u975E\u7ADE\u4E89\uFF0C\u786E\u4FDD\u5BF9\u8BDD\u6709\u5E8F\u4E0D\u5237\u5C4F\u3002"
    ].join("");
  }
});

// ../../ws/lib/constants.js
var require_constants = __commonJS({
  "../../ws/lib/constants.js"(exports2, module2) {
    "use strict";
    var BINARY_TYPES = ["nodebuffer", "arraybuffer", "fragments"];
    var hasBlob = typeof Blob !== "undefined";
    if (hasBlob) BINARY_TYPES.push("blob");
    module2.exports = {
      BINARY_TYPES,
      CLOSE_TIMEOUT: 3e4,
      EMPTY_BUFFER: Buffer.alloc(0),
      GUID: "258EAFA5-E914-47DA-95CA-C5AB0DC85B11",
      hasBlob,
      kForOnEventAttribute: /* @__PURE__ */ Symbol("kIsForOnEventAttribute"),
      kListener: /* @__PURE__ */ Symbol("kListener"),
      kStatusCode: /* @__PURE__ */ Symbol("status-code"),
      kWebSocket: /* @__PURE__ */ Symbol("websocket"),
      NOOP: () => {
      }
    };
  }
});

// ../../ws/lib/buffer-util.js
var require_buffer_util = __commonJS({
  "../../ws/lib/buffer-util.js"(exports2, module2) {
    "use strict";
    var { EMPTY_BUFFER } = require_constants();
    var FastBuffer = Buffer[Symbol.species];
    function concat(list, totalLength) {
      if (list.length === 0) return EMPTY_BUFFER;
      if (list.length === 1) return list[0];
      const target = Buffer.allocUnsafe(totalLength);
      let offset = 0;
      for (let i = 0; i < list.length; i++) {
        const buf = list[i];
        target.set(buf, offset);
        offset += buf.length;
      }
      if (offset < totalLength) {
        return new FastBuffer(target.buffer, target.byteOffset, offset);
      }
      return target;
    }
    function _mask(source, mask, output, offset, length) {
      for (let i = 0; i < length; i++) {
        output[offset + i] = source[i] ^ mask[i & 3];
      }
    }
    function _unmask(buffer, mask) {
      for (let i = 0; i < buffer.length; i++) {
        buffer[i] ^= mask[i & 3];
      }
    }
    function toArrayBuffer(buf) {
      if (buf.length === buf.buffer.byteLength) {
        return buf.buffer;
      }
      return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.length);
    }
    function toBuffer(data) {
      toBuffer.readOnly = true;
      if (Buffer.isBuffer(data)) return data;
      let buf;
      if (data instanceof ArrayBuffer) {
        buf = new FastBuffer(data);
      } else if (ArrayBuffer.isView(data)) {
        buf = new FastBuffer(data.buffer, data.byteOffset, data.byteLength);
      } else {
        buf = Buffer.from(data);
        toBuffer.readOnly = false;
      }
      return buf;
    }
    module2.exports = {
      concat,
      mask: _mask,
      toArrayBuffer,
      toBuffer,
      unmask: _unmask
    };
    if (!process.env.WS_NO_BUFFER_UTIL) {
      try {
        const bufferUtil = require("bufferutil");
        module2.exports.mask = function(source, mask, output, offset, length) {
          if (length < 48) _mask(source, mask, output, offset, length);
          else bufferUtil.mask(source, mask, output, offset, length);
        };
        module2.exports.unmask = function(buffer, mask) {
          if (buffer.length < 32) _unmask(buffer, mask);
          else bufferUtil.unmask(buffer, mask);
        };
      } catch (e) {
      }
    }
  }
});

// ../../ws/lib/limiter.js
var require_limiter = __commonJS({
  "../../ws/lib/limiter.js"(exports2, module2) {
    "use strict";
    var kDone = /* @__PURE__ */ Symbol("kDone");
    var kRun = /* @__PURE__ */ Symbol("kRun");
    var Limiter = class {
      /**
       * Creates a new `Limiter`.
       *
       * @param {Number} [concurrency=Infinity] The maximum number of jobs allowed
       *     to run concurrently
       */
      constructor(concurrency) {
        this[kDone] = () => {
          this.pending--;
          this[kRun]();
        };
        this.concurrency = concurrency || Infinity;
        this.jobs = [];
        this.pending = 0;
      }
      /**
       * Adds a job to the queue.
       *
       * @param {Function} job The job to run
       * @public
       */
      add(job) {
        this.jobs.push(job);
        this[kRun]();
      }
      /**
       * Removes a job from the queue and runs it if possible.
       *
       * @private
       */
      [kRun]() {
        if (this.pending === this.concurrency) return;
        if (this.jobs.length) {
          const job = this.jobs.shift();
          this.pending++;
          job(this[kDone]);
        }
      }
    };
    module2.exports = Limiter;
  }
});

// ../../ws/lib/permessage-deflate.js
var require_permessage_deflate = __commonJS({
  "../../ws/lib/permessage-deflate.js"(exports2, module2) {
    "use strict";
    var zlib = require("zlib");
    var bufferUtil = require_buffer_util();
    var Limiter = require_limiter();
    var { kStatusCode } = require_constants();
    var FastBuffer = Buffer[Symbol.species];
    var TRAILER = Buffer.from([0, 0, 255, 255]);
    var kPerMessageDeflate = /* @__PURE__ */ Symbol("permessage-deflate");
    var kTotalLength = /* @__PURE__ */ Symbol("total-length");
    var kCallback = /* @__PURE__ */ Symbol("callback");
    var kBuffers = /* @__PURE__ */ Symbol("buffers");
    var kError = /* @__PURE__ */ Symbol("error");
    var zlibLimiter;
    var PerMessageDeflate2 = class {
      /**
       * Creates a PerMessageDeflate instance.
       *
       * @param {Object} [options] Configuration options
       * @param {(Boolean|Number)} [options.clientMaxWindowBits] Advertise support
       *     for, or request, a custom client window size
       * @param {Boolean} [options.clientNoContextTakeover=false] Advertise/
       *     acknowledge disabling of client context takeover
       * @param {Number} [options.concurrencyLimit=10] The number of concurrent
       *     calls to zlib
       * @param {Boolean} [options.isServer=false] Create the instance in either
       *     server or client mode
       * @param {Number} [options.maxPayload=0] The maximum allowed message length
       * @param {(Boolean|Number)} [options.serverMaxWindowBits] Request/confirm the
       *     use of a custom server window size
       * @param {Boolean} [options.serverNoContextTakeover=false] Request/accept
       *     disabling of server context takeover
       * @param {Number} [options.threshold=1024] Size (in bytes) below which
       *     messages should not be compressed if context takeover is disabled
       * @param {Object} [options.zlibDeflateOptions] Options to pass to zlib on
       *     deflate
       * @param {Object} [options.zlibInflateOptions] Options to pass to zlib on
       *     inflate
       */
      constructor(options) {
        this._options = options || {};
        this._threshold = this._options.threshold !== void 0 ? this._options.threshold : 1024;
        this._maxPayload = this._options.maxPayload | 0;
        this._isServer = !!this._options.isServer;
        this._deflate = null;
        this._inflate = null;
        this.params = null;
        if (!zlibLimiter) {
          const concurrency = this._options.concurrencyLimit !== void 0 ? this._options.concurrencyLimit : 10;
          zlibLimiter = new Limiter(concurrency);
        }
      }
      /**
       * @type {String}
       */
      static get extensionName() {
        return "permessage-deflate";
      }
      /**
       * Create an extension negotiation offer.
       *
       * @return {Object} Extension parameters
       * @public
       */
      offer() {
        const params = {};
        if (this._options.serverNoContextTakeover) {
          params.server_no_context_takeover = true;
        }
        if (this._options.clientNoContextTakeover) {
          params.client_no_context_takeover = true;
        }
        if (this._options.serverMaxWindowBits) {
          params.server_max_window_bits = this._options.serverMaxWindowBits;
        }
        if (this._options.clientMaxWindowBits) {
          params.client_max_window_bits = this._options.clientMaxWindowBits;
        } else if (this._options.clientMaxWindowBits == null) {
          params.client_max_window_bits = true;
        }
        return params;
      }
      /**
       * Accept an extension negotiation offer/response.
       *
       * @param {Array} configurations The extension negotiation offers/reponse
       * @return {Object} Accepted configuration
       * @public
       */
      accept(configurations) {
        configurations = this.normalizeParams(configurations);
        this.params = this._isServer ? this.acceptAsServer(configurations) : this.acceptAsClient(configurations);
        return this.params;
      }
      /**
       * Releases all resources used by the extension.
       *
       * @public
       */
      cleanup() {
        if (this._inflate) {
          this._inflate.close();
          this._inflate = null;
        }
        if (this._deflate) {
          const callback = this._deflate[kCallback];
          this._deflate.close();
          this._deflate = null;
          if (callback) {
            callback(
              new Error(
                "The deflate stream was closed while data was being processed"
              )
            );
          }
        }
      }
      /**
       *  Accept an extension negotiation offer.
       *
       * @param {Array} offers The extension negotiation offers
       * @return {Object} Accepted configuration
       * @private
       */
      acceptAsServer(offers) {
        const opts = this._options;
        const accepted = offers.find((params) => {
          if (opts.serverNoContextTakeover === false && params.server_no_context_takeover || params.server_max_window_bits && (opts.serverMaxWindowBits === false || typeof opts.serverMaxWindowBits === "number" && opts.serverMaxWindowBits > params.server_max_window_bits) || typeof opts.clientMaxWindowBits === "number" && (typeof params.client_max_window_bits === "number" ? opts.clientMaxWindowBits > params.client_max_window_bits : !params.client_max_window_bits)) {
            return false;
          }
          return true;
        });
        if (!accepted) {
          throw new Error("None of the extension offers can be accepted");
        }
        if (opts.serverNoContextTakeover) {
          accepted.server_no_context_takeover = true;
        }
        if (opts.clientNoContextTakeover) {
          accepted.client_no_context_takeover = true;
        }
        if (typeof opts.serverMaxWindowBits === "number") {
          accepted.server_max_window_bits = opts.serverMaxWindowBits;
        }
        if (typeof opts.clientMaxWindowBits === "number") {
          accepted.client_max_window_bits = opts.clientMaxWindowBits;
        } else if (accepted.client_max_window_bits === true || opts.clientMaxWindowBits === false) {
          delete accepted.client_max_window_bits;
        }
        return accepted;
      }
      /**
       * Accept the extension negotiation response.
       *
       * @param {Array} response The extension negotiation response
       * @return {Object} Accepted configuration
       * @private
       */
      acceptAsClient(response) {
        const params = response[0];
        if (this._options.clientNoContextTakeover === false && params.client_no_context_takeover) {
          throw new Error('Unexpected parameter "client_no_context_takeover"');
        }
        if (!params.client_max_window_bits) {
          if (typeof this._options.clientMaxWindowBits === "number") {
            params.client_max_window_bits = this._options.clientMaxWindowBits;
          }
        } else if (this._options.clientMaxWindowBits === false || typeof this._options.clientMaxWindowBits === "number" && params.client_max_window_bits > this._options.clientMaxWindowBits) {
          throw new Error(
            'Unexpected or invalid parameter "client_max_window_bits"'
          );
        }
        return params;
      }
      /**
       * Normalize parameters.
       *
       * @param {Array} configurations The extension negotiation offers/reponse
       * @return {Array} The offers/response with normalized parameters
       * @private
       */
      normalizeParams(configurations) {
        configurations.forEach((params) => {
          Object.keys(params).forEach((key) => {
            let value = params[key];
            if (value.length > 1) {
              throw new Error(`Parameter "${key}" must have only a single value`);
            }
            value = value[0];
            if (key === "client_max_window_bits") {
              if (value !== true) {
                const num = +value;
                if (!Number.isInteger(num) || num < 8 || num > 15) {
                  throw new TypeError(
                    `Invalid value for parameter "${key}": ${value}`
                  );
                }
                value = num;
              } else if (!this._isServer) {
                throw new TypeError(
                  `Invalid value for parameter "${key}": ${value}`
                );
              }
            } else if (key === "server_max_window_bits") {
              const num = +value;
              if (!Number.isInteger(num) || num < 8 || num > 15) {
                throw new TypeError(
                  `Invalid value for parameter "${key}": ${value}`
                );
              }
              value = num;
            } else if (key === "client_no_context_takeover" || key === "server_no_context_takeover") {
              if (value !== true) {
                throw new TypeError(
                  `Invalid value for parameter "${key}": ${value}`
                );
              }
            } else {
              throw new Error(`Unknown parameter "${key}"`);
            }
            params[key] = value;
          });
        });
        return configurations;
      }
      /**
       * Decompress data. Concurrency limited.
       *
       * @param {Buffer} data Compressed data
       * @param {Boolean} fin Specifies whether or not this is the last fragment
       * @param {Function} callback Callback
       * @public
       */
      decompress(data, fin, callback) {
        zlibLimiter.add((done) => {
          this._decompress(data, fin, (err, result) => {
            done();
            callback(err, result);
          });
        });
      }
      /**
       * Compress data. Concurrency limited.
       *
       * @param {(Buffer|String)} data Data to compress
       * @param {Boolean} fin Specifies whether or not this is the last fragment
       * @param {Function} callback Callback
       * @public
       */
      compress(data, fin, callback) {
        zlibLimiter.add((done) => {
          this._compress(data, fin, (err, result) => {
            done();
            callback(err, result);
          });
        });
      }
      /**
       * Decompress data.
       *
       * @param {Buffer} data Compressed data
       * @param {Boolean} fin Specifies whether or not this is the last fragment
       * @param {Function} callback Callback
       * @private
       */
      _decompress(data, fin, callback) {
        const endpoint = this._isServer ? "client" : "server";
        if (!this._inflate) {
          const key = `${endpoint}_max_window_bits`;
          const windowBits = typeof this.params[key] !== "number" ? zlib.Z_DEFAULT_WINDOWBITS : this.params[key];
          this._inflate = zlib.createInflateRaw({
            ...this._options.zlibInflateOptions,
            windowBits
          });
          this._inflate[kPerMessageDeflate] = this;
          this._inflate[kTotalLength] = 0;
          this._inflate[kBuffers] = [];
          this._inflate.on("error", inflateOnError);
          this._inflate.on("data", inflateOnData);
        }
        this._inflate[kCallback] = callback;
        this._inflate.write(data);
        if (fin) this._inflate.write(TRAILER);
        this._inflate.flush(() => {
          const err = this._inflate[kError];
          if (err) {
            this._inflate.close();
            this._inflate = null;
            callback(err);
            return;
          }
          const data2 = bufferUtil.concat(
            this._inflate[kBuffers],
            this._inflate[kTotalLength]
          );
          if (this._inflate._readableState.endEmitted) {
            this._inflate.close();
            this._inflate = null;
          } else {
            this._inflate[kTotalLength] = 0;
            this._inflate[kBuffers] = [];
            if (fin && this.params[`${endpoint}_no_context_takeover`]) {
              this._inflate.reset();
            }
          }
          callback(null, data2);
        });
      }
      /**
       * Compress data.
       *
       * @param {(Buffer|String)} data Data to compress
       * @param {Boolean} fin Specifies whether or not this is the last fragment
       * @param {Function} callback Callback
       * @private
       */
      _compress(data, fin, callback) {
        const endpoint = this._isServer ? "server" : "client";
        if (!this._deflate) {
          const key = `${endpoint}_max_window_bits`;
          const windowBits = typeof this.params[key] !== "number" ? zlib.Z_DEFAULT_WINDOWBITS : this.params[key];
          this._deflate = zlib.createDeflateRaw({
            ...this._options.zlibDeflateOptions,
            windowBits
          });
          this._deflate[kTotalLength] = 0;
          this._deflate[kBuffers] = [];
          this._deflate.on("data", deflateOnData);
        }
        this._deflate[kCallback] = callback;
        this._deflate.write(data);
        this._deflate.flush(zlib.Z_SYNC_FLUSH, () => {
          if (!this._deflate) {
            return;
          }
          let data2 = bufferUtil.concat(
            this._deflate[kBuffers],
            this._deflate[kTotalLength]
          );
          if (fin) {
            data2 = new FastBuffer(data2.buffer, data2.byteOffset, data2.length - 4);
          }
          this._deflate[kCallback] = null;
          this._deflate[kTotalLength] = 0;
          this._deflate[kBuffers] = [];
          if (fin && this.params[`${endpoint}_no_context_takeover`]) {
            this._deflate.reset();
          }
          callback(null, data2);
        });
      }
    };
    module2.exports = PerMessageDeflate2;
    function deflateOnData(chunk) {
      this[kBuffers].push(chunk);
      this[kTotalLength] += chunk.length;
    }
    function inflateOnData(chunk) {
      this[kTotalLength] += chunk.length;
      if (this[kPerMessageDeflate]._maxPayload < 1 || this[kTotalLength] <= this[kPerMessageDeflate]._maxPayload) {
        this[kBuffers].push(chunk);
        return;
      }
      this[kError] = new RangeError("Max payload size exceeded");
      this[kError].code = "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH";
      this[kError][kStatusCode] = 1009;
      this.removeListener("data", inflateOnData);
      this.reset();
    }
    function inflateOnError(err) {
      this[kPerMessageDeflate]._inflate = null;
      if (this[kError]) {
        this[kCallback](this[kError]);
        return;
      }
      err[kStatusCode] = 1007;
      this[kCallback](err);
    }
  }
});

// ../../ws/lib/validation.js
var require_validation = __commonJS({
  "../../ws/lib/validation.js"(exports2, module2) {
    "use strict";
    var { isUtf8 } = require("buffer");
    var { hasBlob } = require_constants();
    var tokenChars = [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      // 0 - 15
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      // 16 - 31
      0,
      1,
      0,
      1,
      1,
      1,
      1,
      1,
      0,
      0,
      1,
      1,
      0,
      1,
      1,
      0,
      // 32 - 47
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      // 48 - 63
      0,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      // 64 - 79
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      0,
      0,
      0,
      1,
      1,
      // 80 - 95
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      // 96 - 111
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      0,
      1,
      0,
      1,
      0
      // 112 - 127
    ];
    function isValidStatusCode(code) {
      return code >= 1e3 && code <= 1014 && code !== 1004 && code !== 1005 && code !== 1006 || code >= 3e3 && code <= 4999;
    }
    function _isValidUTF8(buf) {
      const len = buf.length;
      let i = 0;
      while (i < len) {
        if ((buf[i] & 128) === 0) {
          i++;
        } else if ((buf[i] & 224) === 192) {
          if (i + 1 === len || (buf[i + 1] & 192) !== 128 || (buf[i] & 254) === 192) {
            return false;
          }
          i += 2;
        } else if ((buf[i] & 240) === 224) {
          if (i + 2 >= len || (buf[i + 1] & 192) !== 128 || (buf[i + 2] & 192) !== 128 || buf[i] === 224 && (buf[i + 1] & 224) === 128 || // Overlong
          buf[i] === 237 && (buf[i + 1] & 224) === 160) {
            return false;
          }
          i += 3;
        } else if ((buf[i] & 248) === 240) {
          if (i + 3 >= len || (buf[i + 1] & 192) !== 128 || (buf[i + 2] & 192) !== 128 || (buf[i + 3] & 192) !== 128 || buf[i] === 240 && (buf[i + 1] & 240) === 128 || // Overlong
          buf[i] === 244 && buf[i + 1] > 143 || buf[i] > 244) {
            return false;
          }
          i += 4;
        } else {
          return false;
        }
      }
      return true;
    }
    function isBlob(value) {
      return hasBlob && typeof value === "object" && typeof value.arrayBuffer === "function" && typeof value.type === "string" && typeof value.stream === "function" && (value[Symbol.toStringTag] === "Blob" || value[Symbol.toStringTag] === "File");
    }
    module2.exports = {
      isBlob,
      isValidStatusCode,
      isValidUTF8: _isValidUTF8,
      tokenChars
    };
    if (isUtf8) {
      module2.exports.isValidUTF8 = function(buf) {
        return buf.length < 24 ? _isValidUTF8(buf) : isUtf8(buf);
      };
    } else if (!process.env.WS_NO_UTF_8_VALIDATE) {
      try {
        const isValidUTF8 = require("utf-8-validate");
        module2.exports.isValidUTF8 = function(buf) {
          return buf.length < 32 ? _isValidUTF8(buf) : isValidUTF8(buf);
        };
      } catch (e) {
      }
    }
  }
});

// ../../ws/lib/receiver.js
var require_receiver = __commonJS({
  "../../ws/lib/receiver.js"(exports2, module2) {
    "use strict";
    var { Writable } = require("stream");
    var PerMessageDeflate2 = require_permessage_deflate();
    var {
      BINARY_TYPES,
      EMPTY_BUFFER,
      kStatusCode,
      kWebSocket
    } = require_constants();
    var { concat, toArrayBuffer, unmask } = require_buffer_util();
    var { isValidStatusCode, isValidUTF8 } = require_validation();
    var FastBuffer = Buffer[Symbol.species];
    var GET_INFO = 0;
    var GET_PAYLOAD_LENGTH_16 = 1;
    var GET_PAYLOAD_LENGTH_64 = 2;
    var GET_MASK = 3;
    var GET_DATA = 4;
    var INFLATING = 5;
    var DEFER_EVENT = 6;
    var Receiver2 = class extends Writable {
      /**
       * Creates a Receiver instance.
       *
       * @param {Object} [options] Options object
       * @param {Boolean} [options.allowSynchronousEvents=true] Specifies whether
       *     any of the `'message'`, `'ping'`, and `'pong'` events can be emitted
       *     multiple times in the same tick
       * @param {String} [options.binaryType=nodebuffer] The type for binary data
       * @param {Object} [options.extensions] An object containing the negotiated
       *     extensions
       * @param {Boolean} [options.isServer=false] Specifies whether to operate in
       *     client or server mode
       * @param {Number} [options.maxBufferedChunks=0] The maximum number of
       *     buffered data chunks
       * @param {Number} [options.maxFragments=0] The maximum number of message
       *     fragments
       * @param {Number} [options.maxPayload=0] The maximum allowed message length
       * @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
       *     not to skip UTF-8 validation for text and close messages
       */
      constructor(options = {}) {
        super();
        this._allowSynchronousEvents = options.allowSynchronousEvents !== void 0 ? options.allowSynchronousEvents : true;
        this._binaryType = options.binaryType || BINARY_TYPES[0];
        this._extensions = options.extensions || {};
        this._isServer = !!options.isServer;
        this._maxBufferedChunks = options.maxBufferedChunks | 0;
        this._maxFragments = options.maxFragments | 0;
        this._maxPayload = options.maxPayload | 0;
        this._skipUTF8Validation = !!options.skipUTF8Validation;
        this[kWebSocket] = void 0;
        this._bufferedBytes = 0;
        this._buffers = [];
        this._compressed = false;
        this._payloadLength = 0;
        this._mask = void 0;
        this._fragmented = 0;
        this._masked = false;
        this._fin = false;
        this._opcode = 0;
        this._totalPayloadLength = 0;
        this._messageLength = 0;
        this._numFragments = 0;
        this._fragments = [];
        this._errored = false;
        this._loop = false;
        this._state = GET_INFO;
      }
      /**
       * Implements `Writable.prototype._write()`.
       *
       * @param {Buffer} chunk The chunk of data to write
       * @param {String} encoding The character encoding of `chunk`
       * @param {Function} cb Callback
       * @private
       */
      _write(chunk, encoding, cb) {
        if (this._opcode === 8 && this._state == GET_INFO) return cb();
        if (this._maxBufferedChunks > 0 && this._buffers.length >= this._maxBufferedChunks) {
          cb(
            this.createError(
              RangeError,
              "Too many buffered chunks",
              false,
              1008,
              "WS_ERR_TOO_MANY_BUFFERED_PARTS"
            )
          );
          return;
        }
        this._bufferedBytes += chunk.length;
        this._buffers.push(chunk);
        this.startLoop(cb);
      }
      /**
       * Consumes `n` bytes from the buffered data.
       *
       * @param {Number} n The number of bytes to consume
       * @return {Buffer} The consumed bytes
       * @private
       */
      consume(n) {
        this._bufferedBytes -= n;
        if (n === this._buffers[0].length) return this._buffers.shift();
        if (n < this._buffers[0].length) {
          const buf = this._buffers[0];
          this._buffers[0] = new FastBuffer(
            buf.buffer,
            buf.byteOffset + n,
            buf.length - n
          );
          return new FastBuffer(buf.buffer, buf.byteOffset, n);
        }
        const dst = Buffer.allocUnsafe(n);
        do {
          const buf = this._buffers[0];
          const offset = dst.length - n;
          if (n >= buf.length) {
            dst.set(this._buffers.shift(), offset);
          } else {
            dst.set(new Uint8Array(buf.buffer, buf.byteOffset, n), offset);
            this._buffers[0] = new FastBuffer(
              buf.buffer,
              buf.byteOffset + n,
              buf.length - n
            );
          }
          n -= buf.length;
        } while (n > 0);
        return dst;
      }
      /**
       * Starts the parsing loop.
       *
       * @param {Function} cb Callback
       * @private
       */
      startLoop(cb) {
        this._loop = true;
        do {
          switch (this._state) {
            case GET_INFO:
              this.getInfo(cb);
              break;
            case GET_PAYLOAD_LENGTH_16:
              this.getPayloadLength16(cb);
              break;
            case GET_PAYLOAD_LENGTH_64:
              this.getPayloadLength64(cb);
              break;
            case GET_MASK:
              this.getMask();
              break;
            case GET_DATA:
              this.getData(cb);
              break;
            case INFLATING:
            case DEFER_EVENT:
              this._loop = false;
              return;
          }
        } while (this._loop);
        if (!this._errored) cb();
      }
      /**
       * Reads the first two bytes of a frame.
       *
       * @param {Function} cb Callback
       * @private
       */
      getInfo(cb) {
        if (this._bufferedBytes < 2) {
          this._loop = false;
          return;
        }
        const buf = this.consume(2);
        if ((buf[0] & 48) !== 0) {
          const error = this.createError(
            RangeError,
            "RSV2 and RSV3 must be clear",
            true,
            1002,
            "WS_ERR_UNEXPECTED_RSV_2_3"
          );
          cb(error);
          return;
        }
        const compressed = (buf[0] & 64) === 64;
        if (compressed && !this._extensions[PerMessageDeflate2.extensionName]) {
          const error = this.createError(
            RangeError,
            "RSV1 must be clear",
            true,
            1002,
            "WS_ERR_UNEXPECTED_RSV_1"
          );
          cb(error);
          return;
        }
        this._fin = (buf[0] & 128) === 128;
        this._opcode = buf[0] & 15;
        this._payloadLength = buf[1] & 127;
        if (this._opcode === 0) {
          if (compressed) {
            const error = this.createError(
              RangeError,
              "RSV1 must be clear",
              true,
              1002,
              "WS_ERR_UNEXPECTED_RSV_1"
            );
            cb(error);
            return;
          }
          if (!this._fragmented) {
            const error = this.createError(
              RangeError,
              "invalid opcode 0",
              true,
              1002,
              "WS_ERR_INVALID_OPCODE"
            );
            cb(error);
            return;
          }
          this._opcode = this._fragmented;
        } else if (this._opcode === 1 || this._opcode === 2) {
          if (this._fragmented) {
            const error = this.createError(
              RangeError,
              `invalid opcode ${this._opcode}`,
              true,
              1002,
              "WS_ERR_INVALID_OPCODE"
            );
            cb(error);
            return;
          }
          this._compressed = compressed;
        } else if (this._opcode > 7 && this._opcode < 11) {
          if (!this._fin) {
            const error = this.createError(
              RangeError,
              "FIN must be set",
              true,
              1002,
              "WS_ERR_EXPECTED_FIN"
            );
            cb(error);
            return;
          }
          if (compressed) {
            const error = this.createError(
              RangeError,
              "RSV1 must be clear",
              true,
              1002,
              "WS_ERR_UNEXPECTED_RSV_1"
            );
            cb(error);
            return;
          }
          if (this._payloadLength > 125 || this._opcode === 8 && this._payloadLength === 1) {
            const error = this.createError(
              RangeError,
              `invalid payload length ${this._payloadLength}`,
              true,
              1002,
              "WS_ERR_INVALID_CONTROL_PAYLOAD_LENGTH"
            );
            cb(error);
            return;
          }
        } else {
          const error = this.createError(
            RangeError,
            `invalid opcode ${this._opcode}`,
            true,
            1002,
            "WS_ERR_INVALID_OPCODE"
          );
          cb(error);
          return;
        }
        if (!this._fin && !this._fragmented) this._fragmented = this._opcode;
        this._masked = (buf[1] & 128) === 128;
        if (this._isServer) {
          if (!this._masked) {
            const error = this.createError(
              RangeError,
              "MASK must be set",
              true,
              1002,
              "WS_ERR_EXPECTED_MASK"
            );
            cb(error);
            return;
          }
        } else if (this._masked) {
          const error = this.createError(
            RangeError,
            "MASK must be clear",
            true,
            1002,
            "WS_ERR_UNEXPECTED_MASK"
          );
          cb(error);
          return;
        }
        if (this._payloadLength === 126) this._state = GET_PAYLOAD_LENGTH_16;
        else if (this._payloadLength === 127) this._state = GET_PAYLOAD_LENGTH_64;
        else this.haveLength(cb);
      }
      /**
       * Gets extended payload length (7+16).
       *
       * @param {Function} cb Callback
       * @private
       */
      getPayloadLength16(cb) {
        if (this._bufferedBytes < 2) {
          this._loop = false;
          return;
        }
        this._payloadLength = this.consume(2).readUInt16BE(0);
        this.haveLength(cb);
      }
      /**
       * Gets extended payload length (7+64).
       *
       * @param {Function} cb Callback
       * @private
       */
      getPayloadLength64(cb) {
        if (this._bufferedBytes < 8) {
          this._loop = false;
          return;
        }
        const buf = this.consume(8);
        const num = buf.readUInt32BE(0);
        if (num > Math.pow(2, 53 - 32) - 1) {
          const error = this.createError(
            RangeError,
            "Unsupported WebSocket frame: payload length > 2^53 - 1",
            false,
            1009,
            "WS_ERR_UNSUPPORTED_DATA_PAYLOAD_LENGTH"
          );
          cb(error);
          return;
        }
        this._payloadLength = num * Math.pow(2, 32) + buf.readUInt32BE(4);
        this.haveLength(cb);
      }
      /**
       * Payload length has been read.
       *
       * @param {Function} cb Callback
       * @private
       */
      haveLength(cb) {
        if (this._payloadLength && this._opcode < 8) {
          this._totalPayloadLength += this._payloadLength;
          if (this._totalPayloadLength > this._maxPayload && this._maxPayload > 0) {
            const error = this.createError(
              RangeError,
              "Max payload size exceeded",
              false,
              1009,
              "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH"
            );
            cb(error);
            return;
          }
        }
        if (this._masked) this._state = GET_MASK;
        else this._state = GET_DATA;
      }
      /**
       * Reads mask bytes.
       *
       * @private
       */
      getMask() {
        if (this._bufferedBytes < 4) {
          this._loop = false;
          return;
        }
        this._mask = this.consume(4);
        this._state = GET_DATA;
      }
      /**
       * Reads data bytes.
       *
       * @param {Function} cb Callback
       * @private
       */
      getData(cb) {
        let data = EMPTY_BUFFER;
        if (this._payloadLength) {
          if (this._bufferedBytes < this._payloadLength) {
            this._loop = false;
            return;
          }
          data = this.consume(this._payloadLength);
          if (this._masked && (this._mask[0] | this._mask[1] | this._mask[2] | this._mask[3]) !== 0) {
            unmask(data, this._mask);
          }
        }
        if (this._opcode > 7) {
          this.controlMessage(data, cb);
          return;
        }
        if (this._maxFragments > 0 && ++this._numFragments > this._maxFragments) {
          const error = this.createError(
            RangeError,
            "Too many message fragments",
            false,
            1008,
            "WS_ERR_TOO_MANY_BUFFERED_PARTS"
          );
          cb(error);
          return;
        }
        if (this._compressed) {
          this._state = INFLATING;
          this.decompress(data, cb);
          return;
        }
        if (data.length) {
          this._messageLength = this._totalPayloadLength;
          this._fragments.push(data);
        }
        this.dataMessage(cb);
      }
      /**
       * Decompresses data.
       *
       * @param {Buffer} data Compressed data
       * @param {Function} cb Callback
       * @private
       */
      decompress(data, cb) {
        const perMessageDeflate = this._extensions[PerMessageDeflate2.extensionName];
        perMessageDeflate.decompress(data, this._fin, (err, buf) => {
          if (err) return cb(err);
          if (buf.length) {
            this._messageLength += buf.length;
            if (this._messageLength > this._maxPayload && this._maxPayload > 0) {
              const error = this.createError(
                RangeError,
                "Max payload size exceeded",
                false,
                1009,
                "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH"
              );
              cb(error);
              return;
            }
            this._fragments.push(buf);
          }
          this.dataMessage(cb);
          if (this._state === GET_INFO) this.startLoop(cb);
        });
      }
      /**
       * Handles a data message.
       *
       * @param {Function} cb Callback
       * @private
       */
      dataMessage(cb) {
        if (!this._fin) {
          this._state = GET_INFO;
          return;
        }
        const messageLength = this._messageLength;
        const fragments = this._fragments;
        this._totalPayloadLength = 0;
        this._messageLength = 0;
        this._fragmented = 0;
        this._numFragments = 0;
        this._fragments = [];
        if (this._opcode === 2) {
          let data;
          if (this._binaryType === "nodebuffer") {
            data = concat(fragments, messageLength);
          } else if (this._binaryType === "arraybuffer") {
            data = toArrayBuffer(concat(fragments, messageLength));
          } else if (this._binaryType === "blob") {
            data = new Blob(fragments);
          } else {
            data = fragments;
          }
          if (this._allowSynchronousEvents) {
            this.emit("message", data, true);
            this._state = GET_INFO;
          } else {
            this._state = DEFER_EVENT;
            setImmediate(() => {
              this.emit("message", data, true);
              this._state = GET_INFO;
              this.startLoop(cb);
            });
          }
        } else {
          const buf = concat(fragments, messageLength);
          if (!this._skipUTF8Validation && !isValidUTF8(buf)) {
            const error = this.createError(
              Error,
              "invalid UTF-8 sequence",
              true,
              1007,
              "WS_ERR_INVALID_UTF8"
            );
            cb(error);
            return;
          }
          if (this._state === INFLATING || this._allowSynchronousEvents) {
            this.emit("message", buf, false);
            this._state = GET_INFO;
          } else {
            this._state = DEFER_EVENT;
            setImmediate(() => {
              this.emit("message", buf, false);
              this._state = GET_INFO;
              this.startLoop(cb);
            });
          }
        }
      }
      /**
       * Handles a control message.
       *
       * @param {Buffer} data Data to handle
       * @return {(Error|RangeError|undefined)} A possible error
       * @private
       */
      controlMessage(data, cb) {
        if (this._opcode === 8) {
          if (data.length === 0) {
            this._loop = false;
            this.emit("conclude", 1005, EMPTY_BUFFER);
            this.end();
          } else {
            const code = data.readUInt16BE(0);
            if (!isValidStatusCode(code)) {
              const error = this.createError(
                RangeError,
                `invalid status code ${code}`,
                true,
                1002,
                "WS_ERR_INVALID_CLOSE_CODE"
              );
              cb(error);
              return;
            }
            const buf = new FastBuffer(
              data.buffer,
              data.byteOffset + 2,
              data.length - 2
            );
            if (!this._skipUTF8Validation && !isValidUTF8(buf)) {
              const error = this.createError(
                Error,
                "invalid UTF-8 sequence",
                true,
                1007,
                "WS_ERR_INVALID_UTF8"
              );
              cb(error);
              return;
            }
            this._loop = false;
            this.emit("conclude", code, buf);
            this.end();
          }
          this._state = GET_INFO;
          return;
        }
        if (this._allowSynchronousEvents) {
          this.emit(this._opcode === 9 ? "ping" : "pong", data);
          this._state = GET_INFO;
        } else {
          this._state = DEFER_EVENT;
          setImmediate(() => {
            this.emit(this._opcode === 9 ? "ping" : "pong", data);
            this._state = GET_INFO;
            this.startLoop(cb);
          });
        }
      }
      /**
       * Builds an error object.
       *
       * @param {function(new:Error|RangeError)} ErrorCtor The error constructor
       * @param {String} message The error message
       * @param {Boolean} prefix Specifies whether or not to add a default prefix to
       *     `message`
       * @param {Number} statusCode The status code
       * @param {String} errorCode The exposed error code
       * @return {(Error|RangeError)} The error
       * @private
       */
      createError(ErrorCtor, message, prefix, statusCode, errorCode) {
        this._loop = false;
        this._errored = true;
        const err = new ErrorCtor(
          prefix ? `Invalid WebSocket frame: ${message}` : message
        );
        Error.captureStackTrace(err, this.createError);
        err.code = errorCode;
        err[kStatusCode] = statusCode;
        return err;
      }
    };
    module2.exports = Receiver2;
  }
});

// ../../ws/lib/sender.js
var require_sender = __commonJS({
  "../../ws/lib/sender.js"(exports2, module2) {
    "use strict";
    var { Duplex } = require("stream");
    var { randomFillSync } = require("crypto");
    var {
      types: { isUint8Array }
    } = require("util");
    var PerMessageDeflate2 = require_permessage_deflate();
    var { EMPTY_BUFFER, kWebSocket, NOOP } = require_constants();
    var { isBlob, isValidStatusCode } = require_validation();
    var { mask: applyMask, toBuffer } = require_buffer_util();
    var kByteLength = /* @__PURE__ */ Symbol("kByteLength");
    var maskBuffer = Buffer.alloc(4);
    var RANDOM_POOL_SIZE = 8 * 1024;
    var randomPool;
    var randomPoolPointer = RANDOM_POOL_SIZE;
    var DEFAULT = 0;
    var DEFLATING = 1;
    var GET_BLOB_DATA = 2;
    var Sender2 = class _Sender {
      /**
       * Creates a Sender instance.
       *
       * @param {Duplex} socket The connection socket
       * @param {Object} [extensions] An object containing the negotiated extensions
       * @param {Function} [generateMask] The function used to generate the masking
       *     key
       */
      constructor(socket, extensions, generateMask) {
        this._extensions = extensions || {};
        if (generateMask) {
          this._generateMask = generateMask;
          this._maskBuffer = Buffer.alloc(4);
        }
        this._socket = socket;
        this._firstFragment = true;
        this._compress = false;
        this._bufferedBytes = 0;
        this._queue = [];
        this._state = DEFAULT;
        this.onerror = NOOP;
        this[kWebSocket] = void 0;
      }
      /**
       * Frames a piece of data according to the HyBi WebSocket protocol.
       *
       * @param {(Buffer|String)} data The data to frame
       * @param {Object} options Options object
       * @param {Boolean} [options.fin=false] Specifies whether or not to set the
       *     FIN bit
       * @param {Function} [options.generateMask] The function used to generate the
       *     masking key
       * @param {Boolean} [options.mask=false] Specifies whether or not to mask
       *     `data`
       * @param {Buffer} [options.maskBuffer] The buffer used to store the masking
       *     key
       * @param {Number} options.opcode The opcode
       * @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
       *     modified
       * @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
       *     RSV1 bit
       * @return {(Buffer|String)[]} The framed data
       * @public
       */
      static frame(data, options) {
        let mask;
        let merge = false;
        let offset = 2;
        let skipMasking = false;
        if (options.mask) {
          mask = options.maskBuffer || maskBuffer;
          if (options.generateMask) {
            options.generateMask(mask);
          } else {
            if (randomPoolPointer === RANDOM_POOL_SIZE) {
              if (randomPool === void 0) {
                randomPool = Buffer.alloc(RANDOM_POOL_SIZE);
              }
              randomFillSync(randomPool, 0, RANDOM_POOL_SIZE);
              randomPoolPointer = 0;
            }
            mask[0] = randomPool[randomPoolPointer++];
            mask[1] = randomPool[randomPoolPointer++];
            mask[2] = randomPool[randomPoolPointer++];
            mask[3] = randomPool[randomPoolPointer++];
          }
          skipMasking = (mask[0] | mask[1] | mask[2] | mask[3]) === 0;
          offset = 6;
        }
        let dataLength;
        if (typeof data === "string") {
          if ((!options.mask || skipMasking) && options[kByteLength] !== void 0) {
            dataLength = options[kByteLength];
          } else {
            data = Buffer.from(data);
            dataLength = data.length;
          }
        } else {
          dataLength = data.length;
          merge = options.mask && options.readOnly && !skipMasking;
        }
        let payloadLength = dataLength;
        if (dataLength >= 65536) {
          offset += 8;
          payloadLength = 127;
        } else if (dataLength > 125) {
          offset += 2;
          payloadLength = 126;
        }
        const target = Buffer.allocUnsafe(merge ? dataLength + offset : offset);
        target[0] = options.fin ? options.opcode | 128 : options.opcode;
        if (options.rsv1) target[0] |= 64;
        target[1] = payloadLength;
        if (payloadLength === 126) {
          target.writeUInt16BE(dataLength, 2);
        } else if (payloadLength === 127) {
          target[2] = target[3] = 0;
          target.writeUIntBE(dataLength, 4, 6);
        }
        if (!options.mask) return [target, data];
        target[1] |= 128;
        target[offset - 4] = mask[0];
        target[offset - 3] = mask[1];
        target[offset - 2] = mask[2];
        target[offset - 1] = mask[3];
        if (skipMasking) return [target, data];
        if (merge) {
          applyMask(data, mask, target, offset, dataLength);
          return [target];
        }
        applyMask(data, mask, data, 0, dataLength);
        return [target, data];
      }
      /**
       * Sends a close message to the other peer.
       *
       * @param {Number} [code] The status code component of the body
       * @param {(String|Buffer)} [data] The message component of the body
       * @param {Boolean} [mask=false] Specifies whether or not to mask the message
       * @param {Function} [cb] Callback
       * @public
       */
      close(code, data, mask, cb) {
        let buf;
        if (code === void 0) {
          buf = EMPTY_BUFFER;
        } else if (typeof code !== "number" || !isValidStatusCode(code)) {
          throw new TypeError("First argument must be a valid error code number");
        } else if (data === void 0 || !data.length) {
          buf = Buffer.allocUnsafe(2);
          buf.writeUInt16BE(code, 0);
        } else {
          const length = Buffer.byteLength(data);
          if (length > 123) {
            throw new RangeError("The message must not be greater than 123 bytes");
          }
          buf = Buffer.allocUnsafe(2 + length);
          buf.writeUInt16BE(code, 0);
          if (typeof data === "string") {
            buf.write(data, 2);
          } else if (isUint8Array(data)) {
            buf.set(data, 2);
          } else {
            throw new TypeError("Second argument must be a string or a Uint8Array");
          }
        }
        const options = {
          [kByteLength]: buf.length,
          fin: true,
          generateMask: this._generateMask,
          mask,
          maskBuffer: this._maskBuffer,
          opcode: 8,
          readOnly: false,
          rsv1: false
        };
        if (this._state !== DEFAULT) {
          this.enqueue([this.dispatch, buf, false, options, cb]);
        } else {
          this.sendFrame(_Sender.frame(buf, options), cb);
        }
      }
      /**
       * Sends a ping message to the other peer.
       *
       * @param {*} data The message to send
       * @param {Boolean} [mask=false] Specifies whether or not to mask `data`
       * @param {Function} [cb] Callback
       * @public
       */
      ping(data, mask, cb) {
        let byteLength;
        let readOnly;
        if (typeof data === "string") {
          byteLength = Buffer.byteLength(data);
          readOnly = false;
        } else if (isBlob(data)) {
          byteLength = data.size;
          readOnly = false;
        } else {
          data = toBuffer(data);
          byteLength = data.length;
          readOnly = toBuffer.readOnly;
        }
        if (byteLength > 125) {
          throw new RangeError("The data size must not be greater than 125 bytes");
        }
        const options = {
          [kByteLength]: byteLength,
          fin: true,
          generateMask: this._generateMask,
          mask,
          maskBuffer: this._maskBuffer,
          opcode: 9,
          readOnly,
          rsv1: false
        };
        if (isBlob(data)) {
          if (this._state !== DEFAULT) {
            this.enqueue([this.getBlobData, data, false, options, cb]);
          } else {
            this.getBlobData(data, false, options, cb);
          }
        } else if (this._state !== DEFAULT) {
          this.enqueue([this.dispatch, data, false, options, cb]);
        } else {
          this.sendFrame(_Sender.frame(data, options), cb);
        }
      }
      /**
       * Sends a pong message to the other peer.
       *
       * @param {*} data The message to send
       * @param {Boolean} [mask=false] Specifies whether or not to mask `data`
       * @param {Function} [cb] Callback
       * @public
       */
      pong(data, mask, cb) {
        let byteLength;
        let readOnly;
        if (typeof data === "string") {
          byteLength = Buffer.byteLength(data);
          readOnly = false;
        } else if (isBlob(data)) {
          byteLength = data.size;
          readOnly = false;
        } else {
          data = toBuffer(data);
          byteLength = data.length;
          readOnly = toBuffer.readOnly;
        }
        if (byteLength > 125) {
          throw new RangeError("The data size must not be greater than 125 bytes");
        }
        const options = {
          [kByteLength]: byteLength,
          fin: true,
          generateMask: this._generateMask,
          mask,
          maskBuffer: this._maskBuffer,
          opcode: 10,
          readOnly,
          rsv1: false
        };
        if (isBlob(data)) {
          if (this._state !== DEFAULT) {
            this.enqueue([this.getBlobData, data, false, options, cb]);
          } else {
            this.getBlobData(data, false, options, cb);
          }
        } else if (this._state !== DEFAULT) {
          this.enqueue([this.dispatch, data, false, options, cb]);
        } else {
          this.sendFrame(_Sender.frame(data, options), cb);
        }
      }
      /**
       * Sends a data message to the other peer.
       *
       * @param {*} data The message to send
       * @param {Object} options Options object
       * @param {Boolean} [options.binary=false] Specifies whether `data` is binary
       *     or text
       * @param {Boolean} [options.compress=false] Specifies whether or not to
       *     compress `data`
       * @param {Boolean} [options.fin=false] Specifies whether the fragment is the
       *     last one
       * @param {Boolean} [options.mask=false] Specifies whether or not to mask
       *     `data`
       * @param {Function} [cb] Callback
       * @public
       */
      send(data, options, cb) {
        const perMessageDeflate = this._extensions[PerMessageDeflate2.extensionName];
        let opcode = options.binary ? 2 : 1;
        let rsv1 = options.compress;
        let byteLength;
        let readOnly;
        if (typeof data === "string") {
          byteLength = Buffer.byteLength(data);
          readOnly = false;
        } else if (isBlob(data)) {
          byteLength = data.size;
          readOnly = false;
        } else {
          data = toBuffer(data);
          byteLength = data.length;
          readOnly = toBuffer.readOnly;
        }
        if (this._firstFragment) {
          this._firstFragment = false;
          if (rsv1 && perMessageDeflate && perMessageDeflate.params[perMessageDeflate._isServer ? "server_no_context_takeover" : "client_no_context_takeover"]) {
            rsv1 = byteLength >= perMessageDeflate._threshold;
          }
          this._compress = rsv1;
        } else {
          rsv1 = false;
          opcode = 0;
        }
        if (options.fin) this._firstFragment = true;
        const opts = {
          [kByteLength]: byteLength,
          fin: options.fin,
          generateMask: this._generateMask,
          mask: options.mask,
          maskBuffer: this._maskBuffer,
          opcode,
          readOnly,
          rsv1
        };
        if (isBlob(data)) {
          if (this._state !== DEFAULT) {
            this.enqueue([this.getBlobData, data, this._compress, opts, cb]);
          } else {
            this.getBlobData(data, this._compress, opts, cb);
          }
        } else if (this._state !== DEFAULT) {
          this.enqueue([this.dispatch, data, this._compress, opts, cb]);
        } else {
          this.dispatch(data, this._compress, opts, cb);
        }
      }
      /**
       * Gets the contents of a blob as binary data.
       *
       * @param {Blob} blob The blob
       * @param {Boolean} [compress=false] Specifies whether or not to compress
       *     the data
       * @param {Object} options Options object
       * @param {Boolean} [options.fin=false] Specifies whether or not to set the
       *     FIN bit
       * @param {Function} [options.generateMask] The function used to generate the
       *     masking key
       * @param {Boolean} [options.mask=false] Specifies whether or not to mask
       *     `data`
       * @param {Buffer} [options.maskBuffer] The buffer used to store the masking
       *     key
       * @param {Number} options.opcode The opcode
       * @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
       *     modified
       * @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
       *     RSV1 bit
       * @param {Function} [cb] Callback
       * @private
       */
      getBlobData(blob, compress, options, cb) {
        this._bufferedBytes += options[kByteLength];
        this._state = GET_BLOB_DATA;
        blob.arrayBuffer().then((arrayBuffer) => {
          if (this._socket.destroyed) {
            const err = new Error(
              "The socket was closed while the blob was being read"
            );
            process.nextTick(callCallbacks, this, err, cb);
            return;
          }
          this._bufferedBytes -= options[kByteLength];
          const data = toBuffer(arrayBuffer);
          if (!compress) {
            this._state = DEFAULT;
            this.sendFrame(_Sender.frame(data, options), cb);
            this.dequeue();
          } else {
            this.dispatch(data, compress, options, cb);
          }
        }).catch((err) => {
          process.nextTick(onError, this, err, cb);
        });
      }
      /**
       * Dispatches a message.
       *
       * @param {(Buffer|String)} data The message to send
       * @param {Boolean} [compress=false] Specifies whether or not to compress
       *     `data`
       * @param {Object} options Options object
       * @param {Boolean} [options.fin=false] Specifies whether or not to set the
       *     FIN bit
       * @param {Function} [options.generateMask] The function used to generate the
       *     masking key
       * @param {Boolean} [options.mask=false] Specifies whether or not to mask
       *     `data`
       * @param {Buffer} [options.maskBuffer] The buffer used to store the masking
       *     key
       * @param {Number} options.opcode The opcode
       * @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
       *     modified
       * @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
       *     RSV1 bit
       * @param {Function} [cb] Callback
       * @private
       */
      dispatch(data, compress, options, cb) {
        if (!compress) {
          this.sendFrame(_Sender.frame(data, options), cb);
          return;
        }
        const perMessageDeflate = this._extensions[PerMessageDeflate2.extensionName];
        this._bufferedBytes += options[kByteLength];
        this._state = DEFLATING;
        perMessageDeflate.compress(data, options.fin, (_2, buf) => {
          if (this._socket.destroyed) {
            const err = new Error(
              "The socket was closed while data was being compressed"
            );
            callCallbacks(this, err, cb);
            return;
          }
          this._bufferedBytes -= options[kByteLength];
          this._state = DEFAULT;
          options.readOnly = false;
          this.sendFrame(_Sender.frame(buf, options), cb);
          this.dequeue();
        });
      }
      /**
       * Executes queued send operations.
       *
       * @private
       */
      dequeue() {
        while (this._state === DEFAULT && this._queue.length) {
          const params = this._queue.shift();
          this._bufferedBytes -= params[3][kByteLength];
          Reflect.apply(params[0], this, params.slice(1));
        }
      }
      /**
       * Enqueues a send operation.
       *
       * @param {Array} params Send operation parameters.
       * @private
       */
      enqueue(params) {
        this._bufferedBytes += params[3][kByteLength];
        this._queue.push(params);
      }
      /**
       * Sends a frame.
       *
       * @param {(Buffer | String)[]} list The frame to send
       * @param {Function} [cb] Callback
       * @private
       */
      sendFrame(list, cb) {
        if (list.length === 2) {
          this._socket.cork();
          this._socket.write(list[0]);
          this._socket.write(list[1], cb);
          this._socket.uncork();
        } else {
          this._socket.write(list[0], cb);
        }
      }
    };
    module2.exports = Sender2;
    function callCallbacks(sender, err, cb) {
      if (typeof cb === "function") cb(err);
      for (let i = 0; i < sender._queue.length; i++) {
        const params = sender._queue[i];
        const callback = params[params.length - 1];
        if (typeof callback === "function") callback(err);
      }
    }
    function onError(sender, err, cb) {
      callCallbacks(sender, err, cb);
      sender.onerror(err);
    }
  }
});

// ../../ws/lib/event-target.js
var require_event_target = __commonJS({
  "../../ws/lib/event-target.js"(exports2, module2) {
    "use strict";
    var { kForOnEventAttribute, kListener } = require_constants();
    var kCode = /* @__PURE__ */ Symbol("kCode");
    var kData = /* @__PURE__ */ Symbol("kData");
    var kError = /* @__PURE__ */ Symbol("kError");
    var kMessage = /* @__PURE__ */ Symbol("kMessage");
    var kReason = /* @__PURE__ */ Symbol("kReason");
    var kTarget = /* @__PURE__ */ Symbol("kTarget");
    var kType = /* @__PURE__ */ Symbol("kType");
    var kWasClean = /* @__PURE__ */ Symbol("kWasClean");
    var Event = class {
      /**
       * Create a new `Event`.
       *
       * @param {String} type The name of the event
       * @throws {TypeError} If the `type` argument is not specified
       */
      constructor(type) {
        this[kTarget] = null;
        this[kType] = type;
      }
      /**
       * @type {*}
       */
      get target() {
        return this[kTarget];
      }
      /**
       * @type {String}
       */
      get type() {
        return this[kType];
      }
    };
    Object.defineProperty(Event.prototype, "target", { enumerable: true });
    Object.defineProperty(Event.prototype, "type", { enumerable: true });
    var CloseEvent = class extends Event {
      /**
       * Create a new `CloseEvent`.
       *
       * @param {String} type The name of the event
       * @param {Object} [options] A dictionary object that allows for setting
       *     attributes via object members of the same name
       * @param {Number} [options.code=0] The status code explaining why the
       *     connection was closed
       * @param {String} [options.reason=''] A human-readable string explaining why
       *     the connection was closed
       * @param {Boolean} [options.wasClean=false] Indicates whether or not the
       *     connection was cleanly closed
       */
      constructor(type, options = {}) {
        super(type);
        this[kCode] = options.code === void 0 ? 0 : options.code;
        this[kReason] = options.reason === void 0 ? "" : options.reason;
        this[kWasClean] = options.wasClean === void 0 ? false : options.wasClean;
      }
      /**
       * @type {Number}
       */
      get code() {
        return this[kCode];
      }
      /**
       * @type {String}
       */
      get reason() {
        return this[kReason];
      }
      /**
       * @type {Boolean}
       */
      get wasClean() {
        return this[kWasClean];
      }
    };
    Object.defineProperty(CloseEvent.prototype, "code", { enumerable: true });
    Object.defineProperty(CloseEvent.prototype, "reason", { enumerable: true });
    Object.defineProperty(CloseEvent.prototype, "wasClean", { enumerable: true });
    var ErrorEvent = class extends Event {
      /**
       * Create a new `ErrorEvent`.
       *
       * @param {String} type The name of the event
       * @param {Object} [options] A dictionary object that allows for setting
       *     attributes via object members of the same name
       * @param {*} [options.error=null] The error that generated this event
       * @param {String} [options.message=''] The error message
       */
      constructor(type, options = {}) {
        super(type);
        this[kError] = options.error === void 0 ? null : options.error;
        this[kMessage] = options.message === void 0 ? "" : options.message;
      }
      /**
       * @type {*}
       */
      get error() {
        return this[kError];
      }
      /**
       * @type {String}
       */
      get message() {
        return this[kMessage];
      }
    };
    Object.defineProperty(ErrorEvent.prototype, "error", { enumerable: true });
    Object.defineProperty(ErrorEvent.prototype, "message", { enumerable: true });
    var MessageEvent = class extends Event {
      /**
       * Create a new `MessageEvent`.
       *
       * @param {String} type The name of the event
       * @param {Object} [options] A dictionary object that allows for setting
       *     attributes via object members of the same name
       * @param {*} [options.data=null] The message content
       */
      constructor(type, options = {}) {
        super(type);
        this[kData] = options.data === void 0 ? null : options.data;
      }
      /**
       * @type {*}
       */
      get data() {
        return this[kData];
      }
    };
    Object.defineProperty(MessageEvent.prototype, "data", { enumerable: true });
    var EventTarget = {
      /**
       * Register an event listener.
       *
       * @param {String} type A string representing the event type to listen for
       * @param {(Function|Object)} handler The listener to add
       * @param {Object} [options] An options object specifies characteristics about
       *     the event listener
       * @param {Boolean} [options.once=false] A `Boolean` indicating that the
       *     listener should be invoked at most once after being added. If `true`,
       *     the listener would be automatically removed when invoked.
       * @public
       */
      addEventListener(type, handler, options = {}) {
        for (const listener of this.listeners(type)) {
          if (!options[kForOnEventAttribute] && listener[kListener] === handler && !listener[kForOnEventAttribute]) {
            return;
          }
        }
        let wrapper;
        if (type === "message") {
          wrapper = function onMessage(data, isBinary) {
            const event = new MessageEvent("message", {
              data: isBinary ? data : data.toString()
            });
            event[kTarget] = this;
            callListener(handler, this, event);
          };
        } else if (type === "close") {
          wrapper = function onClose(code, message) {
            const event = new CloseEvent("close", {
              code,
              reason: message.toString(),
              wasClean: this._closeFrameReceived && this._closeFrameSent
            });
            event[kTarget] = this;
            callListener(handler, this, event);
          };
        } else if (type === "error") {
          wrapper = function onError(error) {
            const event = new ErrorEvent("error", {
              error,
              message: error.message
            });
            event[kTarget] = this;
            callListener(handler, this, event);
          };
        } else if (type === "open") {
          wrapper = function onOpen() {
            const event = new Event("open");
            event[kTarget] = this;
            callListener(handler, this, event);
          };
        } else {
          return;
        }
        wrapper[kForOnEventAttribute] = !!options[kForOnEventAttribute];
        wrapper[kListener] = handler;
        if (options.once) {
          this.once(type, wrapper);
        } else {
          this.on(type, wrapper);
        }
      },
      /**
       * Remove an event listener.
       *
       * @param {String} type A string representing the event type to remove
       * @param {(Function|Object)} handler The listener to remove
       * @public
       */
      removeEventListener(type, handler) {
        for (const listener of this.listeners(type)) {
          if (listener[kListener] === handler && !listener[kForOnEventAttribute]) {
            this.removeListener(type, listener);
            break;
          }
        }
      }
    };
    module2.exports = {
      CloseEvent,
      ErrorEvent,
      Event,
      EventTarget,
      MessageEvent
    };
    function callListener(listener, thisArg, event) {
      if (typeof listener === "object" && listener.handleEvent) {
        listener.handleEvent.call(listener, event);
      } else {
        listener.call(thisArg, event);
      }
    }
  }
});

// ../../ws/lib/extension.js
var require_extension = __commonJS({
  "../../ws/lib/extension.js"(exports2, module2) {
    "use strict";
    var { tokenChars } = require_validation();
    function push(dest, name, elem) {
      if (dest[name] === void 0) dest[name] = [elem];
      else dest[name].push(elem);
    }
    function parse(header) {
      const offers = /* @__PURE__ */ Object.create(null);
      let params = /* @__PURE__ */ Object.create(null);
      let mustUnescape = false;
      let isEscaping = false;
      let inQuotes = false;
      let extensionName;
      let paramName;
      let start = -1;
      let code = -1;
      let end = -1;
      let i = 0;
      for (; i < header.length; i++) {
        code = header.charCodeAt(i);
        if (extensionName === void 0) {
          if (end === -1 && tokenChars[code] === 1) {
            if (start === -1) start = i;
          } else if (i !== 0 && (code === 32 || code === 9)) {
            if (end === -1 && start !== -1) end = i;
          } else if (code === 59 || code === 44) {
            if (start === -1) {
              throw new SyntaxError(`Unexpected character at index ${i}`);
            }
            if (end === -1) end = i;
            const name = header.slice(start, end);
            if (code === 44) {
              push(offers, name, params);
              params = /* @__PURE__ */ Object.create(null);
            } else {
              extensionName = name;
            }
            start = end = -1;
          } else {
            throw new SyntaxError(`Unexpected character at index ${i}`);
          }
        } else if (paramName === void 0) {
          if (end === -1 && tokenChars[code] === 1) {
            if (start === -1) start = i;
          } else if (code === 32 || code === 9) {
            if (end === -1 && start !== -1) end = i;
          } else if (code === 59 || code === 44) {
            if (start === -1) {
              throw new SyntaxError(`Unexpected character at index ${i}`);
            }
            if (end === -1) end = i;
            push(params, header.slice(start, end), true);
            if (code === 44) {
              push(offers, extensionName, params);
              params = /* @__PURE__ */ Object.create(null);
              extensionName = void 0;
            }
            start = end = -1;
          } else if (code === 61 && start !== -1 && end === -1) {
            paramName = header.slice(start, i);
            start = end = -1;
          } else {
            throw new SyntaxError(`Unexpected character at index ${i}`);
          }
        } else {
          if (isEscaping) {
            if (tokenChars[code] !== 1) {
              throw new SyntaxError(`Unexpected character at index ${i}`);
            }
            if (start === -1) start = i;
            else if (!mustUnescape) mustUnescape = true;
            isEscaping = false;
          } else if (inQuotes) {
            if (tokenChars[code] === 1) {
              if (start === -1) start = i;
            } else if (code === 34 && start !== -1) {
              inQuotes = false;
              end = i;
            } else if (code === 92) {
              isEscaping = true;
            } else {
              throw new SyntaxError(`Unexpected character at index ${i}`);
            }
          } else if (code === 34 && header.charCodeAt(i - 1) === 61) {
            inQuotes = true;
          } else if (end === -1 && tokenChars[code] === 1) {
            if (start === -1) start = i;
          } else if (start !== -1 && (code === 32 || code === 9)) {
            if (end === -1) end = i;
          } else if (code === 59 || code === 44) {
            if (start === -1) {
              throw new SyntaxError(`Unexpected character at index ${i}`);
            }
            if (end === -1) end = i;
            let value = header.slice(start, end);
            if (mustUnescape) {
              value = value.replace(/\\/g, "");
              mustUnescape = false;
            }
            push(params, paramName, value);
            if (code === 44) {
              push(offers, extensionName, params);
              params = /* @__PURE__ */ Object.create(null);
              extensionName = void 0;
            }
            paramName = void 0;
            start = end = -1;
          } else {
            throw new SyntaxError(`Unexpected character at index ${i}`);
          }
        }
      }
      if (start === -1 || inQuotes || code === 32 || code === 9) {
        throw new SyntaxError("Unexpected end of input");
      }
      if (end === -1) end = i;
      const token = header.slice(start, end);
      if (extensionName === void 0) {
        push(offers, token, params);
      } else {
        if (paramName === void 0) {
          push(params, token, true);
        } else if (mustUnescape) {
          push(params, paramName, token.replace(/\\/g, ""));
        } else {
          push(params, paramName, token);
        }
        push(offers, extensionName, params);
      }
      return offers;
    }
    function format(extensions) {
      return Object.keys(extensions).map((extension2) => {
        let configurations = extensions[extension2];
        if (!Array.isArray(configurations)) configurations = [configurations];
        return configurations.map((params) => {
          return [extension2].concat(
            Object.keys(params).map((k) => {
              let values = params[k];
              if (!Array.isArray(values)) values = [values];
              return values.map((v) => v === true ? k : `${k}=${v}`).join("; ");
            })
          ).join("; ");
        }).join(", ");
      }).join(", ");
    }
    module2.exports = { format, parse };
  }
});

// ../../ws/lib/websocket.js
var require_websocket = __commonJS({
  "../../ws/lib/websocket.js"(exports2, module2) {
    "use strict";
    var EventEmitter = require("events");
    var https3 = require("https");
    var http2 = require("http");
    var net2 = require("net");
    var tls = require("tls");
    var { randomBytes: randomBytes2, createHash: createHash3 } = require("crypto");
    var { Duplex, Readable } = require("stream");
    var { URL: URL2 } = require("url");
    var PerMessageDeflate2 = require_permessage_deflate();
    var Receiver2 = require_receiver();
    var Sender2 = require_sender();
    var { isBlob } = require_validation();
    var {
      BINARY_TYPES,
      CLOSE_TIMEOUT,
      EMPTY_BUFFER,
      GUID,
      kForOnEventAttribute,
      kListener,
      kStatusCode,
      kWebSocket,
      NOOP
    } = require_constants();
    var {
      EventTarget: { addEventListener, removeEventListener }
    } = require_event_target();
    var { format, parse } = require_extension();
    var { toBuffer } = require_buffer_util();
    var kAborted = /* @__PURE__ */ Symbol("kAborted");
    var protocolVersions = [8, 13];
    var readyStates = ["CONNECTING", "OPEN", "CLOSING", "CLOSED"];
    var subprotocolRegex = /^[!#$%&'*+\-.0-9A-Z^_`|a-z~]+$/;
    var WebSocket2 = class _WebSocket extends EventEmitter {
      /**
       * Create a new `WebSocket`.
       *
       * @param {(String|URL)} address The URL to which to connect
       * @param {(String|String[])} [protocols] The subprotocols
       * @param {Object} [options] Connection options
       */
      constructor(address, protocols, options) {
        super();
        this._binaryType = BINARY_TYPES[0];
        this._closeCode = 1006;
        this._closeFrameReceived = false;
        this._closeFrameSent = false;
        this._closeMessage = EMPTY_BUFFER;
        this._closeTimer = null;
        this._errorEmitted = false;
        this._extensions = {};
        this._paused = false;
        this._protocol = "";
        this._readyState = _WebSocket.CONNECTING;
        this._receiver = null;
        this._sender = null;
        this._socket = null;
        if (address !== null) {
          this._bufferedAmount = 0;
          this._isServer = false;
          this._redirects = 0;
          if (protocols === void 0) {
            protocols = [];
          } else if (!Array.isArray(protocols)) {
            if (typeof protocols === "object" && protocols !== null) {
              options = protocols;
              protocols = [];
            } else {
              protocols = [protocols];
            }
          }
          initAsClient(this, address, protocols, options);
        } else {
          this._autoPong = options.autoPong;
          this._closeTimeout = options.closeTimeout;
          this._isServer = true;
        }
      }
      /**
       * For historical reasons, the custom "nodebuffer" type is used by the default
       * instead of "blob".
       *
       * @type {String}
       */
      get binaryType() {
        return this._binaryType;
      }
      set binaryType(type) {
        if (!BINARY_TYPES.includes(type)) return;
        this._binaryType = type;
        if (this._receiver) this._receiver._binaryType = type;
      }
      /**
       * @type {Number}
       */
      get bufferedAmount() {
        if (!this._socket) return this._bufferedAmount;
        return this._socket._writableState.length + this._sender._bufferedBytes;
      }
      /**
       * @type {String}
       */
      get extensions() {
        return Object.keys(this._extensions).join();
      }
      /**
       * @type {Boolean}
       */
      get isPaused() {
        return this._paused;
      }
      /**
       * @type {Function}
       */
      /* istanbul ignore next */
      get onclose() {
        return null;
      }
      /**
       * @type {Function}
       */
      /* istanbul ignore next */
      get onerror() {
        return null;
      }
      /**
       * @type {Function}
       */
      /* istanbul ignore next */
      get onopen() {
        return null;
      }
      /**
       * @type {Function}
       */
      /* istanbul ignore next */
      get onmessage() {
        return null;
      }
      /**
       * @type {String}
       */
      get protocol() {
        return this._protocol;
      }
      /**
       * @type {Number}
       */
      get readyState() {
        return this._readyState;
      }
      /**
       * @type {String}
       */
      get url() {
        return this._url;
      }
      /**
       * Set up the socket and the internal resources.
       *
       * @param {Duplex} socket The network socket between the server and client
       * @param {Buffer} head The first packet of the upgraded stream
       * @param {Object} options Options object
       * @param {Boolean} [options.allowSynchronousEvents=false] Specifies whether
       *     any of the `'message'`, `'ping'`, and `'pong'` events can be emitted
       *     multiple times in the same tick
       * @param {Function} [options.generateMask] The function used to generate the
       *     masking key
       * @param {Number} [options.maxBufferedChunks=0] The maximum number of
       *     buffered data chunks
       * @param {Number} [options.maxFragments=0] The maximum number of message
       *     fragments
       * @param {Number} [options.maxPayload=0] The maximum allowed message size
       * @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
       *     not to skip UTF-8 validation for text and close messages
       * @private
       */
      setSocket(socket, head, options) {
        const receiver = new Receiver2({
          allowSynchronousEvents: options.allowSynchronousEvents,
          binaryType: this.binaryType,
          extensions: this._extensions,
          isServer: this._isServer,
          maxBufferedChunks: options.maxBufferedChunks,
          maxFragments: options.maxFragments,
          maxPayload: options.maxPayload,
          skipUTF8Validation: options.skipUTF8Validation
        });
        const sender = new Sender2(socket, this._extensions, options.generateMask);
        this._receiver = receiver;
        this._sender = sender;
        this._socket = socket;
        receiver[kWebSocket] = this;
        sender[kWebSocket] = this;
        socket[kWebSocket] = this;
        receiver.on("conclude", receiverOnConclude);
        receiver.on("drain", receiverOnDrain);
        receiver.on("error", receiverOnError);
        receiver.on("message", receiverOnMessage);
        receiver.on("ping", receiverOnPing);
        receiver.on("pong", receiverOnPong);
        sender.onerror = senderOnError;
        if (socket.setTimeout) socket.setTimeout(0);
        if (socket.setNoDelay) socket.setNoDelay();
        if (head.length > 0) socket.unshift(head);
        socket.on("close", socketOnClose);
        socket.on("data", socketOnData);
        socket.on("end", socketOnEnd);
        socket.on("error", socketOnError);
        this._readyState = _WebSocket.OPEN;
        this.emit("open");
      }
      /**
       * Emit the `'close'` event.
       *
       * @private
       */
      emitClose() {
        if (!this._socket) {
          this._readyState = _WebSocket.CLOSED;
          this.emit("close", this._closeCode, this._closeMessage);
          return;
        }
        if (this._extensions[PerMessageDeflate2.extensionName]) {
          this._extensions[PerMessageDeflate2.extensionName].cleanup();
        }
        this._receiver.removeAllListeners();
        this._readyState = _WebSocket.CLOSED;
        this.emit("close", this._closeCode, this._closeMessage);
      }
      /**
       * Start a closing handshake.
       *
       *          +----------+   +-----------+   +----------+
       *     - - -|ws.close()|-->|close frame|-->|ws.close()|- - -
       *    |     +----------+   +-----------+   +----------+     |
       *          +----------+   +-----------+         |
       * CLOSING  |ws.close()|<--|close frame|<--+-----+       CLOSING
       *          +----------+   +-----------+   |
       *    |           |                        |   +---+        |
       *                +------------------------+-->|fin| - - - -
       *    |         +---+                      |   +---+
       *     - - - - -|fin|<---------------------+
       *              +---+
       *
       * @param {Number} [code] Status code explaining why the connection is closing
       * @param {(String|Buffer)} [data] The reason why the connection is
       *     closing
       * @public
       */
      close(code, data) {
        if (this.readyState === _WebSocket.CLOSED) return;
        if (this.readyState === _WebSocket.CONNECTING) {
          const msg = "WebSocket was closed before the connection was established";
          abortHandshake(this, this._req, msg);
          return;
        }
        if (this.readyState === _WebSocket.CLOSING) {
          if (this._closeFrameSent && (this._closeFrameReceived || this._receiver._writableState.errorEmitted)) {
            this._socket.end();
          }
          return;
        }
        this._readyState = _WebSocket.CLOSING;
        this._sender.close(code, data, !this._isServer, (err) => {
          if (err) return;
          this._closeFrameSent = true;
          if (this._closeFrameReceived || this._receiver._writableState.errorEmitted) {
            this._socket.end();
          }
        });
        setCloseTimer(this);
      }
      /**
       * Pause the socket.
       *
       * @public
       */
      pause() {
        if (this.readyState === _WebSocket.CONNECTING || this.readyState === _WebSocket.CLOSED) {
          return;
        }
        this._paused = true;
        this._socket.pause();
      }
      /**
       * Send a ping.
       *
       * @param {*} [data] The data to send
       * @param {Boolean} [mask] Indicates whether or not to mask `data`
       * @param {Function} [cb] Callback which is executed when the ping is sent
       * @public
       */
      ping(data, mask, cb) {
        if (this.readyState === _WebSocket.CONNECTING) {
          throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
        }
        if (typeof data === "function") {
          cb = data;
          data = mask = void 0;
        } else if (typeof mask === "function") {
          cb = mask;
          mask = void 0;
        }
        if (typeof data === "number") data = data.toString();
        if (this.readyState !== _WebSocket.OPEN) {
          sendAfterClose(this, data, cb);
          return;
        }
        if (mask === void 0) mask = !this._isServer;
        this._sender.ping(data || EMPTY_BUFFER, mask, cb);
      }
      /**
       * Send a pong.
       *
       * @param {*} [data] The data to send
       * @param {Boolean} [mask] Indicates whether or not to mask `data`
       * @param {Function} [cb] Callback which is executed when the pong is sent
       * @public
       */
      pong(data, mask, cb) {
        if (this.readyState === _WebSocket.CONNECTING) {
          throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
        }
        if (typeof data === "function") {
          cb = data;
          data = mask = void 0;
        } else if (typeof mask === "function") {
          cb = mask;
          mask = void 0;
        }
        if (typeof data === "number") data = data.toString();
        if (this.readyState !== _WebSocket.OPEN) {
          sendAfterClose(this, data, cb);
          return;
        }
        if (mask === void 0) mask = !this._isServer;
        this._sender.pong(data || EMPTY_BUFFER, mask, cb);
      }
      /**
       * Resume the socket.
       *
       * @public
       */
      resume() {
        if (this.readyState === _WebSocket.CONNECTING || this.readyState === _WebSocket.CLOSED) {
          return;
        }
        this._paused = false;
        if (!this._receiver._writableState.needDrain) this._socket.resume();
      }
      /**
       * Send a data message.
       *
       * @param {*} data The message to send
       * @param {Object} [options] Options object
       * @param {Boolean} [options.binary] Specifies whether `data` is binary or
       *     text
       * @param {Boolean} [options.compress] Specifies whether or not to compress
       *     `data`
       * @param {Boolean} [options.fin=true] Specifies whether the fragment is the
       *     last one
       * @param {Boolean} [options.mask] Specifies whether or not to mask `data`
       * @param {Function} [cb] Callback which is executed when data is written out
       * @public
       */
      send(data, options, cb) {
        if (this.readyState === _WebSocket.CONNECTING) {
          throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
        }
        if (typeof options === "function") {
          cb = options;
          options = {};
        }
        if (typeof data === "number") data = data.toString();
        if (this.readyState !== _WebSocket.OPEN) {
          sendAfterClose(this, data, cb);
          return;
        }
        const opts = {
          binary: typeof data !== "string",
          mask: !this._isServer,
          compress: true,
          fin: true,
          ...options
        };
        if (!this._extensions[PerMessageDeflate2.extensionName]) {
          opts.compress = false;
        }
        this._sender.send(data || EMPTY_BUFFER, opts, cb);
      }
      /**
       * Forcibly close the connection.
       *
       * @public
       */
      terminate() {
        if (this.readyState === _WebSocket.CLOSED) return;
        if (this.readyState === _WebSocket.CONNECTING) {
          const msg = "WebSocket was closed before the connection was established";
          abortHandshake(this, this._req, msg);
          return;
        }
        if (this._socket) {
          this._readyState = _WebSocket.CLOSING;
          this._socket.destroy();
        }
      }
    };
    Object.defineProperty(WebSocket2, "CONNECTING", {
      enumerable: true,
      value: readyStates.indexOf("CONNECTING")
    });
    Object.defineProperty(WebSocket2.prototype, "CONNECTING", {
      enumerable: true,
      value: readyStates.indexOf("CONNECTING")
    });
    Object.defineProperty(WebSocket2, "OPEN", {
      enumerable: true,
      value: readyStates.indexOf("OPEN")
    });
    Object.defineProperty(WebSocket2.prototype, "OPEN", {
      enumerable: true,
      value: readyStates.indexOf("OPEN")
    });
    Object.defineProperty(WebSocket2, "CLOSING", {
      enumerable: true,
      value: readyStates.indexOf("CLOSING")
    });
    Object.defineProperty(WebSocket2.prototype, "CLOSING", {
      enumerable: true,
      value: readyStates.indexOf("CLOSING")
    });
    Object.defineProperty(WebSocket2, "CLOSED", {
      enumerable: true,
      value: readyStates.indexOf("CLOSED")
    });
    Object.defineProperty(WebSocket2.prototype, "CLOSED", {
      enumerable: true,
      value: readyStates.indexOf("CLOSED")
    });
    [
      "binaryType",
      "bufferedAmount",
      "extensions",
      "isPaused",
      "protocol",
      "readyState",
      "url"
    ].forEach((property) => {
      Object.defineProperty(WebSocket2.prototype, property, { enumerable: true });
    });
    ["open", "error", "close", "message"].forEach((method) => {
      Object.defineProperty(WebSocket2.prototype, `on${method}`, {
        enumerable: true,
        get() {
          for (const listener of this.listeners(method)) {
            if (listener[kForOnEventAttribute]) return listener[kListener];
          }
          return null;
        },
        set(handler) {
          for (const listener of this.listeners(method)) {
            if (listener[kForOnEventAttribute]) {
              this.removeListener(method, listener);
              break;
            }
          }
          if (typeof handler !== "function") return;
          this.addEventListener(method, handler, {
            [kForOnEventAttribute]: true
          });
        }
      });
    });
    WebSocket2.prototype.addEventListener = addEventListener;
    WebSocket2.prototype.removeEventListener = removeEventListener;
    module2.exports = WebSocket2;
    function initAsClient(websocket, address, protocols, options) {
      const opts = {
        allowSynchronousEvents: true,
        autoPong: true,
        closeTimeout: CLOSE_TIMEOUT,
        protocolVersion: protocolVersions[1],
        maxBufferedChunks: 256 * 1024,
        maxFragments: 16 * 1024,
        maxPayload: 100 * 1024 * 1024,
        skipUTF8Validation: false,
        perMessageDeflate: true,
        followRedirects: false,
        maxRedirects: 10,
        ...options,
        socketPath: void 0,
        hostname: void 0,
        protocol: void 0,
        timeout: void 0,
        method: "GET",
        host: void 0,
        path: void 0,
        port: void 0
      };
      websocket._autoPong = opts.autoPong;
      websocket._closeTimeout = opts.closeTimeout;
      if (!protocolVersions.includes(opts.protocolVersion)) {
        throw new RangeError(
          `Unsupported protocol version: ${opts.protocolVersion} (supported versions: ${protocolVersions.join(", ")})`
        );
      }
      let parsedUrl;
      if (address instanceof URL2) {
        parsedUrl = address;
      } else {
        try {
          parsedUrl = new URL2(address);
        } catch {
          throw new SyntaxError(`Invalid URL: ${address}`);
        }
      }
      if (parsedUrl.protocol === "http:") {
        parsedUrl.protocol = "ws:";
      } else if (parsedUrl.protocol === "https:") {
        parsedUrl.protocol = "wss:";
      }
      websocket._url = parsedUrl.href;
      const isSecure = parsedUrl.protocol === "wss:";
      const isIpcUrl = parsedUrl.protocol === "ws+unix:";
      let invalidUrlMessage;
      if (parsedUrl.protocol !== "ws:" && !isSecure && !isIpcUrl) {
        invalidUrlMessage = `The URL's protocol must be one of "ws:", "wss:", "http:", "https:", or "ws+unix:"`;
      } else if (isIpcUrl && !parsedUrl.pathname) {
        invalidUrlMessage = "The URL's pathname is empty";
      } else if (parsedUrl.hash) {
        invalidUrlMessage = "The URL contains a fragment identifier";
      }
      if (invalidUrlMessage) {
        const err = new SyntaxError(invalidUrlMessage);
        if (websocket._redirects === 0) {
          throw err;
        } else {
          emitErrorAndClose(websocket, err);
          return;
        }
      }
      const defaultPort = isSecure ? 443 : 80;
      const key = randomBytes2(16).toString("base64");
      const request2 = isSecure ? https3.request : http2.request;
      const protocolSet = /* @__PURE__ */ new Set();
      let perMessageDeflate;
      opts.createConnection = opts.createConnection || (isSecure ? tlsConnect : netConnect);
      opts.defaultPort = opts.defaultPort || defaultPort;
      opts.port = parsedUrl.port || defaultPort;
      opts.host = parsedUrl.hostname.startsWith("[") ? parsedUrl.hostname.slice(1, -1) : parsedUrl.hostname;
      opts.headers = {
        ...opts.headers,
        "Sec-WebSocket-Version": opts.protocolVersion,
        "Sec-WebSocket-Key": key,
        Connection: "Upgrade",
        Upgrade: "websocket"
      };
      opts.path = parsedUrl.pathname + parsedUrl.search;
      opts.timeout = opts.handshakeTimeout;
      if (opts.perMessageDeflate) {
        perMessageDeflate = new PerMessageDeflate2({
          ...opts.perMessageDeflate,
          isServer: false,
          maxPayload: opts.maxPayload
        });
        opts.headers["Sec-WebSocket-Extensions"] = format({
          [PerMessageDeflate2.extensionName]: perMessageDeflate.offer()
        });
      }
      if (protocols.length) {
        for (const protocol of protocols) {
          if (typeof protocol !== "string" || !subprotocolRegex.test(protocol) || protocolSet.has(protocol)) {
            throw new SyntaxError(
              "An invalid or duplicated subprotocol was specified"
            );
          }
          protocolSet.add(protocol);
        }
        opts.headers["Sec-WebSocket-Protocol"] = protocols.join(",");
      }
      if (opts.origin) {
        if (opts.protocolVersion < 13) {
          opts.headers["Sec-WebSocket-Origin"] = opts.origin;
        } else {
          opts.headers.Origin = opts.origin;
        }
      }
      if (parsedUrl.username || parsedUrl.password) {
        opts.auth = `${parsedUrl.username}:${parsedUrl.password}`;
      }
      if (isIpcUrl) {
        const parts = opts.path.split(":");
        opts.socketPath = parts[0];
        opts.path = parts[1];
      }
      let req4;
      if (opts.followRedirects) {
        if (websocket._redirects === 0) {
          websocket._originalIpc = isIpcUrl;
          websocket._originalSecure = isSecure;
          websocket._originalHostOrSocketPath = isIpcUrl ? opts.socketPath : parsedUrl.host;
          const headers = options && options.headers;
          options = { ...options, headers: {} };
          if (headers) {
            for (const [key2, value] of Object.entries(headers)) {
              options.headers[key2.toLowerCase()] = value;
            }
          }
        } else if (websocket.listenerCount("redirect") === 0) {
          const isSameHost = isIpcUrl ? websocket._originalIpc ? opts.socketPath === websocket._originalHostOrSocketPath : false : websocket._originalIpc ? false : parsedUrl.host === websocket._originalHostOrSocketPath;
          if (!isSameHost || websocket._originalSecure && !isSecure) {
            delete opts.headers.authorization;
            delete opts.headers.cookie;
            if (!isSameHost) delete opts.headers.host;
            opts.auth = void 0;
          }
        }
        if (opts.auth && !options.headers.authorization) {
          options.headers.authorization = "Basic " + Buffer.from(opts.auth).toString("base64");
        }
        req4 = websocket._req = request2(opts);
        if (websocket._redirects) {
          websocket.emit("redirect", websocket.url, req4);
        }
      } else {
        req4 = websocket._req = request2(opts);
      }
      if (opts.timeout) {
        req4.on("timeout", () => {
          abortHandshake(websocket, req4, "Opening handshake has timed out");
        });
      }
      req4.on("error", (err) => {
        if (req4 === null || req4[kAborted]) return;
        req4 = websocket._req = null;
        emitErrorAndClose(websocket, err);
      });
      req4.on("response", (res) => {
        const location = res.headers.location;
        const statusCode = res.statusCode;
        if (location && opts.followRedirects && statusCode >= 300 && statusCode < 400) {
          if (++websocket._redirects > opts.maxRedirects) {
            abortHandshake(websocket, req4, "Maximum redirects exceeded");
            return;
          }
          req4.abort();
          let addr;
          try {
            addr = new URL2(location, address);
          } catch (e) {
            const err = new SyntaxError(`Invalid URL: ${location}`);
            emitErrorAndClose(websocket, err);
            return;
          }
          initAsClient(websocket, addr, protocols, options);
        } else if (!websocket.emit("unexpected-response", req4, res)) {
          abortHandshake(
            websocket,
            req4,
            `Unexpected server response: ${res.statusCode}`
          );
        }
      });
      req4.on("upgrade", (res, socket, head) => {
        websocket.emit("upgrade", res);
        if (websocket.readyState !== WebSocket2.CONNECTING) return;
        req4 = websocket._req = null;
        const upgrade = res.headers.upgrade;
        if (upgrade === void 0 || upgrade.toLowerCase() !== "websocket") {
          abortHandshake(websocket, socket, "Invalid Upgrade header");
          return;
        }
        const digest = createHash3("sha1").update(key + GUID).digest("base64");
        if (res.headers["sec-websocket-accept"] !== digest) {
          abortHandshake(websocket, socket, "Invalid Sec-WebSocket-Accept header");
          return;
        }
        const serverProt = res.headers["sec-websocket-protocol"];
        let protError;
        if (serverProt !== void 0) {
          if (!protocolSet.size) {
            protError = "Server sent a subprotocol but none was requested";
          } else if (!protocolSet.has(serverProt)) {
            protError = "Server sent an invalid subprotocol";
          }
        } else if (protocolSet.size) {
          protError = "Server sent no subprotocol";
        }
        if (protError) {
          abortHandshake(websocket, socket, protError);
          return;
        }
        if (serverProt) websocket._protocol = serverProt;
        const secWebSocketExtensions = res.headers["sec-websocket-extensions"];
        if (secWebSocketExtensions !== void 0) {
          if (!perMessageDeflate) {
            const message = "Server sent a Sec-WebSocket-Extensions header but no extension was requested";
            abortHandshake(websocket, socket, message);
            return;
          }
          let extensions;
          try {
            extensions = parse(secWebSocketExtensions);
          } catch (err) {
            const message = "Invalid Sec-WebSocket-Extensions header";
            abortHandshake(websocket, socket, message);
            return;
          }
          const extensionNames = Object.keys(extensions);
          if (extensionNames.length !== 1 || extensionNames[0] !== PerMessageDeflate2.extensionName) {
            const message = "Server indicated an extension that was not requested";
            abortHandshake(websocket, socket, message);
            return;
          }
          try {
            perMessageDeflate.accept(extensions[PerMessageDeflate2.extensionName]);
          } catch (err) {
            const message = "Invalid Sec-WebSocket-Extensions header";
            abortHandshake(websocket, socket, message);
            return;
          }
          websocket._extensions[PerMessageDeflate2.extensionName] = perMessageDeflate;
        }
        websocket.setSocket(socket, head, {
          allowSynchronousEvents: opts.allowSynchronousEvents,
          generateMask: opts.generateMask,
          maxBufferedChunks: opts.maxBufferedChunks,
          maxFragments: opts.maxFragments,
          maxPayload: opts.maxPayload,
          skipUTF8Validation: opts.skipUTF8Validation
        });
      });
      if (opts.finishRequest) {
        opts.finishRequest(req4, websocket);
      } else {
        req4.end();
      }
    }
    function emitErrorAndClose(websocket, err) {
      websocket._readyState = WebSocket2.CLOSING;
      websocket._errorEmitted = true;
      websocket.emit("error", err);
      websocket.emitClose();
    }
    function netConnect(options) {
      options.path = options.socketPath;
      return net2.connect(options);
    }
    function tlsConnect(options) {
      options.path = void 0;
      if (!options.servername && options.servername !== "") {
        options.servername = net2.isIP(options.host) ? "" : options.host;
      }
      return tls.connect(options);
    }
    function abortHandshake(websocket, stream, message) {
      websocket._readyState = WebSocket2.CLOSING;
      const err = new Error(message);
      Error.captureStackTrace(err, abortHandshake);
      if (stream.setHeader) {
        stream[kAborted] = true;
        stream.abort();
        if (stream.socket && !stream.socket.destroyed) {
          stream.socket.destroy();
        }
        process.nextTick(emitErrorAndClose, websocket, err);
      } else {
        stream.destroy(err);
        stream.once("error", websocket.emit.bind(websocket, "error"));
        stream.once("close", websocket.emitClose.bind(websocket));
      }
    }
    function sendAfterClose(websocket, data, cb) {
      if (data) {
        const length = isBlob(data) ? data.size : toBuffer(data).length;
        if (websocket._socket) websocket._sender._bufferedBytes += length;
        else websocket._bufferedAmount += length;
      }
      if (cb) {
        const err = new Error(
          `WebSocket is not open: readyState ${websocket.readyState} (${readyStates[websocket.readyState]})`
        );
        process.nextTick(cb, err);
      }
    }
    function receiverOnConclude(code, reason) {
      const websocket = this[kWebSocket];
      websocket._closeFrameReceived = true;
      websocket._closeMessage = reason;
      websocket._closeCode = code;
      if (websocket._socket[kWebSocket] === void 0) return;
      websocket._socket.removeListener("data", socketOnData);
      process.nextTick(resume, websocket._socket);
      if (code === 1005) websocket.close();
      else websocket.close(code, reason);
    }
    function receiverOnDrain() {
      const websocket = this[kWebSocket];
      if (!websocket.isPaused) websocket._socket.resume();
    }
    function receiverOnError(err) {
      const websocket = this[kWebSocket];
      if (websocket._socket[kWebSocket] !== void 0) {
        websocket._socket.removeListener("data", socketOnData);
        process.nextTick(resume, websocket._socket);
        websocket.close(err[kStatusCode]);
      }
      if (!websocket._errorEmitted) {
        websocket._errorEmitted = true;
        websocket.emit("error", err);
      }
    }
    function receiverOnFinish() {
      this[kWebSocket].emitClose();
    }
    function receiverOnMessage(data, isBinary) {
      this[kWebSocket].emit("message", data, isBinary);
    }
    function receiverOnPing(data) {
      const websocket = this[kWebSocket];
      if (websocket._autoPong) websocket.pong(data, !this._isServer, NOOP);
      websocket.emit("ping", data);
    }
    function receiverOnPong(data) {
      this[kWebSocket].emit("pong", data);
    }
    function resume(stream) {
      stream.resume();
    }
    function senderOnError(err) {
      const websocket = this[kWebSocket];
      if (websocket.readyState === WebSocket2.CLOSED) return;
      if (websocket.readyState === WebSocket2.OPEN) {
        websocket._readyState = WebSocket2.CLOSING;
        setCloseTimer(websocket);
      }
      this._socket.end();
      if (!websocket._errorEmitted) {
        websocket._errorEmitted = true;
        websocket.emit("error", err);
      }
    }
    function setCloseTimer(websocket) {
      websocket._closeTimer = setTimeout(
        websocket._socket.destroy.bind(websocket._socket),
        websocket._closeTimeout
      );
    }
    function socketOnClose() {
      const websocket = this[kWebSocket];
      this.removeListener("close", socketOnClose);
      this.removeListener("data", socketOnData);
      this.removeListener("end", socketOnEnd);
      websocket._readyState = WebSocket2.CLOSING;
      if (!this._readableState.endEmitted && !websocket._closeFrameReceived && !websocket._receiver._writableState.errorEmitted && this._readableState.length !== 0) {
        const chunk = this.read(this._readableState.length);
        websocket._receiver.write(chunk);
      }
      websocket._receiver.end();
      this[kWebSocket] = void 0;
      clearTimeout(websocket._closeTimer);
      if (websocket._receiver._writableState.finished || websocket._receiver._writableState.errorEmitted) {
        websocket.emitClose();
      } else {
        websocket._receiver.on("error", receiverOnFinish);
        websocket._receiver.on("finish", receiverOnFinish);
      }
    }
    function socketOnData(chunk) {
      if (!this[kWebSocket]._receiver.write(chunk)) {
        this.pause();
      }
    }
    function socketOnEnd() {
      const websocket = this[kWebSocket];
      websocket._readyState = WebSocket2.CLOSING;
      websocket._receiver.end();
      this.end();
    }
    function socketOnError() {
      const websocket = this[kWebSocket];
      this.removeListener("error", socketOnError);
      this.on("error", NOOP);
      if (websocket) {
        websocket._readyState = WebSocket2.CLOSING;
        this.destroy();
      }
    }
  }
});

// ../../ws/lib/stream.js
var require_stream = __commonJS({
  "../../ws/lib/stream.js"(exports2, module2) {
    "use strict";
    var WebSocket2 = require_websocket();
    var { Duplex } = require("stream");
    function emitClose(stream) {
      stream.emit("close");
    }
    function duplexOnEnd() {
      if (!this.destroyed && this._writableState.finished) {
        this.destroy();
      }
    }
    function duplexOnError(err) {
      this.removeListener("error", duplexOnError);
      this.destroy();
      if (this.listenerCount("error") === 0) {
        this.emit("error", err);
      }
    }
    function createWebSocketStream2(ws, options) {
      let terminateOnDestroy = true;
      const duplex = new Duplex({
        ...options,
        autoDestroy: false,
        emitClose: false,
        objectMode: false,
        writableObjectMode: false
      });
      ws.on("message", function message(msg, isBinary) {
        const data = !isBinary && duplex._readableState.objectMode ? msg.toString() : msg;
        if (!duplex.push(data)) ws.pause();
      });
      ws.once("error", function error(err) {
        if (duplex.destroyed) return;
        terminateOnDestroy = false;
        duplex.destroy(err);
      });
      ws.once("close", function close() {
        if (duplex.destroyed) return;
        duplex.push(null);
      });
      duplex._destroy = function(err, callback) {
        if (ws.readyState === ws.CLOSED) {
          callback(err);
          process.nextTick(emitClose, duplex);
          return;
        }
        let called = false;
        ws.once("error", function error(err2) {
          called = true;
          callback(err2);
        });
        ws.once("close", function close() {
          if (!called) callback(err);
          process.nextTick(emitClose, duplex);
        });
        if (terminateOnDestroy) ws.terminate();
      };
      duplex._final = function(callback) {
        if (ws.readyState === ws.CONNECTING) {
          ws.once("open", function open() {
            duplex._final(callback);
          });
          return;
        }
        if (ws._socket === null) return;
        if (ws._socket._writableState.finished) {
          callback();
          if (duplex._readableState.endEmitted) duplex.destroy();
        } else {
          ws._socket.once("finish", function finish() {
            callback();
          });
          ws.close();
        }
      };
      duplex._read = function() {
        if (ws.isPaused) ws.resume();
      };
      duplex._write = function(chunk, encoding, callback) {
        if (ws.readyState === ws.CONNECTING) {
          ws.once("open", function open() {
            duplex._write(chunk, encoding, callback);
          });
          return;
        }
        ws.send(chunk, callback);
      };
      duplex.on("end", duplexOnEnd);
      duplex.on("error", duplexOnError);
      return duplex;
    }
    module2.exports = createWebSocketStream2;
  }
});

// ../../ws/lib/subprotocol.js
var require_subprotocol = __commonJS({
  "../../ws/lib/subprotocol.js"(exports2, module2) {
    "use strict";
    var { tokenChars } = require_validation();
    function parse(header) {
      const protocols = /* @__PURE__ */ new Set();
      let start = -1;
      let end = -1;
      let i = 0;
      for (i; i < header.length; i++) {
        const code = header.charCodeAt(i);
        if (end === -1 && tokenChars[code] === 1) {
          if (start === -1) start = i;
        } else if (i !== 0 && (code === 32 || code === 9)) {
          if (end === -1 && start !== -1) end = i;
        } else if (code === 44) {
          if (start === -1) {
            throw new SyntaxError(`Unexpected character at index ${i}`);
          }
          if (end === -1) end = i;
          const protocol2 = header.slice(start, end);
          if (protocols.has(protocol2)) {
            throw new SyntaxError(`The "${protocol2}" subprotocol is duplicated`);
          }
          protocols.add(protocol2);
          start = end = -1;
        } else {
          throw new SyntaxError(`Unexpected character at index ${i}`);
        }
      }
      if (start === -1 || end !== -1) {
        throw new SyntaxError("Unexpected end of input");
      }
      const protocol = header.slice(start, i);
      if (protocols.has(protocol)) {
        throw new SyntaxError(`The "${protocol}" subprotocol is duplicated`);
      }
      protocols.add(protocol);
      return protocols;
    }
    module2.exports = { parse };
  }
});

// ../../ws/lib/websocket-server.js
var require_websocket_server = __commonJS({
  "../../ws/lib/websocket-server.js"(exports2, module2) {
    "use strict";
    var EventEmitter = require("events");
    var http2 = require("http");
    var { Duplex } = require("stream");
    var { createHash: createHash3 } = require("crypto");
    var extension2 = require_extension();
    var PerMessageDeflate2 = require_permessage_deflate();
    var subprotocol2 = require_subprotocol();
    var WebSocket2 = require_websocket();
    var { CLOSE_TIMEOUT, GUID, kWebSocket } = require_constants();
    var keyRegex = /^[+/0-9A-Za-z]{22}==$/;
    var RUNNING = 0;
    var CLOSING = 1;
    var CLOSED = 2;
    var WebSocketServer2 = class extends EventEmitter {
      /**
       * Create a `WebSocketServer` instance.
       *
       * @param {Object} options Configuration options
       * @param {Boolean} [options.allowSynchronousEvents=true] Specifies whether
       *     any of the `'message'`, `'ping'`, and `'pong'` events can be emitted
       *     multiple times in the same tick
       * @param {Boolean} [options.autoPong=true] Specifies whether or not to
       *     automatically send a pong in response to a ping
       * @param {Number} [options.backlog=511] The maximum length of the queue of
       *     pending connections
       * @param {Boolean} [options.clientTracking=true] Specifies whether or not to
       *     track clients
       * @param {Number} [options.closeTimeout=30000] Duration in milliseconds to
       *     wait for the closing handshake to finish after `websocket.close()` is
       *     called
       * @param {Function} [options.handleProtocols] A hook to handle protocols
       * @param {String} [options.host] The hostname where to bind the server
       * @param {Number} [options.maxBufferedChunks=262144] The maximum number of
       *     buffered data chunks
       * @param {Number} [options.maxFragments=16384] The maximum number of message
       *     fragments
       * @param {Number} [options.maxPayload=104857600] The maximum allowed message
       *     size
       * @param {Boolean} [options.noServer=false] Enable no server mode
       * @param {String} [options.path] Accept only connections matching this path
       * @param {(Boolean|Object)} [options.perMessageDeflate=false] Enable/disable
       *     permessage-deflate
       * @param {Number} [options.port] The port where to bind the server
       * @param {(http.Server|https.Server)} [options.server] A pre-created HTTP/S
       *     server to use
       * @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
       *     not to skip UTF-8 validation for text and close messages
       * @param {Function} [options.verifyClient] A hook to reject connections
       * @param {Function} [options.WebSocket=WebSocket] Specifies the `WebSocket`
       *     class to use. It must be the `WebSocket` class or class that extends it
       * @param {Function} [callback] A listener for the `listening` event
       */
      constructor(options, callback) {
        super();
        options = {
          allowSynchronousEvents: true,
          autoPong: true,
          maxBufferedChunks: 256 * 1024,
          maxFragments: 16 * 1024,
          maxPayload: 100 * 1024 * 1024,
          skipUTF8Validation: false,
          perMessageDeflate: false,
          handleProtocols: null,
          clientTracking: true,
          closeTimeout: CLOSE_TIMEOUT,
          verifyClient: null,
          noServer: false,
          backlog: null,
          // use default (511 as implemented in net.js)
          server: null,
          host: null,
          path: null,
          port: null,
          WebSocket: WebSocket2,
          ...options
        };
        if (options.port == null && !options.server && !options.noServer || options.port != null && (options.server || options.noServer) || options.server && options.noServer) {
          throw new TypeError(
            'One and only one of the "port", "server", or "noServer" options must be specified'
          );
        }
        if (options.port != null) {
          this._server = http2.createServer((req4, res) => {
            const body = http2.STATUS_CODES[426];
            res.writeHead(426, {
              "Content-Length": body.length,
              "Content-Type": "text/plain"
            });
            res.end(body);
          });
          this._server.listen(
            options.port,
            options.host,
            options.backlog,
            callback
          );
        } else if (options.server) {
          this._server = options.server;
        }
        if (this._server) {
          const emitConnection = this.emit.bind(this, "connection");
          this._removeListeners = addListeners(this._server, {
            listening: this.emit.bind(this, "listening"),
            error: this.emit.bind(this, "error"),
            upgrade: (req4, socket, head) => {
              this.handleUpgrade(req4, socket, head, emitConnection);
            }
          });
        }
        if (options.perMessageDeflate === true) options.perMessageDeflate = {};
        if (options.clientTracking) {
          this.clients = /* @__PURE__ */ new Set();
          this._shouldEmitClose = false;
        }
        this.options = options;
        this._state = RUNNING;
      }
      /**
       * Returns the bound address, the address family name, and port of the server
       * as reported by the operating system if listening on an IP socket.
       * If the server is listening on a pipe or UNIX domain socket, the name is
       * returned as a string.
       *
       * @return {(Object|String|null)} The address of the server
       * @public
       */
      address() {
        if (this.options.noServer) {
          throw new Error('The server is operating in "noServer" mode');
        }
        if (!this._server) return null;
        return this._server.address();
      }
      /**
       * Stop the server from accepting new connections and emit the `'close'` event
       * when all existing connections are closed.
       *
       * @param {Function} [cb] A one-time listener for the `'close'` event
       * @public
       */
      close(cb) {
        if (this._state === CLOSED) {
          if (cb) {
            this.once("close", () => {
              cb(new Error("The server is not running"));
            });
          }
          process.nextTick(emitClose, this);
          return;
        }
        if (cb) this.once("close", cb);
        if (this._state === CLOSING) return;
        this._state = CLOSING;
        if (this.options.noServer || this.options.server) {
          if (this._server) {
            this._removeListeners();
            this._removeListeners = this._server = null;
          }
          if (this.clients) {
            if (!this.clients.size) {
              process.nextTick(emitClose, this);
            } else {
              this._shouldEmitClose = true;
            }
          } else {
            process.nextTick(emitClose, this);
          }
        } else {
          const server = this._server;
          this._removeListeners();
          this._removeListeners = this._server = null;
          server.close(() => {
            emitClose(this);
          });
        }
      }
      /**
       * See if a given request should be handled by this server instance.
       *
       * @param {http.IncomingMessage} req Request object to inspect
       * @return {Boolean} `true` if the request is valid, else `false`
       * @public
       */
      shouldHandle(req4) {
        if (this.options.path) {
          const index = req4.url.indexOf("?");
          const pathname = index !== -1 ? req4.url.slice(0, index) : req4.url;
          if (pathname !== this.options.path) return false;
        }
        return true;
      }
      /**
       * Handle a HTTP Upgrade request.
       *
       * @param {http.IncomingMessage} req The request object
       * @param {Duplex} socket The network socket between the server and client
       * @param {Buffer} head The first packet of the upgraded stream
       * @param {Function} cb Callback
       * @public
       */
      handleUpgrade(req4, socket, head, cb) {
        socket.on("error", socketOnError);
        const key = req4.headers["sec-websocket-key"];
        const upgrade = req4.headers.upgrade;
        const version = +req4.headers["sec-websocket-version"];
        if (req4.method !== "GET") {
          const message = "Invalid HTTP method";
          abortHandshakeOrEmitwsClientError(this, req4, socket, 405, message);
          return;
        }
        if (upgrade === void 0 || upgrade.toLowerCase() !== "websocket") {
          const message = "Invalid Upgrade header";
          abortHandshakeOrEmitwsClientError(this, req4, socket, 400, message);
          return;
        }
        if (key === void 0 || !keyRegex.test(key)) {
          const message = "Missing or invalid Sec-WebSocket-Key header";
          abortHandshakeOrEmitwsClientError(this, req4, socket, 400, message);
          return;
        }
        if (version !== 13 && version !== 8) {
          const message = "Missing or invalid Sec-WebSocket-Version header";
          abortHandshakeOrEmitwsClientError(this, req4, socket, 400, message, {
            "Sec-WebSocket-Version": "13, 8"
          });
          return;
        }
        if (!this.shouldHandle(req4)) {
          abortHandshake(socket, 400);
          return;
        }
        const secWebSocketProtocol = req4.headers["sec-websocket-protocol"];
        let protocols = /* @__PURE__ */ new Set();
        if (secWebSocketProtocol !== void 0) {
          try {
            protocols = subprotocol2.parse(secWebSocketProtocol);
          } catch (err) {
            const message = "Invalid Sec-WebSocket-Protocol header";
            abortHandshakeOrEmitwsClientError(this, req4, socket, 400, message);
            return;
          }
        }
        const secWebSocketExtensions = req4.headers["sec-websocket-extensions"];
        const extensions = {};
        if (this.options.perMessageDeflate && secWebSocketExtensions !== void 0) {
          const perMessageDeflate = new PerMessageDeflate2({
            ...this.options.perMessageDeflate,
            isServer: true,
            maxPayload: this.options.maxPayload
          });
          try {
            const offers = extension2.parse(secWebSocketExtensions);
            if (offers[PerMessageDeflate2.extensionName]) {
              perMessageDeflate.accept(offers[PerMessageDeflate2.extensionName]);
              extensions[PerMessageDeflate2.extensionName] = perMessageDeflate;
            }
          } catch (err) {
            const message = "Invalid or unacceptable Sec-WebSocket-Extensions header";
            abortHandshakeOrEmitwsClientError(this, req4, socket, 400, message);
            return;
          }
        }
        if (this.options.verifyClient) {
          const info = {
            origin: req4.headers[`${version === 8 ? "sec-websocket-origin" : "origin"}`],
            secure: !!(req4.socket.authorized || req4.socket.encrypted),
            req: req4
          };
          if (this.options.verifyClient.length === 2) {
            this.options.verifyClient(info, (verified, code, message, headers) => {
              if (!verified) {
                return abortHandshake(socket, code || 401, message, headers);
              }
              this.completeUpgrade(
                extensions,
                key,
                protocols,
                req4,
                socket,
                head,
                cb
              );
            });
            return;
          }
          if (!this.options.verifyClient(info)) return abortHandshake(socket, 401);
        }
        this.completeUpgrade(extensions, key, protocols, req4, socket, head, cb);
      }
      /**
       * Upgrade the connection to WebSocket.
       *
       * @param {Object} extensions The accepted extensions
       * @param {String} key The value of the `Sec-WebSocket-Key` header
       * @param {Set} protocols The subprotocols
       * @param {http.IncomingMessage} req The request object
       * @param {Duplex} socket The network socket between the server and client
       * @param {Buffer} head The first packet of the upgraded stream
       * @param {Function} cb Callback
       * @throws {Error} If called more than once with the same socket
       * @private
       */
      completeUpgrade(extensions, key, protocols, req4, socket, head, cb) {
        if (!socket.readable || !socket.writable) return socket.destroy();
        if (socket[kWebSocket]) {
          throw new Error(
            "server.handleUpgrade() was called more than once with the same socket, possibly due to a misconfiguration"
          );
        }
        if (this._state > RUNNING) return abortHandshake(socket, 503);
        const digest = createHash3("sha1").update(key + GUID).digest("base64");
        const headers = [
          "HTTP/1.1 101 Switching Protocols",
          "Upgrade: websocket",
          "Connection: Upgrade",
          `Sec-WebSocket-Accept: ${digest}`
        ];
        const ws = new this.options.WebSocket(null, void 0, this.options);
        if (protocols.size) {
          const protocol = this.options.handleProtocols ? this.options.handleProtocols(protocols, req4) : protocols.values().next().value;
          if (protocol) {
            headers.push(`Sec-WebSocket-Protocol: ${protocol}`);
            ws._protocol = protocol;
          }
        }
        if (extensions[PerMessageDeflate2.extensionName]) {
          const params = extensions[PerMessageDeflate2.extensionName].params;
          const value = extension2.format({
            [PerMessageDeflate2.extensionName]: [params]
          });
          headers.push(`Sec-WebSocket-Extensions: ${value}`);
          ws._extensions = extensions;
        }
        this.emit("headers", headers, req4);
        socket.write(headers.concat("\r\n").join("\r\n"));
        socket.removeListener("error", socketOnError);
        ws.setSocket(socket, head, {
          allowSynchronousEvents: this.options.allowSynchronousEvents,
          maxBufferedChunks: this.options.maxBufferedChunks,
          maxFragments: this.options.maxFragments,
          maxPayload: this.options.maxPayload,
          skipUTF8Validation: this.options.skipUTF8Validation
        });
        if (this.clients) {
          this.clients.add(ws);
          ws.on("close", () => {
            this.clients.delete(ws);
            if (this._shouldEmitClose && !this.clients.size) {
              process.nextTick(emitClose, this);
            }
          });
        }
        cb(ws, req4);
      }
    };
    module2.exports = WebSocketServer2;
    function addListeners(server, map) {
      for (const event of Object.keys(map)) server.on(event, map[event]);
      return function removeListeners() {
        for (const event of Object.keys(map)) {
          server.removeListener(event, map[event]);
        }
      };
    }
    function emitClose(server) {
      server._state = CLOSED;
      server.emit("close");
    }
    function socketOnError() {
      this.destroy();
    }
    function abortHandshake(socket, code, message, headers) {
      message = message || http2.STATUS_CODES[code];
      headers = {
        Connection: "close",
        "Content-Type": "text/html",
        "Content-Length": Buffer.byteLength(message),
        ...headers
      };
      socket.once("finish", socket.destroy);
      socket.end(
        `HTTP/1.1 ${code} ${http2.STATUS_CODES[code]}\r
` + Object.keys(headers).map((h2) => `${h2}: ${headers[h2]}`).join("\r\n") + "\r\n\r\n" + message
      );
    }
    function abortHandshakeOrEmitwsClientError(server, req4, socket, code, message, headers) {
      if (server.listenerCount("wsClientError")) {
        const err = new Error(message);
        Error.captureStackTrace(err, abortHandshakeOrEmitwsClientError);
        server.emit("wsClientError", err, socket, req4);
      } else {
        abortHandshake(socket, code, message, headers);
      }
    }
  }
});

// src/adapter/resolve.ts
var resolve_exports = {};
__export(resolve_exports, {
  _resetAdaptersCache: () => _resetAdaptersCache,
  getAdapters: () => getAdapters,
  persistAuthConfig: () => persistAuthConfig,
  resolveRuntimeAdapters: () => resolveRuntimeAdapters
});
function probeFunction(rt, paths) {
  for (const path22 of paths) {
    let target = rt;
    let parent = rt;
    for (let i = 0; i < path22.length; i++) {
      parent = target;
      target = target?.[path22[i]];
      if (target === void 0 || target === null) break;
    }
    if (typeof target === "function") {
      return target.bind(parent);
    }
  }
  return null;
}
function resolveRuntimeAdapters(rt, log4) {
  const version = rt.version ?? "unknown";
  const inboundRun = probeFunction(rt, [
    ["channel", "inbound", "run"],
    // current (2026-05+)
    ["channel", "turn", "run"]
    // legacy (removed 2026-05-27)
  ]);
  const dispatchReply = probeFunction(rt, [
    ["channel", "reply", "dispatchReplyWithBufferedBlockDispatcher"]
  ]);
  const resolveAgentRoute = probeFunction(rt, [
    ["channel", "routing", "resolveAgentRoute"]
  ]);
  const rawBuildContext = probeFunction(rt, [
    ["channel", "inbound", "buildContext"]
  ]);
  const rawFinalizeContext = !rawBuildContext ? probeFunction(rt, [["channel", "reply", "finalizeInboundContext"]]) : null;
  const buildInboundContext = rawBuildContext ? (params) => rawBuildContext(params) : rawFinalizeContext ? (params) => {
    const isCommand = params.access?.commands?.authorized ?? false;
    const rawCtx = {
      Body: params.message.body,
      BodyForAgent: params.message.bodyForAgent,
      RawBody: params.message.rawBody,
      CommandBody: params.message.commandBody ?? params.message.rawBody,
      CommandSource: isCommand ? "text" : void 0,
      CommandTurn: params.command ?? void 0,
      CommandAuthorized: isCommand,
      From: params.from,
      To: params.reply.to,
      SessionKey: params.route.routeSessionKey,
      AccountId: params.route.accountId ?? params.accountId,
      ChatType: params.conversation.kind,
      GroupSystemPrompt: params.conversation.label,
      SenderId: params.sender.id,
      SenderName: params.sender.name,
      Provider: params.provider ?? params.channel,
      Surface: params.surface ?? params.channel,
      MessageSid: params.messageId,
      Timestamp: params.timestamp ?? Date.now(),
      OriginatingChannel: params.channel,
      OriginatingTo: params.reply.originatingTo ?? params.reply.to,
      ...params.extra
    };
    return rawFinalizeContext(rawCtx);
  } : null;
  const resolveStorePath = probeFunction(rt, [
    ["channel", "session", "resolveStorePath"]
  ]);
  const recordInboundSession = probeFunction(rt, [
    ["channel", "session", "recordInboundSession"]
  ]);
  const formatEnvelope = probeFunction(rt, [
    ["channel", "reply", "formatAgentEnvelope"],
    // current (2026-06+)
    ["channel", "reply", "formatInboundEnvelope"]
    // deprecated，低版本兼容
  ]);
  const resolveEnvelopeFormatOptions = probeFunction(rt, [
    ["channel", "reply", "resolveEnvelopeFormatOptions"]
  ]);
  const chunkMarkdownText = probeFunction(rt, [
    ["channel", "text", "chunkMarkdownText"]
  ]);
  const saveRemoteMedia = probeFunction(rt, [
    ["channel", "media", "saveRemoteMedia"]
  ]);
  const getConfig = probeFunction(rt, [
    ["config", "current"]
  ]) ?? probeFunction(rt, [
    ["getConfig"]
  ]) ?? probeFunction(rt, [
    ["config", "loadConfig"]
  ]);
  const rawMutateConfig = probeFunction(rt, [["config", "mutateConfigFile"]]);
  const rawWriteConfig = probeFunction(rt, [["config", "writeConfigFile"]]);
  const persistConfig = rawMutateConfig ? async (mutator) => {
    await rawMutateConfig({
      afterWrite: "hot-reload",
      mutate: mutator
    });
  } : rawWriteConfig && getConfig ? async (mutator) => {
    const current = JSON.parse(JSON.stringify(getConfig()));
    mutator(current);
    await rawWriteConfig(current);
  } : null;
  const resolved = [
    inboundRun && "inboundRun",
    dispatchReply && "dispatchReply",
    resolveAgentRoute && "resolveAgentRoute",
    buildInboundContext && "buildInboundContext",
    resolveStorePath && "resolveStorePath",
    recordInboundSession && "recordInboundSession",
    formatEnvelope && "formatEnvelope",
    chunkMarkdownText && "chunkMarkdownText",
    saveRemoteMedia && "saveRemoteMedia",
    getConfig && "getConfig",
    persistConfig && `persistConfig(${rawMutateConfig ? "mutate" : "write"})`
  ].filter(Boolean);
  log4?.info(
    `[qqbot:adapter] openclaw=${version} resolved ${resolved.length} adapters: ${resolved.join(", ")}`
  );
  return {
    inboundRun,
    dispatchReply,
    resolveAgentRoute,
    buildInboundContext,
    resolveStorePath,
    recordInboundSession,
    formatEnvelope,
    resolveEnvelopeFormatOptions,
    chunkMarkdownText,
    saveRemoteMedia,
    getConfig,
    persistConfig,
    version
  };
}
function getAdapters(rt, log4) {
  const cached = _cachedRuntimeRef?.deref();
  if (cached === rt && _cachedAdapters) {
    return _cachedAdapters;
  }
  _cachedAdapters = resolveRuntimeAdapters(rt, log4);
  _cachedRuntimeRef = new WeakRef(rt);
  return _cachedAdapters;
}
async function persistAuthConfig(runtime2, cfg, afterWrite = "restart") {
  const config = runtime2.config;
  if (typeof config?.mutateConfigFile === "function") {
    await config.mutateConfigFile({
      mutate: () => cfg,
      afterWrite
    });
    return;
  }
  if (typeof config?.writeConfigFile === "function") {
    await config.writeConfigFile(cfg);
    return;
  }
  if (typeof runtime2.writeConfigFile === "function") {
    await runtime2.writeConfigFile(cfg);
    return;
  }
  const { homedir: homedir5 } = await import("os");
  const { join: join8 } = await import("path");
  const { writeFileSync: writeFileSync5 } = await import("fs");
  writeFileSync5(join8(homedir5(), ".openclaw", "openclaw.json"), JSON.stringify(cfg, null, 2) + "\n", "utf-8");
}
function _resetAdaptersCache() {
  _cachedAdapters = null;
  _cachedRuntimeRef = null;
}
var _cachedAdapters, _cachedRuntimeRef;
var init_resolve = __esm({
  "src/adapter/resolve.ts"() {
    "use strict";
    _cachedAdapters = null;
    _cachedRuntimeRef = null;
  }
});

// src/adapter/setup.ts
function loadSetup() {
  if (_setup !== void 0) return _setup;
  try {
    _setup = req2("openclaw/plugin-sdk/setup");
  } catch {
    _setup = null;
  }
  return _setup;
}
function loadTools() {
  if (_tools !== void 0) return _tools;
  try {
    _tools = req2("openclaw/plugin-sdk/setup-tools");
  } catch {
    _tools = null;
  }
  return _tools;
}
function createStandardChannelSetupStatus(...args) {
  const mod = loadSetup();
  if (mod) return mod.createStandardChannelSetupStatus(...args);
  return {
    channelLabel: args[0]?.channelLabel ?? "QQ Bot",
    configuredLabel: "Configured",
    unconfiguredLabel: "Not configured",
    resolveConfigured: () => false
  };
}
function setSetupChannelEnabled(...args) {
  loadSetup()?.setSetupChannelEnabled?.(...args);
}
function formatDocsLink(...args) {
  const mod = loadTools();
  if (mod) return mod.formatDocsLink(...args);
  return args[1] ? `${args[1]}: ${args[0]}` : args[0];
}
var import_node_module2, req2, _setup, _tools, DEFAULT_ACCOUNT_ID2;
var init_setup = __esm({
  "src/adapter/setup.ts"() {
    "use strict";
    import_node_module2 = require("module");
    req2 = (0, import_node_module2.createRequire)(__filename);
    DEFAULT_ACCOUNT_ID2 = "default";
  }
});

// ../../qrcode-terminal/vendor/QRCode/QRMode.js
var require_QRMode = __commonJS({
  "../../qrcode-terminal/vendor/QRCode/QRMode.js"(exports2, module2) {
    "use strict";
    module2.exports = {
      MODE_NUMBER: 1 << 0,
      MODE_ALPHA_NUM: 1 << 1,
      MODE_8BIT_BYTE: 1 << 2,
      MODE_KANJI: 1 << 3
    };
  }
});

// ../../qrcode-terminal/vendor/QRCode/QR8bitByte.js
var require_QR8bitByte = __commonJS({
  "../../qrcode-terminal/vendor/QRCode/QR8bitByte.js"(exports2, module2) {
    "use strict";
    var QRMode = require_QRMode();
    function QR8bitByte(data) {
      this.mode = QRMode.MODE_8BIT_BYTE;
      this.data = data;
    }
    QR8bitByte.prototype = {
      getLength: function() {
        return this.data.length;
      },
      write: function(buffer) {
        for (var i = 0; i < this.data.length; i++) {
          buffer.put(this.data.charCodeAt(i), 8);
        }
      }
    };
    module2.exports = QR8bitByte;
  }
});

// ../../qrcode-terminal/vendor/QRCode/QRMath.js
var require_QRMath = __commonJS({
  "../../qrcode-terminal/vendor/QRCode/QRMath.js"(exports2, module2) {
    "use strict";
    var QRMath = {
      glog: function(n) {
        if (n < 1) {
          throw new Error("glog(" + n + ")");
        }
        return QRMath.LOG_TABLE[n];
      },
      gexp: function(n) {
        while (n < 0) {
          n += 255;
        }
        while (n >= 256) {
          n -= 255;
        }
        return QRMath.EXP_TABLE[n];
      },
      EXP_TABLE: new Array(256),
      LOG_TABLE: new Array(256)
    };
    for (i = 0; i < 8; i++) {
      QRMath.EXP_TABLE[i] = 1 << i;
    }
    var i;
    for (i = 8; i < 256; i++) {
      QRMath.EXP_TABLE[i] = QRMath.EXP_TABLE[i - 4] ^ QRMath.EXP_TABLE[i - 5] ^ QRMath.EXP_TABLE[i - 6] ^ QRMath.EXP_TABLE[i - 8];
    }
    var i;
    for (i = 0; i < 255; i++) {
      QRMath.LOG_TABLE[QRMath.EXP_TABLE[i]] = i;
    }
    var i;
    module2.exports = QRMath;
  }
});

// ../../qrcode-terminal/vendor/QRCode/QRPolynomial.js
var require_QRPolynomial = __commonJS({
  "../../qrcode-terminal/vendor/QRCode/QRPolynomial.js"(exports2, module2) {
    "use strict";
    var QRMath = require_QRMath();
    function QRPolynomial(num, shift) {
      if (num.length === void 0) {
        throw new Error(num.length + "/" + shift);
      }
      var offset = 0;
      while (offset < num.length && num[offset] === 0) {
        offset++;
      }
      this.num = new Array(num.length - offset + shift);
      for (var i = 0; i < num.length - offset; i++) {
        this.num[i] = num[i + offset];
      }
    }
    QRPolynomial.prototype = {
      get: function(index) {
        return this.num[index];
      },
      getLength: function() {
        return this.num.length;
      },
      multiply: function(e) {
        var num = new Array(this.getLength() + e.getLength() - 1);
        for (var i = 0; i < this.getLength(); i++) {
          for (var j = 0; j < e.getLength(); j++) {
            num[i + j] ^= QRMath.gexp(QRMath.glog(this.get(i)) + QRMath.glog(e.get(j)));
          }
        }
        return new QRPolynomial(num, 0);
      },
      mod: function(e) {
        if (this.getLength() - e.getLength() < 0) {
          return this;
        }
        var ratio = QRMath.glog(this.get(0)) - QRMath.glog(e.get(0));
        var num = new Array(this.getLength());
        for (var i = 0; i < this.getLength(); i++) {
          num[i] = this.get(i);
        }
        for (var x = 0; x < e.getLength(); x++) {
          num[x] ^= QRMath.gexp(QRMath.glog(e.get(x)) + ratio);
        }
        return new QRPolynomial(num, 0).mod(e);
      }
    };
    module2.exports = QRPolynomial;
  }
});

// ../../qrcode-terminal/vendor/QRCode/QRMaskPattern.js
var require_QRMaskPattern = __commonJS({
  "../../qrcode-terminal/vendor/QRCode/QRMaskPattern.js"(exports2, module2) {
    "use strict";
    module2.exports = {
      PATTERN000: 0,
      PATTERN001: 1,
      PATTERN010: 2,
      PATTERN011: 3,
      PATTERN100: 4,
      PATTERN101: 5,
      PATTERN110: 6,
      PATTERN111: 7
    };
  }
});

// ../../qrcode-terminal/vendor/QRCode/QRUtil.js
var require_QRUtil = __commonJS({
  "../../qrcode-terminal/vendor/QRCode/QRUtil.js"(exports2, module2) {
    "use strict";
    var QRMode = require_QRMode();
    var QRPolynomial = require_QRPolynomial();
    var QRMath = require_QRMath();
    var QRMaskPattern = require_QRMaskPattern();
    var QRUtil = {
      PATTERN_POSITION_TABLE: [
        [],
        [6, 18],
        [6, 22],
        [6, 26],
        [6, 30],
        [6, 34],
        [6, 22, 38],
        [6, 24, 42],
        [6, 26, 46],
        [6, 28, 50],
        [6, 30, 54],
        [6, 32, 58],
        [6, 34, 62],
        [6, 26, 46, 66],
        [6, 26, 48, 70],
        [6, 26, 50, 74],
        [6, 30, 54, 78],
        [6, 30, 56, 82],
        [6, 30, 58, 86],
        [6, 34, 62, 90],
        [6, 28, 50, 72, 94],
        [6, 26, 50, 74, 98],
        [6, 30, 54, 78, 102],
        [6, 28, 54, 80, 106],
        [6, 32, 58, 84, 110],
        [6, 30, 58, 86, 114],
        [6, 34, 62, 90, 118],
        [6, 26, 50, 74, 98, 122],
        [6, 30, 54, 78, 102, 126],
        [6, 26, 52, 78, 104, 130],
        [6, 30, 56, 82, 108, 134],
        [6, 34, 60, 86, 112, 138],
        [6, 30, 58, 86, 114, 142],
        [6, 34, 62, 90, 118, 146],
        [6, 30, 54, 78, 102, 126, 150],
        [6, 24, 50, 76, 102, 128, 154],
        [6, 28, 54, 80, 106, 132, 158],
        [6, 32, 58, 84, 110, 136, 162],
        [6, 26, 54, 82, 110, 138, 166],
        [6, 30, 58, 86, 114, 142, 170]
      ],
      G15: 1 << 10 | 1 << 8 | 1 << 5 | 1 << 4 | 1 << 2 | 1 << 1 | 1 << 0,
      G18: 1 << 12 | 1 << 11 | 1 << 10 | 1 << 9 | 1 << 8 | 1 << 5 | 1 << 2 | 1 << 0,
      G15_MASK: 1 << 14 | 1 << 12 | 1 << 10 | 1 << 4 | 1 << 1,
      getBCHTypeInfo: function(data) {
        var d3 = data << 10;
        while (QRUtil.getBCHDigit(d3) - QRUtil.getBCHDigit(QRUtil.G15) >= 0) {
          d3 ^= QRUtil.G15 << QRUtil.getBCHDigit(d3) - QRUtil.getBCHDigit(QRUtil.G15);
        }
        return (data << 10 | d3) ^ QRUtil.G15_MASK;
      },
      getBCHTypeNumber: function(data) {
        var d3 = data << 12;
        while (QRUtil.getBCHDigit(d3) - QRUtil.getBCHDigit(QRUtil.G18) >= 0) {
          d3 ^= QRUtil.G18 << QRUtil.getBCHDigit(d3) - QRUtil.getBCHDigit(QRUtil.G18);
        }
        return data << 12 | d3;
      },
      getBCHDigit: function(data) {
        var digit = 0;
        while (data !== 0) {
          digit++;
          data >>>= 1;
        }
        return digit;
      },
      getPatternPosition: function(typeNumber) {
        return QRUtil.PATTERN_POSITION_TABLE[typeNumber - 1];
      },
      getMask: function(maskPattern, i, j) {
        switch (maskPattern) {
          case QRMaskPattern.PATTERN000:
            return (i + j) % 2 === 0;
          case QRMaskPattern.PATTERN001:
            return i % 2 === 0;
          case QRMaskPattern.PATTERN010:
            return j % 3 === 0;
          case QRMaskPattern.PATTERN011:
            return (i + j) % 3 === 0;
          case QRMaskPattern.PATTERN100:
            return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 === 0;
          case QRMaskPattern.PATTERN101:
            return i * j % 2 + i * j % 3 === 0;
          case QRMaskPattern.PATTERN110:
            return (i * j % 2 + i * j % 3) % 2 === 0;
          case QRMaskPattern.PATTERN111:
            return (i * j % 3 + (i + j) % 2) % 2 === 0;
          default:
            throw new Error("bad maskPattern:" + maskPattern);
        }
      },
      getErrorCorrectPolynomial: function(errorCorrectLength) {
        var a = new QRPolynomial([1], 0);
        for (var i = 0; i < errorCorrectLength; i++) {
          a = a.multiply(new QRPolynomial([1, QRMath.gexp(i)], 0));
        }
        return a;
      },
      getLengthInBits: function(mode, type) {
        if (1 <= type && type < 10) {
          switch (mode) {
            case QRMode.MODE_NUMBER:
              return 10;
            case QRMode.MODE_ALPHA_NUM:
              return 9;
            case QRMode.MODE_8BIT_BYTE:
              return 8;
            case QRMode.MODE_KANJI:
              return 8;
            default:
              throw new Error("mode:" + mode);
          }
        } else if (type < 27) {
          switch (mode) {
            case QRMode.MODE_NUMBER:
              return 12;
            case QRMode.MODE_ALPHA_NUM:
              return 11;
            case QRMode.MODE_8BIT_BYTE:
              return 16;
            case QRMode.MODE_KANJI:
              return 10;
            default:
              throw new Error("mode:" + mode);
          }
        } else if (type < 41) {
          switch (mode) {
            case QRMode.MODE_NUMBER:
              return 14;
            case QRMode.MODE_ALPHA_NUM:
              return 13;
            case QRMode.MODE_8BIT_BYTE:
              return 16;
            case QRMode.MODE_KANJI:
              return 12;
            default:
              throw new Error("mode:" + mode);
          }
        } else {
          throw new Error("type:" + type);
        }
      },
      getLostPoint: function(qrCode) {
        var moduleCount = qrCode.getModuleCount();
        var lostPoint = 0;
        var row = 0;
        var col = 0;
        for (row = 0; row < moduleCount; row++) {
          for (col = 0; col < moduleCount; col++) {
            var sameCount = 0;
            var dark = qrCode.isDark(row, col);
            for (var r = -1; r <= 1; r++) {
              if (row + r < 0 || moduleCount <= row + r) {
                continue;
              }
              for (var c = -1; c <= 1; c++) {
                if (col + c < 0 || moduleCount <= col + c) {
                  continue;
                }
                if (r === 0 && c === 0) {
                  continue;
                }
                if (dark === qrCode.isDark(row + r, col + c)) {
                  sameCount++;
                }
              }
            }
            if (sameCount > 5) {
              lostPoint += 3 + sameCount - 5;
            }
          }
        }
        for (row = 0; row < moduleCount - 1; row++) {
          for (col = 0; col < moduleCount - 1; col++) {
            var count = 0;
            if (qrCode.isDark(row, col)) count++;
            if (qrCode.isDark(row + 1, col)) count++;
            if (qrCode.isDark(row, col + 1)) count++;
            if (qrCode.isDark(row + 1, col + 1)) count++;
            if (count === 0 || count === 4) {
              lostPoint += 3;
            }
          }
        }
        for (row = 0; row < moduleCount; row++) {
          for (col = 0; col < moduleCount - 6; col++) {
            if (qrCode.isDark(row, col) && !qrCode.isDark(row, col + 1) && qrCode.isDark(row, col + 2) && qrCode.isDark(row, col + 3) && qrCode.isDark(row, col + 4) && !qrCode.isDark(row, col + 5) && qrCode.isDark(row, col + 6)) {
              lostPoint += 40;
            }
          }
        }
        for (col = 0; col < moduleCount; col++) {
          for (row = 0; row < moduleCount - 6; row++) {
            if (qrCode.isDark(row, col) && !qrCode.isDark(row + 1, col) && qrCode.isDark(row + 2, col) && qrCode.isDark(row + 3, col) && qrCode.isDark(row + 4, col) && !qrCode.isDark(row + 5, col) && qrCode.isDark(row + 6, col)) {
              lostPoint += 40;
            }
          }
        }
        var darkCount = 0;
        for (col = 0; col < moduleCount; col++) {
          for (row = 0; row < moduleCount; row++) {
            if (qrCode.isDark(row, col)) {
              darkCount++;
            }
          }
        }
        var ratio = Math.abs(100 * darkCount / moduleCount / moduleCount - 50) / 5;
        lostPoint += ratio * 10;
        return lostPoint;
      }
    };
    module2.exports = QRUtil;
  }
});

// ../../qrcode-terminal/vendor/QRCode/QRErrorCorrectLevel.js
var require_QRErrorCorrectLevel = __commonJS({
  "../../qrcode-terminal/vendor/QRCode/QRErrorCorrectLevel.js"(exports2, module2) {
    "use strict";
    module2.exports = {
      L: 1,
      M: 0,
      Q: 3,
      H: 2
    };
  }
});

// ../../qrcode-terminal/vendor/QRCode/QRRSBlock.js
var require_QRRSBlock = __commonJS({
  "../../qrcode-terminal/vendor/QRCode/QRRSBlock.js"(exports2, module2) {
    "use strict";
    var QRErrorCorrectLevel = require_QRErrorCorrectLevel();
    function QRRSBlock(totalCount, dataCount) {
      this.totalCount = totalCount;
      this.dataCount = dataCount;
    }
    QRRSBlock.RS_BLOCK_TABLE = [
      // L
      // M
      // Q
      // H
      // 1
      [1, 26, 19],
      [1, 26, 16],
      [1, 26, 13],
      [1, 26, 9],
      // 2
      [1, 44, 34],
      [1, 44, 28],
      [1, 44, 22],
      [1, 44, 16],
      // 3
      [1, 70, 55],
      [1, 70, 44],
      [2, 35, 17],
      [2, 35, 13],
      // 4		
      [1, 100, 80],
      [2, 50, 32],
      [2, 50, 24],
      [4, 25, 9],
      // 5
      [1, 134, 108],
      [2, 67, 43],
      [2, 33, 15, 2, 34, 16],
      [2, 33, 11, 2, 34, 12],
      // 6
      [2, 86, 68],
      [4, 43, 27],
      [4, 43, 19],
      [4, 43, 15],
      // 7		
      [2, 98, 78],
      [4, 49, 31],
      [2, 32, 14, 4, 33, 15],
      [4, 39, 13, 1, 40, 14],
      // 8
      [2, 121, 97],
      [2, 60, 38, 2, 61, 39],
      [4, 40, 18, 2, 41, 19],
      [4, 40, 14, 2, 41, 15],
      // 9
      [2, 146, 116],
      [3, 58, 36, 2, 59, 37],
      [4, 36, 16, 4, 37, 17],
      [4, 36, 12, 4, 37, 13],
      // 10		
      [2, 86, 68, 2, 87, 69],
      [4, 69, 43, 1, 70, 44],
      [6, 43, 19, 2, 44, 20],
      [6, 43, 15, 2, 44, 16],
      // 11
      [4, 101, 81],
      [1, 80, 50, 4, 81, 51],
      [4, 50, 22, 4, 51, 23],
      [3, 36, 12, 8, 37, 13],
      // 12
      [2, 116, 92, 2, 117, 93],
      [6, 58, 36, 2, 59, 37],
      [4, 46, 20, 6, 47, 21],
      [7, 42, 14, 4, 43, 15],
      // 13
      [4, 133, 107],
      [8, 59, 37, 1, 60, 38],
      [8, 44, 20, 4, 45, 21],
      [12, 33, 11, 4, 34, 12],
      // 14
      [3, 145, 115, 1, 146, 116],
      [4, 64, 40, 5, 65, 41],
      [11, 36, 16, 5, 37, 17],
      [11, 36, 12, 5, 37, 13],
      // 15
      [5, 109, 87, 1, 110, 88],
      [5, 65, 41, 5, 66, 42],
      [5, 54, 24, 7, 55, 25],
      [11, 36, 12],
      // 16
      [5, 122, 98, 1, 123, 99],
      [7, 73, 45, 3, 74, 46],
      [15, 43, 19, 2, 44, 20],
      [3, 45, 15, 13, 46, 16],
      // 17
      [1, 135, 107, 5, 136, 108],
      [10, 74, 46, 1, 75, 47],
      [1, 50, 22, 15, 51, 23],
      [2, 42, 14, 17, 43, 15],
      // 18
      [5, 150, 120, 1, 151, 121],
      [9, 69, 43, 4, 70, 44],
      [17, 50, 22, 1, 51, 23],
      [2, 42, 14, 19, 43, 15],
      // 19
      [3, 141, 113, 4, 142, 114],
      [3, 70, 44, 11, 71, 45],
      [17, 47, 21, 4, 48, 22],
      [9, 39, 13, 16, 40, 14],
      // 20
      [3, 135, 107, 5, 136, 108],
      [3, 67, 41, 13, 68, 42],
      [15, 54, 24, 5, 55, 25],
      [15, 43, 15, 10, 44, 16],
      // 21
      [4, 144, 116, 4, 145, 117],
      [17, 68, 42],
      [17, 50, 22, 6, 51, 23],
      [19, 46, 16, 6, 47, 17],
      // 22
      [2, 139, 111, 7, 140, 112],
      [17, 74, 46],
      [7, 54, 24, 16, 55, 25],
      [34, 37, 13],
      // 23
      [4, 151, 121, 5, 152, 122],
      [4, 75, 47, 14, 76, 48],
      [11, 54, 24, 14, 55, 25],
      [16, 45, 15, 14, 46, 16],
      // 24
      [6, 147, 117, 4, 148, 118],
      [6, 73, 45, 14, 74, 46],
      [11, 54, 24, 16, 55, 25],
      [30, 46, 16, 2, 47, 17],
      // 25
      [8, 132, 106, 4, 133, 107],
      [8, 75, 47, 13, 76, 48],
      [7, 54, 24, 22, 55, 25],
      [22, 45, 15, 13, 46, 16],
      // 26
      [10, 142, 114, 2, 143, 115],
      [19, 74, 46, 4, 75, 47],
      [28, 50, 22, 6, 51, 23],
      [33, 46, 16, 4, 47, 17],
      // 27
      [8, 152, 122, 4, 153, 123],
      [22, 73, 45, 3, 74, 46],
      [8, 53, 23, 26, 54, 24],
      [12, 45, 15, 28, 46, 16],
      // 28
      [3, 147, 117, 10, 148, 118],
      [3, 73, 45, 23, 74, 46],
      [4, 54, 24, 31, 55, 25],
      [11, 45, 15, 31, 46, 16],
      // 29
      [7, 146, 116, 7, 147, 117],
      [21, 73, 45, 7, 74, 46],
      [1, 53, 23, 37, 54, 24],
      [19, 45, 15, 26, 46, 16],
      // 30
      [5, 145, 115, 10, 146, 116],
      [19, 75, 47, 10, 76, 48],
      [15, 54, 24, 25, 55, 25],
      [23, 45, 15, 25, 46, 16],
      // 31
      [13, 145, 115, 3, 146, 116],
      [2, 74, 46, 29, 75, 47],
      [42, 54, 24, 1, 55, 25],
      [23, 45, 15, 28, 46, 16],
      // 32
      [17, 145, 115],
      [10, 74, 46, 23, 75, 47],
      [10, 54, 24, 35, 55, 25],
      [19, 45, 15, 35, 46, 16],
      // 33
      [17, 145, 115, 1, 146, 116],
      [14, 74, 46, 21, 75, 47],
      [29, 54, 24, 19, 55, 25],
      [11, 45, 15, 46, 46, 16],
      // 34
      [13, 145, 115, 6, 146, 116],
      [14, 74, 46, 23, 75, 47],
      [44, 54, 24, 7, 55, 25],
      [59, 46, 16, 1, 47, 17],
      // 35
      [12, 151, 121, 7, 152, 122],
      [12, 75, 47, 26, 76, 48],
      [39, 54, 24, 14, 55, 25],
      [22, 45, 15, 41, 46, 16],
      // 36
      [6, 151, 121, 14, 152, 122],
      [6, 75, 47, 34, 76, 48],
      [46, 54, 24, 10, 55, 25],
      [2, 45, 15, 64, 46, 16],
      // 37
      [17, 152, 122, 4, 153, 123],
      [29, 74, 46, 14, 75, 47],
      [49, 54, 24, 10, 55, 25],
      [24, 45, 15, 46, 46, 16],
      // 38
      [4, 152, 122, 18, 153, 123],
      [13, 74, 46, 32, 75, 47],
      [48, 54, 24, 14, 55, 25],
      [42, 45, 15, 32, 46, 16],
      // 39
      [20, 147, 117, 4, 148, 118],
      [40, 75, 47, 7, 76, 48],
      [43, 54, 24, 22, 55, 25],
      [10, 45, 15, 67, 46, 16],
      // 40
      [19, 148, 118, 6, 149, 119],
      [18, 75, 47, 31, 76, 48],
      [34, 54, 24, 34, 55, 25],
      [20, 45, 15, 61, 46, 16]
    ];
    QRRSBlock.getRSBlocks = function(typeNumber, errorCorrectLevel) {
      var rsBlock = QRRSBlock.getRsBlockTable(typeNumber, errorCorrectLevel);
      if (rsBlock === void 0) {
        throw new Error("bad rs block @ typeNumber:" + typeNumber + "/errorCorrectLevel:" + errorCorrectLevel);
      }
      var length = rsBlock.length / 3;
      var list = [];
      for (var i = 0; i < length; i++) {
        var count = rsBlock[i * 3 + 0];
        var totalCount = rsBlock[i * 3 + 1];
        var dataCount = rsBlock[i * 3 + 2];
        for (var j = 0; j < count; j++) {
          list.push(new QRRSBlock(totalCount, dataCount));
        }
      }
      return list;
    };
    QRRSBlock.getRsBlockTable = function(typeNumber, errorCorrectLevel) {
      switch (errorCorrectLevel) {
        case QRErrorCorrectLevel.L:
          return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 0];
        case QRErrorCorrectLevel.M:
          return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 1];
        case QRErrorCorrectLevel.Q:
          return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 2];
        case QRErrorCorrectLevel.H:
          return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 3];
        default:
          return void 0;
      }
    };
    module2.exports = QRRSBlock;
  }
});

// ../../qrcode-terminal/vendor/QRCode/QRBitBuffer.js
var require_QRBitBuffer = __commonJS({
  "../../qrcode-terminal/vendor/QRCode/QRBitBuffer.js"(exports2, module2) {
    "use strict";
    function QRBitBuffer() {
      this.buffer = [];
      this.length = 0;
    }
    QRBitBuffer.prototype = {
      get: function(index) {
        var bufIndex = Math.floor(index / 8);
        return (this.buffer[bufIndex] >>> 7 - index % 8 & 1) == 1;
      },
      put: function(num, length) {
        for (var i = 0; i < length; i++) {
          this.putBit((num >>> length - i - 1 & 1) == 1);
        }
      },
      getLengthInBits: function() {
        return this.length;
      },
      putBit: function(bit) {
        var bufIndex = Math.floor(this.length / 8);
        if (this.buffer.length <= bufIndex) {
          this.buffer.push(0);
        }
        if (bit) {
          this.buffer[bufIndex] |= 128 >>> this.length % 8;
        }
        this.length++;
      }
    };
    module2.exports = QRBitBuffer;
  }
});

// ../../qrcode-terminal/vendor/QRCode/index.js
var require_QRCode = __commonJS({
  "../../qrcode-terminal/vendor/QRCode/index.js"(exports2, module2) {
    "use strict";
    var QR8bitByte = require_QR8bitByte();
    var QRUtil = require_QRUtil();
    var QRPolynomial = require_QRPolynomial();
    var QRRSBlock = require_QRRSBlock();
    var QRBitBuffer = require_QRBitBuffer();
    function QRCode(typeNumber, errorCorrectLevel) {
      this.typeNumber = typeNumber;
      this.errorCorrectLevel = errorCorrectLevel;
      this.modules = null;
      this.moduleCount = 0;
      this.dataCache = null;
      this.dataList = [];
    }
    QRCode.prototype = {
      addData: function(data) {
        var newData = new QR8bitByte(data);
        this.dataList.push(newData);
        this.dataCache = null;
      },
      isDark: function(row, col) {
        if (row < 0 || this.moduleCount <= row || col < 0 || this.moduleCount <= col) {
          throw new Error(row + "," + col);
        }
        return this.modules[row][col];
      },
      getModuleCount: function() {
        return this.moduleCount;
      },
      make: function() {
        if (this.typeNumber < 1) {
          var typeNumber = 1;
          for (typeNumber = 1; typeNumber < 40; typeNumber++) {
            var rsBlocks = QRRSBlock.getRSBlocks(typeNumber, this.errorCorrectLevel);
            var buffer = new QRBitBuffer();
            var totalDataCount = 0;
            for (var i = 0; i < rsBlocks.length; i++) {
              totalDataCount += rsBlocks[i].dataCount;
            }
            for (var x = 0; x < this.dataList.length; x++) {
              var data = this.dataList[x];
              buffer.put(data.mode, 4);
              buffer.put(data.getLength(), QRUtil.getLengthInBits(data.mode, typeNumber));
              data.write(buffer);
            }
            if (buffer.getLengthInBits() <= totalDataCount * 8)
              break;
          }
          this.typeNumber = typeNumber;
        }
        this.makeImpl(false, this.getBestMaskPattern());
      },
      makeImpl: function(test, maskPattern) {
        this.moduleCount = this.typeNumber * 4 + 17;
        this.modules = new Array(this.moduleCount);
        for (var row = 0; row < this.moduleCount; row++) {
          this.modules[row] = new Array(this.moduleCount);
          for (var col = 0; col < this.moduleCount; col++) {
            this.modules[row][col] = null;
          }
        }
        this.setupPositionProbePattern(0, 0);
        this.setupPositionProbePattern(this.moduleCount - 7, 0);
        this.setupPositionProbePattern(0, this.moduleCount - 7);
        this.setupPositionAdjustPattern();
        this.setupTimingPattern();
        this.setupTypeInfo(test, maskPattern);
        if (this.typeNumber >= 7) {
          this.setupTypeNumber(test);
        }
        if (this.dataCache === null) {
          this.dataCache = QRCode.createData(this.typeNumber, this.errorCorrectLevel, this.dataList);
        }
        this.mapData(this.dataCache, maskPattern);
      },
      setupPositionProbePattern: function(row, col) {
        for (var r = -1; r <= 7; r++) {
          if (row + r <= -1 || this.moduleCount <= row + r) continue;
          for (var c = -1; c <= 7; c++) {
            if (col + c <= -1 || this.moduleCount <= col + c) continue;
            if (0 <= r && r <= 6 && (c === 0 || c === 6) || 0 <= c && c <= 6 && (r === 0 || r === 6) || 2 <= r && r <= 4 && 2 <= c && c <= 4) {
              this.modules[row + r][col + c] = true;
            } else {
              this.modules[row + r][col + c] = false;
            }
          }
        }
      },
      getBestMaskPattern: function() {
        var minLostPoint = 0;
        var pattern = 0;
        for (var i = 0; i < 8; i++) {
          this.makeImpl(true, i);
          var lostPoint = QRUtil.getLostPoint(this);
          if (i === 0 || minLostPoint > lostPoint) {
            minLostPoint = lostPoint;
            pattern = i;
          }
        }
        return pattern;
      },
      createMovieClip: function(target_mc, instance_name, depth) {
        var qr_mc = target_mc.createEmptyMovieClip(instance_name, depth);
        var cs = 1;
        this.make();
        for (var row = 0; row < this.modules.length; row++) {
          var y2 = row * cs;
          for (var col = 0; col < this.modules[row].length; col++) {
            var x = col * cs;
            var dark = this.modules[row][col];
            if (dark) {
              qr_mc.beginFill(0, 100);
              qr_mc.moveTo(x, y2);
              qr_mc.lineTo(x + cs, y2);
              qr_mc.lineTo(x + cs, y2 + cs);
              qr_mc.lineTo(x, y2 + cs);
              qr_mc.endFill();
            }
          }
        }
        return qr_mc;
      },
      setupTimingPattern: function() {
        for (var r = 8; r < this.moduleCount - 8; r++) {
          if (this.modules[r][6] !== null) {
            continue;
          }
          this.modules[r][6] = r % 2 === 0;
        }
        for (var c = 8; c < this.moduleCount - 8; c++) {
          if (this.modules[6][c] !== null) {
            continue;
          }
          this.modules[6][c] = c % 2 === 0;
        }
      },
      setupPositionAdjustPattern: function() {
        var pos = QRUtil.getPatternPosition(this.typeNumber);
        for (var i = 0; i < pos.length; i++) {
          for (var j = 0; j < pos.length; j++) {
            var row = pos[i];
            var col = pos[j];
            if (this.modules[row][col] !== null) {
              continue;
            }
            for (var r = -2; r <= 2; r++) {
              for (var c = -2; c <= 2; c++) {
                if (Math.abs(r) === 2 || Math.abs(c) === 2 || r === 0 && c === 0) {
                  this.modules[row + r][col + c] = true;
                } else {
                  this.modules[row + r][col + c] = false;
                }
              }
            }
          }
        }
      },
      setupTypeNumber: function(test) {
        var bits = QRUtil.getBCHTypeNumber(this.typeNumber);
        var mod;
        for (var i = 0; i < 18; i++) {
          mod = !test && (bits >> i & 1) === 1;
          this.modules[Math.floor(i / 3)][i % 3 + this.moduleCount - 8 - 3] = mod;
        }
        for (var x = 0; x < 18; x++) {
          mod = !test && (bits >> x & 1) === 1;
          this.modules[x % 3 + this.moduleCount - 8 - 3][Math.floor(x / 3)] = mod;
        }
      },
      setupTypeInfo: function(test, maskPattern) {
        var data = this.errorCorrectLevel << 3 | maskPattern;
        var bits = QRUtil.getBCHTypeInfo(data);
        var mod;
        for (var v = 0; v < 15; v++) {
          mod = !test && (bits >> v & 1) === 1;
          if (v < 6) {
            this.modules[v][8] = mod;
          } else if (v < 8) {
            this.modules[v + 1][8] = mod;
          } else {
            this.modules[this.moduleCount - 15 + v][8] = mod;
          }
        }
        for (var h2 = 0; h2 < 15; h2++) {
          mod = !test && (bits >> h2 & 1) === 1;
          if (h2 < 8) {
            this.modules[8][this.moduleCount - h2 - 1] = mod;
          } else if (h2 < 9) {
            this.modules[8][15 - h2 - 1 + 1] = mod;
          } else {
            this.modules[8][15 - h2 - 1] = mod;
          }
        }
        this.modules[this.moduleCount - 8][8] = !test;
      },
      mapData: function(data, maskPattern) {
        var inc = -1;
        var row = this.moduleCount - 1;
        var bitIndex = 7;
        var byteIndex = 0;
        for (var col = this.moduleCount - 1; col > 0; col -= 2) {
          if (col === 6) col--;
          while (true) {
            for (var c = 0; c < 2; c++) {
              if (this.modules[row][col - c] === null) {
                var dark = false;
                if (byteIndex < data.length) {
                  dark = (data[byteIndex] >>> bitIndex & 1) === 1;
                }
                var mask = QRUtil.getMask(maskPattern, row, col - c);
                if (mask) {
                  dark = !dark;
                }
                this.modules[row][col - c] = dark;
                bitIndex--;
                if (bitIndex === -1) {
                  byteIndex++;
                  bitIndex = 7;
                }
              }
            }
            row += inc;
            if (row < 0 || this.moduleCount <= row) {
              row -= inc;
              inc = -inc;
              break;
            }
          }
        }
      }
    };
    QRCode.PAD0 = 236;
    QRCode.PAD1 = 17;
    QRCode.createData = function(typeNumber, errorCorrectLevel, dataList) {
      var rsBlocks = QRRSBlock.getRSBlocks(typeNumber, errorCorrectLevel);
      var buffer = new QRBitBuffer();
      for (var i = 0; i < dataList.length; i++) {
        var data = dataList[i];
        buffer.put(data.mode, 4);
        buffer.put(data.getLength(), QRUtil.getLengthInBits(data.mode, typeNumber));
        data.write(buffer);
      }
      var totalDataCount = 0;
      for (var x = 0; x < rsBlocks.length; x++) {
        totalDataCount += rsBlocks[x].dataCount;
      }
      if (buffer.getLengthInBits() > totalDataCount * 8) {
        throw new Error("code length overflow. (" + buffer.getLengthInBits() + ">" + totalDataCount * 8 + ")");
      }
      if (buffer.getLengthInBits() + 4 <= totalDataCount * 8) {
        buffer.put(0, 4);
      }
      while (buffer.getLengthInBits() % 8 !== 0) {
        buffer.putBit(false);
      }
      while (true) {
        if (buffer.getLengthInBits() >= totalDataCount * 8) {
          break;
        }
        buffer.put(QRCode.PAD0, 8);
        if (buffer.getLengthInBits() >= totalDataCount * 8) {
          break;
        }
        buffer.put(QRCode.PAD1, 8);
      }
      return QRCode.createBytes(buffer, rsBlocks);
    };
    QRCode.createBytes = function(buffer, rsBlocks) {
      var offset = 0;
      var maxDcCount = 0;
      var maxEcCount = 0;
      var dcdata = new Array(rsBlocks.length);
      var ecdata = new Array(rsBlocks.length);
      for (var r = 0; r < rsBlocks.length; r++) {
        var dcCount = rsBlocks[r].dataCount;
        var ecCount = rsBlocks[r].totalCount - dcCount;
        maxDcCount = Math.max(maxDcCount, dcCount);
        maxEcCount = Math.max(maxEcCount, ecCount);
        dcdata[r] = new Array(dcCount);
        for (var i = 0; i < dcdata[r].length; i++) {
          dcdata[r][i] = 255 & buffer.buffer[i + offset];
        }
        offset += dcCount;
        var rsPoly = QRUtil.getErrorCorrectPolynomial(ecCount);
        var rawPoly = new QRPolynomial(dcdata[r], rsPoly.getLength() - 1);
        var modPoly = rawPoly.mod(rsPoly);
        ecdata[r] = new Array(rsPoly.getLength() - 1);
        for (var x = 0; x < ecdata[r].length; x++) {
          var modIndex = x + modPoly.getLength() - ecdata[r].length;
          ecdata[r][x] = modIndex >= 0 ? modPoly.get(modIndex) : 0;
        }
      }
      var totalCodeCount = 0;
      for (var y2 = 0; y2 < rsBlocks.length; y2++) {
        totalCodeCount += rsBlocks[y2].totalCount;
      }
      var data = new Array(totalCodeCount);
      var index = 0;
      for (var z = 0; z < maxDcCount; z++) {
        for (var s = 0; s < rsBlocks.length; s++) {
          if (z < dcdata[s].length) {
            data[index++] = dcdata[s][z];
          }
        }
      }
      for (var xx = 0; xx < maxEcCount; xx++) {
        for (var t = 0; t < rsBlocks.length; t++) {
          if (xx < ecdata[t].length) {
            data[index++] = ecdata[t][xx];
          }
        }
      }
      return data;
    };
    module2.exports = QRCode;
  }
});

// ../../qrcode-terminal/lib/main.js
var require_main = __commonJS({
  "../../qrcode-terminal/lib/main.js"(exports2, module2) {
    "use strict";
    var QRCode = require_QRCode();
    var QRErrorCorrectLevel = require_QRErrorCorrectLevel();
    var black = "\x1B[40m  \x1B[0m";
    var white = "\x1B[47m  \x1B[0m";
    var toCell = function(isBlack) {
      return isBlack ? black : white;
    };
    var repeat = function(color) {
      return {
        times: function(count) {
          return new Array(count).join(color);
        }
      };
    };
    var fill = function(length, value) {
      var arr = new Array(length);
      for (var i = 0; i < length; i++) {
        arr[i] = value;
      }
      return arr;
    };
    module2.exports = {
      error: QRErrorCorrectLevel.L,
      generate: function(input, opts, cb) {
        if (typeof opts === "function") {
          cb = opts;
          opts = {};
        }
        var qrcode = new QRCode(-1, this.error);
        qrcode.addData(input);
        qrcode.make();
        var output = "";
        if (opts && opts.small) {
          var BLACK = true, WHITE = false;
          var moduleCount = qrcode.getModuleCount();
          var moduleData = qrcode.modules.slice();
          var oddRow = moduleCount % 2 === 1;
          if (oddRow) {
            moduleData.push(fill(moduleCount, WHITE));
          }
          var platte = {
            WHITE_ALL: "\u2588",
            WHITE_BLACK: "\u2580",
            BLACK_WHITE: "\u2584",
            BLACK_ALL: " "
          };
          var borderTop = repeat(platte.BLACK_WHITE).times(moduleCount + 3);
          var borderBottom = repeat(platte.WHITE_BLACK).times(moduleCount + 3);
          output += borderTop + "\n";
          for (var row = 0; row < moduleCount; row += 2) {
            output += platte.WHITE_ALL;
            for (var col = 0; col < moduleCount; col++) {
              if (moduleData[row][col] === WHITE && moduleData[row + 1][col] === WHITE) {
                output += platte.WHITE_ALL;
              } else if (moduleData[row][col] === WHITE && moduleData[row + 1][col] === BLACK) {
                output += platte.WHITE_BLACK;
              } else if (moduleData[row][col] === BLACK && moduleData[row + 1][col] === WHITE) {
                output += platte.BLACK_WHITE;
              } else {
                output += platte.BLACK_ALL;
              }
            }
            output += platte.WHITE_ALL + "\n";
          }
          if (!oddRow) {
            output += borderBottom;
          }
        } else {
          var border = repeat(white).times(qrcode.getModuleCount() + 3);
          output += border + "\n";
          qrcode.modules.forEach(function(row2) {
            output += white;
            output += row2.map(toCell).join("");
            output += white + "\n";
          });
          output += border;
        }
        if (cb) cb(output);
        else console.log(output);
      },
      setErrorLevel: function(error) {
        this.error = QRErrorCorrectLevel[error] || this.error;
      }
    };
  }
});

// ../qqbot-connector/dist/esm/qqbot-session.js
function d(t = "production") {
  return E[t];
}
function l() {
  return import_node_crypto.default.randomBytes(32).toString("base64");
}
function b(t, r) {
  const a = Buffer.from(r, "base64"), n = Buffer.from(t, "base64"), e = n.subarray(0, 12), c = n.subarray(n.length - 16), s = n.subarray(12, n.length - 16), o = import_node_crypto.default.createDecipheriv("aes-256-gcm", a, e);
  return o.setAuthTag(c), Buffer.concat([o.update(s), o.final()]).toString("utf8");
}
function h(t, r, a) {
  return new Promise((n, e) => {
    const c = JSON.stringify(r), s = new URL(t), o = import_node_https.default.request({ hostname: s.hostname, path: s.pathname + s.search, method: "POST", timeout: a, headers: { "Content-Type": "application/json", Accept: "application/json", "Content-Length": Buffer.byteLength(c) } }, (i) => {
      if (i.statusCode !== 200) {
        i.resume(), e(new Error(`HTTP ${i.statusCode} from ${t}`));
        return;
      }
      let f = "";
      i.on("data", (p2) => {
        f += p2;
      }), i.on("end", () => {
        try {
          n(JSON.parse(f));
        } catch (p2) {
          e(p2);
        }
      });
    });
    o.on("error", e), o.on("timeout", () => {
      o.destroy(), e(new Error(`timeout fetching ${t}`));
    }), o.end(c);
  });
}
async function y(t = "production", r = 1e4) {
  const a = `https://${d(t)}/lite/create_bind_task`, n = l(), e = await h(a, { key: n }, r);
  if (e.retcode !== 0) throw new Error(e.msg ?? "create_bind_task failed");
  if (!e.data?.task_id) throw new Error("create_bind_task: missing task_id");
  return { taskId: e.data.task_id, key: n };
}
async function g(t, r = "production", a = 1e4) {
  const n = `https://${d(r)}/lite/poll_bind_result`, e = await h(n, { task_id: t }, a);
  if (e.retcode !== 0) throw new Error(e.msg ?? "poll_bind_result failed");
  return { status: e.data?.status ?? u.NONE, botAppId: String(e.data?.bot_appid ?? ""), botEncryptSecret: e.data?.bot_encrypt_secret ?? "", userOpenid: e.data?.user_openid || void 0 };
}
function w(t, r = "") {
  return `https://${d("production")}/qqbot/openclaw/connect.html?task_id=${encodeURIComponent(t)}&source=${encodeURIComponent(r)}&_wv=2`;
}
var import_node_crypto, import_node_https, E, u;
var init_qqbot_session = __esm({
  "../qqbot-connector/dist/esm/qqbot-session.js"() {
    "use strict";
    import_node_crypto = __toESM(require("crypto"), 1);
    import_node_https = __toESM(require("https"), 1);
    E = { production: "q.qq.com", test: "test.q.qq.com" };
    (function(t) {
      t[t.NONE = 0] = "NONE", t[t.PENDING = 1] = "PENDING", t[t.COMPLETED = 2] = "COMPLETED", t[t.EXPIRED = 3] = "EXPIRED";
    })(u || (u = {}));
  }
});

// ../qqbot-connector/dist/esm/qr-connect.js
function F(r) {
  return new Promise((o) => {
    import_qrcode_terminal.default.generate(r, { small: true }, (e) => {
      o(e);
    });
  });
}
function d2(r, o) {
  return new Promise((e, t) => {
    if (o?.aborted) {
      t(new DOMException("Aborted", "AbortError"));
      return;
    }
    const n = setTimeout(e, r);
    o?.addEventListener("abort", () => {
      clearTimeout(n), t(new DOMException("Aborted", "AbortError"));
    }, { once: true });
  });
}
async function C(r, o, e) {
  for (; !e?.aborted; ) {
    let t;
    try {
      t = await g(r);
    } catch {
      await d2(p, e);
      continue;
    }
    if (t.status === u.COMPLETED) {
      const n = b(t.botEncryptSecret, o);
      return { outcome: "scanned", appId: t.botAppId, appSecret: n, userOpenid: t.userOpenid };
    }
    if (t.status === u.EXPIRED) return { outcome: "expired" };
    await d2(p, e);
  }
  throw new DOMException("Aborted", "AbortError");
}
function l2(r, o) {
  const e = new AbortController(), t = o?.signal ? AbortSignal.any([e.signal, o.signal]) : e.signal;
  return (async () => {
    const n = o?.displayQrCodeToConsole ?? true;
    for (; ; ) {
      if (t.aborted) throw new DOMException("Aborted", "AbortError");
      let a;
      try {
        a = await y();
      } catch (u2) {
        throw new Error(`\u83B7\u53D6\u7ED1\u5B9A\u4EFB\u52A1\u5931\u8D25: ${u2 instanceof Error ? u2.message : String(u2)}`, { cause: u2 });
      }
      const i = w(a.taskId, o?.source);
      if (n) {
        const u2 = await F(i);
        console.log(u2), console.log(`\u8BF7\u4F7F\u7528\u624B\u673A QQ \u626B\u63CF\u4E0A\u65B9\u4E8C\u7EF4\u7801\uFF0C\u5B8C\u6210\u673A\u5668\u4EBA\u7ED1\u5B9A\u3002
`);
      }
      r.onQrDisplayed?.(i);
      const s = await C(a.taskId, a.key, t);
      if (s.outcome === "scanned") {
        r.onSuccess([{ appId: s.appId, appSecret: s.appSecret, userOpenid: s.userOpenid }]);
        return;
      }
      r.onQrExpired?.(), n && console.log(`\u4E8C\u7EF4\u7801\u5DF2\u8FC7\u671F\uFF0C\u6B63\u5728\u5237\u65B0\u2026
`);
    }
  })().catch((n) => {
    if (n instanceof DOMException && n.name === "AbortError") {
      r.onFailure(new Error("\u5DF2\u53D6\u6D88"));
      return;
    }
    r.onFailure(n instanceof Error ? n : new Error(String(n)));
  }), () => e.abort();
}
function m2(r) {
  return new Promise((o, e) => {
    l2({ onSuccess: o, onFailure: e }, { ...r, displayQrCodeToConsole: true });
  });
}
var import_qrcode_terminal, p;
var init_qr_connect = __esm({
  "../qqbot-connector/dist/esm/qr-connect.js"() {
    "use strict";
    import_qrcode_terminal = __toESM(require_main(), 1);
    init_qqbot_session();
    p = 2e3;
  }
});

// ../qqbot-connector/dist/esm/index.js
var init_esm = __esm({
  "../qqbot-connector/dist/esm/index.js"() {
    "use strict";
    init_qr_connect();
  }
});

// src/setup/account-key.ts
var account_key_exports = {};
__export(account_key_exports, {
  resolveAccountKey: () => resolveAccountKey
});
function resolveAccountKey(cfg, appId, resolvedId) {
  if (resolvedId) return resolvedId;
  for (const id of listQQBotAccountIds(cfg)) {
    if (resolveQQBotAccount(cfg, id).appId === appId) return id;
  }
  if (listQQBotAccountIds(cfg).length === 0) return "default";
  return appId;
}
var init_account_key = __esm({
  "src/setup/account-key.ts"() {
    "use strict";
    init_config();
  }
});

// src/setup/finalize.ts
var finalize_exports = {};
__export(finalize_exports, {
  applyAccountDefaults: () => applyAccountDefaults,
  finalizeQQBotSetup: () => finalizeQQBotSetup
});
function isConfigured(cfg, accountId) {
  const account = resolveQQBotAccount(cfg, accountId);
  return Boolean(account.appId && account.clientSecret);
}
async function linkViaQrCode(cfg, _accountId, prompter, rt) {
  try {
    const accounts = await m2({ source: "openclaw" });
    if (accounts.length === 0) {
      await prompter.note("\u672A\u83B7\u53D6\u5230\u4EFB\u4F55 QQ Bot \u8D26\u53F7\u4FE1\u606F\u3002", "QQ Bot");
      return cfg;
    }
    let next = cfg;
    for (const { appId, appSecret, userOpenid } of accounts) {
      const key = resolveAccountKey(cfg, appId);
      next = applyQQBotAccountConfig(next, key, { appId, clientSecret: appSecret });
      next = applyAccountDefaults(next, key, userOpenid);
      rt.log(`\u7ED1\u5B9A\u6210\u529F\uFF01\u8D26\u6237: ${key} (AppID: ${appId})`);
    }
    return next;
  } catch (err) {
    rt.error(`QQ Bot \u7ED1\u5B9A\u5931\u8D25: ${String(err)}`);
    await prompter.note(`\u7ED1\u5B9A\u5931\u8D25\uFF0C\u60A8\u53EF\u4EE5\u7A0D\u540E\u624B\u52A8\u914D\u7F6E\u3002
\u6587\u6863: ${formatDocsLink("/channels/qqbot", "qqbot")}`, "QQ Bot");
    return cfg;
  }
}
async function linkViaManual(cfg, _accountId, prompter) {
  const appIdInput = await prompter.text({ message: "\u8BF7\u8F93\u5165 QQ Bot AppID", validate: (v) => v.trim() ? void 0 : "AppID \u4E0D\u80FD\u4E3A\u7A7A" });
  const secret = await prompter.text({ message: "\u8BF7\u8F93\u5165 QQ Bot AppSecret", validate: (v) => v.trim() ? void 0 : "AppSecret \u4E0D\u80FD\u4E3A\u7A7A" });
  const appId = appIdInput.trim();
  const key = resolveAccountKey(cfg, appId);
  let next = applyQQBotAccountConfig(cfg, key, { appId, clientSecret: secret.trim() });
  next = applyAccountDefaults(next, key);
  await prompter.note("\u2714 QQ Bot \u914D\u7F6E\u5B8C\u6210\uFF01", "QQ Bot");
  return next;
}
async function finalizeQQBotSetup(params) {
  const accountId = params.accountId.trim() || DEFAULT_ACCOUNT_ID2;
  const configured = isConfigured(params.cfg, accountId);
  const mode = await params.prompter.select({
    message: configured ? "QQ \u5DF2\u7ED1\u5B9A\uFF0C\u9009\u62E9\u64CD\u4F5C" : "\u9009\u62E9 QQ \u7ED1\u5B9A\u65B9\u5F0F",
    options: [
      { value: "qr", label: "\u626B\u7801\u7ED1\u5B9A\uFF08\u63A8\u8350\uFF09", hint: "\u4F7F\u7528 QQ \u626B\u63CF\u4E8C\u7EF4\u7801\u81EA\u52A8\u5B8C\u6210\u7ED1\u5B9A" },
      { value: "manual", label: "\u624B\u52A8\u8F93\u5165 QQ Bot AppID \u548C AppSecret", hint: "\u9700\u5230 QQ \u5F00\u653E\u5E73\u53F0 q.qq.com \u67E5\u770B" },
      { value: "skip", label: configured ? "\u4FDD\u6301\u5F53\u524D\u914D\u7F6E" : "\u7A0D\u540E\u914D\u7F6E" }
    ]
  });
  let next = params.cfg;
  if (mode === "qr") {
    next = await linkViaQrCode(next, accountId, params.prompter, params.runtime);
  } else if (mode === "manual") {
    next = await linkViaManual(next, accountId, params.prompter);
  } else if (!configured) {
    await params.prompter.note("\u60A8\u53EF\u4EE5\u7A0D\u540E\u8FD0\u884C\u4EE5\u4E0B\u547D\u4EE4\u91CD\u65B0\u914D\u7F6E\uFF1A\n  openclaw channels add", "QQ Bot");
  }
  return { cfg: next };
}
function applyAccountDefaults(cfg, accountId, userOpenid) {
  const next = { ...cfg, channels: { ...cfg.channels } };
  const qqbot = { ...next.channels?.qqbot ?? {} };
  const defaults = { streaming: { mode: "partial" }, dmPolicy: "allowlist", mediaMaxMb: 200 };
  if (userOpenid) defaults.allowFrom = [userOpenid];
  if (accountId === DEFAULT_ACCOUNT_ID2) {
    Object.assign(qqbot, defaults);
  } else {
    const accounts = { ...qqbot.accounts ?? {} };
    accounts[accountId] = { ...accounts[accountId] ?? {}, ...defaults };
    qqbot.accounts = accounts;
  }
  next.channels = { ...next.channels, qqbot };
  return next;
}
var init_finalize = __esm({
  "src/setup/finalize.ts"() {
    "use strict";
    init_setup();
    init_esm();
    init_config();
    init_account_key();
  }
});

// index.ts
var index_exports = {};
__export(index_exports, {
  DEFAULT_ACCOUNT_ID: () => DEFAULT_ACCOUNT_ID,
  MSG_TYPE_QUOTE: () => MSG_TYPE_QUOTE2,
  MSG_TYPE_TEXT: () => MSG_TYPE_TEXT,
  PersistedRefIndexStore: () => PersistedRefIndexStore,
  QQBotGateway: () => QQBotGateway,
  StreamContentType: () => StreamContentType2,
  StreamInputMode: () => StreamInputMode2,
  StreamInputState: () => StreamInputState2,
  StreamingController: () => StreamingController,
  applyQQBotAccountConfig: () => applyQQBotAccountConfig,
  buildUserAgent: () => buildUserAgent,
  default: () => index_default,
  dispatchToOpenClaw: () => dispatchToOpenClaw,
  flushAllRefIndexStores: () => flushAllRefIndexStores,
  getBotForAccount: () => getBotForAccount,
  getPersistedRefIndexStore: () => getPersistedRefIndexStore,
  getQQBotRuntime: () => getQQBotRuntime,
  isGroupAllowed: () => isGroupAllowed,
  listQQBotAccountIds: () => listQQBotAccountIds,
  parseTarget: () => parseTarget,
  qqbotOnboardingAdapter: () => qqbotOnboardingAdapter,
  qqbotPlugin: () => qqbotPlugin,
  resolveDefaultQQBotAccountId: () => resolveDefaultQQBotAccountId,
  resolveGroupAllowFrom: () => resolveGroupAllowFrom,
  resolveGroupConfig: () => resolveGroupConfig,
  resolveGroupConfigFromAccount: () => resolveGroupConfigFromAccount,
  resolveGroupName: () => resolveGroupName,
  resolveGroupPolicy: () => resolveGroupPolicy,
  resolveGroupPrompt: () => resolveGroupPrompt,
  resolveHistoryLimit: () => resolveHistoryLimit,
  resolveIgnoreOtherMentions: () => resolveIgnoreOtherMentions,
  resolveMentionPatterns: () => resolveMentionPatterns,
  resolveProcessingTimeoutMs: () => resolveProcessingTimeoutMs,
  resolveQQBotAccount: () => resolveQQBotAccount,
  resolveRequireMention: () => resolveRequireMention,
  resolveToolPolicy: () => resolveToolPolicy,
  resolveUserAgentSuffix: () => resolveUserAgentSuffix,
  sendMedia: () => sendMedia,
  sendText: () => sendText,
  setQQBotRuntime: () => setQQBotRuntime,
  shouldUseStreaming: () => shouldUseStreaming,
  tryGetBotForAccount: () => tryGetBotForAccount
});
module.exports = __toCommonJS(index_exports);
var import_core2 = require("openclaw/plugin-sdk/core");

// src/channel.ts
var import_core = require("openclaw/plugin-sdk/core");
init_config();

// src/bot-instance.ts
var import_node_os = __toESM(require("os"), 1);

// src/outbound/outbound-service.ts
var path3 = __toESM(require("path"), 1);

// ../qqbot-nodejs/dist/QQBot.js
var fs3 = __toESM(require("fs"), 1);
var path = __toESM(require("path"), 1);

// ../qqbot-nodejs/dist/middleware/types.js
function resolvePolicy(ctx, path22, explicit, defaultValue) {
  if (explicit !== void 0 && explicit !== null) {
    return explicit;
  }
  const keys = path22.split(".");
  let value = ctx.state.policy;
  for (const key of keys) {
    if (value === null || value === void 0)
      break;
    value = value[key];
  }
  if (value !== void 0 && value !== null) {
    return value;
  }
  return defaultValue;
}
async function runMiddlewareChain(middlewares, ctx) {
  let index = -1;
  const dispatch = async (i) => {
    if (i <= index) {
      throw new Error("next() called multiple times");
    }
    index = i;
    if (ctx.stopped) {
      return;
    }
    if (i >= middlewares.length) {
      return;
    }
    const fn = middlewares[i];
    if (!fn) {
      return;
    }
    await fn(ctx, () => dispatch(i + 1));
  };
  await dispatch(0);
  return !ctx.stopped;
}
function createMiddlewareContext(params) {
  const receivedAt = Date.now();
  let stopped = false;
  let stopReason;
  const ac = new AbortController();
  const ctx = {
    bot: params.bot,
    message: params.message,
    replyTarget: params.message.replyTarget,
    state: {},
    log: params.log,
    stop(reason) {
      stopped = true;
      stopReason = reason;
    },
    get stopped() {
      return stopped;
    },
    get stopReason() {
      return stopReason;
    },
    get signal() {
      return ac.signal;
    },
    abort(reason) {
      ac.abort(reason);
      stopped = true;
      stopReason = reason ?? "aborted";
    },
    get aborted() {
      return ac.signal.aborted;
    },
    receivedAt
  };
  return ctx;
}

// ../qqbot-nodejs/dist/protocol/types.js
var ApiError = class extends Error {
  httpStatus;
  path;
  bizCode;
  bizMessage;
  name = "ApiError";
  constructor(message, httpStatus, path22, bizCode, bizMessage) {
    super(message);
    this.httpStatus = httpStatus;
    this.path = path22;
    this.bizCode = bizCode;
    this.bizMessage = bizMessage;
  }
};
var MediaFileType;
(function(MediaFileType2) {
  MediaFileType2[MediaFileType2["IMAGE"] = 1] = "IMAGE";
  MediaFileType2[MediaFileType2["VIDEO"] = 2] = "VIDEO";
  MediaFileType2[MediaFileType2["VOICE"] = 3] = "VOICE";
  MediaFileType2[MediaFileType2["FILE"] = 4] = "FILE";
})(MediaFileType || (MediaFileType = {}));
var StreamInputMode = {
  REPLACE: "replace"
};
var StreamInputState = {
  GENERATING: 1,
  DONE: 10
};
var StreamContentType = {
  MARKDOWN: "markdown"
};

// ../qqbot-nodejs/dist/protocol/utils/format.js
function formatErrorMessage(err) {
  if (err instanceof Error) {
    let formatted = err.message || err.name || "Error";
    let cause = err.cause;
    const seen = /* @__PURE__ */ new Set([err]);
    while (cause && !seen.has(cause)) {
      seen.add(cause);
      if (cause instanceof Error) {
        if (cause.message) {
          formatted += ` | ${cause.message}`;
        }
        cause = cause.cause;
      } else if (typeof cause === "string") {
        formatted += ` | ${cause}`;
        break;
      } else {
        break;
      }
    }
    return formatted;
  }
  if (typeof err === "string") {
    return err;
  }
  if (err === null || err === void 0 || typeof err === "number" || typeof err === "boolean" || typeof err === "bigint") {
    return String(err);
  }
  try {
    return JSON.stringify(err);
  } catch {
    return Object.prototype.toString.call(err);
  }
}
function formatFileSize(bytes) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(2)} KB`;
  }
  if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  }
  return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

// ../qqbot-nodejs/dist/protocol/api/api-client.js
var DEFAULT_BASE_URL = "https://api.sgroup.qq.com";
var DEFAULT_TIMEOUT_MS = 3e4;
var FILE_UPLOAD_TIMEOUT_MS = 12e4;
var ApiClient = class {
  baseUrl;
  defaultTimeoutMs;
  fileUploadTimeoutMs;
  logger;
  resolveUserAgent;
  constructor(config = {}) {
    this.baseUrl = config.baseUrl ?? DEFAULT_BASE_URL;
    this.defaultTimeoutMs = config.defaultTimeoutMs ?? DEFAULT_TIMEOUT_MS;
    this.fileUploadTimeoutMs = config.fileUploadTimeoutMs ?? FILE_UPLOAD_TIMEOUT_MS;
    this.logger = config.logger;
    const ua = config.userAgent ?? "qqbot-nodejs/unknown";
    this.resolveUserAgent = typeof ua === "function" ? ua : () => ua;
  }
  async request(accessToken, method, path22, body, options) {
    const url = `${this.baseUrl}${path22}`;
    const headers = {
      Authorization: `QQBot ${accessToken}`,
      "Content-Type": "application/json",
      "User-Agent": this.resolveUserAgent()
    };
    const isFileUpload = options?.uploadRequest === true || path22.includes("/files") || path22.includes("/upload_prepare") || path22.includes("/upload_part_finish");
    const timeout = options?.timeoutMs ?? (isFileUpload ? this.fileUploadTimeoutMs : this.defaultTimeoutMs);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    const fetchInit = { method, headers, signal: controller.signal };
    if (body) {
      fetchInit.body = JSON.stringify(body);
    }
    this.logger?.debug?.(`[qqbot:api] >>> ${method} ${url} (timeout: ${timeout}ms)`);
    if (body && this.logger?.debug) {
      const logBody = { ...body };
      for (const key of options?.redactBodyKeys ?? ["file_data"]) {
        if (typeof logBody[key] === "string") {
          logBody[key] = `<redacted ${logBody[key].length} chars>`;
        }
      }
      this.logger.debug(`[qqbot:api] >>> Body: ${JSON.stringify(logBody)}`);
    }
    let res;
    try {
      res = await fetch(url, fetchInit);
    } catch (err) {
      clearTimeout(timeoutId);
      if (err instanceof Error && err.name === "AbortError") {
        this.logger?.error?.(`[qqbot:api] <<< Timeout after ${timeout}ms`);
        throw new ApiError(`Request timeout [${path22}]: exceeded ${timeout}ms`, 0, path22);
      }
      this.logger?.error?.(`[qqbot:api] <<< Network error: ${formatErrorMessage(err)}`);
      throw new ApiError(`Network error [${path22}]: ${formatErrorMessage(err)}`, 0, path22);
    } finally {
      clearTimeout(timeoutId);
    }
    const traceId = res.headers.get("x-tps-trace-id") ?? "";
    this.logger?.info?.(`[qqbot:api] <<< Status: ${res.status} ${res.statusText}${traceId ? ` | TraceId: ${traceId}` : ""}`);
    let rawBody;
    try {
      rawBody = await res.text();
    } catch (err) {
      throw new ApiError(`Failed to read response [${path22}]: ${formatErrorMessage(err)}`, res.status, path22);
    }
    this.logger?.debug?.(`[qqbot:api] <<< Body: ${rawBody}`);
    const contentType = res.headers.get("content-type") ?? "";
    const isHtmlResponse = contentType.includes("text/html") || rawBody.trimStart().startsWith("<");
    if (!res.ok) {
      if (isHtmlResponse) {
        const statusHint = res.status === 502 || res.status === 503 || res.status === 504 ? "\u8C03\u7528\u53D1\u751F\u5F02\u5E38\uFF0C\u8BF7\u7A0D\u5019\u91CD\u8BD5" : res.status === 429 ? "\u8BF7\u6C42\u8FC7\u4E8E\u9891\u7E41\uFF0C\u5DF2\u88AB\u9650\u6D41" : `\u5F00\u653E\u5E73\u53F0\u8FD4\u56DE HTTP ${res.status}`;
        throw new ApiError(`${statusHint}\uFF08${path22}\uFF09\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5`, res.status, path22);
      }
      try {
        const error = JSON.parse(rawBody);
        const bizCode = error.code ?? error.err_code;
        throw new ApiError(`API Error [${path22}]: ${error.message ?? rawBody}`, res.status, path22, bizCode, error.message);
      } catch (parseErr) {
        if (parseErr instanceof ApiError) {
          throw parseErr;
        }
        throw new ApiError(`API Error [${path22}] HTTP ${res.status}: ${rawBody.slice(0, 200)}`, res.status, path22);
      }
    }
    if (isHtmlResponse) {
      throw new ApiError(`QQ \u670D\u52A1\u7AEF\u8FD4\u56DE\u4E86\u975E JSON \u54CD\u5E94\uFF08${path22}\uFF09\uFF0C\u53EF\u80FD\u662F\u4E34\u65F6\u6545\u969C\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5`, res.status, path22);
    }
    try {
      return JSON.parse(rawBody);
    } catch {
      throw new ApiError(`\u5F00\u653E\u5E73\u53F0\u54CD\u5E94\u683C\u5F0F\u5F02\u5E38\uFF08${path22}\uFF09\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5`, res.status, path22);
    }
  }
};

// ../qqbot-nodejs/dist/protocol/api/media-chunked.js
var crypto = __toESM(require("crypto"), 1);
var fs = __toESM(require("fs"), 1);
var https = __toESM(require("https"), 1);

// ../qqbot-nodejs/dist/protocol/api/retry.js
async function withRetry(fn, policy, persistentPolicy, logger) {
  let lastError = null;
  for (let attempt = 0; attempt <= policy.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(formatErrorMessage(err));
      if (persistentPolicy?.shouldPersistRetry(lastError)) {
        (logger?.warn ?? logger?.error)?.(`[qqbot:retry] Hit persistent-retry trigger, entering persistent loop (timeout=${persistentPolicy.timeoutMs / 1e3}s)`);
        return await persistentRetryLoop(fn, persistentPolicy, logger);
      }
      if (policy.shouldRetry?.(lastError, attempt) === false) {
        throw lastError;
      }
      if (attempt < policy.maxRetries) {
        const delay = policy.backoff === "exponential" ? policy.baseDelayMs * 2 ** attempt : policy.baseDelayMs;
        logger?.debug?.(`[qqbot:retry] Attempt ${attempt + 1} failed, retrying in ${delay}ms: ${lastError.message.slice(0, 100)}`);
        await sleep(delay);
      }
    }
  }
  throw lastError;
}
async function persistentRetryLoop(fn, policy, logger) {
  const deadline = Date.now() + policy.timeoutMs;
  let attempt = 0;
  let lastError = null;
  while (Date.now() < deadline) {
    try {
      const result = await fn();
      logger?.debug?.(`[qqbot:retry] Persistent retry succeeded after ${attempt} retries`);
      return result;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(formatErrorMessage(err));
      if (!policy.shouldPersistRetry(lastError)) {
        logger?.error?.(`[qqbot:retry] Persistent retry: error is no longer retryable, aborting`);
        throw lastError;
      }
      attempt++;
      const remaining = deadline - Date.now();
      if (remaining <= 0) {
        break;
      }
      const actualDelay = Math.min(policy.intervalMs, remaining);
      (logger?.warn ?? logger?.error)?.(`[qqbot:retry] Persistent retry #${attempt}: retrying in ${actualDelay}ms (remaining=${Math.round(remaining / 1e3)}s)`);
      await sleep(actualDelay);
    }
  }
  logger?.error?.(`[qqbot:retry] Persistent retry timed out after ${policy.timeoutMs / 1e3}s (${attempt} attempts)`);
  throw lastError ?? new Error(`Persistent retry timed out (${policy.timeoutMs / 1e3}s)`);
}
function sleep(ms) {
  return new Promise((resolve2) => setTimeout(resolve2, ms));
}
var UPLOAD_RETRY_POLICY = {
  maxRetries: 2,
  baseDelayMs: 1e3,
  backoff: "exponential",
  shouldRetry: (error) => {
    const msg = error.message;
    return !(msg.includes("400") || msg.includes("401") || msg.includes("Invalid") || msg.includes("timeout") || msg.includes("Timeout"));
  }
};
var COMPLETE_UPLOAD_RETRY_POLICY = {
  maxRetries: 2,
  baseDelayMs: 2e3,
  backoff: "exponential"
};
var PART_FINISH_RETRY_POLICY = {
  maxRetries: 2,
  baseDelayMs: 1e3,
  backoff: "exponential"
};
function buildPartFinishPersistentPolicy(retryTimeoutMs, retryableCodes = PART_FINISH_RETRYABLE_CODES) {
  return {
    timeoutMs: retryTimeoutMs ?? 2 * 60 * 1e3,
    intervalMs: 1e3,
    shouldPersistRetry: (error) => {
      if (retryableCodes.size === 0) {
        return false;
      }
      if ("bizCode" in error && typeof error.bizCode === "number") {
        return retryableCodes.has(error.bizCode);
      }
      return false;
    }
  };
}
var PART_FINISH_RETRYABLE_CODES = /* @__PURE__ */ new Set([40093001]);
var UPLOAD_PREPARE_FALLBACK_CODE = 40093002;

// ../qqbot-nodejs/dist/protocol/api/routes.js
function messagePath(scope, targetId) {
  return scope === "c2c" ? `/v2/users/${targetId}/messages` : `/v2/groups/${targetId}/messages`;
}
function channelMessagePath(channelId) {
  return `/channels/${channelId}/messages`;
}
function dmMessagePath(guildId) {
  return `/dms/${guildId}/messages`;
}
function mediaUploadPath(scope, targetId) {
  return scope === "c2c" ? `/v2/users/${targetId}/files` : `/v2/groups/${targetId}/files`;
}
function uploadPreparePath(scope, targetId) {
  return scope === "c2c" ? `/v2/users/${targetId}/upload_prepare` : `/v2/groups/${targetId}/upload_prepare`;
}
function uploadPartFinishPath(scope, targetId) {
  return scope === "c2c" ? `/v2/users/${targetId}/upload_part_finish` : `/v2/groups/${targetId}/upload_part_finish`;
}
function uploadCompletePath(scope, targetId) {
  return mediaUploadPath(scope, targetId);
}
function streamMessagePath(openid) {
  return `/v2/users/${openid}/stream_messages`;
}
function gatewayPath() {
  return "/gateway";
}
function interactionPath(interactionId) {
  return `/interactions/${interactionId}`;
}
function getNextMsgSeq(_msgId) {
  const timePart = Date.now() % 1e8;
  const random = Math.floor(Math.random() * 65536);
  return (timePart ^ random) % 65536;
}

// ../qqbot-nodejs/dist/protocol/api/media-chunked.js
var UploadDailyLimitExceededError = class extends Error {
  filePath;
  fileSize;
  name = "UploadDailyLimitExceededError";
  constructor(filePath, fileSize, originalMessage) {
    super(originalMessage);
    this.filePath = filePath;
    this.fileSize = fileSize;
  }
};
var DEFAULT_CONCURRENT_PARTS = 1;
var MAX_CONCURRENT_PARTS = 10;
var MAX_PART_FINISH_RETRY_TIMEOUT_MS = 10 * 60 * 1e3;
var PART_UPLOAD_TIMEOUT_MS = 3e5;
var MD5_10M_SIZE = 10002432;
var ChunkedMediaApi = class {
  client;
  tokenManager;
  logger;
  cache;
  sanitize;
  constructor(client, tokenManager, config = {}) {
    this.client = client;
    this.tokenManager = tokenManager;
    this.logger = config.logger;
    this.cache = config.uploadCache;
    this.sanitize = config.sanitizeFileName ?? ((n) => n);
  }
  async uploadChunked(opts) {
    const prefix = opts.logPrefix ?? "[qqbot:chunked-upload]";
    const input = resolveSource(opts.source, opts.fileName);
    const displayName = input.fileName;
    const fileSize = input.size;
    const pathLabel = input.kind === "localPath" ? input.path : "<buffer>";
    this.logger?.info?.(`${prefix} Start: file=${displayName} size=${formatFileSize(fileSize)} type=${opts.fileType}`);
    const hashes = await computeHashes(input);
    this.logger?.debug?.(`${prefix} hashes: md5=${hashes.md5} sha1=${hashes.sha1} md5_10m=${hashes.md5_10m}`);
    if (this.cache) {
      const cached = this.cache.get(hashes.md5, opts.scope, opts.targetId, opts.fileType);
      if (cached) {
        this.logger?.info?.(`${prefix} cache HIT (md5=${hashes.md5.slice(0, 8)}) \u2014 skipping chunked upload`);
        return { file_uuid: "", file_info: cached, ttl: 0 };
      }
    }
    const fileNameForPrepare = opts.fileType === MediaFileType.FILE ? this.sanitize(displayName) : displayName;
    const prepareResp = await this.callUploadPrepare(opts, fileNameForPrepare, fileSize, hashes, pathLabel);
    const { upload_id, parts } = prepareResp;
    const block_size = prepareResp.block_size;
    const maxConcurrent = Math.min(prepareResp.concurrency ? prepareResp.concurrency : DEFAULT_CONCURRENT_PARTS, MAX_CONCURRENT_PARTS);
    const retryTimeoutMs = prepareResp.retry_timeout ? Math.min(prepareResp.retry_timeout * 1e3, MAX_PART_FINISH_RETRY_TIMEOUT_MS) : void 0;
    this.logger?.info?.(`${prefix} prepared: upload_id=${upload_id} block=${formatFileSize(block_size)} parts=${parts.length} concurrency=${maxConcurrent}`);
    let completedParts = 0;
    let uploadedBytes = 0;
    const uploadPart = async (part) => {
      const partIndex = part.index;
      const offset = (partIndex - 1) * block_size;
      const length = Math.min(block_size, fileSize - offset);
      const partBuffer = await readPart(input, offset, length);
      const md5Hex = crypto.createHash("md5").update(partBuffer).digest("hex");
      this.logger?.debug?.(`${prefix} part ${partIndex}/${parts.length}: ${formatFileSize(length)} offset=${offset} md5=${md5Hex}`);
      await putToPresignedUrl(part.presigned_url, partBuffer, partIndex, parts.length, this.logger, prefix);
      await this.callUploadPartFinish(opts, upload_id, partIndex, length, md5Hex, retryTimeoutMs);
      completedParts++;
      uploadedBytes += length;
      this.logger?.info?.(`${prefix} part ${partIndex}/${parts.length} done (${completedParts}/${parts.length})`);
      opts.onProgress?.({
        completedParts,
        totalParts: parts.length,
        uploadedBytes,
        totalBytes: fileSize
      });
    };
    await runWithConcurrency(parts.map((part) => () => uploadPart(part)), maxConcurrent);
    this.logger?.info?.(`${prefix} all parts uploaded, completing...`);
    const result = await this.callCompleteUpload(opts, upload_id);
    this.logger?.info?.(`${prefix} completed: file_uuid=${result.file_uuid} ttl=${result.ttl}s`);
    if (this.cache && result.file_info && result.ttl > 0) {
      this.cache.set(hashes.md5, opts.scope, opts.targetId, opts.fileType, result.file_info, result.file_uuid, result.ttl);
    }
    return result;
  }
  async callUploadPrepare(opts, fileName, fileSize, hashes, pathLabel) {
    const token = await this.tokenManager.getAccessToken(opts.creds.appId, opts.creds.clientSecret);
    const path22 = uploadPreparePath(opts.scope, opts.targetId);
    try {
      return await this.client.request(token, "POST", path22, {
        file_type: opts.fileType,
        file_name: fileName,
        file_size: fileSize,
        md5: hashes.md5,
        sha1: hashes.sha1,
        md5_10m: hashes.md5_10m
      }, { uploadRequest: true });
    } catch (err) {
      if (err instanceof ApiError && err.bizCode === UPLOAD_PREPARE_FALLBACK_CODE) {
        throw new UploadDailyLimitExceededError(pathLabel, fileSize, err.message);
      }
      throw err;
    }
  }
  async callUploadPartFinish(opts, uploadId, partIndex, blockSize, md5, retryTimeoutMs) {
    const persistentPolicy = buildPartFinishPersistentPolicy(retryTimeoutMs);
    const path22 = uploadPartFinishPath(opts.scope, opts.targetId);
    await withRetry(async () => {
      const token = await this.tokenManager.getAccessToken(opts.creds.appId, opts.creds.clientSecret);
      return this.client.request(token, "POST", path22, {
        upload_id: uploadId,
        part_index: partIndex,
        block_size: blockSize,
        md5
      }, { uploadRequest: true });
    }, PART_FINISH_RETRY_POLICY, persistentPolicy, this.logger);
  }
  async callCompleteUpload(opts, uploadId) {
    const path22 = uploadCompletePath(opts.scope, opts.targetId);
    return withRetry(async () => {
      const token = await this.tokenManager.getAccessToken(opts.creds.appId, opts.creds.clientSecret);
      return this.client.request(token, "POST", path22, { upload_id: uploadId }, { uploadRequest: true });
    }, COMPLETE_UPLOAD_RETRY_POLICY, void 0, this.logger);
  }
};
function resolveSource(source, fileNameOverride) {
  if (source.kind === "localPath") {
    const inferredName = source.path.split(/[/\\]/).pop() || "file";
    return {
      kind: "localPath",
      path: source.path,
      size: source.size,
      fileName: fileNameOverride ?? inferredName
    };
  }
  return {
    kind: "buffer",
    buffer: source.buffer,
    size: source.buffer.length,
    fileName: fileNameOverride ?? source.fileName ?? "file"
  };
}
async function readPart(input, offset, length) {
  if (input.kind === "buffer") {
    return input.buffer.subarray(offset, offset + length);
  }
  const handle = await fs.promises.open(input.path, "r");
  try {
    const buf = Buffer.alloc(length);
    const { bytesRead } = await handle.read(buf, 0, length, offset);
    return bytesRead < length ? buf.subarray(0, bytesRead) : buf;
  } finally {
    await handle.close();
  }
}
async function computeHashes(input) {
  if (input.kind === "buffer") {
    const md5 = crypto.createHash("md5").update(input.buffer).digest("hex");
    const sha1 = crypto.createHash("sha1").update(input.buffer).digest("hex");
    const md5_10m = input.size > MD5_10M_SIZE ? crypto.createHash("md5").update(input.buffer.subarray(0, MD5_10M_SIZE)).digest("hex") : md5;
    return { md5, sha1, md5_10m };
  }
  return new Promise((resolve2, reject) => {
    const md5 = crypto.createHash("md5");
    const sha1 = crypto.createHash("sha1");
    const md5_10m = crypto.createHash("md5");
    let consumed = 0;
    const needsMd5_10m = input.size > MD5_10M_SIZE;
    const stream = fs.createReadStream(input.path);
    stream.on("data", (chunk) => {
      const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
      md5.update(buf);
      sha1.update(buf);
      if (needsMd5_10m) {
        const remaining = MD5_10M_SIZE - consumed;
        if (remaining > 0) {
          md5_10m.update(remaining >= buf.length ? buf : buf.subarray(0, remaining));
        }
      }
      consumed += buf.length;
    });
    stream.on("end", () => {
      const md5Hex = md5.digest("hex");
      const sha1Hex = sha1.digest("hex");
      resolve2({
        md5: md5Hex,
        sha1: sha1Hex,
        md5_10m: needsMd5_10m ? md5_10m.digest("hex") : md5Hex
      });
    });
    stream.on("error", reject);
  });
}
var PART_UPLOAD_MAX_RETRIES = 2;
function putToCOS(presignedUrl, data, signal) {
  return new Promise((resolve2, reject) => {
    const parsed = new URL(presignedUrl);
    const req4 = https.request(parsed, {
      method: "PUT",
      headers: { "Content-Length": String(data.length) },
      signal
    }, (res) => {
      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => {
        const etag = (res.headers.etag ?? "").replace(/"/g, "");
        const requestId = res.headers["x-cos-request-id"]?.toString() ?? "-";
        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
          resolve2({ status: res.statusCode, etag, requestId });
        } else {
          reject(new Error(`COS PUT failed: ${res.statusCode} ${res.statusMessage ?? ""} - ${Buffer.concat(chunks).toString().slice(0, 120)}`));
        }
      });
      res.on("error", reject);
    });
    req4.on("error", (err) => {
      reject(err);
    });
    req4.end(data);
  });
}
async function putToPresignedUrl(presignedUrl, data, partIndex, totalParts, logger, prefix) {
  let lastError = null;
  for (let attempt = 0; attempt <= PART_UPLOAD_MAX_RETRIES; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), PART_UPLOAD_TIMEOUT_MS);
    try {
      const startTime = Date.now();
      const { etag, requestId } = await putToCOS(presignedUrl, data, controller.signal);
      const elapsed = Date.now() - startTime;
      logger?.debug?.(`${prefix} PUT part ${partIndex}/${totalParts} OK (${elapsed}ms ETag=${etag} requestId=${requestId})`);
      return;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      const code = err.code ?? "none";
      const causeMsg = (() => {
        const c = err instanceof Error ? err.cause : void 0;
        return c instanceof Error ? c.message : "none";
      })();
      if (lastError.name === "AbortError") {
        lastError = new Error(`Part ${partIndex}/${totalParts} upload timeout after ${PART_UPLOAD_TIMEOUT_MS}ms`);
      }
      if (attempt < PART_UPLOAD_MAX_RETRIES) {
        const delay = 1e3 * 2 ** attempt;
        (logger?.warn ?? logger?.error)?.(`${prefix} PUT part ${partIndex}/${totalParts} attempt ${attempt + 1} failed (${lastError.message.slice(0, 120)} code=${code} cause=${causeMsg}), retrying in ${delay}ms`);
        await sleep2(delay);
      } else {
        logger?.error?.(`${prefix} PUT part ${partIndex}/${totalParts} all retries exhausted (code=${code} cause=${causeMsg})`);
      }
    } finally {
      clearTimeout(timeoutId);
    }
  }
  throw lastError ?? new Error(`Part ${partIndex}/${totalParts} upload failed`);
}
async function runWithConcurrency(tasks, maxConcurrent) {
  for (let i = 0; i < tasks.length; i += maxConcurrent) {
    const batch = tasks.slice(i, i + maxConcurrent);
    await Promise.all(batch.map((task) => task()));
  }
}
function sleep2(ms) {
  return new Promise((resolve2) => setTimeout(resolve2, ms));
}

// ../qqbot-nodejs/dist/protocol/api/media.js
var fs2 = __toESM(require("fs"), 1);

// ../qqbot-nodejs/dist/protocol/utils/file-utils.js
var MAX_UPLOAD_SIZE = 20 * 1024 * 1024;
var CHUNKED_UPLOAD_MAX_SIZE = 100 * 1024 * 1024;
var LARGE_FILE_THRESHOLD = 5 * 1024 * 1024;
var MEDIA_FILE_TYPE_INFO = {
  [MediaFileType.IMAGE]: { maxSize: 30 * 1024 * 1024, name: "image" },
  [MediaFileType.VIDEO]: { maxSize: 100 * 1024 * 1024, name: "video" },
  [MediaFileType.VOICE]: { maxSize: 20 * 1024 * 1024, name: "voice" },
  [MediaFileType.FILE]: { maxSize: 100 * 1024 * 1024, name: "file" }
};
function sanitizeFileName(name) {
  if (!name) {
    return "file";
  }
  const cleaned = name.replace(/[\\/:*?"<>|]/g, "_").replace(/[\u0000-\u001f\u007f]/g, "").replace(/\s+/g, " ").trim();
  return cleaned || "file";
}

// ../qqbot-nodejs/dist/protocol/api/media.js
var MAX_BASE64_CHECK_SIZE = Math.ceil(MAX_UPLOAD_SIZE * 1.4);
function formatUploadSize() {
  return formatFileSize(MAX_UPLOAD_SIZE);
}
var MediaApi = class {
  client;
  tokenManager;
  logger;
  cache;
  sanitize;
  constructor(client, tokenManager, config = {}) {
    this.client = client;
    this.tokenManager = tokenManager;
    this.logger = config.logger;
    this.cache = config.uploadCache;
    this.sanitize = config.sanitizeFileName ?? ((n) => n);
  }
  /**
   * Upload media via base64, URL, buffer, or local file path to a C2C or Group target.
   */
  async uploadMedia(scope, targetId, fileType, creds, opts) {
    const sources = [opts.url, opts.fileData, opts.buffer, opts.localPath].filter((v) => v !== void 0);
    if (sources.length === 0) {
      throw new Error(`uploadMedia: one of url/fileData/buffer/localPath is required`);
    }
    if (sources.length > 1) {
      throw new Error(`uploadMedia: url/fileData/buffer/localPath are mutually exclusive (got ${sources.length})`);
    }
    let fileData = opts.fileData;
    if (opts.buffer) {
      fileData = opts.buffer.toString("base64");
    } else if (opts.localPath) {
      const buf = await fs2.promises.readFile(opts.localPath);
      fileData = buf.toString("base64");
    }
    if (fileData && fileData.length > MAX_BASE64_CHECK_SIZE) {
      const sizeMB = (fileData.length / (1024 * 1024)).toFixed(1);
      throw new Error(`fileData too large (${sizeMB}MB decoded); QQ Bot single upload limit is ${formatUploadSize()}`);
    }
    if (fileData && this.cache) {
      const hash = this.cache.computeHash(fileData);
      const cached = this.cache.get(hash, scope, targetId, fileType);
      if (cached) {
        return { file_uuid: "", file_info: cached, ttl: 0 };
      }
    }
    const body = {
      file_type: fileType,
      srv_send_msg: opts.srvSendMsg ?? false
    };
    if (opts.url) {
      body.url = opts.url;
    } else if (fileData) {
      body.file_data = fileData;
    }
    if (fileType === MediaFileType.FILE && opts.fileName) {
      body.file_name = this.sanitize(opts.fileName);
    }
    const token = await this.tokenManager.getAccessToken(creds.appId, creds.clientSecret);
    const path22 = mediaUploadPath(scope, targetId);
    const result = await withRetry(() => this.client.request(token, "POST", path22, body, {
      redactBodyKeys: ["file_data"],
      uploadRequest: true
    }), UPLOAD_RETRY_POLICY, void 0, this.logger);
    if (fileData && result.file_info && result.ttl > 0 && this.cache) {
      const hash = this.cache.computeHash(fileData);
      this.cache.set(hash, scope, targetId, fileType, result.file_info, result.file_uuid, result.ttl);
    }
    return result;
  }
  /**
   * Send a media message (post upload) to a C2C or Group target.
   */
  async sendMediaMessage(scope, targetId, fileInfo, creds, opts) {
    const token = await this.tokenManager.getAccessToken(creds.appId, creds.clientSecret);
    const msgSeq = opts?.msgId ? getNextMsgSeq(opts.msgId) : 1;
    const path22 = messagePath(scope, targetId);
    return this.client.request(token, "POST", path22, {
      msg_type: 7,
      media: { file_info: fileInfo },
      msg_seq: msgSeq,
      ...opts?.content ? { content: opts.content } : {},
      ...opts?.msgId ? { msg_id: opts.msgId } : {}
    });
  }
};

// ../qqbot-nodejs/dist/protocol/api/messages.js
var MessageApi = class {
  client;
  tokenManager;
  markdownSupport;
  logger;
  messageSentHook = null;
  constructor(client, tokenManager, config) {
    this.client = client;
    this.tokenManager = tokenManager;
    this.markdownSupport = config.markdownSupport;
    this.logger = config.logger;
  }
  onMessageSent(callback) {
    this.messageSentHook = callback;
  }
  notifyMessageSent(refIdx, meta) {
    if (this.messageSentHook) {
      try {
        this.messageSentHook(refIdx, meta);
      } catch (err) {
        this.logger?.error?.(`[qqbot:messages] onMessageSent hook error: ${formatErrorMessage(err)}`);
      }
    }
  }
  async sendMessage(scope, targetId, content, creds, opts) {
    const token = await this.tokenManager.getAccessToken(creds.appId, creds.clientSecret);
    const msgSeq = opts?.msgId ? getNextMsgSeq(opts.msgId) : 1;
    const body = this.buildMessageBody(content, opts?.msgId, msgSeq, opts?.messageReference, opts?.inlineKeyboard);
    const path22 = messagePath(scope, targetId);
    return this.sendAndNotify(creds.appId, token, "POST", path22, body, { text: content });
  }
  async sendProactiveMessage(scope, targetId, content, creds) {
    if (!content?.trim()) {
      throw new Error("Proactive message content must not be empty");
    }
    const token = await this.tokenManager.getAccessToken(creds.appId, creds.clientSecret);
    const body = this.buildProactiveBody(content);
    const path22 = messagePath(scope, targetId);
    return this.sendAndNotify(creds.appId, token, "POST", path22, body, { text: content });
  }
  async sendChannelMessage(opts) {
    const token = await this.tokenManager.getAccessToken(opts.creds.appId, opts.creds.clientSecret);
    return this.client.request(token, "POST", channelMessagePath(opts.channelId), {
      content: opts.content,
      ...opts.msgId ? { msg_id: opts.msgId } : {}
    });
  }
  async sendDmMessage(opts) {
    const token = await this.tokenManager.getAccessToken(opts.creds.appId, opts.creds.clientSecret);
    return this.client.request(token, "POST", dmMessagePath(opts.guildId), {
      content: opts.content,
      ...opts.msgId ? { msg_id: opts.msgId } : {}
    });
  }
  /** Send a typing indicator to a C2C user. */
  async sendInputNotify(opts) {
    const inputSecond = opts.inputSecond ?? 60;
    const token = await this.tokenManager.getAccessToken(opts.creds.appId, opts.creds.clientSecret);
    const msgSeq = opts.msgId ? getNextMsgSeq(opts.msgId) : 1;
    const response = await this.client.request(token, "POST", messagePath("c2c", opts.openid), {
      msg_type: 6,
      input_notify: { input_type: 1, input_second: inputSecond },
      msg_seq: msgSeq,
      ...opts.msgId ? { msg_id: opts.msgId } : {}
    });
    return { refIdx: response.ext_info?.ref_idx };
  }
  async acknowledgeInteraction(interactionId, creds, code = 0, data) {
    const token = await this.tokenManager.getAccessToken(creds.appId, creds.clientSecret);
    const body = { code };
    if (data)
      body.data = data;
    await this.client.request(token, "PUT", interactionPath(interactionId), body);
  }
  /** Get the WebSocket gateway URL for the bot. */
  async getGatewayUrl(creds) {
    const token = await this.tokenManager.getAccessToken(creds.appId, creds.clientSecret);
    const data = await this.client.request(token, "GET", gatewayPath());
    return data.url;
  }
  /**
   * Send a C2C stream message chunk (`/v2/users/{openid}/stream_messages`).
   * Only supported for one-to-one chats.
   */
  async sendC2CStreamMessage(creds, openid, req4) {
    const token = await this.tokenManager.getAccessToken(creds.appId, creds.clientSecret);
    const path22 = streamMessagePath(openid);
    const body = {
      input_mode: req4.input_mode,
      input_state: req4.input_state,
      content_type: req4.content_type,
      content_raw: req4.content_raw,
      event_id: req4.event_id,
      msg_id: req4.msg_id,
      msg_seq: req4.msg_seq,
      index: req4.index
    };
    if (req4.stream_msg_id) {
      body.stream_msg_id = req4.stream_msg_id;
    }
    return this.client.request(token, "POST", path22, body);
  }
  /**
   * Raw message send — transparently forwards all fields to the QQ Open Platform API.
   *
   * This is the "escape hatch" for any message type not covered by the
   * higher-level helpers. Fields like `msg_type`, `markdown`, `ark`, `embed`,
   * `keyboard`, `media`, `message_reference`, `is_wakeup` etc. are passed through
   * as-is to `/v2/users/{openid}/messages` or `/v2/groups/{group_openid}/messages`.
   *
   * Auto-injects `msg_seq` if not provided.
   */
  async sendRaw(scope, targetId, creds, body) {
    const token = await this.tokenManager.getAccessToken(creds.appId, creds.clientSecret);
    const path22 = messagePath(scope, targetId);
    if (body.msg_seq === void 0) {
      body.msg_seq = body.msg_id ? getNextMsgSeq(body.msg_id) : 1;
    }
    if (body.msg_type === void 0) {
      if (body.markdown)
        body.msg_type = 2;
      else if (body.ark)
        body.msg_type = 3;
      else if (body.embed)
        body.msg_type = 4;
      else if (body.media)
        body.msg_type = 7;
      else
        body.msg_type = 0;
    }
    const cleaned = Object.fromEntries(Object.entries(body).filter(([, v]) => v !== void 0));
    return this.sendAndNotify(creds.appId, token, "POST", path22, cleaned, { text: cleaned.content ?? cleaned.markdown?.content });
  }
  /**
   * Send a message to a guild text channel.
   * Supports content, keyboard, message_reference, and arbitrary extra fields.
   */
  async sendChannelMessageRaw(channelId, creds, body) {
    const token = await this.tokenManager.getAccessToken(creds.appId, creds.clientSecret);
    const cleaned = Object.fromEntries(Object.entries(body).filter(([, v]) => v !== void 0));
    return this.client.request(token, "POST", channelMessagePath(channelId), cleaned);
  }
  /**
   * Send a DM (direct message) in a guild.
   */
  async sendDmMessageRaw(guildId, creds, body) {
    const token = await this.tokenManager.getAccessToken(creds.appId, creds.clientSecret);
    const cleaned = Object.fromEntries(Object.entries(body).filter(([, v]) => v !== void 0));
    return this.client.request(token, "POST", dmMessagePath(guildId), cleaned);
  }
  /**
   * Recall (delete) a message.
   */
  async recallMessage(scope, targetId, messageId, creds) {
    const token = await this.tokenManager.getAccessToken(creds.appId, creds.clientSecret);
    const path22 = `${messagePath(scope, targetId)}/${messageId}`;
    await this.client.request(token, "DELETE", path22);
  }
  async sendAndNotify(_appId, accessToken, method, path22, body, meta) {
    const result = await this.client.request(accessToken, method, path22, body);
    if (result.ext_info?.ref_idx && this.messageSentHook) {
      try {
        this.messageSentHook(result.ext_info.ref_idx, meta);
      } catch (err) {
        this.logger?.error?.(`[qqbot:messages] onMessageSent hook error: ${formatErrorMessage(err)}`);
      }
    }
    return result;
  }
  buildMessageBody(content, msgId, msgSeq, messageReference, inlineKeyboard) {
    const body = this.markdownSupport ? { markdown: { content }, msg_type: 2, msg_seq: msgSeq } : { content, msg_type: 0, msg_seq: msgSeq };
    if (msgId) {
      body.msg_id = msgId;
    }
    if (messageReference && !this.markdownSupport) {
      body.message_reference = { message_id: messageReference };
    }
    if (inlineKeyboard) {
      body.keyboard = inlineKeyboard;
    }
    return body;
  }
  buildProactiveBody(content) {
    return this.markdownSupport ? { markdown: { content }, msg_type: 2 } : { content, msg_type: 0 };
  }
};

// ../qqbot-nodejs/dist/protocol/api/token.js
var DEFAULT_TOKEN_BASE_URL = "https://bots.qq.com";
var TOKEN_PATH = "/app/getAppAccessToken";
var DEFAULT_TOKEN_TIMEOUT_MS = 1e4;
var FIVE_MINUTES_MS = 5 * 60 * 1e3;
var TokenManager = class {
  cache = /* @__PURE__ */ new Map();
  fetchPromises = /* @__PURE__ */ new Map();
  refreshControllers = /* @__PURE__ */ new Map();
  logger;
  resolveUserAgent;
  baseUrl;
  constructor(config) {
    this.logger = config?.logger;
    const ua = config?.userAgent ?? "qqbot-nodejs/unknown";
    this.resolveUserAgent = typeof ua === "function" ? ua : () => ua;
    this.baseUrl = config?.baseUrl ?? DEFAULT_TOKEN_BASE_URL;
  }
  async getAccessToken(appId, clientSecret) {
    const normalizedId = appId.trim();
    const cached = this.cache.get(normalizedId);
    const refreshAheadMs = cached ? Math.min(FIVE_MINUTES_MS, (cached.expiresAt - Date.now()) / 3) : 0;
    if (cached && Date.now() < cached.expiresAt - refreshAheadMs) {
      return cached.token;
    }
    let pending = this.fetchPromises.get(normalizedId);
    if (pending) {
      this.logger?.debug?.(`[qqbot:token:${normalizedId}] Fetch in progress, reusing promise`);
      return pending;
    }
    pending = (async () => {
      try {
        return await this.doFetchToken(normalizedId, clientSecret);
      } finally {
        this.fetchPromises.delete(normalizedId);
      }
    })();
    this.fetchPromises.set(normalizedId, pending);
    return pending;
  }
  clearCache(appId) {
    if (appId) {
      this.cache.delete(appId.trim());
      this.logger?.debug?.(`[qqbot:token:${appId}] Cache cleared`);
    } else {
      this.cache.clear();
      this.logger?.debug?.(`[token] All caches cleared`);
    }
  }
  getStatus(appId) {
    if (this.fetchPromises.has(appId)) {
      return { status: "refreshing", expiresAt: this.cache.get(appId)?.expiresAt ?? null };
    }
    const cached = this.cache.get(appId);
    if (!cached) {
      return { status: "none", expiresAt: null };
    }
    const remaining = cached.expiresAt - Date.now();
    const isValid = remaining > Math.min(FIVE_MINUTES_MS, remaining / 3);
    return { status: isValid ? "valid" : "expired", expiresAt: cached.expiresAt };
  }
  startBackgroundRefresh(appId, clientSecret, options) {
    if (this.refreshControllers.has(appId)) {
      this.logger?.info?.(`[qqbot:token:${appId}] Background refresh already running`);
      return;
    }
    const { refreshAheadMs = 5 * 60 * 1e3, randomOffsetMs = 30 * 1e3, minRefreshIntervalMs = 60 * 1e3, retryDelayMs = 5 * 1e3 } = options ?? {};
    const controller = new AbortController();
    this.refreshControllers.set(appId, controller);
    const { signal } = controller;
    const loop = async () => {
      this.logger?.info?.(`[qqbot:token:${appId}] Background refresh started`);
      while (!signal.aborted) {
        try {
          await this.getAccessToken(appId, clientSecret);
          const cached = this.cache.get(appId);
          if (cached) {
            const expiresIn = cached.expiresAt - Date.now();
            const randomOffset = Math.random() * randomOffsetMs;
            const refreshIn = Math.max(expiresIn - refreshAheadMs - randomOffset, minRefreshIntervalMs);
            this.logger?.debug?.(`[qqbot:token:${appId}] Next refresh in ${Math.round(refreshIn / 1e3)}s`);
            await this.abortableSleep(refreshIn, signal);
          } else {
            await this.abortableSleep(minRefreshIntervalMs, signal);
          }
        } catch (err) {
          if (signal.aborted) {
            break;
          }
          this.logger?.error?.(`[qqbot:token:${appId}] Background refresh failed: ${formatErrorMessage(err)}`);
          await this.abortableSleep(retryDelayMs, signal);
        }
      }
      this.refreshControllers.delete(appId);
      this.logger?.info?.(`[qqbot:token:${appId}] Background refresh stopped`);
    };
    loop().catch((err) => {
      if (this.refreshControllers.has(appId)) {
        this.refreshControllers.delete(appId);
        this.logger?.error?.(`[qqbot:token:${appId}] Background refresh crashed: ${formatErrorMessage(err)}`);
      }
    });
  }
  stopBackgroundRefresh(appId) {
    if (appId) {
      const ctrl = this.refreshControllers.get(appId);
      if (ctrl) {
        ctrl.abort();
        this.refreshControllers.delete(appId);
      }
    } else {
      for (const ctrl of this.refreshControllers.values()) {
        ctrl.abort();
      }
      this.refreshControllers.clear();
    }
  }
  isBackgroundRefreshRunning(appId) {
    if (appId) {
      return this.refreshControllers.has(appId);
    }
    return this.refreshControllers.size > 0;
  }
  async doFetchToken(appId, clientSecret) {
    const url = `${this.baseUrl}${TOKEN_PATH}`;
    this.logger?.debug?.(`[qqbot:token:${appId}] >>> POST ${url}`);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), DEFAULT_TOKEN_TIMEOUT_MS);
    let response;
    try {
      response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": this.resolveUserAgent()
        },
        body: JSON.stringify({ appId, clientSecret }),
        signal: controller.signal
      });
    } catch (err) {
      this.logger?.error?.(`[qqbot:token:${appId}] Network error: ${formatErrorMessage(err)}`);
      throw new Error(`Network error getting access_token: ${formatErrorMessage(err)}`, {
        cause: err
      });
    } finally {
      clearTimeout(timeout);
    }
    const traceId = response.headers.get("x-tps-trace-id") ?? "";
    this.logger?.debug?.(`[qqbot:token:${appId}] <<< ${response.status}${traceId ? ` | TraceId: ${traceId}` : ""}`);
    if (!response.ok) {
      const errorBody = await response.text().catch(() => "");
      throw new Error(`Token fetch failed: HTTP ${response.status}${errorBody ? ` \u2014 ${errorBody.slice(0, 200)}` : ""}`);
    }
    let data;
    try {
      const rawBody = await response.text();
      const logBody = rawBody.replace(/"access_token"\s*:\s*"[^"]+"/g, '"access_token": "***"');
      this.logger?.debug?.(`[qqbot:token:${appId}] <<< Body: ${logBody}`);
      data = JSON.parse(rawBody);
    } catch (err) {
      throw new Error(`Failed to parse access_token response: ${formatErrorMessage(err)}`, {
        cause: err
      });
    }
    if (!data.access_token) {
      throw new Error(`Failed to get access_token: ${JSON.stringify(data)}`);
    }
    const expiresAt = Date.now() + (data.expires_in ?? 7200) * 1e3;
    this.cache.set(appId, { token: data.access_token, expiresAt, appId });
    this.logger?.debug?.(`[qqbot:token:${appId}] Cached, expires at: ${new Date(expiresAt).toISOString()}`);
    return data.access_token;
  }
  abortableSleep(ms, signal) {
    return new Promise((resolve2, reject) => {
      if (signal.aborted) {
        reject(signal.reason ?? new DOMException("The operation was aborted", "AbortError"));
        return;
      }
      const timer = setTimeout(() => {
        signal.removeEventListener("abort", onAbort);
        resolve2();
      }, ms);
      const onAbort = () => {
        clearTimeout(timer);
        reject(signal.reason ?? new DOMException("The operation was aborted", "AbortError"));
      };
      signal.addEventListener("abort", onAbort, { once: true });
    });
  }
};

// ../../ws/wrapper.mjs
var import_stream = __toESM(require_stream(), 1);
var import_extension = __toESM(require_extension(), 1);
var import_permessage_deflate = __toESM(require_permessage_deflate(), 1);
var import_receiver = __toESM(require_receiver(), 1);
var import_sender = __toESM(require_sender(), 1);
var import_subprotocol = __toESM(require_subprotocol(), 1);
var import_websocket = __toESM(require_websocket(), 1);
var import_websocket_server = __toESM(require_websocket_server(), 1);
var wrapper_default = import_websocket.default;

// ../qqbot-nodejs/dist/protocol/gateway/codec.js
function decodeGatewayMessageData(data) {
  if (typeof data === "string") {
    return data;
  }
  if (Buffer.isBuffer(data)) {
    return data.toString("utf8");
  }
  if (Array.isArray(data) && data.every((chunk) => Buffer.isBuffer(chunk))) {
    return Buffer.concat(data).toString("utf8");
  }
  if (data instanceof ArrayBuffer) {
    return Buffer.from(data).toString("utf8");
  }
  if (ArrayBuffer.isView(data)) {
    return Buffer.from(data.buffer, data.byteOffset, data.byteLength).toString("utf8");
  }
  return "";
}
function readOptionalMessageSceneExt(event) {
  if (!("message_scene" in event)) {
    return void 0;
  }
  const scene = event.message_scene;
  return scene?.ext;
}

// ../qqbot-nodejs/dist/protocol/gateway/constants.js
var INTENTS = {
  GUILDS: 1 << 0,
  GUILD_MEMBERS: 1 << 1,
  PUBLIC_GUILD_MESSAGES: 1 << 30,
  DIRECT_MESSAGE: 1 << 12,
  GROUP_AND_C2C: 1 << 25,
  /** Button interaction callbacks (INTERACTION_CREATE). */
  INTERACTION: 1 << 26
};
var FULL_INTENTS = INTENTS.GUILDS | INTENTS.GUILD_MEMBERS | INTENTS.PUBLIC_GUILD_MESSAGES | INTENTS.DIRECT_MESSAGE | INTENTS.GROUP_AND_C2C | INTENTS.INTERACTION;
var RECONNECT_DELAYS = [1e3, 2e3, 5e3, 1e4, 3e4, 6e4];
var RATE_LIMIT_DELAY = 6e4;
var MAX_RECONNECT_ATTEMPTS = 100;
var MAX_QUICK_DISCONNECT_COUNT = 3;
var QUICK_DISCONNECT_THRESHOLD = 5e3;
var GatewayOp = {
  DISPATCH: 0,
  HEARTBEAT: 1,
  IDENTIFY: 2,
  RESUME: 6,
  RECONNECT: 7,
  INVALID_SESSION: 9,
  HELLO: 10,
  HEARTBEAT_ACK: 11
};
var GatewayCloseCode = {
  NORMAL: 1e3,
  AUTH_FAILED: 4004,
  INVALID_SESSION: 4006,
  SEQ_OUT_OF_RANGE: 4007,
  RATE_LIMITED: 4008,
  SESSION_TIMEOUT: 4009,
  SERVER_ERROR_START: 4900,
  SERVER_ERROR_END: 4913,
  INSUFFICIENT_INTENTS: 4914,
  DISALLOWED_INTENTS: 4915
};
var GatewayEvent = {
  READY: "READY",
  RESUMED: "RESUMED",
  // ── Message events ──
  C2C_MESSAGE_CREATE: "C2C_MESSAGE_CREATE",
  AT_MESSAGE_CREATE: "AT_MESSAGE_CREATE",
  DIRECT_MESSAGE_CREATE: "DIRECT_MESSAGE_CREATE",
  GROUP_AT_MESSAGE_CREATE: "GROUP_AT_MESSAGE_CREATE",
  GROUP_MESSAGE_CREATE: "GROUP_MESSAGE_CREATE",
  // ── Interaction ──
  INTERACTION_CREATE: "INTERACTION_CREATE",
  // ── Guild events (P1) ──
  GUILD_CREATE: "GUILD_CREATE",
  GUILD_UPDATE: "GUILD_UPDATE",
  GUILD_DELETE: "GUILD_DELETE",
  GUILD_MEMBER_ADD: "GUILD_MEMBER_ADD",
  GUILD_MEMBER_UPDATE: "GUILD_MEMBER_UPDATE",
  GUILD_MEMBER_REMOVE: "GUILD_MEMBER_REMOVE",
  CHANNEL_CREATE: "CHANNEL_CREATE",
  CHANNEL_UPDATE: "CHANNEL_UPDATE",
  CHANNEL_DELETE: "CHANNEL_DELETE",
  // ── Group/C2C lifecycle events (P1) ──
  GROUP_ADD_ROBOT: "GROUP_ADD_ROBOT",
  GROUP_DEL_ROBOT: "GROUP_DEL_ROBOT",
  GROUP_MSG_REJECT: "GROUP_MSG_REJECT",
  GROUP_MSG_RECEIVE: "GROUP_MSG_RECEIVE",
  FRIEND_ADD: "FRIEND_ADD",
  FRIEND_DEL: "FRIEND_DEL",
  C2C_MSG_REJECT: "C2C_MSG_REJECT",
  C2C_MSG_RECEIVE: "C2C_MSG_RECEIVE",
  // ── Reaction events ──
  MESSAGE_REACTION_ADD: "MESSAGE_REACTION_ADD",
  MESSAGE_REACTION_REMOVE: "MESSAGE_REACTION_REMOVE"
};

// ../qqbot-nodejs/dist/protocol/gateway/event-dispatcher.js
var REF_INDEX_KEY = "msg_idx";
function parseRefIndices(ext, msgType, msgElements) {
  let refMsgIdx;
  let msgIdx;
  if (Array.isArray(ext)) {
    for (const entry of ext) {
      if (typeof entry !== "string") {
        continue;
      }
      const eq = entry.indexOf("=");
      if (eq < 0) {
        continue;
      }
      const key = entry.slice(0, eq).trim();
      const val = entry.slice(eq + 1).trim();
      if (!val) {
        continue;
      }
      if (key === REF_INDEX_KEY) {
        msgIdx = val;
      } else if (key === "ref_msg_idx") {
        refMsgIdx = val;
      }
    }
  }
  if (msgType === 103 && Array.isArray(msgElements)) {
    for (const el of msgElements) {
      if (el?.msg_idx) {
        refMsgIdx = el.msg_idx;
        break;
      }
    }
  }
  return { refMsgIdx, msgIdx };
}
function dispatchEvent(eventType, data, _accountId, _log) {
  if (eventType === GatewayEvent.READY) {
    const d3 = data;
    return { action: "ready", data, sessionId: d3.session_id };
  }
  if (eventType === GatewayEvent.RESUMED) {
    return { action: "resumed", data };
  }
  if (eventType === GatewayEvent.C2C_MESSAGE_CREATE) {
    const ev = data;
    const refs = parseRefIndices(ev.message_scene?.ext, ev.message_type, ev.msg_elements);
    return {
      action: "message",
      msg: {
        rawEventType: eventType,
        kind: "c2c",
        senderId: ev.author.user_openid,
        content: ev.content,
        messageId: ev.id,
        timestamp: ev.timestamp,
        attachments: ev.attachments,
        refMsgIdx: refs.refMsgIdx,
        msgIdx: refs.msgIdx,
        msgType: ev.message_type,
        messageScene: ev.message_scene,
        msgElements: ev.msg_elements,
        raw: ev
      }
    };
  }
  if (eventType === GatewayEvent.AT_MESSAGE_CREATE) {
    const ev = data;
    const refs = parseRefIndices(readOptionalMessageSceneExt(ev));
    return {
      action: "message",
      msg: {
        rawEventType: eventType,
        kind: "guild",
        senderId: ev.author.id,
        senderName: ev.author.username,
        content: ev.content,
        messageId: ev.id,
        timestamp: ev.timestamp,
        channelId: ev.channel_id,
        guildId: ev.guild_id,
        attachments: ev.attachments,
        refMsgIdx: refs.refMsgIdx,
        msgIdx: refs.msgIdx,
        raw: ev
      }
    };
  }
  if (eventType === GatewayEvent.DIRECT_MESSAGE_CREATE) {
    const ev = data;
    const refs = parseRefIndices(readOptionalMessageSceneExt(ev));
    return {
      action: "message",
      msg: {
        rawEventType: eventType,
        kind: "dm",
        senderId: ev.author.id,
        senderName: ev.author.username,
        content: ev.content,
        messageId: ev.id,
        timestamp: ev.timestamp,
        guildId: ev.guild_id,
        attachments: ev.attachments,
        refMsgIdx: refs.refMsgIdx,
        msgIdx: refs.msgIdx,
        raw: ev
      }
    };
  }
  if (eventType === GatewayEvent.GROUP_AT_MESSAGE_CREATE || eventType === GatewayEvent.GROUP_MESSAGE_CREATE) {
    const ev = data;
    const refs = parseRefIndices(ev.message_scene?.ext, ev.message_type, ev.msg_elements);
    return {
      action: "message",
      msg: {
        rawEventType: eventType,
        kind: "group",
        senderId: ev.author.member_openid,
        senderName: ev.author.username,
        senderIsBot: ev.author.bot,
        content: ev.content,
        messageId: ev.id,
        timestamp: ev.timestamp,
        groupOpenid: ev.group_openid,
        attachments: ev.attachments,
        refMsgIdx: refs.refMsgIdx,
        msgIdx: refs.msgIdx,
        msgType: ev.message_type,
        mentions: ev.mentions,
        messageScene: ev.message_scene,
        msgElements: ev.msg_elements,
        raw: ev
      }
    };
  }
  if (eventType === GatewayEvent.INTERACTION_CREATE) {
    return { action: "interaction", event: data };
  }
  return { action: "raw", type: eventType, data };
}

// ../qqbot-nodejs/dist/protocol/gateway/reconnect.js
var ReconnectState = class {
  accountId;
  log;
  attempts = 0;
  lastConnectTime = 0;
  quickDisconnectCount = 0;
  constructor(accountId, log4) {
    this.accountId = accountId;
    this.log = log4;
  }
  onConnected() {
    this.attempts = 0;
    this.lastConnectTime = Date.now();
  }
  isExhausted() {
    return this.attempts >= MAX_RECONNECT_ATTEMPTS;
  }
  getNextDelay(customDelay) {
    const delay = customDelay ?? RECONNECT_DELAYS[Math.min(this.attempts, RECONNECT_DELAYS.length - 1)];
    this.attempts++;
    this.log?.debug?.(`[${this.accountId}] Reconnecting in ${delay}ms (attempt ${this.attempts})`);
    return delay;
  }
  handleClose(code, isAborted) {
    if (code === GatewayCloseCode.INSUFFICIENT_INTENTS || code === GatewayCloseCode.DISALLOWED_INTENTS) {
      const reason = code === GatewayCloseCode.INSUFFICIENT_INTENTS ? "offline/sandbox-only" : "banned";
      this.log?.error(`[${this.accountId}] Bot is ${reason}. Please contact QQ platform.`);
      return {
        shouldReconnect: false,
        clearSession: false,
        refreshToken: false,
        fatal: true,
        reason
      };
    }
    if (code === GatewayCloseCode.AUTH_FAILED) {
      this.log?.info(`[${this.accountId}] Invalid token (4004), will refresh token and reconnect`);
      return {
        shouldReconnect: !isAborted,
        clearSession: false,
        refreshToken: true,
        fatal: false,
        reason: "invalid token (4004)"
      };
    }
    if (code === GatewayCloseCode.RATE_LIMITED) {
      this.log?.info(`[${this.accountId}] Rate limited (4008), waiting ${RATE_LIMIT_DELAY}ms`);
      return {
        shouldReconnect: !isAborted,
        reconnectDelay: RATE_LIMIT_DELAY,
        clearSession: false,
        refreshToken: false,
        fatal: false,
        reason: "rate limited (4008)"
      };
    }
    if (code === GatewayCloseCode.INVALID_SESSION || code === GatewayCloseCode.SEQ_OUT_OF_RANGE || code === GatewayCloseCode.SESSION_TIMEOUT) {
      const codeDesc = {
        [GatewayCloseCode.INVALID_SESSION]: "session no longer valid",
        [GatewayCloseCode.SEQ_OUT_OF_RANGE]: "invalid seq on resume",
        [GatewayCloseCode.SESSION_TIMEOUT]: "session timed out"
      };
      this.log?.info(`[${this.accountId}] Error ${code} (${codeDesc[code]}), will re-identify`);
      return {
        shouldReconnect: !isAborted,
        clearSession: true,
        refreshToken: true,
        fatal: false,
        reason: codeDesc[code]
      };
    }
    if (code >= GatewayCloseCode.SERVER_ERROR_START && code <= GatewayCloseCode.SERVER_ERROR_END) {
      this.log?.info(`[${this.accountId}] Internal error (${code}), will re-identify`);
      return {
        shouldReconnect: !isAborted && code !== GatewayCloseCode.NORMAL,
        clearSession: true,
        refreshToken: true,
        fatal: false,
        reason: `internal error (${code})`
      };
    }
    const connectionDuration = Date.now() - this.lastConnectTime;
    if (connectionDuration < QUICK_DISCONNECT_THRESHOLD && this.lastConnectTime > 0) {
      this.quickDisconnectCount++;
      this.log?.debug?.(`[${this.accountId}] Quick disconnect detected (${connectionDuration}ms), count: ${this.quickDisconnectCount}`);
      if (this.quickDisconnectCount >= MAX_QUICK_DISCONNECT_COUNT) {
        this.log?.error(`[${this.accountId}] Too many quick disconnects. This may indicate a permission issue.`);
        this.quickDisconnectCount = 0;
        return {
          shouldReconnect: !isAborted && code !== 1e3,
          reconnectDelay: RATE_LIMIT_DELAY,
          clearSession: false,
          refreshToken: false,
          fatal: false,
          reason: "too many quick disconnects"
        };
      }
    } else {
      this.quickDisconnectCount = 0;
    }
    return {
      shouldReconnect: !isAborted && code !== GatewayCloseCode.NORMAL,
      clearSession: false,
      refreshToken: false,
      fatal: false,
      reason: `close code ${code}`
    };
  }
};

// ../qqbot-nodejs/dist/protocol/gateway/gateway-connection.js
var GatewayConnection = class {
  isAborted = false;
  currentWs = null;
  heartbeatInterval = null;
  sessionId = null;
  lastSeq = null;
  isConnecting = false;
  reconnectTimer = null;
  shouldRefreshToken = false;
  reconnect;
  opts;
  resolveUserAgent;
  constructor(opts) {
    this.opts = opts;
    this.reconnect = new ReconnectState(opts.account.accountId, opts.log);
    const ua = opts.userAgent ?? "qqbot-nodejs/unknown";
    this.resolveUserAgent = typeof ua === "function" ? ua : () => ua;
  }
  /** Start the connection loop. Resolves when abortSignal fires. */
  async start() {
    this.restoreSession();
    this.registerAbortHandler();
    await this.connect();
    return new Promise((resolve2) => {
      this.opts.abortSignal.addEventListener("abort", () => resolve2());
    });
  }
  // ============ Session persistence ============
  restoreSession() {
    const saved = this.opts.session?.load();
    if (saved) {
      this.sessionId = saved.sessionId;
      this.lastSeq = saved.lastSeq;
      this.opts.log?.info?.(`[${this.opts.account.accountId}] Restored session: sessionId=${saved.sessionId}, lastSeq=${saved.lastSeq}`);
    }
  }
  saveCurrentSession() {
    if (!this.sessionId || !this.opts.session) {
      return;
    }
    this.opts.session.save({
      sessionId: this.sessionId,
      lastSeq: this.lastSeq
    });
  }
  // ============ Abort + cleanup ============
  registerAbortHandler() {
    this.opts.abortSignal.addEventListener("abort", () => {
      this.isAborted = true;
      if (this.reconnectTimer) {
        clearTimeout(this.reconnectTimer);
        this.reconnectTimer = null;
      }
      this.cleanup();
    });
  }
  cleanup() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
    if (this.currentWs && (this.currentWs.readyState === wrapper_default.OPEN || this.currentWs.readyState === wrapper_default.CONNECTING)) {
      this.currentWs.close();
    }
    this.currentWs = null;
  }
  // ============ Reconnect ============
  scheduleReconnect(customDelay) {
    if (this.isAborted || this.reconnect.isExhausted()) {
      this.opts.log?.error(`[${this.opts.account.accountId}] Max reconnect attempts reached or aborted`);
      return;
    }
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    const delay = this.reconnect.getNextDelay(customDelay);
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      if (!this.isAborted) {
        void this.connect();
      }
    }, delay);
  }
  // ============ Connect ============
  async connect() {
    const { log: log4, account } = this.opts;
    if (this.isConnecting) {
      log4?.debug?.(`[${account.accountId}] Already connecting, skip`);
      return;
    }
    this.isConnecting = true;
    try {
      this.cleanup();
      if (this.shouldRefreshToken) {
        log4?.debug?.(`[${account.accountId}] Refreshing token...`);
        this.opts.clearTokenCache?.();
        this.shouldRefreshToken = false;
      }
      const accessToken = await this.opts.getAccessToken();
      log4?.info(`[${account.accountId}] \u2705 Access token obtained`);
      const gatewayUrl = await this.opts.getGatewayUrl(accessToken);
      log4?.info(`[${account.accountId}] Connecting to ${gatewayUrl}`);
      const ws = new wrapper_default(gatewayUrl, {
        headers: { "User-Agent": this.resolveUserAgent() }
      });
      this.currentWs = ws;
      ws.on("open", () => {
        log4?.info(`[${account.accountId}] WebSocket connected`);
        this.isConnecting = false;
        this.reconnect.onConnected();
      });
      ws.on("message", async (data) => {
        try {
          const rawData = decodeGatewayMessageData(data);
          const payload = JSON.parse(rawData);
          const { op, d: d3, s, t } = payload;
          if (s) {
            this.lastSeq = s;
            this.saveCurrentSession();
          }
          switch (op) {
            case GatewayOp.HELLO:
              this.handleHello(ws, d3, accessToken);
              break;
            case GatewayOp.DISPATCH: {
              log4?.debug?.(`[${account.accountId}] Dispatch event: t=${t} payload=${previewPayload(d3)}`);
              const result = dispatchEvent(t ?? "", d3, account.accountId, log4);
              if (result.action === "ready") {
                this.sessionId = result.sessionId;
                this.saveCurrentSession();
                this.opts.onReady?.(result.data);
              } else if (result.action === "resumed") {
                (this.opts.onResumed ?? this.opts.onReady)?.(result.data);
                this.saveCurrentSession();
              } else if (result.action === "interaction") {
                if (this.opts.onInteraction) {
                  void Promise.resolve(this.opts.onInteraction(result.event));
                } else if (this.opts.onRawEvent) {
                  void Promise.resolve(this.opts.onRawEvent(payload.t, payload.d));
                }
              } else if (result.action === "message") {
                void Promise.resolve(this.opts.onMessage(result.msg));
              } else if (result.action === "raw") {
                if (this.opts.onRawEvent) {
                  void Promise.resolve(this.opts.onRawEvent(result.type, result.data));
                }
              }
              break;
            }
            case GatewayOp.HEARTBEAT_ACK:
              break;
            case GatewayOp.RECONNECT:
              this.cleanup();
              this.scheduleReconnect();
              break;
            case GatewayOp.INVALID_SESSION: {
              const canResume = d3;
              if (!canResume) {
                this.sessionId = null;
                this.lastSeq = null;
                this.opts.session?.clear();
                this.shouldRefreshToken = true;
              }
              this.cleanup();
              this.scheduleReconnect(3e3);
              break;
            }
          }
        } catch (err) {
          log4?.error(`[${account.accountId}] Message parse error: ${err instanceof Error ? err.message : String(err)}`);
        }
      });
      ws.on("close", (code, reason) => {
        log4?.info(`[${account.accountId}] WebSocket closed: ${code} ${reason.toString()}`);
        this.isConnecting = false;
        this.handleClose(code);
      });
      ws.on("error", (err) => {
        log4?.error(`[${account.accountId}] WebSocket error: ${err.message}`);
        this.opts.onError?.(err);
      });
    } catch (err) {
      this.isConnecting = false;
      const errMsg = err instanceof Error ? err.message : String(err);
      log4?.error(`[${account.accountId}] Connection failed: ${errMsg}`);
      if (errMsg.includes("Too many requests") || errMsg.includes("100001")) {
        this.scheduleReconnect(RATE_LIMIT_DELAY);
      } else {
        this.scheduleReconnect();
      }
    }
  }
  // ============ Protocol handlers ============
  handleHello(ws, d3, accessToken) {
    const intents = this.opts.intents ?? FULL_INTENTS;
    if (this.sessionId && this.lastSeq !== null) {
      ws.send(JSON.stringify({
        op: GatewayOp.RESUME,
        d: {
          token: `QQBot ${accessToken}`,
          session_id: this.sessionId,
          seq: this.lastSeq
        }
      }));
    } else {
      ws.send(JSON.stringify({
        op: GatewayOp.IDENTIFY,
        d: {
          token: `QQBot ${accessToken}`,
          intents,
          shard: [0, 1]
        }
      }));
    }
    const interval = d3.heartbeat_interval;
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
    this.heartbeatInterval = setInterval(() => {
      if (ws.readyState === wrapper_default.OPEN) {
        ws.send(JSON.stringify({ op: GatewayOp.HEARTBEAT, d: this.lastSeq }));
      }
    }, interval);
  }
  handleClose(code) {
    const action = this.reconnect.handleClose(code, this.isAborted);
    if (action.clearSession) {
      this.sessionId = null;
      this.lastSeq = null;
      this.opts.session?.clear();
    }
    if (action.refreshToken) {
      this.shouldRefreshToken = true;
    }
    this.cleanup();
    if (action.fatal) {
      return;
    }
    if (action.shouldReconnect) {
      this.scheduleReconnect(action.reconnectDelay);
    }
  }
};
function previewPayload(data) {
  if (data === void 0)
    return "undefined";
  if (data === null)
    return "null";
  try {
    const s = JSON.stringify(data);
    return s === void 0 ? "(non-serializable)" : s;
  } catch {
    return "(non-serializable)";
  }
}

// ../qqbot-nodejs/dist/protocol/transport/webhook-verify.js
var crypto2 = __toESM(require("crypto"), 1);
function deriveSeed(botSecret) {
  let seed = botSecret;
  while (seed.length < 32) {
    seed = seed + seed;
  }
  return Buffer.from(seed.slice(0, 32), "utf-8");
}
function getKeyPair(botSecret) {
  const seed = deriveSeed(botSecret);
  const privateKey = crypto2.createPrivateKey({
    key: Buffer.concat([
      // Ed25519 PKCS8 DER prefix for 32-byte seed
      Buffer.from("302e020100300506032b657004220420", "hex"),
      seed
    ]),
    format: "der",
    type: "pkcs8"
  });
  const publicKey = crypto2.createPublicKey(privateKey);
  return { privateKey, publicKey };
}
function ed25519Sign(botSecret, message) {
  const { privateKey } = getKeyPair(botSecret);
  const signature = crypto2.sign(null, message, privateKey);
  return signature.toString("hex");
}
function verifyWebhookSignature(params) {
  const { body, timestamp, signature, botSecret } = params;
  try {
    const { publicKey } = getKeyPair(botSecret);
    const message = Buffer.concat([
      Buffer.from(timestamp, "utf-8"),
      body
    ]);
    const sigBuffer = Buffer.from(signature, "hex");
    return crypto2.verify(null, message, publicKey, sigBuffer);
  } catch {
    return false;
  }
}
function signValidationResponse(params) {
  const { plainToken, eventTs, botSecret } = params;
  const message = Buffer.from(eventTs + plainToken, "utf-8");
  const signature = ed25519Sign(botSecret, message);
  return {
    plain_token: plainToken,
    signature
  };
}

// ../qqbot-nodejs/dist/protocol/transport/webhook-server-node.js
var http = __toESM(require("http"), 1);
var NodeHttpWebhookServer = class {
  server = null;
  async listen(port, path22, handler) {
    return new Promise((resolve2, reject) => {
      const server = http.createServer(async (req4, res) => {
        if (req4.method !== "POST" || req4.url !== path22) {
          res.writeHead(404, { "Content-Type": "text/plain" });
          res.end("Not Found");
          return;
        }
        const chunks = [];
        req4.on("data", (chunk) => chunks.push(chunk));
        req4.on("end", async () => {
          try {
            const body = Buffer.concat(chunks);
            const headers = {};
            for (const [key, value] of Object.entries(req4.headers)) {
              headers[key.toLowerCase()] = value;
            }
            const response = await handler({ body, headers });
            res.writeHead(response.status, {
              "Content-Type": "application/json",
              ...response.headers ?? {}
            });
            res.end(response.body);
          } catch (_err) {
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.end("Internal Server Error");
          }
        });
      });
      server.on("error", reject);
      server.listen(port, () => {
        this.server = server;
        resolve2();
      });
    });
  }
  close() {
    if (this.server) {
      this.server.close();
      this.server = null;
    }
  }
};

// ../qqbot-nodejs/dist/protocol/transport/webhook.js
var OP_DISPATCH = 0;
var OP_HTTP_CALLBACK_ACK = 12;
var OP_VALIDATION = 13;
var WebhookTransport = class {
  opts;
  callbacks;
  log;
  server;
  accountId;
  stopped = false;
  stopResolve = null;
  constructor(opts, callbacks) {
    this.opts = opts;
    this.callbacks = callbacks;
    this.log = opts.log;
    this.server = opts.server ?? new NodeHttpWebhookServer();
    this.accountId = opts.accountId ?? opts.appId;
  }
  async start() {
    const port = this.opts.port ?? 8080;
    const path22 = this.opts.path ?? "/";
    this.log?.info?.(`[webhook] starting on port ${port}, path ${path22}`);
    await this.server.listen(port, path22, (req4) => this.handleRequest(req4));
    this.log?.info?.(`[webhook] listening on :${port}${path22}`);
    this.callbacks.onReady?.({ transport: "webhook", port, path: path22 });
    if (this.opts.abortSignal) {
      await new Promise((resolve2) => {
        if (this.opts.abortSignal.aborted) {
          resolve2();
          return;
        }
        this.stopResolve = resolve2;
        this.opts.abortSignal.addEventListener("abort", () => this.stop(), { once: true });
      });
    } else {
      await new Promise((resolve2) => {
        this.stopResolve = resolve2;
      });
    }
  }
  stop() {
    if (this.stopped)
      return;
    this.stopped = true;
    this.server.close();
    this.log?.info?.(`[webhook] stopped`);
    this.stopResolve?.();
  }
  // ============ Request handler ============
  async handleRequest(req4) {
    let payload;
    try {
      payload = JSON.parse(req4.body.toString("utf-8"));
    } catch {
      this.log?.warn?.(`[webhook] invalid JSON body`);
      return { status: 400, body: JSON.stringify({ error: "invalid json" }) };
    }
    if (payload.op === OP_VALIDATION) {
      return this.handleValidation(payload);
    }
    const timestamp = getHeader(req4.headers, "x-signature-timestamp") ?? "";
    const signature = getHeader(req4.headers, "x-signature-ed25519") ?? "";
    if (!timestamp || !signature) {
      this.log?.warn?.(`[webhook] missing signature headers`);
      return { status: 401, body: JSON.stringify({ error: "missing signature" }) };
    }
    const valid = verifyWebhookSignature({
      body: req4.body,
      timestamp,
      signature,
      botSecret: this.opts.appSecret
    });
    if (!valid) {
      this.log?.warn?.(`[webhook] signature verification failed`);
      return { status: 401, body: JSON.stringify({ error: "invalid signature" }) };
    }
    if (payload.op === OP_DISPATCH) {
      this.handleDispatch(payload).catch((err) => {
        this.log?.error?.(`[webhook] dispatch error: ${err instanceof Error ? err.message : String(err)}`);
      });
    }
    return {
      status: 200,
      body: JSON.stringify({ op: OP_HTTP_CALLBACK_ACK, d: 0 })
    };
  }
  // ============ Validation handler (op:13) ============
  handleValidation(payload) {
    const d3 = payload.d;
    if (!d3?.plain_token || !d3?.event_ts) {
      this.log?.warn?.(`[webhook] validation missing plain_token or event_ts`);
      return { status: 400, body: JSON.stringify({ error: "invalid validation" }) };
    }
    this.log?.info?.(`[webhook] handling callback URL validation`);
    const response = signValidationResponse({
      plainToken: d3.plain_token,
      eventTs: d3.event_ts,
      botSecret: this.opts.appSecret
    });
    return {
      status: 200,
      body: JSON.stringify(response)
    };
  }
  // ============ Dispatch handler (op:0) ============
  async handleDispatch(payload) {
    const eventType = payload.t ?? "";
    const data = payload.d;
    this.log?.debug?.(`[webhook] dispatch event: t=${eventType} payload=${JSON.stringify(data)}`);
    const result = dispatchEvent(eventType, data, this.accountId, this.log);
    switch (result.action) {
      case "ready":
        this.callbacks.onReady?.(result.data);
        break;
      case "resumed":
        this.callbacks.onResumed?.(result.data);
        break;
      case "message":
        try {
          await this.callbacks.onMessage(result.msg);
        } catch (err) {
          this.callbacks.onError?.(err instanceof Error ? err : new Error(String(err)));
        }
        break;
      case "interaction":
        try {
          await this.callbacks.onInteraction?.(result.event);
        } catch (err) {
          this.callbacks.onError?.(err instanceof Error ? err : new Error(String(err)));
        }
        break;
      case "ignore":
        break;
    }
  }
};
function getHeader(headers, key) {
  const val = headers[key];
  if (Array.isArray(val))
    return val[0];
  return val;
}

// ../qqbot-nodejs/dist/protocol/utils/upload-cache.js
var crypto3 = __toESM(require("crypto"), 1);
var MAX_CACHE_SIZE = 500;
function computeFileHash(data) {
  return crypto3.createHash("md5").update(data).digest("hex");
}
function buildCacheKey(contentHash, scope, targetId, fileType) {
  return `${contentHash}:${scope}:${targetId}:${fileType}`;
}
var UploadCache = class {
  cache = /* @__PURE__ */ new Map();
  logger;
  constructor(options) {
    this.logger = options?.logger;
  }
  computeHash(data) {
    return computeFileHash(data);
  }
  get(contentHash, scope, targetId, fileType) {
    const key = buildCacheKey(contentHash, scope, targetId, fileType);
    const entry = this.cache.get(key);
    if (!entry) {
      return null;
    }
    if (Date.now() >= entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    this.logger?.debug?.(`[upload-cache] HIT key=${key.slice(0, 40)}... uuid=${entry.fileUuid}`);
    return entry.fileInfo;
  }
  set(contentHash, scope, targetId, fileType, fileInfo, fileUuid, ttl) {
    if (this.cache.size >= MAX_CACHE_SIZE) {
      const now = Date.now();
      for (const [k, v] of this.cache) {
        if (now >= v.expiresAt) {
          this.cache.delete(k);
        }
      }
      if (this.cache.size >= MAX_CACHE_SIZE) {
        const keys = Array.from(this.cache.keys());
        for (let i = 0; i < keys.length / 2; i++) {
          this.cache.delete(keys[i]);
        }
      }
    }
    const key = buildCacheKey(contentHash, scope, targetId, fileType);
    const safetyMargin = 60;
    const effectiveTtl = Math.max(ttl - safetyMargin, 10);
    this.cache.set(key, {
      fileInfo,
      fileUuid,
      expiresAt: Date.now() + effectiveTtl * 1e3
    });
    this.logger?.debug?.(`[upload-cache] SET key=${key.slice(0, 40)}... ttl=${effectiveTtl}s uuid=${fileUuid}`);
  }
  stats() {
    return { size: this.cache.size, maxSize: MAX_CACHE_SIZE };
  }
  clear() {
    this.cache.clear();
    this.logger?.debug?.(`[upload-cache] cleared`);
  }
};

// ../qqbot-nodejs/dist/streaming.js
var DEFAULT_THROTTLE_MS = 500;
var MIN_THROTTLE_MS = 300;
var MAX_FLUSH_RETRIES = 3;
var RATE_LIMIT_BASE_DELAY_MS = 1e3;
var StreamSession = class {
  api;
  opts;
  throttleMs;
  eventId;
  streamMsgId;
  index = 0;
  /**
   * `msg_seq` for the current stream session. QQ open platform expects all
   * frames in one stream to share the same `msg_seq` (only `index` advances).
   */
  msgSeq = null;
  lastFlushAt = 0;
  lastSentText = "";
  pendingText = "";
  pendingTimer = null;
  flushInProgress = false;
  flushPromise = null;
  isCompleted = false;
  constructor(api, opts) {
    this.api = api;
    this.opts = opts;
    this.throttleMs = Math.max(opts.throttleMs ?? DEFAULT_THROTTLE_MS, MIN_THROTTLE_MS);
    this.eventId = opts.eventId ?? opts.msgId;
  }
  /**
   * Update the current full message text. Will be sent at most once per
   * throttle window.
   */
  async update(fullText) {
    if (this.isCompleted) {
      return;
    }
    this.pendingText = fullText;
    const now = Date.now();
    const elapsed = now - this.lastFlushAt;
    if (this.flushInProgress) {
      return;
    }
    if (elapsed >= this.throttleMs) {
      await this.flush(StreamInputState.GENERATING);
      return;
    }
    if (!this.pendingTimer) {
      const wait = this.throttleMs - elapsed;
      this.pendingTimer = setTimeout(() => {
        this.pendingTimer = null;
        if (!this.isCompleted) {
          this.flush(StreamInputState.GENERATING).catch((err) => {
            this.opts.logger?.error?.(`[qqbot:stream] throttle flush error: ${formatErrorMessage(err)}`);
          });
        }
      }, wait);
    }
  }
  /** Mark the stream as DONE. Sends a final frame with the latest text. */
  async complete() {
    if (this.isCompleted) {
      return void 0;
    }
    this.isCompleted = true;
    if (this.pendingTimer) {
      clearTimeout(this.pendingTimer);
      this.pendingTimer = null;
    }
    if (this.flushPromise) {
      await this.flushPromise.catch(() => {
      });
    }
    return this.flush(StreamInputState.DONE);
  }
  /** Force-cancel without sending a DONE frame (caller must clean up). */
  cancel() {
    this.isCompleted = true;
    if (this.pendingTimer) {
      clearTimeout(this.pendingTimer);
      this.pendingTimer = null;
    }
  }
  // ============ Internal ============
  async flush(state) {
    if (this.flushInProgress) {
      return void 0;
    }
    if (this.pendingText === this.lastSentText && state !== StreamInputState.DONE) {
      return void 0;
    }
    this.flushInProgress = true;
    const promise = this.doFlush(state);
    this.flushPromise = promise;
    return promise;
  }
  async doFlush(state) {
    let flushFailed = false;
    try {
      const text = this.pendingText;
      if (this.msgSeq === null) {
        this.msgSeq = getNextMsgSeq(this.opts.msgId);
      }
      const currentIndex = this.index++;
      const req4 = {
        input_mode: StreamInputMode.REPLACE,
        input_state: state,
        content_type: StreamContentType.MARKDOWN,
        content_raw: text,
        event_id: this.eventId,
        msg_id: this.opts.msgId,
        msg_seq: this.msgSeq,
        index: currentIndex
      };
      if (this.streamMsgId) {
        req4.stream_msg_id = this.streamMsgId;
      }
      const resp = await this.sendWithRetry(req4);
      if (resp?.id && !this.streamMsgId) {
        this.streamMsgId = resp.id;
      }
      this.lastSentText = text;
      this.lastFlushAt = Date.now();
      return resp;
    } catch (err) {
      flushFailed = true;
      this.opts.logger?.error?.(`[qqbot:stream] flush failed (state=${state}): ${formatErrorMessage(err)}`);
      throw err;
    } finally {
      this.flushInProgress = false;
      if (!flushFailed && !this.isCompleted && this.pendingText !== this.lastSentText && !this.pendingTimer && state !== StreamInputState.DONE) {
        await this.flush(StreamInputState.GENERATING);
      }
    }
  }
  /**
   * Send a stream message with exponential backoff on rate-limit errors.
   * QQ returns err_code 50002 or HTTP 429 when rate-limited.
   */
  async sendWithRetry(req4) {
    for (let attempt = 0; attempt <= MAX_FLUSH_RETRIES; attempt++) {
      try {
        return await this.api.sendC2CStreamMessage(this.opts.creds, this.opts.openid, req4);
      } catch (err) {
        if (!this.isRateLimitError(err) || attempt >= MAX_FLUSH_RETRIES) {
          throw err;
        }
        const delay = RATE_LIMIT_BASE_DELAY_MS * Math.pow(2, attempt);
        this.opts.logger?.debug?.(`[qqbot:stream] rate limited, retry ${attempt + 1}/${MAX_FLUSH_RETRIES} after ${delay}ms`);
        await new Promise((r) => setTimeout(r, delay));
        req4.index = this.index++;
      }
    }
    return void 0;
  }
  /** Check if an error is a rate-limit error (QQ err_code 50002 or HTTP 429). */
  isRateLimitError(err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("rate limit"))
      return true;
    const code = err?.code ?? err?.err_code;
    if (code === 50002 || code === 429)
      return true;
    return false;
  }
};

// ../qqbot-nodejs/dist/QQBot.js
var MsgType = {
  /** Plain text. */
  TEXT: 0,
  /** Markdown. */
  MARKDOWN: 2,
  /** Ark template message. */
  ARK: 3,
  /** Embed message. */
  EMBED: 4,
  /** Rich media (image/video/voice/file). */
  MEDIA: 7
};
var noopLogger = {
  info: () => {
  },
  error: () => {
  },
  warn: () => {
  },
  debug: () => {
  }
};
var QQBot = class {
  // Public protocol primitives — exposed for advanced users.
  tokenManager;
  apiClient;
  messageApi;
  mediaApi;
  chunkedMediaApi;
  opts;
  logger;
  creds;
  account;
  userAgent;
  uploadCache;
  middlewares = [];
  handlers = {
    ready: /* @__PURE__ */ new Set(),
    resumed: /* @__PURE__ */ new Set(),
    error: /* @__PURE__ */ new Set(),
    message: /* @__PURE__ */ new Set(),
    interaction: /* @__PURE__ */ new Set(),
    rawEvent: /* @__PURE__ */ new Set()
  };
  gateway = null;
  abortController = null;
  _apiGateway = null;
  constructor(options) {
    if (!options.appId) {
      throw new Error("QQBot: appId is required");
    }
    if (!options.appSecret) {
      throw new Error("QQBot: appSecret is required");
    }
    this.opts = options;
    this.logger = options.logger ?? noopLogger;
    this.userAgent = options.userAgent ?? `qqbot-nodejs/0.1.0 (Node/${process.versions.node})`;
    this.creds = {
      appId: options.appId,
      clientSecret: options.appSecret
    };
    this.account = {
      accountId: options.accountId ?? options.appId,
      appId: options.appId,
      clientSecret: options.appSecret,
      markdownSupport: options.markdownSupport === true
    };
    this.uploadCache = options.uploadCache ?? new UploadCache({ logger: this.logger });
    this.apiClient = new ApiClient({
      logger: this.logger,
      userAgent: this.userAgent,
      baseUrl: options.baseUrl
    });
    this.tokenManager = new TokenManager({
      logger: this.logger,
      userAgent: this.userAgent,
      baseUrl: options.tokenBaseUrl
    });
    this.messageApi = new MessageApi(this.apiClient, this.tokenManager, {
      markdownSupport: options.markdownSupport === true,
      logger: this.logger
    });
    const cacheAdapter = {
      computeHash: (data) => this.uploadCache.computeHash(data),
      get: (hash, scope, targetId, fileType) => this.uploadCache.get(hash, scope, targetId, fileType),
      set: (hash, scope, targetId, fileType, fileInfo, fileUuid, ttl) => this.uploadCache.set(hash, scope, targetId, fileType, fileInfo, fileUuid, ttl)
    };
    this.mediaApi = new MediaApi(this.apiClient, this.tokenManager, {
      logger: this.logger,
      uploadCache: cacheAdapter,
      sanitizeFileName
    });
    this.chunkedMediaApi = new ChunkedMediaApi(this.apiClient, this.tokenManager, {
      logger: this.logger,
      uploadCache: cacheAdapter,
      sanitizeFileName
    });
  }
  // ============ Public getters ============
  /** The QQ Open Platform AppID this bot is bound to. */
  get appId() {
    return this.creds.appId;
  }
  /** The stable account id (defaults to appId). */
  get accountId() {
    return this.account.accountId;
  }
  // ============ Event listeners ============
  on(event, handler) {
    this.handlers[event].add(handler);
    return this;
  }
  off(event, handler) {
    this.handlers[event].delete(handler);
    return this;
  }
  // ============ Middleware ============
  /**
   * Register an inbound middleware. Middlewares run in registration order
   * before the `message` event listeners; calling `ctx.stop()` (or simply
   * not calling `next()`) short-circuits the chain — including the final
   * `message` listener.
   *
   * @example
   * ```ts
   * import { accessPolicy, mentionGate } from "@tencent-connect/qqbot-nodejs";
   * bot.use(accessPolicy({ group: { mode: "allowlist", allow: [...] } }));
   * bot.use(mentionGate());
   * bot.on("message", async (ctx, msg) => {  ... });
   * ```
   */
  use(...middleware) {
    for (const mw of middleware) {
      if (typeof mw !== "function") {
        throw new Error("QQBot.use: middleware must be a function");
      }
      this.middlewares.push(mw);
    }
    return this;
  }
  /** Read the registered middleware chain (for diagnostics). */
  getMiddlewares() {
    return this.middlewares;
  }
  async emit(event, ...args) {
    for (const handler of this.handlers[event]) {
      try {
        await Promise.resolve(handler(...args));
      } catch (err) {
        this.logger.error?.(`[qqbot] handler for "${String(event)}" threw: ${err instanceof Error ? err.message : String(err)}`);
      }
    }
  }
  // ============ Lifecycle ============
  /**
   * Start receiving events from QQ Open Platform.
   *
   * - **WebSocket mode** (default): connects to the WS gateway with heartbeat/RESUME.
   * - **Webhook mode**: starts an HTTP server to receive POST callbacks.
   *
   * Resolves when {@link stop} or the abort signal terminates the connection.
   */
  async start(externalSignal) {
    if (this.gateway) {
      throw new Error("QQBot: already started");
    }
    this.abortController = new AbortController();
    if (externalSignal) {
      if (externalSignal.aborted) {
        this.abortController.abort();
      } else {
        externalSignal.addEventListener("abort", () => this.abortController?.abort(), {
          once: true
        });
      }
    }
    const transportMode = this.opts.transport ?? "websocket";
    if (transportMode === "webhook") {
      await this.startWebhook();
    } else if (transportMode === "websocket") {
      await this.startWebSocket();
    } else {
      const custom = transportMode;
      await custom.start();
    }
    this.tokenManager.stopBackgroundRefresh(this.creds.appId);
    this.gateway = null;
    this.abortController = null;
  }
  /** Stop the transport and background refreshers. */
  stop() {
    this.abortController?.abort();
    this.tokenManager.stopBackgroundRefresh(this.creds.appId);
    this.gateway = null;
    this.abortController = null;
  }
  // ============ Token initialization ============
  /**
   * Initialize token based on the configured prefetch strategy.
   *
   * - `"sync"` (default): awaits the first token fetch, providing fail-fast
   *   semantics so credential errors surface at startup.
   * - `"async"`: fires the token fetch in the background and starts the
   *   background refresher immediately — trades fail-fast for faster startup.
   */
  async initToken() {
    const mode = this.opts.tokenPrefetch ?? "sync";
    if (mode === "sync") {
      await this.tokenManager.getAccessToken(this.creds.appId, this.creds.clientSecret);
    } else {
      this.tokenManager.getAccessToken(this.creds.appId, this.creds.clientSecret).catch((err) => {
        this.logger.error?.(`[qqbot] async token prefetch failed: ${err}`);
        void this.emit("error", err instanceof Error ? err : new Error(String(err)));
      });
    }
    this.tokenManager.startBackgroundRefresh(this.creds.appId, this.creds.clientSecret);
  }
  // ============ Transport: WebSocket ============
  async startWebSocket() {
    await this.initToken();
    this.gateway = new GatewayConnection({
      account: this.account,
      abortSignal: this.abortController.signal,
      log: this.logger,
      userAgent: this.userAgent,
      intents: this.opts.intents,
      session: this.opts.sessionPersistence,
      getAccessToken: () => this.tokenManager.getAccessToken(this.creds.appId, this.creds.clientSecret),
      clearTokenCache: () => this.tokenManager.clearCache(this.creds.appId),
      getGatewayUrl: () => this.messageApi.getGatewayUrl(this.creds),
      onReady: (data) => {
        this.logger.info?.(`[qqbot] gateway READY`);
        void this.emit("ready", data);
      },
      onResumed: (data) => {
        this.logger.info?.(`[qqbot] gateway RESUMED`);
        void this.emit("resumed", data);
      },
      onError: (err) => {
        void this.emit("error", err);
      },
      onMessage: (raw) => this.handleInboundMessage(raw),
      onInteraction: (event) => {
        const ctx = { bot: this, event, state: {}, receivedAt: Date.now() };
        void this.emit("interaction", ctx, event);
      },
      onRawEvent: (type, data) => {
        const ctx = { bot: this, eventType: type, data, state: {}, receivedAt: Date.now() };
        void this.emit("rawEvent", ctx);
      }
    });
    await this.gateway.start();
  }
  // ============ Transport: Webhook ============
  async startWebhook() {
    await this.initToken();
    const webhook = new WebhookTransport({
      appId: this.creds.appId,
      appSecret: this.creds.clientSecret,
      port: this.opts.webhook?.port,
      path: this.opts.webhook?.path,
      server: this.opts.webhook?.server,
      accountId: this.account.accountId,
      log: this.logger,
      abortSignal: this.abortController.signal
    }, {
      onReady: (data) => {
        this.logger.info?.(`[qqbot] webhook READY`);
        void this.emit("ready", data);
      },
      onResumed: (data) => {
        void this.emit("resumed", data);
      },
      onError: (err) => {
        void this.emit("error", err);
      },
      onMessage: (raw) => this.handleInboundMessage(raw),
      onInteraction: (event) => {
        const ctx = { bot: this, event, state: {}, receivedAt: Date.now() };
        void this.emit("interaction", ctx, event);
      }
    });
    await webhook.start();
  }
  // ============ Shared inbound message handler ============
  async handleInboundMessage(raw) {
    const replyTarget = this.deriveReplyTarget(raw);
    if (!replyTarget) {
      this.logger.debug?.(`[qqbot] inbound message has no reply target \u2014 skipping`);
      return;
    }
    const augmented = { ...raw, replyTarget };
    const ctx = createMiddlewareContext({
      bot: this,
      message: augmented,
      log: this.logger
    });
    const downstream = async () => {
      await this.emit("message", ctx, ctx.message);
    };
    const chain = [...this.middlewares, downstream];
    try {
      await runMiddlewareChain(chain, ctx);
    } catch (err) {
      this.logger.error?.(`[qqbot] middleware chain threw: ${err instanceof Error ? err.message : String(err)}`);
      void this.emit("error", err instanceof Error ? err : new Error(String(err)));
    }
  }
  // ============ Message sending ============
  /**
   * Universal message send — supports all QQ Open Platform message types.
   *
   * This is the most flexible sending method. It accepts the full parameter
   * set of POST `/v2/users/{openid}/messages` or `/v2/groups/{group_openid}/messages`.
   * Use it when the convenience helpers (sendText, sendMarkdown, etc.) don't
   * cover your use case.
   *
   * `msg_type` is auto-detected if not specified:
   * - markdown field present → 2 (Markdown)
   * - ark field present → 3 (Ark)
   * - embed field present → 4 (Embed)
   * - media field present → 7 (Rich media)
   * - otherwise → 0 (Text)
   *
   * @example Send a keyboard message
   * ```ts
   * await bot.send({
   *   target: msg.replyTarget,
   *   msgType: MsgType.MARKDOWN,
   *   markdown: { content: '# Hello' },
   *   keyboard: { content: { rows: [...] } },
   * });
   * ```
   *
   * @example Send a proactive message (no msgId)
   * ```ts
   * await bot.send({
   *   target: { scope: 'c2c', targetId: openid },
   *   content: 'Hello from bot!',
   * });
   * ```
   */
  async send(opts) {
    const body = {};
    if (opts.target.msgId)
      body.msg_id = opts.target.msgId;
    if (opts.msgType !== void 0)
      body.msg_type = opts.msgType;
    if (opts.content !== void 0)
      body.content = opts.content;
    if (opts.markdown)
      body.markdown = opts.markdown;
    if (opts.ark)
      body.ark = opts.ark;
    if (opts.embed)
      body.embed = opts.embed;
    if (opts.media)
      body.media = opts.media;
    if (opts.keyboard)
      body.keyboard = opts.keyboard;
    if (opts.messageReference)
      body.message_reference = opts.messageReference;
    if (opts.extra)
      Object.assign(body, opts.extra);
    return this.messageApi.sendRaw(opts.target.scope, opts.target.targetId, this.creds, body);
  }
  /**
   * Send a text message to a C2C user or group (smart mode).
   *
   * **Difference from `send()`**:
   * - `sendText` auto-selects msg_type based on `markdownSupport` config
   *   (markdown bots automatically send as msg_type=2).
   * - `send()` is explicit mode — you control msg_type directly.
   *
   * When `target.msgId` is present the message is treated as a reply
   * (tied to the inbound message lifecycle); otherwise it is treated as
   * a proactive push.
   */
  async sendText(target, content) {
    if (target.msgId) {
      return this.messageApi.sendMessage(target.scope, target.targetId, content, this.creds, {
        msgId: target.msgId
      });
    }
    return this.messageApi.sendProactiveMessage(target.scope, target.targetId, content, this.creds);
  }
  /** Send a text message with an inline keyboard. */
  async sendTextWithKeyboard(target, content, inlineKeyboard) {
    return this.messageApi.sendMessage(target.scope, target.targetId, content, this.creds, {
      msgId: target.msgId,
      inlineKeyboard
    });
  }
  /**
   * Send a Markdown message (msg_type=2).
   *
   * @example
   * ```ts
   * await bot.sendMarkdown(msg.replyTarget, '# Hello **world**');
   * await bot.sendMarkdown(msg.replyTarget, '# Click below', {
   *   keyboard: { content: { rows: [...] } },
   * });
   * ```
   */
  async sendMarkdown(target, content, opts) {
    return this.send({
      target,
      msgType: MsgType.MARKDOWN,
      markdown: { content },
      keyboard: opts?.keyboard
    });
  }
  /**
   * Recall (delete) a previously sent message.
   *
   * @example
   * ```ts
   * const sent = await bot.sendText(target, 'oops');
   * await bot.recallMessage(target, sent.id);
   * ```
   */
  async recallMessage(target, messageId) {
    return this.messageApi.recallMessage(target.scope, target.targetId, messageId, this.creds);
  }
  /**
   * Send a wakeup/recall message (C2C only, 30-day window).
   *
   * After a user initiates a conversation, the bot can send periodic
   * recall messages within 30 days using `is_wakeup: true`.
   * Platform enforces frequency limits.
   *
   * @example
   * ```ts
   * await bot.sendWakeup({ scope: 'c2c', targetId: openid }, '你有新消息!');
   * ```
   */
  async sendWakeup(target, content) {
    if (target.scope !== "c2c") {
      throw new Error("sendWakeup is only supported for C2C targets");
    }
    return this.send({ target, content, extra: { is_wakeup: true } });
  }
  /**
   * Send a message to a guild text channel.
   *
   * @example
   * ```ts
   * await bot.sendChannelMessage(channelId, '频道消息', { msgId });
   * ```
   */
  async sendChannelMessage(channelId, content, opts) {
    const body = { content };
    if (opts?.msgId)
      body.msg_id = opts.msgId;
    if (opts?.keyboard)
      body.keyboard = opts.keyboard;
    if (opts?.messageReference)
      body.message_reference = { message_id: opts.messageReference };
    return this.messageApi.sendChannelMessageRaw(channelId, this.creds, body);
  }
  /**
   * Send a direct message (DM) in a guild.
   *
   * @example
   * ```ts
   * await bot.sendDmMessage(guildId, '私信内容', { msgId });
   * ```
   */
  async sendDmMessage(guildId, content, opts) {
    const body = { content };
    if (opts?.msgId)
      body.msg_id = opts.msgId;
    return this.messageApi.sendDmMessageRaw(guildId, this.creds, body);
  }
  /** Send a typing indicator (C2C only). */
  async sendTyping(target, durationSec = 30) {
    if (target.scope !== "c2c") {
      throw new Error("sendTyping is only supported for C2C targets");
    }
    return this.messageApi.sendInputNotify({
      openid: target.targetId,
      creds: this.creds,
      msgId: target.msgId,
      inputSecond: durationSec
    });
  }
  /** Acknowledge an INTERACTION_CREATE event. */
  async acknowledgeInteraction(interactionId, code = 0, data) {
    return this.messageApi.acknowledgeInteraction(interactionId, this.creds, code, data);
  }
  // ============ API Gateway ============
  /**
   * Open Platform API Gateway — call any QQ Open Platform REST API with
   * automatic token injection and refresh.
   *
   * This is the "escape hatch" for any API not wrapped by a dedicated method.
   * All requests are authenticated, rate-limit aware, and return structured errors.
   *
   * @example List guilds
   * ```ts
   * const guilds = await bot.api.get('/users/@me/guilds');
   * ```
   *
   * @example Create an announcement
   * ```ts
   * await bot.api.post(`/guilds/${guildId}/announces`, {
   *   message_id: msgId, channel_id: channelId,
   * });
   * ```
   *
   * @example Get a raw access token
   * ```ts
   * const token = await bot.api.getToken();
   * ```
   */
  get api() {
    if (this._apiGateway)
      return this._apiGateway;
    this._apiGateway = {
      get: (path22, query) => this.apiRequest("GET", path22, void 0, query),
      post: (path22, body) => this.apiRequest("POST", path22, body),
      put: (path22, body) => this.apiRequest("PUT", path22, body),
      patch: (path22, body) => this.apiRequest("PATCH", path22, body),
      delete: (path22) => this.apiRequest("DELETE", path22),
      getToken: () => this.tokenManager.getAccessToken(this.creds.appId, this.creds.clientSecret)
    };
    return this._apiGateway;
  }
  async apiRequest(method, path22, body, query) {
    const token = await this.tokenManager.getAccessToken(this.creds.appId, this.creds.clientSecret);
    let fullPath = path22;
    if (query && Object.keys(query).length > 0) {
      const params = new URLSearchParams();
      for (const [k, v] of Object.entries(query)) {
        if (v !== void 0 && v !== null)
          params.set(k, String(v));
      }
      fullPath = `${path22}?${params.toString()}`;
    }
    return this.apiClient.request(token, method, fullPath, body ?? void 0);
  }
  // ============ Streaming ============
  /**
   * Open a C2C stream session for incremental output.
   *
   * @returns A {@link StreamSession} — call `update(fullText)` repeatedly,
   * then `complete()` when finished.
   */
  openStream(opts) {
    if (opts.target.scope !== "c2c") {
      throw new Error("Streaming is only supported for C2C targets");
    }
    if (!opts.target.msgId) {
      throw new Error("Streaming requires target.msgId from the inbound message");
    }
    const sessionOptions = {
      openid: opts.target.targetId,
      msgId: opts.target.msgId,
      creds: this.creds,
      eventId: opts.eventId,
      throttleMs: opts.throttleMs,
      logger: this.logger
    };
    return new StreamSession(this.messageApi, sessionOptions);
  }
  // ============ Media ============
  /**
   * Upload media (image / voice / video / file) to a target. Automatically
   * dispatches to the chunked-upload path when the source exceeds
   * {@link LARGE_FILE_THRESHOLD} bytes.
   */
  async uploadMedia(opts) {
    const sources = [opts.url, opts.fileData, opts.buffer, opts.localPath].filter((v) => v !== void 0);
    if (sources.length === 0) {
      throw new Error("uploadMedia: one of url/fileData/buffer/localPath is required");
    }
    if (sources.length > 1) {
      throw new Error("uploadMedia: provide exactly one source");
    }
    const size = await this.computeSourceSize(opts);
    const useChunked = size !== null && size >= LARGE_FILE_THRESHOLD;
    const fileName = opts.fileName ?? (opts.localPath ? path.basename(opts.localPath) : void 0) ?? (opts.url ? decodeURIComponent(path.basename(new URL(opts.url).pathname)) || void 0 : void 0);
    if (useChunked && (opts.localPath || opts.buffer)) {
      const source = opts.localPath ? { kind: "localPath", path: opts.localPath, size } : {
        kind: "buffer",
        buffer: opts.buffer,
        fileName
      };
      return this.chunkedMediaApi.uploadChunked({
        scope: opts.target.scope,
        targetId: opts.target.targetId,
        fileType: opts.fileType,
        source,
        creds: this.creds,
        fileName,
        onProgress: opts.onProgress ? (p2) => opts.onProgress(p2.uploadedBytes, p2.totalBytes) : void 0
      });
    }
    return this.mediaApi.uploadMedia(opts.target.scope, opts.target.targetId, opts.fileType, this.creds, {
      url: opts.url,
      fileData: opts.fileData,
      buffer: opts.buffer,
      localPath: opts.localPath,
      srvSendMsg: opts.srvSendMsg,
      fileName
    });
  }
  /**
   * Upload + send a media message to a C2C user or group.
   */
  async sendMedia(opts) {
    const upload = await this.uploadMedia({ ...opts, srvSendMsg: false });
    const message = await this.mediaApi.sendMediaMessage(opts.target.scope, opts.target.targetId, upload.file_info, this.creds, {
      msgId: opts.target.msgId,
      content: opts.content
    });
    return { upload, message };
  }
  /** Convenience: upload + send an image. */
  async sendImage(target, source, opts) {
    return this.sendMedia({
      target,
      fileType: MediaFileType.IMAGE,
      ...source,
      content: opts?.content,
      onProgress: opts?.onProgress
    });
  }
  /** Convenience: upload + send a video. */
  async sendVideo(target, source, opts) {
    return this.sendMedia({
      target,
      fileType: MediaFileType.VIDEO,
      ...source,
      content: opts?.content,
      onProgress: opts?.onProgress
    });
  }
  /** Convenience: upload + send a voice message. */
  async sendVoice(target, source, opts) {
    return this.sendMedia({
      target,
      fileType: MediaFileType.VOICE,
      ...source,
      onProgress: opts?.onProgress
    });
  }
  /** Convenience: upload + send a generic file (for users with file-message permission). */
  async sendFile(target, source, opts) {
    return this.sendMedia({
      target,
      fileType: MediaFileType.FILE,
      ...source,
      fileName: opts?.fileName,
      content: opts?.content,
      onProgress: opts?.onProgress
    });
  }
  // ============ Internal ============
  deriveReplyTarget(raw) {
    if (raw.kind === "c2c") {
      return { scope: "c2c", targetId: raw.senderId, msgId: raw.messageId };
    }
    if (raw.kind === "group" && raw.groupOpenid) {
      return { scope: "group", targetId: raw.groupOpenid, msgId: raw.messageId };
    }
    return null;
  }
  async computeSourceSize(opts) {
    if (opts.buffer) {
      return opts.buffer.length;
    }
    if (opts.localPath) {
      try {
        const stat = await fs3.promises.stat(opts.localPath);
        return stat.size;
      } catch {
        return null;
      }
    }
    if (opts.fileData) {
      return Math.floor(opts.fileData.length * 3 / 4);
    }
    return null;
  }
};

// ../qqbot-nodejs/dist/middleware/message-filter.js
function messageFilter(options = {}) {
  const skipSelfEcho = options.skipSelfEcho ?? true;
  const dedupOpts = options.dedup !== false ? { windowMs: 5e3, maxSize: 1e3, ...options.dedup ?? {} } : null;
  const seen = dedupOpts ? /* @__PURE__ */ new Map() : null;
  function evict(now) {
    if (!seen || !dedupOpts)
      return;
    if (seen.size <= dedupOpts.maxSize)
      return;
    for (const [key, ts] of seen) {
      if (now - ts > dedupOpts.windowMs || seen.size > dedupOpts.maxSize) {
        seen.delete(key);
      } else {
        break;
      }
    }
  }
  return async (ctx, next) => {
    if (skipSelfEcho && ctx.message.senderIsBot) {
      ctx.stop("self-echo");
      return;
    }
    if (seen && dedupOpts) {
      const id = ctx.message.messageId;
      const now = Date.now();
      if (seen.has(id)) {
        ctx.log.debug?.(`[message-filter] dropping duplicate messageId=${id}`);
        ctx.stop("deduplication");
        return;
      }
      seen.set(id, now);
      evict(now);
    }
    await next();
  };
}

// ../qqbot-nodejs/dist/middleware/content-sanitizer.js
function contentSanitizer(options = {}) {
  const { stripBotMention = true, stripAllMentions = false, collapseWhitespace = false, parseFaceTags: parseFaceTags2 = false, transform } = options;
  return async (ctx, next) => {
    let content = ctx.message.content ?? "";
    if (stripAllMentions) {
      content = content.replace(/<@!?\d+>\s*/g, "");
    } else if (stripBotMention) {
      const appId = ctx.bot.appId;
      if (appId) {
        const re = new RegExp(`<@!?${appId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}>\\s*`, "g");
        content = re[Symbol.replace](content, "");
      }
    }
    if (parseFaceTags2) {
      content = content.replace(/\[<face,id=(\d+)\/?>]/g, (_m, id) => faceToEmoji(id) ?? "");
      content = content.replace(/<faceType=\d+,faceId="[^"]*",ext="([^"]*)">/g, (_m, ext) => {
        try {
          const decoded = Buffer.from(ext, "base64").toString("utf-8");
          const parsed = JSON.parse(decoded);
          return `\u3010\u8868\u60C5: ${parsed.text || "\u672A\u77E5\u8868\u60C5"}\u3011`;
        } catch {
          return _m;
        }
      });
    } else {
      content = content.replace(/\[<face,id=\d+\/?>]/g, "");
      content = content.replace(/<faceType=\d+,faceId="[^"]*",ext="[^"]*">/g, "");
    }
    if (collapseWhitespace) {
      content = content.replace(/\s+/g, " ");
    }
    content = content.trim();
    if (transform) {
      content = transform(content, ctx);
    }
    ctx.message.content = content;
    await next();
  };
}
function faceToEmoji(id) {
  const map = {
    "0": "\u{1F60A}",
    "1": "\u{1F623}",
    "2": "\u{1F60D}",
    "4": "\u{1F60E}",
    "5": "\u{1F62D}",
    "6": "\u{1F633}",
    "7": "\u{1F910}",
    "8": "\u{1F634}",
    "9": "\u{1F622}",
    "10": "\u{1F630}",
    "11": "\u{1F621}",
    "12": "\u{1F917}",
    "13": "\u2B50",
    "14": "\u{1F31F}",
    "15": "\u{1F319}",
    "16": "\u{1F44D}",
    "18": "\u270A",
    "21": "\u{1F60A}",
    "23": "\u{1F622}",
    "25": "\u{1F914}",
    "26": "\u{1F631}",
    "27": "\u{1F605}",
    "28": "\u{1F601}",
    "29": "\u{1F92E}",
    "30": "\u{1F4AA}",
    "32": "\u{1F389}",
    "33": "\u{1F624}",
    "34": "\u{1F60F}",
    "35": "\u{1F97A}",
    "49": "\u{1F437}",
    "53": "\u{1F382}",
    "60": "\u2615",
    "63": "\u{1F339}",
    "66": "\u2764\uFE0F",
    "74": "\u{1F31E}",
    "75": "\u{1F31B}",
    "76": "\u{1F44F}",
    "78": "\u{1F91D}",
    "79": "\u270C\uFE0F",
    "85": "\u{1F385}",
    "89": "\u{1F349}",
    "96": "\u{1F613}",
    "97": "\u{1F632}",
    "100": "\u{1F602}",
    "101": "\u{1F60A}",
    "104": "\u{1F62D}",
    "106": "\u{1F631}",
    "109": "\u{1F618}",
    "111": "\u{1F970}"
  };
  return map[id];
}

// ../qqbot-nodejs/dist/middleware/rate-limiter.js
var SlidingWindow = class {
  buckets = /* @__PURE__ */ new Map();
  max;
  windowMs;
  constructor(tier) {
    this.max = tier.max;
    this.windowMs = tier.windowMs;
  }
  /** Returns `true` if allowed, `false` if rate-limited. */
  check(key) {
    const now = Date.now();
    let arr = this.buckets.get(key);
    if (!arr) {
      arr = [];
      this.buckets.set(key, arr);
    }
    while (arr.length > 0 && now - arr[0] > this.windowMs) {
      arr.shift();
    }
    if (arr.length >= this.max) {
      return false;
    }
    arr.push(now);
    return true;
  }
};
function rateLimiter(options = {}) {
  const { onLimit } = options;
  const perSender = options.perSender ? new SlidingWindow(options.perSender) : void 0;
  const perGroup = options.perGroup ? new SlidingWindow(options.perGroup) : void 0;
  const global = options.global ? new SlidingWindow(options.global) : void 0;
  return async (ctx, next) => {
    const senderId = ctx.message.senderId;
    const groupKey = ctx.message.groupOpenid ?? senderId;
    if (global && !global.check("__global__")) {
      await onLimit?.(ctx, "global");
      ctx.stop("rate-limit:global");
      return;
    }
    if (perGroup && !perGroup.check(groupKey)) {
      await onLimit?.(ctx, "perGroup");
      ctx.stop("rate-limit:perGroup");
      return;
    }
    if (perSender && !perSender.check(senderId)) {
      await onLimit?.(ctx, "perSender");
      ctx.stop("rate-limit:perSender");
      return;
    }
    await next();
  };
}

// ../qqbot-nodejs/dist/middleware/concurrency-guard.js
function concurrencyGuard(options = {}) {
  const strategy = options.strategy ?? "queue";
  const maxQueue = options.maxQueue ?? 3;
  const { onDrop, onMerge, onDispatch, urgentPredicate, maxProcessingMs } = options;
  const locks = /* @__PURE__ */ new Map();
  function getState(key) {
    let s = locks.get(key);
    if (!s) {
      s = { busy: false, queue: [] };
      locks.set(key, s);
    }
    return s;
  }
  function cleanupState(key) {
    const s = locks.get(key);
    if (s && !s.busy && s.queue.length === 0 && (!s.mergeBuffer || s.mergeBuffer.length === 0)) {
      locks.delete(key);
    }
  }
  function targetKey2(ctx) {
    const t = ctx.message.replyTarget;
    return `${t.scope}:${t.targetId}`;
  }
  const guard = async (ctx, next) => {
    const key = targetKey2(ctx);
    const state = getState(key);
    if (!state.busy) {
      state.busy = true;
      state.activeCtx = ctx;
      if (strategy === "merge") {
        state.mergeBuffer = [];
        state.mergeWaiters = [];
      }
      let timedOut = false;
      let timeoutId;
      if (maxProcessingMs && maxProcessingMs > 0) {
        timeoutId = setTimeout(() => {
          timedOut = true;
          ctx.log.warn?.(`[concurrency] aborting active chain ${key} after ${maxProcessingMs}ms`);
          ctx.abort("concurrency:processing-timeout");
          state.busy = false;
          state.activeCtx = void 0;
          if (strategy === "merge") {
            drainMergeBuffer(key, state, ctx).catch(() => {
            });
          } else {
            drainQueue(key);
          }
          cleanupState(key);
        }, maxProcessingMs);
      }
      try {
        await next();
      } finally {
        if (timeoutId)
          clearTimeout(timeoutId);
        if (!timedOut) {
          state.activeCtx = void 0;
          if (strategy === "merge") {
            await drainMergeBuffer(key, state, ctx);
            state.busy = false;
          } else {
            state.busy = false;
            if (strategy === "queue" || strategy === "abort") {
              drainQueue(key);
            }
          }
          cleanupState(key);
        }
      }
      return;
    }
    switch (strategy) {
      case "merge": {
        if (!state.mergeBuffer || !state.mergeWaiters) {
          state.mergeBuffer = [];
          state.mergeWaiters = [];
        }
        if (urgentPredicate?.(ctx)) {
          ctx.log.debug?.(`[concurrency:merge] urgent for ${key}`);
          for (const w2 of state.mergeWaiters)
            w2.resolve();
          state.mergeBuffer.length = 0;
          state.mergeWaiters.length = 0;
          await next();
          return;
        }
        if (state.mergeBuffer.length >= maxQueue) {
          ctx.log.debug?.(`[concurrency:merge] buffer full (${maxQueue}), drop for ${key}`);
          await onDrop?.(ctx);
          ctx.stop("concurrency:merge-full");
          return;
        }
        ctx.log.debug?.(`[concurrency:merge] buffered: ${key} (msgId=${ctx.message.messageId} pos=${state.mergeBuffer.length + 1})`);
        state.mergeBuffer.push(ctx);
        let isSurvivor = false;
        await new Promise((resolve2) => {
          state.mergeWaiters.push({
            ctx,
            resolve: resolve2,
            markSurvivor: () => {
              isSurvivor = true;
            }
          });
        });
        if (isSurvivor) {
          await next();
        }
        return;
      }
      case "drop": {
        ctx.log.debug?.(`[concurrency] drop message for busy target ${key}`);
        await onDrop?.(ctx);
        ctx.stop("concurrency:drop");
        return;
      }
      case "abort": {
        ctx.log.debug?.(`[concurrency] abort previous for ${key}`);
        state.activeCtx?.abort("concurrency:abort");
        for (const entry of state.queue) {
          entry.ctx?.abort("concurrency:superseded");
          entry.run();
        }
        state.queue.length = 0;
        await waitForRelease(state, ctx);
        if (ctx.signal.aborted) {
          ctx.log.debug?.(`[concurrency] superseded while waiting for ${key}`);
          return;
        }
        state.busy = true;
        state.activeCtx = ctx;
        try {
          await next();
        } finally {
          state.busy = false;
          state.activeCtx = void 0;
          drainQueue(key);
        }
        return;
      }
      case "queue":
      default: {
        if (state.queue.length >= maxQueue) {
          ctx.log.debug?.(`[concurrency] queue full (${maxQueue}), drop for ${key}`);
          await onDrop?.(ctx);
          ctx.stop("concurrency:queue-full");
          return;
        }
        ctx.log.debug?.(`[concurrency] queued message for ${key} (pos=${state.queue.length + 1})`);
        await new Promise((resolve2) => {
          state.queue.push({ run: resolve2 });
        });
        state.busy = true;
        state.activeCtx = ctx;
        try {
          await next();
        } finally {
          state.busy = false;
          state.activeCtx = void 0;
          drainQueue(key);
        }
        return;
      }
    }
  };
  async function drainMergeBuffer(key, state, ownerCtx) {
    while (state.mergeBuffer && state.mergeBuffer.length > 0) {
      const buffered = state.mergeBuffer.splice(0);
      const waiters = state.mergeWaiters?.splice(0) ?? [];
      const survivor = onMerge ? onMerge(buffered) : defaultMerge(buffered);
      const validSurvivor = buffered.includes(survivor) ? survivor : buffered[0];
      ownerCtx.log.debug?.(`[concurrency:merge] flushing batch: ${key} (count=${buffered.length})`);
      if (onDispatch) {
        state.activeCtx = validSurvivor;
        try {
          await onDispatch(validSurvivor);
        } catch (err) {
          validSurvivor.log.error?.(`[concurrency:merge] onDispatch error: ${err instanceof Error ? err.message : String(err)}`);
        } finally {
          state.activeCtx = void 0;
        }
        for (const w2 of waiters)
          w2.resolve();
      } else {
        for (const w2 of waiters) {
          if (w2.ctx === validSurvivor)
            w2.markSurvivor();
          w2.resolve();
        }
      }
    }
    state.mergeBuffer = void 0;
    state.mergeWaiters = void 0;
  }
  function drainQueue(key) {
    const state = locks.get(key);
    if (!state)
      return;
    const entry = state.queue.shift();
    if (entry) {
      entry.run();
    } else if (!state.busy) {
      locks.delete(key);
    }
  }
  function waitForRelease(state, ctx) {
    if (!state.busy)
      return Promise.resolve();
    return new Promise((resolve2) => {
      state.queue.unshift({ run: resolve2, ctx });
    });
  }
  function defaultMerge(buffered) {
    const first = buffered[0];
    if (buffered.length === 1)
      return first;
    const contentBearingCtxs = buffered.filter((ctx) => (ctx.message.content ?? "") !== "");
    const contents = contentBearingCtxs.map((ctx) => ctx.message.content);
    if (contents.length > 0) {
      first.message.content = contents.join("\n");
    }
    const envelopes = contentBearingCtxs.map((ctx) => ctx.state.envelope).filter(Boolean);
    if (envelopes.length > 0) {
      first.state.envelope = envelopes.join("\n\n");
    }
    const allAttachments = contentBearingCtxs.flatMap((ctx) => ctx.message.attachments ?? []);
    if (allAttachments.length > 0) {
      first.message.attachments = allAttachments;
    }
    return first;
  }
  return guard;
}

// ../qqbot-nodejs/dist/middleware/mention-gate.js
function detectMentionInContent(content, appId) {
  if (!content || !appId)
    return false;
  const re = new RegExp(`<@!?${appId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}>`);
  return re.test(content);
}
function mentionGate(options = {}) {
  const { requireMentionInGroup = true, alwaysAnswerC2C = true, isImplicitMention, onSkip, ignoreOtherMentions = false, passthrough = false, resolveConfig } = options;
  return async (ctx, next) => {
    const msg = ctx.message;
    const appId = ctx.bot.appId;
    if (msg.kind !== "group") {
      const decision2 = {
        wasMentioned: true,
        implicit: false,
        shouldAnswer: alwaysAnswerC2C || msg.kind !== "c2c" && msg.kind !== "dm",
        reason: "passthrough"
      };
      ctx.state.mention = decision2;
      await next();
      return;
    }
    const dynamic = resolveConfig?.(ctx);
    const effectiveRequireMention = resolvePolicy(ctx, "group.requireMention", dynamic?.requireMentionInGroup, requireMentionInGroup);
    const effectiveIgnoreOther = resolvePolicy(ctx, "group.ignoreOtherMentions", dynamic?.ignoreOtherMentions, ignoreOtherMentions);
    const wasMentioned = msg.rawEventType === "GROUP_AT_MESSAGE_CREATE" || Array.isArray(msg.mentions) && msg.mentions.some((m3) => m3?.is_you === true) || detectMentionInContent(msg.content, appId);
    const implicit = isImplicitMention?.(ctx) ?? false;
    let shouldAnswer = !effectiveRequireMention || wasMentioned || implicit;
    let reason = shouldAnswer ? "passthrough" : "no_mention";
    if (effectiveIgnoreOther && effectiveRequireMention && !wasMentioned && !implicit) {
      const mentions = msg.mentions;
      if (Array.isArray(mentions) && mentions.length > 0) {
        shouldAnswer = false;
        reason = "other_mention";
      }
    }
    const decision = {
      wasMentioned,
      implicit,
      shouldAnswer,
      reason
    };
    ctx.state.mention = decision;
    if (!shouldAnswer) {
      onSkip?.(ctx, decision);
      ctx.log.debug?.(`[mention-gate] skip group message (${reason}): wasMentioned=${wasMentioned}, implicit=${implicit}`);
      if (!passthrough) {
        ctx.stop(`mention-gate:${reason}`);
        return;
      }
    }
    await next();
  };
}

// ../qqbot-nodejs/dist/middleware/quote-ref.js
var MemoryRefIndexStore = class {
  map = /* @__PURE__ */ new Map();
  maxSize;
  constructor(maxSize = 500) {
    this.maxSize = maxSize;
  }
  get(key) {
    return this.map.get(key);
  }
  set(key, entry) {
    if (this.map.size >= this.maxSize) {
      const first = this.map.keys().next().value;
      if (first !== void 0)
        this.map.delete(first);
    }
    this.map.set(key, entry);
  }
};
function quoteRef(options = {}) {
  const contentLimit = options.contentLimit ?? 200;
  const store = options.store ?? new MemoryRefIndexStore(options.maxSize ?? 500);
  return async (ctx, next) => {
    const msg = ctx.message;
    const key = msg.msgIdx ?? msg.messageId;
    if (key) {
      let entry = {
        messageId: msg.messageId,
        senderId: msg.senderId,
        senderName: msg.senderName,
        content: (msg.content ?? "").slice(0, contentLimit),
        timestamp: msg.timestamp,
        isBot: msg.senderIsBot,
        scope: msg.kind
      };
      if (options.enrichEntry) {
        entry = options.enrichEntry(entry, ctx);
      }
      await store.set(key, entry);
    }
    const refKey = msg.refMsgIdx;
    if (refKey) {
      const entry = await store.get(refKey);
      const resolveFromElements = () => {
        const el = msg.msgElements?.[0];
        if (!el || !el.content && !el.attachments?.length)
          return null;
        const rawContent = el.content ?? "";
        const attachments = parseAttachments(el.attachments);
        return { rawContent, attachments, text: buildText(rawContent, attachments) };
      };
      if (entry) {
        const elementsQuote = options.preferMsgElements !== false ? resolveFromElements() : null;
        if (elementsQuote) {
          ctx.state.quote = {
            refKey,
            source: "msg_elements",
            rawContent: elementsQuote.rawContent,
            attachments: elementsQuote.attachments,
            text: elementsQuote.text
          };
        } else {
          ctx.state.quote = {
            refKey,
            source: "store",
            entry,
            text: entry.content || "[empty message]"
          };
        }
        ctx.log.debug?.(`[quote-ref] hit refKey=${refKey} sender=${entry.senderId}`);
      } else {
        const elementsQuote = resolveFromElements();
        if (elementsQuote) {
          ctx.state.quote = {
            refKey,
            source: "msg_elements",
            rawContent: elementsQuote.rawContent,
            attachments: elementsQuote.attachments,
            text: elementsQuote.text
          };
        } else {
          ctx.state.quote = { refKey, source: "none", text: "" };
        }
        ctx.log.debug?.(`[quote-ref] ${elementsQuote ? "fallback" : "miss"} refKey=${refKey}`);
      }
    }
    await next();
  };
}
function parseAttachments(raw) {
  if (!raw || raw.length === 0)
    return [];
  return raw.map((a) => ({
    contentType: a.content_type,
    url: a.url,
    filename: a.filename,
    asrText: a.asr_refer_text
  }));
}
function buildText(content, attachments) {
  const parts = [];
  if (content.trim())
    parts.push(content.trim());
  for (const att of attachments) {
    const t = att.contentType.toLowerCase();
    if (t.startsWith("audio/")) {
      parts.push(att.asrText ? `[voice: ${att.asrText}]` : "[voice]");
    } else if (t.startsWith("image/")) {
      parts.push(att.filename ? `[image: ${att.filename}]` : "[image]");
    } else if (t.startsWith("video/")) {
      parts.push(att.filename ? `[video: ${att.filename}]` : "[video]");
    } else {
      parts.push(`[file: ${att.filename ?? "untitled"}]`);
    }
  }
  return parts.join("\n") || "[empty message]";
}

// ../qqbot-nodejs/dist/middleware/envelope-formatter.js
function envelopeFormatter(options = {}) {
  const { historyLimit = 5, includeQuote = true, includeSender = true, format } = options;
  return async (ctx, next) => {
    if (format) {
      ctx.state.envelope = format(ctx);
    } else {
      ctx.state.envelope = buildEnvelope(ctx, { historyLimit, includeQuote, includeSender });
    }
    ctx.log.debug?.(`[envelope] built ${ctx.state.envelope.length} chars (sender=${includeSender}, quote=${includeQuote}, history=${ctx.state.history?.length ?? 0}/${historyLimit})`);
    await next();
  };
}
function buildEnvelope(ctx, opts) {
  const sections = [];
  if (opts.includeSender) {
    const name = ctx.message.senderName || ctx.message.senderId;
    const scope = ctx.message.kind === "group" ? `group(${ctx.message.groupOpenid ?? "unknown"})` : ctx.message.kind;
    sections.push(`<from>
user: ${name}
scope: ${scope}
</from>`);
  }
  if (opts.includeQuote) {
    const quote = ctx.state.quote;
    if (quote && quote.text) {
      const sender = quote.entry?.senderName || quote.entry?.senderId;
      const line = sender ? `${sender}: ${quote.text}` : quote.text;
      sections.push(`<reply_to>
${line}
</reply_to>`);
    }
  }
  const history = ctx.state.history;
  if (history && history.length > 0) {
    const recent = history.slice(-opts.historyLimit);
    const lines = recent.map((h2) => {
      const name = h2.senderName || h2.senderId;
      return `${name}: ${h2.content.slice(0, 200)}`;
    });
    sections.push(`<history>
${lines.join("\n")}
</history>`);
  }
  const content = (ctx.message.content ?? "").trim();
  const attachments = ctx.message.attachments;
  const hasAttachments = attachments && attachments.length > 0;
  if (content || hasAttachments) {
    const parts = [];
    if (content) {
      parts.push(content);
    }
    if (hasAttachments) {
      for (const att of attachments) {
        const t = att.content_type.toLowerCase();
        if (t.startsWith("image/"))
          parts.push(`[image: ${att.filename ?? "image"}]`);
        else if (t.startsWith("audio/") || t === "voice") {
          parts.push(att.asr_refer_text ? `[voice: ${att.asr_refer_text}]` : "[voice]");
        } else if (t.startsWith("video/"))
          parts.push("[video]");
        else
          parts.push(`[file: ${att.filename ?? "file"}]`);
      }
    }
    sections.push(`<message>
${parts.join("\n")}
</message>`);
  }
  return sections.join("\n\n");
}

// ../qqbot-nodejs/dist/middleware/slash-command.js
function slashCommand(options = {}) {
  const prefixes = options.prefixes ?? ["/"];
  const catchErrors = options.catchErrors ?? true;
  const autoHelp = options.autoHelp ?? true;
  const allowFrom = options.allowFrom ?? [];
  const registry = /* @__PURE__ */ new Map();
  const register = (cmd) => {
    const names = Array.isArray(cmd.name) ? cmd.name : [cmd.name];
    if (names.length === 0) {
      throw new Error("slash-command: name must not be empty");
    }
    for (const n of names) {
      const key = n.toLowerCase();
      if (registry.has(key)) {
        throw new Error(`slash-command: duplicate name "${n}"`);
      }
      registry.set(key, cmd);
    }
  };
  const unregister = (name) => {
    registry.delete(name.toLowerCase());
  };
  const list = () => {
    const seen = /* @__PURE__ */ new Set();
    const out = [];
    for (const cmd of registry.values()) {
      if (!seen.has(cmd)) {
        seen.add(cmd);
        out.push(cmd);
      }
    }
    return out;
  };
  for (const cmd of options.commands ?? []) {
    register(cmd);
  }
  if (autoHelp && !registry.has("help")) {
    register({
      name: "help",
      description: "List all available commands",
      handler: () => {
        const lines = ["Available commands:"];
        for (const cmd of list()) {
          if (cmd.hidden)
            continue;
          const names = Array.isArray(cmd.name) ? cmd.name.join(", ") : cmd.name;
          const desc = cmd.description ?? "";
          const usage = cmd.usage ? ` \u2014 ${cmd.usage}` : "";
          lines.push(`/${names}${usage}${desc ? ` \u2014 ${desc}` : ""}`);
        }
        return lines.join("\n");
      }
    });
  }
  const middleware = async (ctx, next) => {
    const content = (ctx.message.content ?? "").trim();
    if (!content) {
      await next();
      return;
    }
    const cleaned = content.replace(/<@!?[^>]+>\s*/g, "").trim();
    if (ctx.message.kind === "group") {
      const msg = ctx.message;
      const wasMentioned = msg.rawEventType === "GROUP_AT_MESSAGE_CREATE" || msg.mentions?.some((m3) => m3.is_you);
      if (!wasMentioned) {
        await next();
        return;
      }
    }
    const prefix = prefixes.find((p2) => cleaned.startsWith(p2));
    if (!prefix) {
      await next();
      return;
    }
    const body = cleaned.slice(prefix.length);
    const match = /^(\S+)(?:\s+(.*))?$/.exec(body);
    if (!match) {
      await next();
      return;
    }
    const [, name, rest = ""] = match;
    const cmd = registry.get(name.toLowerCase());
    if (!cmd) {
      await next();
      return;
    }
    const isAllowed = allowFrom.length === 0 || allowFrom.includes("*") || allowFrom.includes(ctx.message.senderId);
    if (!isAllowed) {
      await next();
      return;
    }
    const parsed = {
      name: name.toLowerCase(),
      args: rest ? rest.split(/\s+/) : [],
      raw: rest
    };
    ctx.state.command = parsed;
    const cmdScope = cmd.scope ?? "all";
    if (cmdScope !== "all") {
      const msgKind = ctx.message.kind;
      const isC2C = msgKind === "c2c" || msgKind === "dm";
      const isGroup = msgKind === "group";
      if (cmdScope === "c2c" && !isC2C || cmdScope === "group" && !isGroup) {
        const hint = cmdScope === "c2c" ? "\u8BE5\u6307\u4EE4\u4EC5\u9650\u79C1\u804A\u4F7F\u7528" : "\u8BE5\u6307\u4EE4\u4EC5\u9650\u7FA4\u804A\u4F7F\u7528";
        await sendCommandResult(ctx, hint);
        ctx.stop(`command:scope-denied:${parsed.name}`);
        return;
      }
    }
    const handlerCtx = ctx;
    handlerCtx.command = parsed;
    if (cmd.authorized) {
      const auth = cmd.authorized(handlerCtx);
      if (auth !== true) {
        const authMsg = typeof auth === "string" ? auth : "\u26A0\uFE0F \u65E0\u6743\u9650\u6267\u884C\u6B64\u547D\u4EE4";
        await sendCommandResult(ctx, { kind: "text", content: authMsg });
        ctx.stop(`command:unauthorized:${parsed.name}`);
        return;
      }
    }
    try {
      const result = await cmd.handler(handlerCtx);
      await sendCommandResult(ctx, result);
    } catch (err) {
      if (catchErrors) {
        const msg = err instanceof Error ? err.message : String(err);
        ctx.log.error?.(`[slash-command] handler "${parsed.name}" threw: ${msg}`);
        await sendCommandResult(ctx, { kind: "text", content: `Error: ${msg}` });
      } else {
        ctx.stop(`command:error:${parsed.name}`);
        throw err;
      }
    }
    ctx.stop(`command:matched:${parsed.name}`);
  };
  return { middleware, register, unregister, list };
}
async function sendCommandResult(ctx, result) {
  if (result === void 0 || result === null)
    return;
  if (typeof result === "string") {
    if (result)
      await ctx.bot.sendText(ctx.replyTarget, result);
    return;
  }
  if (typeof result === "object") {
    if (result.kind === "text" && result.content) {
      await ctx.bot.sendText(ctx.replyTarget, result.content);
    }
  }
}

// ../qqbot-nodejs/dist/middleware/history-buffer.js
var MemoryHistoryStore = class {
  buffers = /* @__PURE__ */ new Map();
  append(groupKey, entry, limit) {
    let buf = this.buffers.get(groupKey);
    if (!buf) {
      buf = [];
      this.buffers.set(groupKey, buf);
    }
    if (buf.some((e) => e.messageId === entry.messageId)) {
      return;
    }
    buf.push(entry);
    if (buf.length > limit) {
      buf.splice(0, buf.length - limit);
    }
  }
  list(groupKey, limit) {
    const buf = this.buffers.get(groupKey);
    if (!buf)
      return [];
    return buf.slice(-limit);
  }
  clear(groupKey) {
    this.buffers.delete(groupKey);
  }
  /** Diagnostic: number of groups with buffered history. */
  size() {
    return this.buffers.size;
  }
};
function historyBuffer(options = {}) {
  const limit = options.limit ?? 50;
  const store = options.store ?? new MemoryHistoryStore();
  const recordOnSkip = options.recordOnSkip ?? true;
  const getKey = options.groupKey ?? ((ctx) => ctx.message.kind === "group" ? ctx.message.groupOpenid : void 0);
  const m3 = async (ctx, next) => {
    const key = getKey(ctx);
    if (!key) {
      await next();
      return;
    }
    const effectiveLimit = resolvePolicy(ctx, "group.historyLimit", limit, 50);
    const buffered = await store.list(key, effectiveLimit);
    ctx.state.history = buffered;
    const entry = {
      senderId: ctx.message.senderId,
      senderName: ctx.message.senderName,
      content: ctx.message.content,
      timestamp: Date.parse(ctx.message.timestamp) || Date.now(),
      messageId: ctx.message.messageId
    };
    try {
      await store.append(key, entry, effectiveLimit);
    } catch (err) {
      ctx.log.error?.(`[history-buffer] append failed: ${err instanceof Error ? err.message : String(err)}`);
    }
    if (ctx.stopped && !recordOnSkip) {
      return;
    }
    await next();
  };
  return m3;
}

// ../qqbot-nodejs/dist/middleware/typing-indicator.js
var DEFAULT_DURATION_SEC = 60;
var DEFAULT_KEEPALIVE_INTERVAL_MS = 5e4;
function typingIndicator(options = {}) {
  const durationSec = options.durationSec ?? DEFAULT_DURATION_SEC;
  const predicate = options.predicate ?? (() => true);
  const awaitTyping = options.awaitTyping ?? false;
  const keepAlive = options.keepAlive ?? true;
  const keepAliveIntervalMs = options.keepAliveIntervalMs ?? DEFAULT_KEEPALIVE_INTERVAL_MS;
  return async (ctx, next) => {
    if (ctx.message.kind !== "c2c" || !predicate(ctx)) {
      await next();
      return;
    }
    const sendTyping = () => ctx.bot.sendTyping(ctx.replyTarget, durationSec).catch((err) => {
      ctx.log.debug?.(`[typing] failed: ${err instanceof Error ? err.message : String(err)}`);
    });
    const promise = sendTyping();
    if (awaitTyping) {
      await promise;
    }
    let timer = null;
    if (keepAlive) {
      timer = setInterval(() => {
        sendTyping();
      }, keepAliveIntervalMs);
    }
    try {
      await next();
    } finally {
      if (timer) {
        clearInterval(timer);
      }
    }
  };
}

// ../qqbot-nodejs/dist/middleware/error-handler.js
var DEFAULT_FORMAT = (err) => {
  if (err instanceof ApiError) {
    if (err.bizMessage)
      return `[QQ ${err.bizCode ?? err.httpStatus}] ${err.bizMessage}`;
    return `[QQ ${err.httpStatus}] ${err.message}`;
  }
  return err.message || "Unknown error";
};
function errorHandler(options = {}) {
  const format = options.format ?? DEFAULT_FORMAT;
  const rethrow = options.rethrow ?? false;
  const filter = options.filter ?? (() => true);
  return async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      if (!filter(e)) {
        if (rethrow)
          throw e;
        return;
      }
      ctx.log.error?.(`[error-handler] caught: ${e.message}`);
      try {
        const reply = format(e, ctx);
        if (reply) {
          await ctx.bot.sendText(ctx.replyTarget, reply);
        }
      } catch (sendErr) {
        ctx.log.error?.(`[error-handler] failed to send error reply: ${sendErr instanceof Error ? sendErr.message : String(sendErr)}`);
      }
      if (rethrow)
        throw e;
    }
  };
}

// ../qqbot-nodejs/dist/storage/kv-store.js
var import_node_fs = __toESM(require("fs"), 1);
var import_node_path = __toESM(require("path"), 1);
var FileKVStore = class {
  map = /* @__PURE__ */ new Map();
  filePath;
  saveThrottleMs;
  saveTimer = null;
  dirty = false;
  logger;
  constructor(opts) {
    this.filePath = import_node_path.default.join(opts.dir, opts.fileName ?? "kv-store.json");
    this.saveThrottleMs = opts.saveThrottleMs ?? 1e3;
    this.logger = opts.logger ?? {};
    this.load();
  }
  get(key) {
    const entry = this.map.get(key);
    if (!entry)
      return void 0;
    if (entry.expireAt && entry.expireAt <= Date.now()) {
      this.map.delete(key);
      this.scheduleSave();
      return void 0;
    }
    return entry.value;
  }
  set(key, value, ttlMs) {
    this.map.set(key, {
      value,
      expireAt: ttlMs && ttlMs > 0 ? Date.now() + ttlMs : void 0
    });
    this.scheduleSave();
  }
  delete(key) {
    const removed = this.map.delete(key);
    if (removed)
      this.scheduleSave();
    return removed;
  }
  has(key) {
    return this.get(key) !== void 0;
  }
  keys(prefix) {
    const all = [...this.map.keys()];
    return prefix ? all.filter((k) => k.startsWith(prefix)) : all;
  }
  clear(prefix) {
    if (!prefix) {
      this.map.clear();
    } else {
      for (const k of this.map.keys()) {
        if (k.startsWith(prefix))
          this.map.delete(k);
      }
    }
    this.scheduleSave();
  }
  /** Force flush pending writes. Call before process exit. */
  flush() {
    if (this.saveTimer) {
      clearTimeout(this.saveTimer);
      this.saveTimer = null;
    }
    if (this.dirty) {
      this.doSave();
    }
  }
  // ============ Internal ============
  load() {
    try {
      if (!import_node_fs.default.existsSync(this.filePath))
        return;
      const raw = import_node_fs.default.readFileSync(this.filePath, "utf-8");
      const data = JSON.parse(raw);
      const now = Date.now();
      for (const [k, e] of Object.entries(data)) {
        if (e.expireAt && e.expireAt <= now)
          continue;
        this.map.set(k, e);
      }
    } catch (err) {
      this.logger.error?.(`[file-kv-store] load failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  }
  scheduleSave() {
    this.dirty = true;
    if (this.saveTimer)
      return;
    this.saveTimer = setTimeout(() => {
      this.saveTimer = null;
      this.doSave();
    }, this.saveThrottleMs);
  }
  doSave() {
    try {
      import_node_fs.default.mkdirSync(import_node_path.default.dirname(this.filePath), { recursive: true });
      const obj = {};
      for (const [k, e] of this.map)
        obj[k] = e;
      const tmp = this.filePath + ".tmp";
      import_node_fs.default.writeFileSync(tmp, JSON.stringify(obj, null, 2), "utf-8");
      import_node_fs.default.renameSync(tmp, this.filePath);
      this.dirty = false;
    } catch (err) {
      this.logger.error?.(`[file-kv-store] save failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  }
};

// ../qqbot-nodejs/dist/storage/session-adapter.js
function kvSessionPersistence(opts) {
  const prefix = opts.prefix ?? "qqbot:session:";
  const key = `${prefix}${opts.accountId}`;
  const ttlMs = opts.ttlMs ?? 5 * 60 * 1e3;
  return {
    load() {
      const v = opts.store.get(key);
      if (v && typeof v.then === "function") {
        return null;
      }
      return v ?? null;
    },
    save(session) {
      void opts.store.set(key, session, ttlMs);
    },
    clear() {
      void opts.store.delete(key);
    }
  };
}

// src/outbound/target.ts
var OPENID_HEX_RE = /^[0-9a-fA-F]{32}$/;
var OPENID_UUID_RE = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
var QQBOT_PREFIX_RE = /^qqbot:(c2c|group|channel):/i;
var SCOPE_PREFIX_RE = /^(c2c|group|channel):/i;
function isQQBotTarget(id) {
  if (QQBOT_PREFIX_RE.test(id)) return true;
  if (SCOPE_PREFIX_RE.test(id)) return true;
  if (OPENID_HEX_RE.test(id)) return true;
  return OPENID_UUID_RE.test(id);
}
function normalizeTarget(target) {
  const id = target.replace(/^qqbot:/i, "");
  if (id.startsWith("c2c:") || id.startsWith("group:") || id.startsWith("channel:")) {
    return `qqbot:${id}`;
  }
  if (OPENID_HEX_RE.test(id)) return `qqbot:c2c:${id}`;
  if (OPENID_UUID_RE.test(id)) return `qqbot:c2c:${id}`;
  return void 0;
}
function parseTarget(to) {
  const id = to.replace(/^qqbot:/i, "");
  if (id.startsWith("c2c:")) {
    return { scope: "c2c", targetId: id.slice(4) };
  }
  if (id.startsWith("group:")) {
    return { scope: "group", targetId: id.slice(6) };
  }
  return { scope: "c2c", targetId: id };
}

// src/outbound/reply-limiter.ts
var ReplyLimiter = class {
  limit;
  ttlMs;
  maxTracked;
  messages = /* @__PURE__ */ new Map();
  constructor(config) {
    this.limit = config?.limit ?? 4;
    this.ttlMs = config?.ttlMs ?? 36e5;
    this.maxTracked = config?.maxTrackedMessages ?? 1e4;
  }
  /**
   * 检查是否允许对指定消息继续被动回复
   */
  checkLimit(messageId) {
    const now = Date.now();
    const tracked = this.messages.get(messageId);
    if (!tracked) {
      return { allowed: true, remaining: this.limit, shouldFallbackToProactive: false };
    }
    if (now - tracked.firstSeenAt > this.ttlMs) {
      this.messages.delete(messageId);
      return {
        allowed: false,
        remaining: 0,
        shouldFallbackToProactive: true,
        fallbackReason: "expired"
      };
    }
    const remaining = Math.max(0, this.limit - tracked.count);
    if (remaining <= 0) {
      return {
        allowed: false,
        remaining: 0,
        shouldFallbackToProactive: true,
        fallbackReason: "limit_exceeded"
      };
    }
    return { allowed: true, remaining, shouldFallbackToProactive: false };
  }
  /**
   * 记录一次被动回复
   */
  record(messageId) {
    const now = Date.now();
    const tracked = this.messages.get(messageId);
    if (tracked) {
      tracked.count++;
    } else {
      if (this.messages.size >= this.maxTracked) {
        const firstKey = this.messages.keys().next().value;
        if (firstKey) this.messages.delete(firstKey);
      }
      this.messages.set(messageId, { count: 1, firstSeenAt: now });
    }
  }
  /**
   * 获取统计信息
   */
  getStats() {
    let totalReplies = 0;
    for (const [, v] of this.messages) {
      totalReplies += v.count;
    }
    return { trackedMessages: this.messages.size, totalReplies };
  }
  /**
   * 清除所有跟踪数据
   */
  clear() {
    this.messages.clear();
  }
};

// src/outbound/outbound-service.ts
var gateways = /* @__PURE__ */ new Map();
var limiters = /* @__PURE__ */ new Map();
function getLimiter(accountId) {
  let l3 = limiters.get(accountId);
  if (!l3) {
    l3 = new ReplyLimiter();
    limiters.set(accountId, l3);
  }
  return l3;
}
function resolveMsgId(replyToId, accountId) {
  if (!replyToId) return void 0;
  const limiter = getLimiter(accountId);
  const result = limiter.checkLimit(replyToId);
  if (!result.allowed) return void 0;
  limiter.record(replyToId);
  return replyToId;
}
function registerGateway(accountId, gw) {
  gateways.set(accountId, gw);
}
function unregisterGateway(accountId) {
  gateways.delete(accountId);
  limiters.delete(accountId);
}
function getGateway(accountId) {
  return gateways.get(accountId);
}
var MEDIA_KIND_TO_FILE_TYPE = {
  image: MediaFileType.IMAGE,
  voice: MediaFileType.VOICE,
  video: MediaFileType.VIDEO,
  file: MediaFileType.FILE
};
async function sendText(params) {
  const accountId = params.account.accountId;
  const gw = gateways.get(accountId);
  if (!gw) return { error: `Bot "${accountId}" not running` };
  try {
    const target = parseTarget(params.to);
    const msgId = resolveMsgId(params.replyToId, accountId);
    const result = await gw.sendText(target, params.text, { msgId });
    return { messageId: result.id };
  } catch (err) {
    return formatError(err);
  }
}
async function sendMedia(params) {
  const accountId = params.account.accountId;
  const gw = gateways.get(accountId);
  if (!gw) return { error: `Bot "${accountId}" not running` };
  try {
    const target = parseTarget(params.to);
    const kind = params.mediaKind ?? "image";
    const msgId = resolveMsgId(params.replyToId, accountId);
    if (kind === "voice") {
      const source = resolveVoiceSource(params.mediaUrl);
      const result2 = await gw.sendVoice(target, source, { text: params.text, msgId });
      return { messageId: result2.id };
    }
    if (kind === "video") {
      const result2 = await gw.sendVideo(target, params.mediaUrl, { text: params.text, msgId });
      return { messageId: result2.id };
    }
    if (kind === "file") {
      const result2 = await gw.sendFile(target, params.mediaUrl, { text: params.text, msgId });
      return { messageId: result2.id };
    }
    const fileType = MEDIA_KIND_TO_FILE_TYPE[kind];
    const result = await gw.sendMedia(target, params.mediaUrl, { text: params.text, msgId, fileType });
    return { messageId: result.id };
  } catch (err) {
    return formatError(err);
  }
}
function resolveVoiceSource(source) {
  if (source.startsWith("http://") || source.startsWith("https://")) return { url: source };
  if (source.startsWith("/") || source.startsWith("./") || source.startsWith("../")) return { localPath: source };
  if (source.startsWith("data:")) {
    const i = source.indexOf(",");
    return { base64: i > 0 ? source.slice(i + 1) : source };
  }
  return { base64: source };
}
function formatError(err) {
  if (err instanceof Error) {
    const result = { error: err.message };
    if ("code" in err) result.errorCode = String(err.code);
    if ("qqBizCode" in err) result.qqBizCode = err.qqBizCode;
    return result;
  }
  return { error: String(err) };
}

// src/utils/pkg-version.ts
var import_node_path2 = __toESM(require("path"), 1);
var import_node_fs2 = __toESM(require("fs"), 1);
var _cachedOpenclawVersion;
function getPackageVersion() {
  return true ? "2.0.3" : "unknown";
}
function getOpenclawVersion(runtimeVersion) {
  if (_cachedOpenclawVersion) return _cachedOpenclawVersion;
  if (runtimeVersion && runtimeVersion !== "unknown") {
    return _cachedOpenclawVersion = runtimeVersion;
  }
  if (process.env.OPENCLAW_VERSION) {
    return _cachedOpenclawVersion = process.env.OPENCLAW_VERSION;
  }
  if (process.env.OPENCLAW_SERVICE_VERSION) {
    return _cachedOpenclawVersion = process.env.OPENCLAW_SERVICE_VERSION;
  }
  const pkgVer = readOpenclawPackageVersion();
  if (pkgVer) return _cachedOpenclawVersion = pkgVer;
  return "unknown";
}
function readOpenclawPackageVersion() {
  try {
    const dirs = searchRoots();
    for (const dir of dirs) {
      const pkgPath = import_node_path2.default.join(dir, "package.json");
      try {
        const pkg = JSON.parse(import_node_fs2.default.readFileSync(pkgPath, "utf8"));
        if (pkg.name === "openclaw" && pkg.version) return pkg.version;
      } catch {
      }
    }
  } catch {
  }
  return void 0;
}
function searchRoots() {
  const roots = [];
  if (typeof __filename === "string") {
    let dir = import_node_path2.default.dirname(__filename);
    for (let i = 0; i < 10; i++) {
      roots.push(dir);
      const parent = import_node_path2.default.dirname(dir);
      if (parent === dir) break;
      dir = parent;
    }
  }
  for (const key of ["OPENCLAW_STATE_DIR", "CLAWDBOT_STATE_DIR", "MOLTBOT_STATE_DIR"]) {
    const v = process.env[key];
    if (v) {
      roots.push(import_node_path2.default.dirname(v));
      roots.push(import_node_path2.default.resolve(v, ".."));
    }
  }
  const home = process.env.HOME || process.env.USERPROFILE || "/tmp";
  for (const name of ["openclaw", "clawdbot", "moltbot"]) {
    roots.push(import_node_path2.default.join(home, `.${name}`));
  }
  roots.push(process.cwd());
  return [...new Set(roots.filter((r) => typeof r === "string" && r.length > 0))];
}

// src/bot-instance.ts
var PLUGIN_VERSION = getPackageVersion();
var _openclawVersion = "unknown";
function setOpenClawVersion(version) {
  if (version) _openclawVersion = version;
}
function getOpenClawVersion() {
  return _openclawVersion;
}
function buildUserAgent(suffix) {
  const base = `QQBotPlugin/${PLUGIN_VERSION} (Node/${process.versions.node}; ${import_node_os.default.platform()}; OpenClaw/${_openclawVersion})`;
  return suffix ? `${base} ${suffix}` : base;
}
function getBotForAccount(accountId) {
  const gw = getGateway(accountId);
  if (!gw) {
    throw new Error(`[qqbot] Bot "${accountId}" not running \u2014 gateway not started`);
  }
  return gw.bot;
}
function tryGetBotForAccount(accountId) {
  const gw = getGateway(accountId);
  return gw?.bot ?? null;
}

// src/features/ref-index-store.ts
var import_node_fs3 = __toESM(require("fs"), 1);
var import_node_path3 = __toESM(require("path"), 1);

// src/utils/platform.ts
var os2 = __toESM(require("os"), 1);
var path5 = __toESM(require("path"), 1);
var fs6 = __toESM(require("fs"), 1);
function getHomeDir() {
  try {
    const home = os2.homedir();
    if (home && fs6.existsSync(home)) return home;
  } catch {
  }
  const envHome = process.env.HOME || process.env.USERPROFILE;
  if (envHome && fs6.existsSync(envHome)) return envHome;
  return os2.tmpdir();
}
function getQQBotDataDir(...subPaths) {
  const dir = path5.join(getHomeDir(), ".openclaw", "qqbot", ...subPaths);
  if (!fs6.existsSync(dir)) {
    fs6.mkdirSync(dir, { recursive: true });
  }
  return dir;
}
function getQQBotMediaDir(...subPaths) {
  const dir = path5.join(getHomeDir(), ".openclaw", "media", "qqbot", ...subPaths);
  if (!fs6.existsSync(dir)) {
    fs6.mkdirSync(dir, { recursive: true });
  }
  return dir;
}

// src/request-context.ts
var import_node_async_hooks = require("async_hooks");
var asyncLocalStorage = new import_node_async_hooks.AsyncLocalStorage();
function runWithRequestContext(ctx, fn) {
  return asyncLocalStorage.run(ctx, fn);
}
function getRequestContext() {
  return asyncLocalStorage.getStore();
}
function getRequestTarget() {
  return asyncLocalStorage.getStore()?.target;
}
function getRequestAccountId() {
  return asyncLocalStorage.getStore()?.accountId;
}

// src/utils/plugin-logger.ts
function consoleSink() {
  const C2 = "\x1B[36m", Y = "\x1B[33m", R = "\x1B[31m", G = "\x1B[90m", X = "\x1B[0m";
  return {
    debug: (m3) => console.debug(`${G}[qqbot]${X}`, m3),
    info: (m3) => console.log(`${C2}[qqbot]${X}`, m3),
    warn: (m3) => console.warn(`${Y}[qqbot]${X}`, m3),
    error: (m3) => console.error(`${R}[qqbot]${X}`, m3)
  };
}
function enrichMeta(meta) {
  const ctx = getRequestContext();
  if (!ctx) return meta;
  const trace = {};
  if (ctx.accountId) trace.accountId = ctx.accountId;
  if (ctx.messageId) trace.messageId = ctx.messageId;
  if (ctx.openId) trace.openId = ctx.openId;
  if (Object.keys(trace).length === 0) return meta;
  return meta ? { ...trace, ...meta } : trace;
}
function frameworkSink() {
  const resolve2 = () => {
    try {
      const r = tryGetQQBotRuntime();
      if (r?.logging) {
        const child = r.logging.getChildLogger({ subsystem: "qqbot/core" });
        return {
          debug: child.debug?.bind(child),
          info: child.info.bind(child),
          warn: child.warn.bind(child),
          error: child.error.bind(child)
        };
      }
    } catch {
    }
    return consoleSink();
  };
  return {
    debug: (msg, meta) => resolve2().debug?.(msg, meta),
    info: (msg, meta) => resolve2().info(msg, meta),
    warn: (msg, meta) => resolve2().warn(msg, meta),
    error: (msg, meta) => resolve2().error(msg, meta)
  };
}
function createPluginLogger(opts = {}) {
  const output = opts.output ?? (opts.forceConsole ? consoleSink() : frameworkSink());
  const prefix = opts.prefix ?? "";
  const fmt = (msg) => prefix ? `${prefix} ${msg}` : msg;
  const buildChild = (parentPrefix, tag) => createPluginLogger({
    output,
    prefix: parentPrefix ? `${parentPrefix}[${tag}]` : `[${tag}]`
  });
  return {
    info: (msg, meta) => output.info(fmt(msg), enrichMeta(meta)),
    warn: (msg, meta) => output.warn(fmt(msg), enrichMeta(meta)),
    error: (msg, meta) => output.error(fmt(msg), enrichMeta(meta)),
    debug: (msg, meta) => output.debug(fmt(msg), enrichMeta(meta)),
    child: (tag) => buildChild(prefix, tag)
  };
}

// src/features/ref-index-store.ts
var log = createPluginLogger({ prefix: "[ref-index]" });
var DEFAULT_MAX_ENTRIES = 5e4;
var DEFAULT_FILENAME = "ref-index.jsonl";
var COMPACT_RATIO = 2;
var MIN_MAX_ENTRIES = 100;
var PersistedRefIndexStore = class {
  memory = /* @__PURE__ */ new Map();
  maxEntries;
  filePath;
  /** 当前磁盘累计写入的行数（用于 compact 阈值判断） */
  diskLineCount = 0;
  /** 是否已成功初始化（磁盘回放完成） */
  initialized = false;
  /** 串行化写入，防止并发 append 撕裂行 */
  writeChain = Promise.resolve();
  constructor(options = {}) {
    this.maxEntries = Math.max(options.maxEntries ?? DEFAULT_MAX_ENTRIES, MIN_MAX_ENTRIES);
    this.filePath = options.filePath ?? import_node_path3.default.join(getQQBotDataDir("data"), DEFAULT_FILENAME);
    this.init();
  }
  /**
   * 初始化：按时间顺序回放 JSONL 重建内存 LRU
   */
  init() {
    try {
      if (!import_node_fs3.default.existsSync(this.filePath)) {
        this.initialized = true;
        return;
      }
      const raw = import_node_fs3.default.readFileSync(this.filePath, "utf8");
      const lines = raw.split("\n").filter((l3) => l3.length > 0);
      this.diskLineCount = lines.length;
      const parsed = [];
      for (const line of lines) {
        try {
          const obj = JSON.parse(line);
          if (obj?.k && obj?.v) {
            parsed.push(obj);
          }
        } catch {
        }
      }
      parsed.sort((a, b2) => a.t - b2.t);
      for (const { k, v } of parsed) {
        this.touchMemory(k, v);
      }
      if (this.diskLineCount > this.maxEntries * COMPACT_RATIO) {
        this.compactSync();
      }
    } catch (err) {
      log.error(
        `init failed: ${err instanceof Error ? err.message : String(err)}`
      );
    } finally {
      this.initialized = true;
    }
  }
  // ── RefIndexStore 接口 ──
  get(key) {
    return this.memory.get(key);
  }
  set(key, entry) {
    this.touchMemory(key, entry);
    this.writeChain = this.writeChain.then(() => this.appendToDisk(key, entry));
  }
  // ── 内部：内存 LRU 维护 ──
  touchMemory(key, entry) {
    if (this.memory.has(key)) {
      this.memory.delete(key);
    } else if (this.memory.size >= this.maxEntries) {
      const oldest = this.memory.keys().next().value;
      if (oldest !== void 0) {
        this.memory.delete(oldest);
      }
    }
    this.memory.set(key, entry);
  }
  // ── 内部：磁盘追加 + compact ──
  async appendToDisk(key, entry) {
    const line = { k: key, v: entry, t: Date.now() };
    const text = JSON.stringify(line) + "\n";
    try {
      await import_node_fs3.default.promises.appendFile(this.filePath, text, "utf8");
      this.diskLineCount += 1;
      if (this.diskLineCount > this.maxEntries * COMPACT_RATIO) {
        await this.compact();
      }
    } catch (err) {
      log.error(
        `append failed: ${err instanceof Error ? err.message : String(err)}`
      );
    }
  }
  /**
   * 异步 compact：将内存 LRU 状态完整重写到磁盘，丢弃历史冗余。
   */
  async compact() {
    const tmpPath = `${this.filePath}.tmp`;
    try {
      const now = Date.now();
      const lines = [];
      for (const [k, v] of this.memory.entries()) {
        lines.push(JSON.stringify({ k, v, t: now }));
      }
      const content = lines.length > 0 ? lines.join("\n") + "\n" : "";
      await import_node_fs3.default.promises.writeFile(tmpPath, content, "utf8");
      await import_node_fs3.default.promises.rename(tmpPath, this.filePath);
      this.diskLineCount = lines.length;
      log.info(
        `compacted to ${lines.length} entries`
      );
    } catch (err) {
      log.error(
        `compact failed: ${err instanceof Error ? err.message : String(err)}`
      );
      try {
        await import_node_fs3.default.promises.unlink(tmpPath);
      } catch {
      }
    }
  }
  /**
   * 同步 compact（仅 init 阶段使用，避免回放后立刻保留巨大磁盘文件）
   */
  compactSync() {
    const tmpPath = `${this.filePath}.tmp`;
    try {
      const now = Date.now();
      const lines = [];
      for (const [k, v] of this.memory.entries()) {
        lines.push(JSON.stringify({ k, v, t: now }));
      }
      const content = lines.length > 0 ? lines.join("\n") + "\n" : "";
      import_node_fs3.default.writeFileSync(tmpPath, content, "utf8");
      import_node_fs3.default.renameSync(tmpPath, this.filePath);
      this.diskLineCount = lines.length;
    } catch (err) {
      log.error(
        `compactSync failed: ${err instanceof Error ? err.message : String(err)}`
      );
    }
  }
  // ── 诊断 ──
  /** 当前内存中的条目数 */
  get size() {
    return this.memory.size;
  }
  /** 是否已完成初始化（磁盘回放） */
  get isInitialized() {
    return this.initialized;
  }
  /** 诊断快照 */
  stats() {
    return {
      memoryEntries: this.memory.size,
      diskLines: this.diskLineCount,
      maxEntries: this.maxEntries,
      filePath: this.filePath
    };
  }
  /**
   * 强制将当前内存状态持久化到磁盘（进程退出前调用）
   */
  flush() {
    this.compactSync();
  }
};
var stores = /* @__PURE__ */ new Map();
function getPersistedRefIndexStore(accountId) {
  let store = stores.get(accountId);
  if (!store) {
    const filePath = import_node_path3.default.join(getQQBotDataDir("data", accountId), DEFAULT_FILENAME);
    store = new PersistedRefIndexStore({ filePath });
    stores.set(accountId, store);
  }
  return store;
}
function flushAllRefIndexStores() {
  for (const store of stores.values()) {
    store.flush();
  }
}

// src/runtime.ts
var runtime = null;
var exitHooksInstalled = false;
function setQQBotRuntime(next) {
  runtime = next;
  const version = getOpenclawVersion(next.version);
  setOpenClawVersion(version);
  installExitHooksOnce();
}
function installExitHooksOnce() {
  if (exitHooksInstalled) return;
  exitHooksInstalled = true;
  const flush = () => {
    try {
      flushAllRefIndexStores();
    } catch {
    }
  };
  process.on("beforeExit", flush);
  process.on("SIGINT", () => {
    flush();
    process.exit(0);
  });
  process.on("SIGTERM", () => {
    flush();
    process.exit(0);
  });
}
function getQQBotRuntime() {
  if (!runtime) throw new Error("QQBot runtime not initialized");
  return runtime;
}
function tryGetQQBotRuntime() {
  return runtime;
}

// src/channel.ts
init_resolve();

// src/outbound/media-send.ts
var path8 = __toESM(require("path"), 1);
var fs9 = __toESM(require("fs"), 1);
var os4 = __toESM(require("os"), 1);

// src/adapter/workspace.ts
var import_node_module = require("module");
var req = (0, import_node_module.createRequire)(__filename);
var health = null;
function resolveAgentWorkspace(cfg, agentId) {
  if (!health) {
    try {
      health = req("openclaw/plugin-sdk/health");
    } catch {
      health = null;
    }
  }
  if (health) {
    return health.resolveAgentWorkspaceDir(cfg, agentId ?? health.resolveDefaultAgentId(cfg));
  }
  return getQQBotMediaDir();
}

// src/outbound/media-send.ts
init_resolve();

// src/utils/ssrf-guard.ts
var import_node_net = __toESM(require("net"), 1);
var import_promises = __toESM(require("dns/promises"), 1);
var RESERVED_V4_PREFIXES = [
  "127.",
  // loopback
  "10.",
  // class-A private
  "192.168.",
  // class-C private
  "169.254."
  // link-local / cloud metadata
];
var PRIVATE_172_RE = /^172\.(1[6-9]|2\d|3[01])\./;
function isReservedAddr(ip) {
  if (ip === "0.0.0.0") return true;
  for (const pfx of RESERVED_V4_PREFIXES) {
    if (ip.startsWith(pfx)) return true;
  }
  if (PRIVATE_172_RE.test(ip)) return true;
  const lower = ip.toLowerCase();
  if (lower === "::1" || lower === "::") return true;
  if (lower.startsWith("fe80:")) return true;
  if (lower.startsWith("fc") || lower.startsWith("fd")) return true;
  return false;
}
var ALLOWED_SCHEMES = /* @__PURE__ */ new Set(["http:", "https:"]);
var QQ_TRUSTED_DOMAINS = /* @__PURE__ */ new Set([
  // QQ Bot API
  "api.sgroup.qq.com",
  "sandbox.api.sgroup.qq.com",
  // QQ Bot Token
  "bots.qq.com",
  // QQ 多媒体上传/下载
  "multimedia.nt.qq.com.cn",
  "multimedia.nt.qq.com",
  // QQ 群文件
  "grouppro.grouppro.qq.com"
]);
function isQQTrustedDomain(hostname) {
  if (QQ_TRUSTED_DOMAINS.has(hostname)) return true;
  const dot = hostname.indexOf(".");
  if (dot > 0) {
    const parent = hostname.slice(dot + 1);
    return QQ_TRUSTED_DOMAINS.has(parent);
  }
  return false;
}
async function validateRemoteUrl(raw) {
  const url = new URL(raw);
  if (!ALLOWED_SCHEMES.has(url.protocol)) {
    throw new Error(
      `\u4E0D\u652F\u6301\u7684\u534F\u8BAE "${url.protocol}"\uFF0C\u4EC5\u5141\u8BB8 http/https\uFF08URL: ${raw}\uFF09`
    );
  }
  const host = url.hostname.replace(/^\[|\]$/g, "");
  if (isQQTrustedDomain(host)) return;
  if (import_node_net.default.isIP(host)) {
    assertPublicAddr(host, raw);
    return;
  }
  try {
    const ips = await import_promises.default.resolve(host);
    for (const ip of ips) {
      assertPublicAddr(ip, raw, host);
    }
  } catch (err) {
    if (err instanceof Error && err.message.includes("\u5185\u7F51")) throw err;
    console.warn(`[url-check] DNS \u89E3\u6790 "${host}" \u5931\u8D25: ${err}`);
  }
}
function assertPublicAddr(ip, originalUrl, domain) {
  if (!isReservedAddr(ip)) return;
  const target = domain ? `\u57DF\u540D "${domain}" \u89E3\u6790\u5230\u5185\u7F51\u5730\u5740 "${ip}"` : `\u5185\u7F51\u5730\u5740 "${ip}"`;
  throw new Error(
    `\u7981\u6B62\u8BBF\u95EE${target}\uFF0C\u5DF2\u62E6\u622A\u6F5C\u5728\u7684 SSRF \u8BF7\u6C42\uFF08URL: ${originalUrl}\uFF09`
  );
}

// src/outbound/local-file-router.ts
var path7 = __toESM(require("path"), 1);
var fs8 = __toESM(require("fs"), 1);
var os3 = __toESM(require("os"), 1);
function normalizePath(p2) {
  let result = p2;
  if (result.startsWith("file://")) {
    result = result.slice("file://".length);
    if (/^\/[a-zA-Z]:[\\/]/.test(result)) {
      result = result.slice(1);
    }
  }
  try {
    result = decodeURIComponent(result);
  } catch {
  }
  if (result === "~" || result.startsWith("~/") || result.startsWith("~\\")) {
    result = result.replace(/^~/, os3.homedir());
  }
  return result;
}
function isLocalFilePath(source) {
  if (!source) return false;
  if (source.startsWith("http://") || source.startsWith("https://")) return false;
  if (source.startsWith("data:")) return false;
  if (source.startsWith("file://")) return true;
  if (source === "~" || source.startsWith("~/") || source.startsWith("~\\")) return true;
  if (source.startsWith("/")) return true;
  if (/^[a-zA-Z]:[\\/]/.test(source)) return true;
  if (source.startsWith("\\\\")) return true;
  if (source.startsWith("./") || source.startsWith("../")) return true;
  if (source.startsWith(".\\") || source.startsWith("..\\")) return true;
  return false;
}
function isDataUrl(source) {
  return source.startsWith("data:");
}
var IMAGE_EXTS = /* @__PURE__ */ new Set([".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp", ".svg", ".ico"]);
var VOICE_EXTS = /* @__PURE__ */ new Set([".wav", ".mp3", ".silk", ".amr", ".ogg", ".flac", ".aac", ".m4a"]);
var VIDEO_EXTS = /* @__PURE__ */ new Set([".mp4", ".avi", ".mov", ".mkv", ".webm", ".flv", ".wmv"]);
function inferMediaKind(filePath) {
  const ext = path7.extname(filePath).toLowerCase();
  if (IMAGE_EXTS.has(ext)) return "image";
  if (VOICE_EXTS.has(ext)) return "voice";
  if (VIDEO_EXTS.has(ext)) return "video";
  return "file";
}
function inferMediaKindFromMime(mime) {
  const lower = mime.toLowerCase();
  if (lower.startsWith("image/")) return "image";
  if (lower.startsWith("audio/") || lower === "voice") return "voice";
  if (lower.startsWith("video/")) return "video";
  return "file";
}
function isPathInAllowedRoots(absPath, allowedRoots) {
  if (!allowedRoots.length) return false;
  try {
    const real = fs8.realpathSync(absPath);
    return allowedRoots.some((root) => {
      try {
        const rootReal = fs8.existsSync(root) ? fs8.realpathSync(root) : root;
        return real.startsWith(rootReal + path7.sep) || real === rootReal;
      } catch {
        return false;
      }
    });
  } catch {
    return false;
  }
}

// src/outbound/media-send.ts
function resolveTempRoots() {
  const roots = /* @__PURE__ */ new Set();
  try {
    const tmp = os4.tmpdir();
    roots.add(fs9.existsSync(tmp) ? fs9.realpathSync(tmp) : tmp);
  } catch {
  }
  if (process.platform !== "win32") {
    try {
      roots.add(fs9.realpathSync("/tmp"));
    } catch {
    }
  }
  return [...roots];
}
function buildDynamicAllowedRoots(workspaceDir) {
  const home = os4.homedir();
  const derivedBase = workspaceDir ? path8.dirname(workspaceDir) : path8.join(home, ".openclaw");
  const roots = [];
  const added = /* @__PURE__ */ new Set();
  const addRoot = (p2) => {
    try {
      const real = fs9.existsSync(p2) ? fs9.realpathSync(p2) : p2;
      if (!added.has(real)) {
        added.add(real);
        roots.push(real);
      }
    } catch {
    }
  };
  const knownBases = [path8.join(home, ".openclaw"), path8.join(home, ".openclaw-dev")];
  if (workspaceDir) {
    addRoot(path8.join(derivedBase, "media"));
    addRoot(path8.join(derivedBase, "workspace"));
    addRoot(path8.join(derivedBase, "outbound"));
    addRoot(workspaceDir);
  }
  for (const base of knownBases) {
    addRoot(path8.join(base, "media"));
    addRoot(path8.join(base, "workspace"));
    addRoot(path8.join(base, "outbound"));
  }
  for (const t of resolveTempRoots()) addRoot(t);
  return roots;
}
var MAX_DATA_URL_BYTES = 10 * 1024 * 1024;
async function sendMedia2(params) {
  const { source, accountId, log: log4 } = params;
  const mlog = log4?.child("media");
  if (!source) {
    mlog?.error("source is empty");
    return { error: "sendMedia: source is required" };
  }
  const wsDir = resolveWorkspaceFromAgent(params.agentId);
  mlog?.debug(`resolveMediaPath source=${source} agentId=${params.agentId ?? "none"} workspaceDir=${wsDir ?? "none"}`);
  const resolved = await resolveMediaPath(source, mlog, wsDir);
  if (!resolved.ok) {
    mlog?.error(`resolveMediaPath failed: ${resolved.error}`);
    return { error: resolved.error };
  }
  const kind = params.mediaKind ?? (params.mimeType ? inferMediaKindFromMime(params.mimeType) : void 0) ?? inferMediaKind(resolved.path);
  const gw = getGateway(accountId);
  if (!gw) {
    return { error: `Bot "${accountId}" not running` };
  }
  const target = parseTarget(params.to);
  switch (kind) {
    case "voice":
      return sendVoiceMedia(gw, target, resolved.path, params);
    case "video":
      return sendVideoMedia(gw, target, resolved.path, params);
    case "file":
      return sendFileMedia(gw, target, resolved.path, params);
    case "image":
    default:
      return sendImageMedia(gw, target, resolved.path, params);
  }
}
async function resolveMediaPath(source, log4, workspaceDir) {
  const normalized = normalizePath(source);
  if (isDataUrl(normalized)) {
    if (normalized.length > MAX_DATA_URL_BYTES) {
      const sizeMB = (normalized.length / (1024 * 1024)).toFixed(1);
      return { ok: false, error: `Data URL \u8FC7\u5927\uFF08${sizeMB}MB\uFF0C\u6700\u5927 10MB\uFF09` };
    }
    return { ok: true, path: normalized, isLocal: false };
  }
  if (normalized.startsWith("http://") || normalized.startsWith("https://")) {
    try {
      await validateRemoteUrl(normalized);
    } catch (err) {
      log4?.warn(`SSRF blocked for media URL: ${normalized}`);
      return { ok: false, error: `\u5A92\u4F53 URL \u88AB SSRF \u9632\u62A4\u62E6\u622A: ${err instanceof Error ? err.message : String(err)}` };
    }
    return { ok: true, path: normalized, isLocal: false };
  }
  if (!isLocalFilePath(normalized)) {
    const resolved2 = resolveWorkingFile(normalized, workspaceDir);
    if (resolved2) {
      return { ok: true, path: resolved2, isLocal: true };
    }
    return { ok: true, path: normalized, isLocal: false };
  }
  const resolved = path8.resolve(normalized);
  if (!fs9.existsSync(resolved)) {
    return { ok: false, error: `File not found: ${resolved}` };
  }
  let real;
  try {
    real = fs9.realpathSync(resolved);
  } catch {
    return { ok: false, error: `Cannot resolve path: ${resolved}` };
  }
  const dynamicRoots = buildDynamicAllowedRoots(workspaceDir);
  const allowed = isPathInAllowedRoots(real, dynamicRoots);
  if (!allowed) {
    log4?.warn(`path blocked \u2014 not in allowed directory: ${real}`);
    return { ok: false, error: `\u6587\u4EF6\u8DEF\u5F84\u4E0D\u5728\u5141\u8BB8\u7684\u76EE\u5F55\u4E2D` };
  }
  return { ok: true, path: real, isLocal: true };
}
function resolveWorkspaceFromAgent(agentId) {
  const cfg = resolveConfigViaAdapter();
  if (!cfg) return void 0;
  return resolveAgentWorkspace(cfg, agentId);
}
function resolveConfigViaAdapter() {
  try {
    const rt = tryGetQQBotRuntime();
    if (!rt) return void 0;
    return getAdapters(rt).getConfig?.();
  } catch {
    return void 0;
  }
}
function resolveWorkingFile(name, workspaceDir) {
  for (const p2 of [path8.resolve(name), workspaceDir ? path8.join(workspaceDir, name) : null]) {
    if (p2 && fs9.existsSync(p2)) return p2;
  }
  return null;
}
async function sendImageMedia(gw, target, source, params) {
  try {
    const result = await gw.sendMedia(target, source, {
      text: params.text,
      msgId: params.replyToId
    });
    return { messageId: result.id };
  } catch (err) {
    return { error: formatErr(err) };
  }
}
async function sendVoiceMedia(gw, target, source, params) {
  const voiceSource = resolveVoiceSource2(source);
  try {
    const result = await gw.sendVoice(target, voiceSource, {
      msgId: params.replyToId
    });
    return { messageId: result.id };
  } catch (err) {
    params.log?.child("media")?.warn(`sendVoice failed (${formatErr(err)}), falling back to sendFile`);
    try {
      const fileName = path8.basename(source);
      const fallback = await gw.sendFile(target, source, {
        text: params.text,
        msgId: params.replyToId,
        fileName
      });
      return { messageId: fallback.id, fallback: true };
    } catch (fallbackErr) {
      return { error: `voice: ${formatErr(err)} | fallback file: ${formatErr(fallbackErr)}` };
    }
  }
}
async function sendVideoMedia(gw, target, source, params) {
  try {
    const result = await gw.sendVideo(target, source, {
      text: params.text,
      msgId: params.replyToId
    });
    return { messageId: result.id };
  } catch (err) {
    return { error: formatErr(err) };
  }
}
async function sendFileMedia(gw, target, source, params) {
  try {
    const fileName = path8.basename(source);
    const result = await gw.sendFile(target, source, {
      text: params.text,
      msgId: params.replyToId,
      fileName
    });
    return { messageId: result.id };
  } catch (err) {
    return { error: formatErr(err) };
  }
}
function resolveVoiceSource2(source) {
  if (source.startsWith("http://") || source.startsWith("https://")) {
    return { url: source };
  }
  if (source.startsWith("data:") || !source.startsWith("/") && !source.startsWith("./") && !source.startsWith("../") && !source.startsWith("~")) {
    const commaIdx = source.indexOf(",");
    return { base64: commaIdx > 0 ? source.slice(commaIdx + 1) : source };
  }
  return { localPath: source };
}
function formatErr(err) {
  if (err instanceof Error) return err.message;
  return String(err);
}

// src/setup/surface.ts
init_setup();
init_config();
init_finalize();
var CHANNEL = "qqbot";
var qqbotSetupWizard = {
  channel: CHANNEL,
  status: createStandardChannelSetupStatus({
    channelLabel: "QQ Bot",
    configuredLabel: "configured",
    unconfiguredLabel: "needs AppID + AppSecret",
    configuredHint: "configured",
    unconfiguredHint: "needs AppID + AppSecret",
    configuredScore: 1,
    unconfiguredScore: 6,
    resolveConfigured: ({ cfg, accountId }) => (accountId ? [accountId] : listQQBotAccountIds(cfg)).some((id) => {
      const account = resolveQQBotAccount(cfg, id);
      return Boolean(account.appId && account.clientSecret);
    })
  }),
  // 未配置时默认使用 default 账号，有账户时框架会提示选择
  resolveAccountIdForConfigure: async ({ cfg, shouldPromptAccountIds, accountOverride, defaultAccountId }) => {
    if (accountOverride) return accountOverride;
    const ids = listQQBotAccountIds(cfg);
    if (ids.length === 0) return "default";
    if (!shouldPromptAccountIds) return ids[0];
    return defaultAccountId || resolveDefaultQQBotAccountId(cfg);
  },
  credentials: [],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  finalize: (async ({ cfg, accountId, prompter, runtime: runtime2 }) => finalizeQQBotSetup({ cfg, accountId, prompter, runtime: runtime2 })),
  disable: (cfg) => {
    setSetupChannelEnabled(cfg, CHANNEL, false);
    return cfg;
  }
};

// src/setup/login.ts
init_esm();
var pendingSessions = /* @__PURE__ */ new Map();
function startQrLogin(accountId, source = "openclaw") {
  const key = accountId ?? "default";
  pendingSessions.get(key)?.dispose();
  pendingSessions.delete(key);
  return new Promise((resolve2) => {
    let credentialsResolve;
    let credentialsReject;
    const credentialsPromise = new Promise((res, rej) => {
      credentialsResolve = res;
      credentialsReject = rej;
    });
    const dispose = l2(
      {
        onQrDisplayed(url) {
          resolve2({
            qrDataUrl: url,
            message: "\u8BF7\u4F7F\u7528\u624B\u673A QQ \u626B\u63CF\u4E8C\u7EF4\u7801\u5B8C\u6210\u7ED1\u5B9A"
          });
        },
        onSuccess: (creds) => credentialsResolve(creds),
        onFailure: (err) => credentialsReject(err)
      },
      { displayQrCodeToConsole: true, source }
    );
    pendingSessions.set(key, { dispose, credentialsPromise });
  });
}
async function waitQrLogin(accountId) {
  const key = accountId ?? "default";
  const session = pendingSessions.get(key);
  if (!session) {
    return { connected: false, message: "\u6CA1\u6709\u6B63\u5728\u8FDB\u884C\u7684\u767B\u5F55\u4F1A\u8BDD\uFF0C\u8BF7\u5148\u8FD0\u884C login \u547D\u4EE4\u3002" };
  }
  try {
    const credentials = await session.credentialsPromise;
    pendingSessions.delete(key);
    if (credentials.length === 0) {
      return { connected: false, message: "\u672A\u83B7\u53D6\u5230 QQ Bot \u51ED\u636E\u3002" };
    }
    return {
      connected: true,
      message: `\u7ED1\u5B9A\u6210\u529F\uFF01AppID: ${credentials.map((c) => c.appId).join(", ")}`,
      credentials
    };
  } catch (err) {
    pendingSessions.delete(key);
    return {
      connected: false,
      message: `\u7ED1\u5B9A\u5931\u8D25: ${err instanceof Error ? err.message : String(err)}`
    };
  }
}
function parseChannelInput(channelInput) {
  if (!channelInput) return null;
  const parts = channelInput.trim().split(":");
  if (parts.length === 2 && parts[0] && parts[1]) {
    return { appId: parts[0], clientSecret: parts[1] };
  }
  return null;
}
async function qqbotLogin({
  cfg,
  accountId,
  channelInput,
  verbose,
  ...rest
}) {
  const { applyQQBotAccountConfig: applyQQBotAccountConfig2 } = await Promise.resolve().then(() => (init_config(), config_exports));
  const { persistAuthConfig: persistAuthConfig2 } = await Promise.resolve().then(() => (init_resolve(), resolve_exports));
  const { applyAccountDefaults: applyAccountDefaults2 } = await Promise.resolve().then(() => (init_finalize(), finalize_exports));
  const { resolveAccountKey: resolveAccountKey2 } = await Promise.resolve().then(() => (init_account_key(), account_key_exports));
  const runtime2 = rest;
  const resolvedId = accountId ? accountId.trim().toLowerCase() : null;
  const parsed = parseChannelInput(channelInput);
  if (parsed) {
    const key = resolveAccountKey2(cfg, parsed.appId, resolvedId);
    const result2 = applyQQBotAccountConfig2(cfg, key, {
      appId: parsed.appId,
      clientSecret: parsed.clientSecret
    });
    Object.assign(cfg, result2);
    const withDefaults = applyAccountDefaults2(cfg, key);
    Object.assign(cfg, withDefaults);
    await persistAuthConfig2(runtime2, cfg, "restart");
    if (verbose) console.log(`QQ Bot \u5DF2\u914D\u7F6E (${key}) AppID: ${parsed.appId}`);
    return;
  }
  const { qrDataUrl, message } = await startQrLogin(resolvedId || "pending");
  console.log(`
${message}`);
  if (qrDataUrl) console.log(`QR \u94FE\u63A5: ${qrDataUrl}`);
  const result = await waitQrLogin(resolvedId || "pending");
  if (!result.connected || !result.credentials) {
    throw new Error(result.message);
  }
  for (const cred of result.credentials) {
    const key = resolveAccountKey2(cfg, cred.appId, resolvedId);
    const next = applyQQBotAccountConfig2(cfg, key, {
      appId: cred.appId,
      clientSecret: cred.appSecret
    });
    Object.assign(cfg, next);
    const withDefaults = applyAccountDefaults2(cfg, key, cred.userOpenid);
    Object.assign(cfg, withDefaults);
  }
  await persistAuthConfig2(runtime2, cfg, "restart");
  console.log(`QQ Bot \u767B\u5F55\u6210\u529F\uFF01`);
}

// src/outbound/sanitize.ts
var INTERNAL_TAGS = [
  // 框架脚手架标签
  /<system-reminder\b[^>]*>[\s\S]*?<\/system-reminder>/gi,
  /<previous_response\b[^>]*>[\s\S]*?<\/previous_response>/gi,
  /<\s*\/?\s*(?:system-reminder|previous_response)\b[^>]*\/?\s*>/gi,
  // 模型推理/思考内容
  // deepseek: `think`...`/think` — 匹配完整标签块，标签名 think 必须完整
  // 格式说明：deepseek 用 `` ` `` (反引号) 替代 XML 的 `<` `>` 作为标签定界符
  //   `think`  ≡ <think>  开标签
  //   `/think` ≡ </think> 闭标签
  /`think`[\s\S]*?`\/think`/gi,
  /<\s*\/?\s*think\b[^>]*\/?\s*>/gi,
  // claude: <thinking>...</thinking>
  /<thinking\b[^>]*>[\s\S]*?<\/thinking>/gi,
  /<\s*\/?\s*thinking\b[^>]*\/?\s*>/gi
];
function sanitizeQQBotText(text) {
  let result = text;
  for (const re of INTERNAL_TAGS) {
    result = result.replace(re, "");
  }
  return result.trim();
}

// src/gateway/lifecycle.ts
init_config();
init_resolve();

// src/gateway/qqbot-gateway.ts
var import_node_os4 = __toESM(require("os"), 1);

// src/commands/bot-help.ts
var PLUGIN_VERSION2 = getPackageVersion();
var GROUP_EXCLUDED = /* @__PURE__ */ new Set([
  "bot-upgrade",
  "bot-clear-storage",
  "bot-logs",
  "bot-approve",
  "bot-group-always",
  "bot-group-allways",
  "bot-streaming",
  "bot-me"
]);
function botHelp(_account, allCommands) {
  return {
    name: "bot-help",
    description: "\u67E5\u770B\u6240\u6709\u6307\u4EE4\u4EE5\u53CA\u7528\u9014",
    usage: [
      "/bot-help",
      "",
      "\u5217\u51FA\u6240\u6709\u53EF\u7528\u7684 QQBot \u63D2\u4EF6\u5185\u7F6E\u6307\u4EE4\u53CA\u5176\u7B80\u8981\u8BF4\u660E\u3002",
      "\u4F7F\u7528 /\u6307\u4EE4\u540D ? \u53EF\u67E5\u770B\u67D0\u6761\u6307\u4EE4\u7684\u8BE6\u7EC6\u7528\u6CD5\u3002"
    ].join("\n"),
    handler: (ctx) => {
      const isGroup = ctx.message.kind === "group";
      const lines = ["### QQBot\u63D2\u4EF6\u5185\u7F6E\u8C03\u8BD5\u6307\u4EE4", ""];
      for (const cmd of allCommands()) {
        const name = Array.isArray(cmd.name) ? cmd.name[0] : cmd.name;
        if (cmd.hidden) continue;
        if (isGroup && GROUP_EXCLUDED.has(name)) continue;
        if (cmd.authorized && cmd.authorized(ctx) !== true) continue;
        lines.push(`<qqbot-cmd-input text="/${name}" show="/${name}"/> ${cmd.description ?? ""}`);
      }
      lines.push("", `> \u63D2\u4EF6\u7248\u672C v${PLUGIN_VERSION2}`);
      return lines.join("\n");
    }
  };
}

// src/commands/bot-ping.ts
function botPing() {
  return {
    name: "bot-ping",
    description: "\u6D4B\u8BD5\u5F53\u524D openclaw \u4E0E QQ \u8FDE\u63A5\u7684\u7F51\u7EDC\u5EF6\u8FDF",
    usage: [
      "/bot-ping",
      "",
      "\u6D4B\u8BD5 OpenClaw \u4E3B\u673A\u4E0E QQ \u670D\u52A1\u5668\u4E4B\u95F4\u7684\u7F51\u7EDC\u5EF6\u8FDF\u3002",
      "\u8FD4\u56DE\u7F51\u7EDC\u4F20\u8F93\u8017\u65F6\u548C\u63D2\u4EF6\u5904\u7406\u8017\u65F6\u3002"
    ].join("\n"),
    handler: (ctx) => {
      const now = Date.now();
      const ts = ctx.message.timestamp;
      const eventTime = ts ? new Date(ts).getTime() : NaN;
      if (isNaN(eventTime)) {
        return "\u2705 pong!";
      }
      const totalMs = now - eventTime;
      const qqToPlugin = ctx.receivedAt - eventTime;
      const pluginProcess = now - ctx.receivedAt;
      return [
        "\u2705 pong\uFF01",
        "",
        `\u23F1 \u5EF6\u8FDF: ${totalMs}ms`,
        `  \u251C \u7F51\u7EDC\u4F20\u8F93: ${qqToPlugin}ms`,
        `  \u2514 \u63D2\u4EF6\u5904\u7406: ${pluginProcess}ms`
      ].join("\n");
    }
  };
}

// src/features/update-checker.ts
var import_node_https2 = __toESM(require("https"), 1);
var PKG_NAME = "@tencent-connect/openclaw-qqbot";
var ENCODED_PKG = encodeURIComponent(PKG_NAME);
var REGISTRIES = [
  `https://registry.npmjs.org/${ENCODED_PKG}`,
  `https://registry.npmmirror.com/${ENCODED_PKG}`
];
var CURRENT_VERSION = getPackageVersion();
function fetchJson(url, timeoutMs) {
  return new Promise((resolve2, reject) => {
    const req4 = import_node_https2.default.get(url, { timeout: timeoutMs, headers: { Accept: "application/json" } }, (res) => {
      if (res.statusCode !== 200) {
        res.resume();
        reject(new Error(`HTTP ${res.statusCode} from ${url}`));
        return;
      }
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        try {
          resolve2(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    });
    req4.on("error", reject);
    req4.on("timeout", () => {
      req4.destroy();
      reject(new Error(`timeout fetching ${url}`));
    });
  });
}
async function fetchDistTags(log4) {
  for (const url of REGISTRIES) {
    try {
      const json3 = await fetchJson(url, 1e4);
      const tags = json3["dist-tags"];
      if (tags && typeof tags === "object") return tags;
    } catch (e) {
      log4?.debug(`[update-checker] ${url} failed: ${e.message}`);
    }
  }
  throw new Error("all registries failed");
}
function buildUpdateInfo(tags) {
  const currentIsPrerelease = CURRENT_VERSION.includes("-");
  const stableTag = tags.latest || null;
  const alphaTag = tags.alpha || null;
  const compareTarget = currentIsPrerelease ? alphaTag : stableTag;
  const hasUpdate = typeof compareTarget === "string" && compareTarget !== CURRENT_VERSION && compareVersions(compareTarget, CURRENT_VERSION) > 0;
  return {
    current: CURRENT_VERSION,
    latest: compareTarget,
    stable: stableTag,
    alpha: alphaTag,
    hasUpdate,
    checkedAt: Date.now()
  };
}
function triggerUpdateCheck(log4) {
  getUpdateInfo(log4).then((info) => {
    if (info.hasUpdate) {
      log4.info(`[update-checker] new version available: ${info.latest} (current: ${CURRENT_VERSION})`);
    }
  }).catch(() => {
  });
}
async function getUpdateInfo(log4) {
  try {
    const tags = await fetchDistTags(log4);
    return buildUpdateInfo(tags);
  } catch (err) {
    log4?.debug(`[update-checker] check failed: ${err.message}`);
    return { current: CURRENT_VERSION, latest: null, stable: null, alpha: null, hasUpdate: false, checkedAt: Date.now(), error: err.message };
  }
}
function compareVersions(a, b2) {
  const parse = (v) => {
    const clean = v.replace(/^v/, "");
    const [main, pre] = clean.split("-", 2);
    return { parts: main.split(".").map(Number), pre: pre || null };
  };
  const pa = parse(a);
  const pb = parse(b2);
  for (let i = 0; i < 3; i++) {
    const diff = (pa.parts[i] || 0) - (pb.parts[i] || 0);
    if (diff !== 0) return diff;
  }
  if (!pa.pre && pb.pre) return 1;
  if (pa.pre && !pb.pre) return -1;
  if (!pa.pre && !pb.pre) return 0;
  const aParts = pa.pre.split(".");
  const bParts = pb.pre.split(".");
  for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
    const aP = aParts[i] ?? "";
    const bP = bParts[i] ?? "";
    const aNum = Number(aP);
    const bNum = Number(bP);
    if (!isNaN(aNum) && !isNaN(bNum)) {
      if (aNum !== bNum) return aNum - bNum;
    } else {
      if (aP < bP) return -1;
      if (aP > bP) return 1;
    }
  }
  return 0;
}

// src/commands/bot-version.ts
var PLUGIN_VERSION3 = getPackageVersion();
var GITHUB_URL = "https://github.com/tencent-connect/openclaw-qqbot";
function botVersion(_account) {
  return {
    name: "bot-version",
    description: "\u67E5\u770B\u63D2\u4EF6\u7248\u672C\u53F7",
    usage: [
      "/bot-version",
      "",
      "\u67E5\u770B\u5F53\u524D QQBot \u63D2\u4EF6\u7248\u672C\u548C OpenClaw \u6846\u67B6\u7248\u672C\u3002",
      "\u540C\u65F6\u68C0\u67E5\u662F\u5426\u6709\u65B0\u7248\u672C\u53EF\u7528\u3002"
    ].join("\n"),
    handler: async () => {
      const frameworkVersion = getOpenClawVersion();
      const lines = [
        `\u{1F99E}\u6846\u67B6\u7248\u672C\uFF1A${frameworkVersion}`,
        `\u{1F916}QQBot \u63D2\u4EF6\u7248\u672C\uFF1Av${PLUGIN_VERSION3}`
      ];
      const info = await getUpdateInfo();
      if (info.checkedAt === 0) {
        lines.push("\u23F3 \u7248\u672C\u68C0\u67E5\u4E2D...");
      } else if (info.error) {
        lines.push("\u26A0\uFE0F \u7248\u672C\u68C0\u67E5\u5931\u8D25");
      } else if (info.hasUpdate && info.latest) {
        lines.push(`\u{1F195}\u6700\u65B0\u53EF\u7528\u7248\u672C\uFF1Av${info.latest}\uFF0C\u70B9\u51FB <qqbot-cmd-input text="/bot-upgrade" show="/bot-upgrade"/> \u67E5\u770B\u5347\u7EA7\u6307\u5F15`);
      }
      lines.push(`\u{1F31F}\u5B98\u65B9 GitHub \u4ED3\u5E93\uFF1A[\u70B9\u51FB\u524D\u5F80](${GITHUB_URL})`);
      return lines.join("\n");
    }
  };
}

// src/commands/bot-me.ts
function botMe() {
  return {
    name: "bot-me",
    description: "\u67E5\u770B\u4F60\u7684 OpenID\uFF08\u4EC5\u79C1\u804A\uFF09",
    usage: `/bot-me

\u67E5\u770B\u4F60\u5728\u5F53\u524D QQBot \u5E94\u7528\u4E0B\u7684\u552F\u4E00 OpenID\u3002
\u6B64 ID \u7528\u4E8E\u7BA1\u7406\u5458\u8BC6\u522B\u3001\u8BBF\u95EE\u63A7\u5236\u7B49\u573A\u666F\u3002`,
    scope: "c2c",
    handler: (ctx) => {
      const senderId = ctx.message.senderId ?? "unknown";
      return `\u{1F194} \u4F60\u7684 OpenID: \`${senderId}\``;
    }
  };
}

// src/commands/config-util.ts
init_resolve();
function checkCommandAuth(ctx) {
  const p2 = ctx.state.policy;
  const mode = p2?.c2cMode ?? "allowlist";
  const allowFrom = p2?.allowFrom ?? [];
  if (mode === "open" || !allowFrom.length || allowFrom.includes("*")) return true;
  return allowFrom.includes(ctx.message.senderId) || "\u26A0\uFE0F \u65E0\u6743\u9650\u6267\u884C\u6B64\u547D\u4EE4";
}
async function resolvePersistFn(getRuntime) {
  const runtime2 = getRuntime();
  if (!runtime2) return ["\u26A0\uFE0F runtime \u4E0D\u53EF\u7528\uFF0C\u65E0\u6CD5\u4FEE\u6539\u914D\u7F6E\u3002", null];
  const adapters = getAdapters(runtime2);
  if (!adapters.persistConfig) {
    return ["\u26A0\uFE0F \u5F53\u524D\u6846\u67B6\u7248\u672C\u4E0D\u652F\u6301\u5728\u7EBF\u4FEE\u6539\u914D\u7F6E\uFF0C\u8BF7\u624B\u52A8\u7F16\u8F91\u914D\u7F6E\u6587\u4EF6\u3002", null];
  }
  return [
    null,
    { persist: (updater) => adapters.persistConfig(updater) }
  ];
}
async function updateAccountConfig(account, getRuntime, updater) {
  const [err, result] = await resolvePersistFn(getRuntime);
  if (err || !result) return err;
  try {
    await result.persist((cfg) => {
      cfg.channels ??= {};
      cfg.channels.qqbot ??= {};
      const qqbot = cfg.channels.qqbot;
      const accountId = account.accountId;
      const isNamedAccount = accountId !== "default" && qqbot.accounts?.[accountId];
      if (isNamedAccount) {
        qqbot.accounts[accountId] ??= {};
        updater(qqbot.accounts[accountId]);
      } else {
        updater(qqbot);
      }
    });
    return null;
  } catch (e) {
    return `\u26A0\uFE0F \u914D\u7F6E\u4FEE\u6539\u5931\u8D25\uFF1A${e instanceof Error ? e.message : String(e)}`;
  }
}
async function updateGlobalConfig(getRuntime, updater) {
  const [err, result] = await resolvePersistFn(getRuntime);
  if (err || !result) return err;
  try {
    await result.persist(updater);
    return null;
  } catch (e) {
    return `\u26A0\uFE0F \u914D\u7F6E\u4FEE\u6539\u5931\u8D25\uFF1A${e instanceof Error ? e.message : String(e)}`;
  }
}

// src/commands/bot-upgrade.ts
var PLUGIN_VERSION4 = getPackageVersion();
var DEFAULT_UPGRADE_URL = "https://docs.qq.com/doc/DSGxOZk1oVnVKVkpq";
var GITHUB_URL2 = "https://github.com/tencent-connect/openclaw-qqbot";
function botUpgrade(account) {
  return {
    name: "bot-upgrade",
    description: "\u68C0\u67E5\u66F4\u65B0\u5E76\u67E5\u770B\u5347\u7EA7\u6307\u5F15",
    scope: "c2c",
    authorized: checkCommandAuth,
    usage: [
      "/bot-upgrade              \u68C0\u67E5\u662F\u5426\u6709\u65B0\u7248\u672C"
    ].join("\n"),
    handler: async () => {
      const url = account.config.upgradeUrl ?? DEFAULT_UPGRADE_URL;
      const info = await getUpdateInfo();
      if (info.checkedAt === 0) {
        return "\u23F3 \u7248\u672C\u68C0\u67E5\u4E2D\uFF0C\u8BF7\u7A0D\u540E\u518D\u8BD5";
      }
      if (info.error) {
        return [
          "\u274C \u4E3B\u673A\u7F51\u7EDC\u8BBF\u95EE\u5F02\u5E38\uFF0C\u65E0\u6CD5\u68C0\u67E5\u66F4\u65B0",
          "",
          `\u67E5\u770B\u5347\u7EA7\u6307\u5F15\uFF1A[\u70B9\u51FB\u67E5\u770B](${url})`
        ].join("\n");
      }
      if (!info.hasUpdate) {
        return [
          `\u2705 \u5F53\u524D\u5DF2\u662F\u6700\u65B0\u7248\u672C v${PLUGIN_VERSION4}`,
          "",
          `\u9879\u76EE\u5730\u5740\uFF1A[GitHub](${GITHUB_URL2})`
        ].join("\n");
      }
      return [
        "\u{1F195} \u53D1\u73B0\u65B0\u7248\u672C",
        "",
        `\u5F53\u524D\u7248\u672C\uFF1A**v${PLUGIN_VERSION4}**`,
        `\u6700\u65B0\u7248\u672C\uFF1A**v${info.latest}**`,
        "",
        `\u{1F4D6} \u5347\u7EA7\u6307\u5F15\uFF1A[\u70B9\u51FB\u67E5\u770B](${url})`,
        `\u{1F31F} \u5B98\u65B9 GitHub \u4ED3\u5E93\uFF1A[\u70B9\u51FB\u524D\u5F80](${GITHUB_URL2})`
      ].join("\n");
    }
  };
}

// src/commands/bot-streaming.ts
function botStreaming(account, getRuntime) {
  return {
    name: "bot-streaming",
    description: "\u4E00\u952E\u5F00\u5173\u6D41\u5F0F\u6D88\u606F",
    scope: "c2c",
    authorized: checkCommandAuth,
    usage: `/bot-streaming

\u67E5\u770B\u5F53\u524D\u6D41\u5F0F\u6D88\u606F\u72B6\u6001\uFF0C\u6216\u5207\u6362\u5F00/\u5173\u3002
\u6D41\u5F0F\u6D88\u606F\u4EC5\u652F\u6301 C2C\uFF08\u79C1\u804A\uFF09\u573A\u666F\u3002`,
    handler: async (ctx) => {
      const args = (Array.isArray(ctx.command.args) ? ctx.command.args.join(" ") : String(ctx.command.args ?? "")).trim().toLowerCase();
      const streaming = account.config?.streaming;
      const currentEnabled = typeof streaming === "boolean" ? streaming : streaming?.mode !== "off";
      if (!args) {
        const status = currentEnabled ? "\u2705 \u5DF2\u542F\u7528" : "\u274C \u672A\u542F\u7528";
        const toggleHint = currentEnabled ? '<qqbot-cmd-input text="/bot-streaming off" show="\u5173\u95ED\u6D41\u5F0F"/>' : '<qqbot-cmd-input text="/bot-streaming on" show="\u5F00\u542F\u6D41\u5F0F"/>';
        return [
          `\u{1F30A} \u6D41\u5F0F\u6D88\u606F\u72B6\u6001: ${status}`,
          "",
          "\u6D41\u5F0F\u6D88\u606F\u4EC5\u652F\u6301 C2C\uFF08\u79C1\u804A\uFF09\u573A\u666F\u3002",
          `\u70B9\u51FB ${toggleHint} \u5207\u6362\u3002`
        ].join("\n");
      }
      const targetEnabled = args === "on" || args === "1" || args === "true";
      if (targetEnabled === currentEnabled) {
        return `\u2139\uFE0F \u6D41\u5F0F\u6D88\u606F\u5DF2\u7ECF\u662F${currentEnabled ? "\u5F00\u542F" : "\u5173\u95ED"}\u72B6\u6001\uFF0C\u65E0\u9700\u5207\u6362\u3002`;
      }
      const error = await updateAccountConfig(account, getRuntime, (acfg) => {
        acfg.streaming = { mode: targetEnabled ? "partial" : "off" };
      });
      if (error) return error;
      account.config.streaming = { mode: targetEnabled ? "partial" : "off" };
      return targetEnabled ? "\u2705 \u6D41\u5F0F\u6D88\u606F\u5DF2\u5F00\u542F\uFF0C\u79C1\u804A\u6D88\u606F\u5C06\u4EE5\u6D41\u5F0F\u65B9\u5F0F\u53D1\u9001\u3002" : "\u2705 \u6D41\u5F0F\u6D88\u606F\u5DF2\u5173\u95ED\uFF0C\u79C1\u804A\u6D88\u606F\u5C06\u4EE5\u9759\u6001\u65B9\u5F0F\u53D1\u9001\u3002";
    }
  };
}

// src/commands/bot-clear-storage.ts
var import_node_fs4 = __toESM(require("fs"), 1);
var import_node_path4 = __toESM(require("path"), 1);
var import_node_os2 = __toESM(require("os"), 1);
var MAX_DISPLAY = 10;
function scanFiles(dirPath) {
  const files = [];
  if (!import_node_fs4.default.existsSync(dirPath)) return files;
  const walk = (dir) => {
    let entries;
    try {
      entries = import_node_fs4.default.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const full = import_node_path4.default.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (entry.isFile()) {
        try {
          files.push({ filePath: full, size: import_node_fs4.default.statSync(full).size });
        } catch {
        }
      }
    }
  };
  walk(dirPath);
  return files.sort((a, b2) => b2.size - a.size);
}
function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}
function botClearStorage(_account) {
  const targetDir = getQQBotMediaDir("downloads");
  const displayDir = targetDir.replace(import_node_os2.default.homedir(), "~");
  return {
    name: "bot-clear-storage",
    description: "\u6E05\u7406\u901A\u8FC7QQBot\u5BF9\u8BDD\u4EA7\u751F\u7684\u6587\u4EF6\u4EE5\u53CA\u4E0B\u8F7D\u7684\u8D44\u6E90",
    scope: "c2c",
    authorized: checkCommandAuth,
    usage: [
      "/bot-clear-storage",
      "",
      "\u626B\u63CF\u5F53\u524D\u673A\u5668\u4EBA\u4EA7\u751F\u7684\u4E0B\u8F7D\u6587\u4EF6\u5E76\u5217\u51FA\u660E\u7EC6\u3002",
      "\u786E\u8BA4\u540E\u6267\u884C\u5220\u9664\uFF0C\u91CA\u653E\u4E3B\u673A\u78C1\u76D8\u7A7A\u95F4\u3002",
      "",
      "/bot-clear-storage --force   \u786E\u8BA4\u6267\u884C\u6E05\u7406",
      "",
      "\u26A0\uFE0F \u4EC5\u5728\u79C1\u804A\u4E2D\u53EF\u7528\u3002"
    ].join("\n"),
    handler: (ctx) => {
      const isForce = ctx.command.raw?.trim() === "--force";
      if (!isForce) {
        const files2 = scanFiles(targetDir);
        if (files2.length === 0) {
          return `\u2705 \u5F53\u524D\u6CA1\u6709\u9700\u8981\u6E05\u7406\u7684\u6587\u4EF6

\u76EE\u5F55 \`${displayDir}\` \u4E3A\u7A7A\u6216\u4E0D\u5B58\u5728\u3002`;
        }
        const totalSize = files2.reduce((s, f) => s + f.size, 0);
        const lines = [
          `\u5373\u5C06\u6E05\u7406 \`${displayDir}\` \u4E0B\u6240\u6709\u6587\u4EF6\uFF0C\u5171 ${files2.length} \u4E2A\uFF0C\u5360\u7528 ${formatSize(totalSize)}\u3002`,
          "",
          `\u6587\u4EF6\u6982\u51B5\uFF1A`
        ];
        for (const f of files2.slice(0, MAX_DISPLAY)) {
          const rel = import_node_path4.default.relative(targetDir, f.filePath).replace(/\\/g, "/");
          lines.push(`  ${rel} (${formatSize(f.size)})`);
        }
        if (files2.length > MAX_DISPLAY) {
          lines.push(`  ...\u5171 ${files2.length} \u4E2A\u6587\u4EF6 (${formatSize(totalSize)})`);
        }
        lines.push("", "---", "", "\u786E\u8BA4\u6E05\u7406\u540E\u6587\u4EF6\u5C06\u6C38\u4E45\u5220\u9664\uFF0C\u540E\u7EED AI \u65E0\u6CD5\u627E\u56DE\u3002", '\u203C\uFE0F <qqbot-cmd-enter text="/bot-clear-storage --force" />');
        return lines.join("\n");
      }
      const files = scanFiles(targetDir);
      if (files.length === 0) {
        return "\u2705 \u6CA1\u6709\u9700\u8981\u6E05\u7406\u7684\u6587\u4EF6\u3002";
      }
      let deleted = 0;
      let failed = 0;
      for (const f of files) {
        try {
          import_node_fs4.default.unlinkSync(f.filePath);
          deleted++;
        } catch {
          failed++;
        }
      }
      const parts = [`\u{1F5D1}\uFE0F \u5DF2\u5220\u9664 ${deleted} \u4E2A\u6587\u4EF6`];
      if (failed > 0) parts.push(`\uFF0C${failed} \u4E2A\u5931\u8D25`);
      parts.push(`
\u{1F4C1} \`${displayDir}\``);
      try {
        import_node_fs4.default.rmdirSync(targetDir);
      } catch {
      }
      return parts.join("");
    }
  };
}

// src/commands/bot-logs.ts
var import_node_fs5 = __toESM(require("fs"), 1);
var import_node_path5 = __toESM(require("path"), 1);
var import_node_os3 = __toESM(require("os"), 1);
var import_node_crypto2 = __toESM(require("crypto"), 1);
init_resolve();
var MAX_LINES_PER_FILE = 1e3;
var MAX_FILES = 4;
var LOG_KEYWORDS = ["gateway", "openclaw", "clawdbot", "moltbot"];
var LOG_PATTERN = new RegExp(LOG_KEYWORDS.join("|"), "i");
function getConfiguredLogFiles(runtime2) {
  const files = [];
  try {
    const cfg = getAdapters(runtime2).getConfig?.() ?? {};
    const logFile = cfg?.logging?.file;
    if (typeof logFile === "string") {
      files.push(import_node_path5.default.resolve(logFile));
    }
  } catch {
  }
  return files;
}
function collectCandidateLogDirs(runtime2) {
  const homeDir = import_node_os3.default.homedir();
  const dirs = /* @__PURE__ */ new Set();
  const pushDir = (p2) => {
    if (!p2) return;
    try {
      dirs.add(import_node_path5.default.resolve(p2));
    } catch {
    }
  };
  const pushStateDir = (stateDir) => {
    if (!stateDir) return;
    pushDir(stateDir);
    pushDir(import_node_path5.default.join(stateDir, "logs"));
  };
  for (const logFile of getConfiguredLogFiles(runtime2)) {
    pushDir(import_node_path5.default.dirname(logFile));
  }
  for (const [key, value] of Object.entries(process.env)) {
    if (!value) continue;
    if (/STATE_DIR$/i.test(key) && /(OPENCLAW|CLAWDBOT|MOLTBOT)/i.test(key)) {
      pushStateDir(value);
    }
  }
  for (const name of LOG_KEYWORDS) {
    pushDir(import_node_path5.default.join(homeDir, `.${name}`));
    pushDir(import_node_path5.default.join(homeDir, `.${name}`, "logs"));
    pushDir(import_node_path5.default.join(homeDir, name));
    pushDir(import_node_path5.default.join(homeDir, name, "logs"));
  }
  const searchRoots2 = /* @__PURE__ */ new Set([homeDir, process.cwd(), import_node_path5.default.dirname(process.cwd())]);
  if (process.env.APPDATA) searchRoots2.add(process.env.APPDATA);
  if (process.env.LOCALAPPDATA) searchRoots2.add(process.env.LOCALAPPDATA);
  for (const root of searchRoots2) {
    try {
      const entries = import_node_fs5.default.readdirSync(root, { withFileTypes: true });
      for (const entry of entries) {
        if (!entry.isDirectory()) continue;
        const re = LOG_PATTERN;
        if (!re.test(entry.name)) continue;
        const base = import_node_path5.default.join(root, entry.name);
        pushDir(base);
        pushDir(import_node_path5.default.join(base, "logs"));
      }
    } catch {
    }
  }
  if (process.platform !== "win32") {
    for (const name of LOG_KEYWORDS) {
      pushDir(import_node_path5.default.join("/var/log", name));
    }
  }
  if (process.platform === "win32") {
    pushDir("C:\\tmp");
    if (process.env.TEMP) pushDir(process.env.TEMP);
    if (process.env.TMP) pushDir(process.env.TMP);
    if (process.env.LOCALAPPDATA) pushDir(import_node_path5.default.join(process.env.LOCALAPPDATA, "Temp"));
  } else {
    pushDir("/tmp");
  }
  for (const name of LOG_KEYWORDS) {
    pushDir(import_node_path5.default.join("/tmp", name));
    if (process.platform === "win32" && process.env.TEMP) {
      pushDir(import_node_path5.default.join(process.env.TEMP, name));
    }
  }
  const pm2Home = process.env.PM2_HOME ?? import_node_path5.default.join(homeDir, ".pm2");
  pushDir(import_node_path5.default.join(pm2Home, "logs"));
  return Array.from(dirs);
}
function collectRecentLogFiles(logDirs, runtime2) {
  const candidates = [];
  const dedupe = /* @__PURE__ */ new Set();
  const pushFile = (filePath, sourceDir) => {
    const normalized = import_node_path5.default.resolve(filePath);
    if (dedupe.has(normalized)) return;
    try {
      const stat = import_node_fs5.default.statSync(normalized);
      if (!stat.isFile() || stat.size === 0) return;
      dedupe.add(normalized);
      candidates.push({ filePath: normalized, sourceDir, mtime: stat.mtimeMs });
    } catch {
    }
  };
  for (const logFile of getConfiguredLogFiles(runtime2)) {
    pushFile(logFile, import_node_path5.default.dirname(logFile));
  }
  for (const dir of logDirs) {
    for (const name of ["gateway.log", "gateway.err.log", "openclaw.log", "clawdbot.log", "moltbot.log"]) {
      pushFile(import_node_path5.default.join(dir, name), dir);
    }
    try {
      const entries = import_node_fs5.default.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        if (!entry.isFile()) continue;
        if (!/\.(log|txt)$/i.test(entry.name)) continue;
        const re = LOG_PATTERN;
        if (!re.test(entry.name)) continue;
        pushFile(import_node_path5.default.join(dir, entry.name), dir);
      }
    } catch {
    }
  }
  return candidates.sort((a, b2) => b2.mtime - a.mtime);
}
function botLogs(runtime2) {
  return {
    name: "bot-logs",
    description: "\u5BFC\u51FA\u672C\u5730\u65E5\u5FD7\u6587\u4EF6",
    scope: "c2c",
    authorized: checkCommandAuth,
    usage: [
      "/bot-logs",
      "",
      `\u5BFC\u51FA\u6700\u8FD1\u7684 OpenClaw \u65E5\u5FD7\u6587\u4EF6\uFF08\u6700\u591A ${MAX_FILES} \u4E2A\uFF09\u3002`,
      `\u6BCF\u4E2A\u6587\u4EF6\u6700\u591A\u4FDD\u7559\u6700\u540E ${MAX_LINES_PER_FILE} \u884C\uFF0C\u4EE5\u6587\u4EF6\u5F62\u5F0F\u8FD4\u56DE\u3002`
    ].join("\n"),
    handler: async (ctx) => {
      const logDirs = collectCandidateLogDirs(runtime2);
      const recentFiles = collectRecentLogFiles(logDirs, runtime2).slice(0, MAX_FILES);
      if (recentFiles.length === 0) {
        const existingDirs = logDirs.filter((d3) => {
          try {
            return import_node_fs5.default.existsSync(d3);
          } catch {
            return false;
          }
        });
        const searched = existingDirs.length > 0 ? existingDirs.map((d3) => `  \u2022 ${d3}`).join("\n") : logDirs.map((d3) => `  \u2022 ${d3}`).join("\n");
        return [
          "\u26A0\uFE0F \u672A\u627E\u5230\u65E5\u5FD7\u6587\u4EF6",
          "",
          "\u5DF2\u641C\u7D22\u4EE5\u4E0B\u8DEF\u5F84\uFF1A",
          searched
        ].join("\n");
      }
      const lines = [];
      let totalIncluded = 0;
      let totalOriginal = 0;
      let truncatedCount = 0;
      for (const logFile of recentFiles) {
        try {
          const content = import_node_fs5.default.readFileSync(logFile.filePath, "utf8");
          const allLines = content.split("\n");
          const tail = allLines.slice(-MAX_LINES_PER_FILE);
          if (tail.length > 0) {
            const fileName = import_node_path5.default.basename(logFile.filePath);
            lines.push(`
== ${fileName} (last ${tail.length}/${allLines.length}) ==`);
            lines.push(...tail);
            totalIncluded += tail.length;
            totalOriginal += allLines.length;
            if (allLines.length > MAX_LINES_PER_FILE) truncatedCount++;
          }
        } catch {
        }
      }
      if (lines.length === 0) {
        return "\u26A0\uFE0F \u627E\u5230\u65E5\u5FD7\u6587\u4EF6\u4F46\u8BFB\u53D6\u5931\u8D25";
      }
      const tmpDir = getQQBotMediaDir("exports");
      if (!import_node_fs5.default.existsSync(tmpDir)) import_node_fs5.default.mkdirSync(tmpDir, { recursive: true });
      const timestamp = (/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-").slice(0, 19);
      const suffix = import_node_crypto2.default.randomBytes(4).toString("hex");
      const tmpFile = import_node_path5.default.join(tmpDir, `bot-logs-${timestamp}-${suffix}.txt`);
      import_node_fs5.default.writeFileSync(tmpFile, lines.join("\n"), "utf8");
      let summary = `${recentFiles.length} \u4E2A\u65E5\u5FD7\u6587\u4EF6\uFF0C\u5171 ${totalIncluded} \u884C`;
      if (truncatedCount > 0) summary += `\uFF08${truncatedCount} \u4E2A\u622A\u65AD\uFF0C\u539F\u59CB ${totalOriginal} \u884C\uFF09`;
      try {
        const senderId = ctx.message.senderId;
        if (senderId) {
          await ctx.bot.sendFile(
            { scope: "c2c", targetId: senderId, msgId: ctx.message.messageId },
            { localPath: tmpFile },
            { fileName: `bot-logs-${timestamp}-${suffix}.txt` }
          );
        }
      } catch (err) {
        return `\u{1F4CB} ${summary}
\u26A0\uFE0F \u6587\u4EF6\u53D1\u9001\u5931\u8D25\uFF1A${err instanceof Error ? err.message : err}
\u{1F4CE} ${tmpFile}`;
      }
      return `\u{1F4CB} ${summary}`;
    }
  };
}

// src/commands/bot-approve.ts
init_resolve();
var PRESETS = {
  on: { security: "allowlist", ask: "on-miss", desc: "\u5F00\u542F\u5BA1\u6279\uFF08\u767D\u540D\u5355\u6A21\u5F0F\uFF09" },
  off: { security: "full", ask: "off", desc: "\u5173\u95ED\u5BA1\u6279" },
  always: { security: "allowlist", ask: "always", desc: "\u4E25\u683C\u6A21\u5F0F\uFF08\u6BCF\u6B21\u90FD\u5BA1\u6279\uFF09" }
};
function formatStatus(security, ask) {
  const secIcon = security === "full" ? "\u{1F7E2}" : security === "allowlist" ? "\u{1F7E1}" : "\u{1F534}";
  const askIcon = ask === "off" ? "\u{1F7E2}" : ask === "always" ? "\u{1F534}" : "\u{1F7E1}";
  const desc = security === "deny" ? "\u26A0\uFE0F \u5F53\u524D\u4E3A deny \u6A21\u5F0F\uFF0C\u6240\u6709\u547D\u4EE4\u6267\u884C\u88AB\u62D2\u7EDD" : security === "full" && ask === "off" ? "\u2705 \u6240\u6709\u547D\u4EE4\u65E0\u9700\u5BA1\u6279\u76F4\u63A5\u6267\u884C" : security === "allowlist" && ask === "on-miss" ? "\u{1F6E1}\uFE0F \u767D\u540D\u5355\u547D\u4EE4\u76F4\u63A5\u6267\u884C\uFF0C\u5176\u4F59\u9700\u5BA1\u6279" : ask === "always" ? "\u{1F512} \u6BCF\u6B21\u547D\u4EE4\u6267\u884C\u90FD\u9700\u8981\u4EBA\u5DE5\u5BA1\u6279" : `\u2139\uFE0F security=${security}, ask=${ask}`;
  return [
    "\u{1F510} \u5F53\u524D\u5BA1\u6279\u914D\u7F6E",
    "",
    `${secIcon} \u5B89\u5168\u6A21\u5F0F (security): **${security}**`,
    `${askIcon} \u5BA1\u6279\u6A21\u5F0F (ask): **${ask}**`,
    "",
    desc
  ].join("\n");
}
function menuText() {
  return [
    "\u{1F510} \u547D\u4EE4\u6267\u884C\u5BA1\u6279\u914D\u7F6E",
    "",
    '<qqbot-cmd-input text="/bot-approve on" show="/bot-approve on"/> \u5F00\u542F\u5BA1\u6279\uFF08\u767D\u540D\u5355\u6A21\u5F0F\uFF09',
    '<qqbot-cmd-input text="/bot-approve off" show="/bot-approve off"/> \u5173\u95ED\u5BA1\u6279',
    '<qqbot-cmd-input text="/bot-approve always" show="/bot-approve always"/> \u4E25\u683C\u6A21\u5F0F',
    '<qqbot-cmd-input text="/bot-approve reset" show="/bot-approve reset"/> \u6062\u590D\u9ED8\u8BA4',
    '<qqbot-cmd-input text="/bot-approve status" show="/bot-approve status"/> \u67E5\u770B\u5F53\u524D\u914D\u7F6E'
  ].join("\n");
}
function botApprove(getRuntime) {
  return {
    name: "bot-approve",
    description: "\u7BA1\u7406\u547D\u4EE4\u6267\u884C\u5BA1\u6279\u914D\u7F6E",
    scope: "c2c",
    authorized: checkCommandAuth,
    usage: [
      "/bot-approve            \u67E5\u770B\u64CD\u4F5C\u6307\u5F15",
      "/bot-approve on         \u5F00\u542F\u5BA1\u6279\uFF08\u767D\u540D\u5355\u6A21\u5F0F\uFF0C\u63A8\u8350\uFF09",
      "/bot-approve off        \u5173\u95ED\u5BA1\u6279\uFF0C\u547D\u4EE4\u76F4\u63A5\u6267\u884C",
      "/bot-approve always     \u59CB\u7EC8\u5BA1\u6279\uFF0C\u6BCF\u6B21\u6267\u884C\u90FD\u9700\u5BA1\u6279",
      "/bot-approve reset      \u6062\u590D\u6846\u67B6\u9ED8\u8BA4\u503C",
      "/bot-approve status     \u67E5\u770B\u5F53\u524D\u5BA1\u6279\u914D\u7F6E"
    ].join("\n"),
    handler: async (ctx) => {
      const arg = (Array.isArray(ctx.command.args) ? ctx.command.args.join(" ") : String(ctx.command.args ?? "")).trim().toLowerCase();
      const runtime2 = getRuntime();
      if (!runtime2) {
        return "\u26A0\uFE0F runtime \u4E0D\u53EF\u7528\uFF0C\u65E0\u6CD5\u7BA1\u7406\u5BA1\u6279\u914D\u7F6E\u3002";
      }
      const adapters = getAdapters(runtime2);
      const loadExecConfig = () => {
        const cfg = adapters.getConfig?.() ?? {};
        const tools = cfg.tools ?? {};
        const exec = tools.exec ?? {};
        return {
          security: String(exec.security ?? "deny"),
          ask: String(exec.ask ?? "on-miss")
        };
      };
      if (!arg) {
        return menuText();
      }
      if (arg === "status") {
        const { security, ask } = loadExecConfig();
        return [
          formatStatus(security, ask),
          "",
          '<qqbot-cmd-input text="/bot-approve on" show="/bot-approve on"/> \u5F00\u542F\u5BA1\u6279',
          '<qqbot-cmd-input text="/bot-approve off" show="/bot-approve off"/> \u5173\u95ED\u5BA1\u6279',
          '<qqbot-cmd-input text="/bot-approve always" show="/bot-approve always"/> \u4E25\u683C\u6A21\u5F0F',
          '<qqbot-cmd-input text="/bot-approve reset" show="/bot-approve reset"/> \u6062\u590D\u9ED8\u8BA4'
        ].join("\n");
      }
      const preset = PRESETS[arg];
      if (preset) {
        const error = await updateGlobalConfig(getRuntime, (cfg) => {
          cfg.tools ??= {};
          cfg.tools.exec ??= {};
          cfg.tools.exec.security = preset.security;
          cfg.tools.exec.ask = preset.ask;
        });
        if (error) return error;
        if (arg === "on") {
          return ["\u2705 \u5BA1\u6279\u5DF2\u5F00\u542F", "", "\u2022 security = allowlist", "\u2022 ask = on-miss", "", "\u5DF2\u6279\u51C6\u7684\u547D\u4EE4\u81EA\u52A8\u52A0\u5165\u767D\u540D\u5355\uFF0C\u4E0B\u6B21\u76F4\u63A5\u6267\u884C\u3002"].join("\n");
        }
        if (arg === "off") {
          return ["\u2705 \u5BA1\u6279\u5DF2\u5173\u95ED", "", "\u2022 security = full", "\u2022 ask = off", "", "\u26A0\uFE0F \u6240\u6709\u547D\u4EE4\u5C06\u76F4\u63A5\u6267\u884C\uFF0C\u4E0D\u4F1A\u5F39\u51FA\u5BA1\u6279\u786E\u8BA4\u3002"].join("\n");
        }
        return ["\u2705 \u5DF2\u5207\u6362\u4E3A\u4E25\u683C\u5BA1\u6279\u6A21\u5F0F", "", "\u2022 security = allowlist", "\u2022 ask = always", "", "\u6BCF\u4E2A\u547D\u4EE4\u90FD\u4F1A\u5F39\u51FA\u5BA1\u6279\u6309\u94AE\uFF0C\u9700\u624B\u52A8\u786E\u8BA4\u3002"].join("\n");
      }
      if (arg === "reset") {
        const error = await updateGlobalConfig(getRuntime, (cfg) => {
          const exec = cfg.tools?.exec;
          if (exec) {
            delete exec.security;
            delete exec.ask;
            if (Object.keys(exec).length === 0) delete cfg.tools.exec;
            if (cfg.tools && Object.keys(cfg.tools).length === 0) delete cfg.tools;
          }
        });
        if (error) return error;
        return ["\u2705 \u5BA1\u6279\u914D\u7F6E\u5DF2\u91CD\u7F6E", "", "\u5DF2\u79FB\u9664 tools.exec.security \u548C tools.exec.ask", "\u6846\u67B6\u5C06\u4F7F\u7528\u9ED8\u8BA4\u503C\uFF08security=deny, ask=on-miss\uFF09", "", "\u5982\u9700\u5F00\u542F\u547D\u4EE4\u6267\u884C\uFF0C\u8BF7\u4F7F\u7528 /bot-approve on"].join("\n");
      }
      return [
        `\u274C \u672A\u77E5\u53C2\u6570: ${arg}`,
        "",
        "\u53EF\u7528\u9009\u9879: on | off | always | reset | status"
      ].join("\n");
    }
  };
}

// src/commands/bot-group-always.ts
function botGroupAlways(account, getRuntime) {
  return {
    name: ["bot-group-always", "bot-group-allways"],
    description: "\u4FEE\u6539\u7FA4\u6D88\u606F\u9ED8\u8BA4\u54CD\u5E94\u6A21\u5F0F",
    scope: "c2c",
    authorized: checkCommandAuth,
    usage: [
      "/bot-group-always on   AI \u81EA\u4E3B\u5224\u65AD\u4F55\u65F6\u53D1\u8A00\uFF08\u65E0\u9700 @\uFF09",
      "/bot-group-always off  \u4EC5\u5728\u88AB @ \u65F6\u56DE\u590D",
      "/bot-group-always      \u67E5\u770B\u5F53\u524D\u8BBE\u7F6E",
      "",
      "\u8BBE\u4E3A on \u540E\uFF0CAI \u4F1A\u81EA\u4E3B\u5224\u65AD\u6BCF\u6761\u6D88\u606F\u662F\u5426\u9700\u8981\u56DE\u590D\uFF08\u65E0\u9700 @\uFF09\u3002",
      "\u4ECD\u53EF\u901A\u8FC7 groups.{groupId}.requireMention \u5BF9\u5355\u4E2A\u7FA4\u8986\u76D6\u3002"
    ].join("\n"),
    handler: async (ctx) => {
      const arg = (Array.isArray(ctx.command.args) ? ctx.command.args.join(" ") : String(ctx.command.args ?? "")).trim().toLowerCase();
      const currentRequireMention = account.config.defaultRequireMention ?? true;
      if (!arg) {
        return [
          `\u{1F916} \u7FA4\u81EA\u4E3B\u53D1\u8A00\u72B6\u6001\uFF1A${currentRequireMention ? "\u274C \u4EC5\u88AB @ \u65F6\u56DE\u590D" : "\u2705 \u81EA\u4E3B\u5224\u65AD\u4F55\u65F6\u53D1\u8A00"}`,
          `\u4F7F\u7528 <qqbot-cmd-input text="/bot-group-always on" show="/bot-group-always on"/> \u8BBE\u4E3A\u81EA\u4E3B\u53D1\u8A00`,
          `\u4F7F\u7528 <qqbot-cmd-input text="/bot-group-always off" show="/bot-group-always off"/> \u8BBE\u4E3A\u4EC5\u88AB @ \u65F6\u56DE\u590D`
        ].join("\n");
      }
      if (arg !== "on" && arg !== "off") {
        return "\u274C \u53C2\u6570\u9519\u8BEF\uFF0C\u8BF7\u4F7F\u7528 on \u6216 off\n\n\u793A\u4F8B\uFF1A/bot-group-always on";
      }
      const newRequireMention = arg === "off";
      if (newRequireMention === currentRequireMention) {
        return `\u{1F916} \u7FA4\u81EA\u4E3B\u53D1\u8A00\u5DF2\u7ECF\u662F"${arg}"\u72B6\u6001\uFF0C\u65E0\u9700\u64CD\u4F5C`;
      }
      const error = await updateAccountConfig(account, getRuntime, (acfg) => {
        acfg.defaultRequireMention = newRequireMention;
      });
      if (error) return error;
      account.config.defaultRequireMention = newRequireMention;
      return [
        `\u2705 \u7FA4\u81EA\u4E3B\u53D1\u8A00\u5DF2\u8BBE\u7F6E\u4E3A ${newRequireMention ? "**off**\uFF08\u4EC5\u88AB @ \u65F6\u56DE\u590D\uFF09" : "**on**\uFF08AI \u81EA\u4E3B\u5224\u65AD\u4F55\u65F6\u53D1\u8A00\uFF09"}`,
        "",
        newRequireMention ? "\u4EC5\u5728\u88AB @ \u673A\u5668\u4EBA\u624D\u4F1A\u56DE\u590D\u3002" : "AI \u5C06\u81EA\u4E3B\u5224\u65AD\u7FA4\u6D88\u606F\u662F\u5426\u9700\u8981\u56DE\u590D\uFF0C\u65E0\u9700\u88AB @ \u5373\u53EF\u53D1\u8A00\u3002"
      ].join("\n");
    }
  };
}

// src/adapter/pairing.ts
var import_node_module3 = require("module");
var import_node_path6 = __toESM(require("path"), 1);
var _api;
function getPairingApi() {
  if (_api !== void 0) return _api;
  _api = loadPairingApi();
  return _api;
}
function loadPairingApi() {
  const currentFile = __filename;
  const req4 = (0, import_node_module3.createRequire)(currentFile);
  const pluginRoot = import_node_path6.default.resolve(import_node_path6.default.dirname(currentFile), "..", "..");
  const fs21 = req4("node:fs");
  const tryLoad = (root) => {
    for (const rel of ["dist/plugin-sdk/conversation-runtime.js", "plugin-sdk/conversation-runtime.js"]) {
      const p2 = import_node_path6.default.join(root, rel);
      try {
        if (fs21.existsSync(p2)) return req4(p2);
      } catch {
      }
    }
    return null;
  };
  let mod = null;
  try {
    const { findOpenclawRoot } = req4(import_node_path6.default.join(pluginRoot, "scripts", "link-sdk-core.cjs"));
    const root = findOpenclawRoot(pluginRoot);
    if (root) mod = tryLoad(root);
  } catch {
  }
  if (!mod) {
    try {
      const entry = process.argv[1];
      if (entry) {
        const realEntry = fs21.realpathSync(entry);
        let dir = import_node_path6.default.dirname(realEntry);
        for (let i = 0; i < 6; i++) {
          mod = tryLoad(dir);
          if (mod) break;
          const parent = import_node_path6.default.dirname(dir);
          if (parent === dir) break;
          dir = parent;
        }
      }
    } catch {
    }
  }
  if (!mod?.readChannelAllowFromStore) return null;
  return {
    // readChannelAllowFromStore(channel, env?, accountId?) — 位置参数
    readAllowFromStore: (params) => mod.readChannelAllowFromStore(params.channel, void 0, params.accountId),
    // upsertChannelPairingRequest({ channel, id, accountId }) — 对象参数
    issueChallenge: (params) => mod.upsertChannelPairingRequest({
      channel: params.channel,
      id: params.id,
      accountId: params.accountId
    }).then((r) => ({ code: r.code })),
    // buildPairingReply({ channel, idLine, code }) — 对象参数
    buildReply: (params) => mod.buildPairingReply({
      channel: params.channel,
      idLine: "",
      // qqbot 无额外 ID 信息，留空即可
      code: params.code
    }),
    // approveChannelPairingCode({ channel, code, accountId? }) — 对象参数
    approveCode: (params) => mod.approveChannelPairingCode({
      channel: params.channel,
      code: params.code,
      accountId: params.accountId
    })
  };
}

// src/commands/bot-pairing.ts
function botPairing(_getRuntime) {
  return {
    name: "bot-pairing",
    description: "\u7BA1\u7406 DM \u914D\u5BF9\u5BA1\u6279",
    scope: "c2c",
    hidden: true,
    usage: `/bot-pairing approve <code>

\u6279\u51C6\u6307\u5B9A\u914D\u5BF9\u7801\uFF0C\u5141\u8BB8\u5BF9\u5E94\u7528\u6237\u79C1\u804A\u673A\u5668\u4EBA\u3002
\u914D\u5BF9\u7801\u7531\u7528\u6237\u9996\u6B21\u79C1\u804A\u65F6\u81EA\u52A8\u751F\u6210\u3002`,
    authorized: checkCommandAuth,
    handler: async (ctx) => {
      const args = (Array.isArray(ctx.command.args) ? ctx.command.args.join(" ") : String(ctx.command.args ?? "")).trim();
      const parts = args.split(/\s+/);
      const subCmd = parts[0]?.toLowerCase();
      const code = parts[1]?.trim();
      if (subCmd !== "approve" || !code) {
        return "\u26A0\uFE0F \u7528\u6CD5: /bot-pairing approve <\u914D\u5BF9\u7801>";
      }
      const api = getPairingApi();
      if (!api) {
        return "\u26A0\uFE0F \u5F53\u524D OpenClaw \u7248\u672C\u4E0D\u652F\u6301\u914D\u5BF9\u5BA1\u6279\u529F\u80FD\u3002";
      }
      try {
        const result = await api.approveCode({
          channel: "qqbot",
          code
        });
        if (!result?.id) {
          return [
            `\u26A0\uFE0F \u914D\u5BF9\u7801 \`${code}\` \u65E0\u6548\u6216\u5DF2\u8FC7\u671F\u3002`,
            "",
            "\u6BCF\u4E2A\u914D\u5BF9\u7801\u6709\u6548\u671F\u4E3A 1 \u5C0F\u65F6\u3002"
          ].join("\n");
        }
        return [
          "\u2705 \u5DF2\u6279\u51C6\u7528\u6237\u8BBF\u95EE\u3002",
          "",
          `\u7528\u6237 ID: \`${result.id}\``
        ].join("\n");
      } catch (err) {
        return `\u274C \u5BA1\u6279\u5931\u8D25: ${err.message}`;
      }
    }
  };
}

// src/commands/index.ts
function buildCommandList(account, opts) {
  const commands = [];
  const help = botHelp(account, () => commands);
  commands.push(
    help,
    botPing(),
    botVersion(account),
    botMe(),
    botUpgrade(account),
    botLogs(opts.getRuntime()),
    botStreaming(account, opts.getRuntime),
    botClearStorage(account),
    botApprove(opts.getRuntime),
    botGroupAlways(account, opts.getRuntime),
    botPairing(opts.getRuntime)
  );
  return commands;
}

// src/middleware/attachment.ts
var path17 = __toESM(require("path"), 1);

// ../qqbot-nodejs/dist/protocol/utils/reply-limiter.js
var DEFAULT_TTL_MS = 60 * 60 * 1e3;

// ../qqbot-nodejs/dist/protocol/utils/media-tags.js
var VALID_TAGS = ["qqimg", "qqvoice", "qqvideo", "qqfile", "qqmedia"];
var TAG_ALIASES = {
  qq_img: "qqimg",
  qqimage: "qqimg",
  qq_image: "qqimg",
  qqpic: "qqimg",
  qq_pic: "qqimg",
  qqpicture: "qqimg",
  qq_picture: "qqimg",
  qqphoto: "qqimg",
  qq_photo: "qqimg",
  img: "qqimg",
  image: "qqimg",
  pic: "qqimg",
  picture: "qqimg",
  photo: "qqimg",
  qq_voice: "qqvoice",
  qqaudio: "qqvoice",
  qq_audio: "qqvoice",
  voice: "qqvoice",
  audio: "qqvoice",
  qq_video: "qqvideo",
  video: "qqvideo",
  qq_file: "qqfile",
  qqdoc: "qqfile",
  qq_doc: "qqfile",
  file: "qqfile",
  doc: "qqfile",
  document: "qqfile",
  qq_media: "qqmedia",
  media: "qqmedia",
  attachment: "qqmedia",
  attach: "qqmedia",
  qqattachment: "qqmedia",
  qq_attachment: "qqmedia",
  qqsend: "qqmedia",
  qq_send: "qqmedia",
  send: "qqmedia"
};
var ALL_TAG_NAMES = [...VALID_TAGS, ...Object.keys(TAG_ALIASES)];
ALL_TAG_NAMES.sort((a, b2) => b2.length - a.length);
var TAG_NAME_PATTERN = ALL_TAG_NAMES.join("|");
var LEFT_BRACKET = "(?:[<\uFF1C<]|&lt;)";
var RIGHT_BRACKET = "(?:[>\uFF1E>]|&gt;)";
var SELF_CLOSING_TAG_REGEX = new RegExp("`?" + LEFT_BRACKET + "\\s*(" + TAG_NAME_PATTERN + `)(?:\\s+(?!file|src|path|url)[a-z_-]+\\s*=\\s*["']?[^"'\\s\uFF1C<>\uFF1E>]*?["']?)*\\s+(?:file|src|path|url)\\s*=\\s*["']?([^"'\\s>\uFF1E]+?)["']?(?:\\s+[a-z_-]+\\s*=\\s*["']?[^"'\\s\uFF1C<>\uFF1E>]*?["']?)*\\s*/?\\s*` + RIGHT_BRACKET + "`?", "gi");
var FUZZY_MEDIA_TAG_REGEX = new RegExp("`?" + LEFT_BRACKET + "\\s*(" + TAG_NAME_PATTERN + ")\\s*" + RIGHT_BRACKET + `["']?\\s*([^<\uFF1C<\uFF1E>"'\`]+?)\\s*["']?` + LEFT_BRACKET + "\\s*/?\\s*(?:" + TAG_NAME_PATTERN + ")\\s*" + RIGHT_BRACKET + "`?", "gi");
var MULTILINE_TAG_CLEANUP = new RegExp("(" + LEFT_BRACKET + "\\s*(?:" + TAG_NAME_PATTERN + ")\\s*" + RIGHT_BRACKET + ")([\\s\\S]*?)(" + LEFT_BRACKET + "\\s*/?\\s*(?:" + TAG_NAME_PATTERN + ")\\s*" + RIGHT_BRACKET + ")", "gi");

// ../qqbot-nodejs/dist/protocol/utils/ref-index-store.js
var import_node_fs6 = __toESM(require("fs"), 1);
var DEFAULT_TTL_MS2 = 7 * 24 * 60 * 60 * 1e3;

// ../qqbot-nodejs/dist/protocol/utils/session-store.js
var import_node_fs7 = __toESM(require("fs"), 1);
var import_node_path7 = __toESM(require("path"), 1);
var DEFAULT_EXPIRE_MS = 5 * 60 * 1e3;

// ../qqbot-nodejs/dist/protocol/utils/text-parsing.js
var MAX_FACE_EXT_BYTES = 64 * 1024;

// ../qqbot-nodejs/dist/protocol/utils/media-source.js
var fs14 = __toESM(require("fs"), 1);

// ../qqbot-nodejs/dist/protocol/utils/image-size.js
var import_node_buffer = require("buffer");

// ../qqbot-nodejs/dist/protocol/utils/ffmpeg.js
var import_node_child_process = require("child_process");
var fs15 = __toESM(require("fs"), 1);
var path13 = __toESM(require("path"), 1);

// ../qqbot-nodejs/dist/protocol/utils/audio.js
var import_node_child_process2 = require("child_process");
var fs16 = __toESM(require("fs"), 1);
var path14 = __toESM(require("path"), 1);
var _silkWasmPromise = null;
function loadSilkWasm() {
  if (_silkWasmPromise) {
    return _silkWasmPromise;
  }
  _silkWasmPromise = (async () => {
    try {
      const mod = await import("silk-wasm");
      return mod;
    } catch {
      return null;
    }
  })();
  return _silkWasmPromise;
}
function lowerExt(p2) {
  return path14.extname(p2).toLowerCase();
}
function pcmToWav(pcmData, sampleRate, channels = 1, bitsPerSample = 16) {
  const byteRate = sampleRate * channels * (bitsPerSample / 8);
  const blockAlign = channels * (bitsPerSample / 8);
  const dataSize = pcmData.length;
  const headerSize = 44;
  const fileSize = headerSize + dataSize;
  const buffer = Buffer.alloc(fileSize);
  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(fileSize - 8, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(channels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bitsPerSample, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(dataSize, 40);
  Buffer.from(pcmData.buffer, pcmData.byteOffset, pcmData.byteLength).copy(buffer, headerSize);
  return buffer;
}
function stripAmrHeader(buf) {
  const AMR_HEADER = Buffer.from("#!AMR\n");
  if (buf.length > 6 && buf.subarray(0, 6).equals(AMR_HEADER)) {
    return buf.subarray(6);
  }
  return buf;
}
async function convertSilkToWav(inputPath, outputDir) {
  if (!fs16.existsSync(inputPath)) {
    return null;
  }
  const fileBuf = fs16.readFileSync(inputPath);
  const strippedBuf = stripAmrHeader(fileBuf);
  const rawData = new Uint8Array(strippedBuf.buffer, strippedBuf.byteOffset, strippedBuf.byteLength);
  const silk = await loadSilkWasm();
  if (!silk || !silk.isSilk(rawData)) {
    return null;
  }
  const sampleRate = 24e3;
  const result = await silk.decode(rawData, sampleRate);
  const wavBuffer = pcmToWav(result.data, sampleRate);
  const dir = outputDir || path14.dirname(inputPath);
  if (!fs16.existsSync(dir)) {
    fs16.mkdirSync(dir, { recursive: true });
  }
  const baseName = path14.basename(inputPath, path14.extname(inputPath));
  const wavPath = path14.join(dir, `${baseName}.wav`);
  fs16.writeFileSync(wavPath, wavBuffer);
  return { wavPath, duration: result.duration };
}
function isVoiceAttachment(att) {
  if (att.content_type === "voice" || att.content_type?.startsWith("audio/")) {
    return true;
  }
  const ext = att.filename ? lowerExt(att.filename) : "";
  return [".amr", ".silk", ".slk", ".slac"].includes(ext);
}

// src/utils/stt.ts
var fs17 = __toESM(require("fs"), 1);
var path15 = __toESM(require("path"), 1);
function resolveSTTConfig(cfg) {
  const channels = asRecord(cfg.channels);
  const qqbot = asRecord(channels?.qqbot);
  const sttCfg = asRecord(qqbot?.stt);
  if (sttCfg?.enabled === false) {
    return null;
  }
  const models = asRecord(cfg.models);
  const providers = asRecord(models?.providers);
  if (sttCfg) {
    const providerId = readString(sttCfg, "provider") ?? "openai";
    const providerCfg = asRecord(providers?.[providerId]);
    const baseUrl = readString(sttCfg, "baseUrl") ?? readString(providerCfg, "baseUrl");
    const apiKey = readString(sttCfg, "apiKey") ?? readString(providerCfg, "apiKey");
    const model = readString(sttCfg, "model") ?? "whisper-1";
    if (baseUrl && apiKey) {
      return { enabled: true, baseUrl: baseUrl.replace(/\/+$/, ""), apiKey, model };
    }
  }
  const tools = asRecord(cfg.tools);
  const media = asRecord(tools?.media);
  const audio = asRecord(media?.audio);
  const audioModels = audio?.models;
  const audioModelEntry = Array.isArray(audioModels) ? asRecord(audioModels[0]) : void 0;
  if (audioModelEntry) {
    const providerId = readString(audioModelEntry, "provider") ?? "openai";
    const providerCfg = asRecord(providers?.[providerId]);
    const baseUrl = readString(audioModelEntry, "baseUrl") ?? readString(providerCfg, "baseUrl");
    const apiKey = readString(audioModelEntry, "apiKey") ?? readString(providerCfg, "apiKey");
    const model = readString(audioModelEntry, "model") ?? "whisper-1";
    if (baseUrl && apiKey) {
      return { enabled: true, baseUrl: baseUrl.replace(/\/+$/, ""), apiKey, model };
    }
  }
  return null;
}
async function transcribeAudio(audioPath, cfg) {
  const sttCfg = resolveSTTConfig(cfg);
  if (!sttCfg) {
    return null;
  }
  const fileBuffer = fs17.readFileSync(audioPath);
  const fileName = sanitizeFileName2(path15.basename(audioPath));
  const mime = guessMimeType(fileName);
  const form = new FormData();
  form.append("file", new Blob([fileBuffer], { type: mime }), fileName);
  form.append("model", sttCfg.model);
  const resp = await fetch(`${sttCfg.baseUrl}/audio/transcriptions`, {
    method: "POST",
    headers: { Authorization: `Bearer ${sttCfg.apiKey}` },
    body: form
  });
  if (!resp.ok) {
    const detail = await resp.text().catch(() => "");
    throw new Error(`STT failed (HTTP ${resp.status}): ${detail.slice(0, 300)}`);
  }
  const result = await resp.json();
  return result.text?.trim() || null;
}
function asRecord(value) {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value;
  }
  return void 0;
}
function readString(obj, key) {
  const val = obj?.[key];
  if (typeof val === "string" && val.trim()) {
    return val.trim();
  }
  return void 0;
}
function sanitizeFileName2(name) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}
function guessMimeType(fileName) {
  const ext = path15.extname(fileName).toLowerCase();
  const mimeMap = {
    ".wav": "audio/wav",
    ".mp3": "audio/mpeg",
    ".ogg": "audio/ogg",
    ".flac": "audio/flac",
    ".m4a": "audio/mp4",
    ".aac": "audio/aac",
    ".silk": "audio/silk",
    ".amr": "audio/amr",
    ".pcm": "audio/pcm"
  };
  return mimeMap[ext] ?? "application/octet-stream";
}

// src/utils/voice-text.ts
function formatVoiceText2(transcripts) {
  if (transcripts.length === 0) {
    return "";
  }
  if (transcripts.length === 1) {
    const t = transcripts[0];
    const durationStr = t.duration ? ` (${formatDuration2(t.duration)})` : "";
    return `[Voice message${durationStr}] ${t.text}`;
  }
  return transcripts.map((t, i) => {
    const durationStr = t.duration ? ` (${formatDuration2(t.duration)})` : "";
    return `[Voice ${i + 1}${durationStr}] ${t.text}`;
  }).join("\n");
}
function formatDuration2(seconds) {
  if (seconds < 60) {
    return `${Math.round(seconds)}s`;
  }
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

// src/adapter/media.ts
var import_node_module4 = require("module");
var dns2 = __toESM(require("dns"), 1);
var path16 = __toESM(require("path"), 1);
var fs18 = __toESM(require("fs"), 1);
var crypto5 = __toESM(require("crypto"), 1);
var req3 = (0, import_node_module4.createRequire)(__filename);
var _save;
function downloadRemoteMedia(opts) {
  if (_save === void 0) {
    try {
      const mod = req3("openclaw/plugin-sdk/media-runtime");
      _save = mod.saveRemoteMedia;
    } catch {
      _save = null;
    }
  }
  return _save ? _save(opts) : downloadViaFetch(opts);
}
var PRIVATE_RANGES = [
  [0x0A000000n, 8],
  // 10.0.0.0/8
  [0xAC100000n, 12],
  // 172.16.0.0/12
  [0xC0A80000n, 16],
  // 192.168.0.0/16
  [0x7F000000n, 8],
  // 127.0.0.0/8
  [0xA9FE0000n, 16],
  // 169.254.0.0/16
  [0xE0000000n, 4]
  // 224.0.0.0/4 (multicast)
];
function ipToBigInt(ip) {
  return ip.split(".").reduce((acc, octet) => acc << 8n | BigInt(Number(octet)), 0n);
}
function isPrivateIP(ip) {
  const val = ipToBigInt(ip);
  return PRIVATE_RANGES.some(([mask, prefix]) => val >> 32n - BigInt(prefix) === mask >> 32n - BigInt(prefix));
}
async function assertSafeHostname(hostname) {
  const addresses = await dns2.promises.resolve4(hostname).catch(() => []);
  if (addresses.length === 0) throw new Error(`DNS resolution failed: ${hostname}`);
  for (const addr of addresses) {
    if (isPrivateIP(addr)) {
      throw new Error(`SSRF blocked: ${hostname} resolves to private IP ${addr}`);
    }
  }
}
async function downloadViaFetch(opts) {
  const parsed = new URL(opts.url);
  if (parsed.protocol !== "https:") {
    throw new Error(`Only HTTPS allowed: ${parsed.protocol}`);
  }
  await assertSafeHostname(parsed.hostname);
  const dir = getQQBotMediaDir(opts.subdir ?? "downloads");
  if (!fs18.existsSync(dir)) fs18.mkdirSync(dir, { recursive: true });
  const resp = await fetch(opts.url, {
    signal: AbortSignal.timeout(opts.timeoutMs ?? 12e4)
  });
  if (!resp.ok) throw new Error(`Download HTTP ${resp.status}`);
  const maxBytes = opts.maxBytes ?? 500 * 1024 * 1024;
  const buf = Buffer.from(await resp.arrayBuffer());
  if (buf.length > maxBytes) throw new Error(`Download exceeds ${(maxBytes / 1024 / 1024).toFixed(0)}MB`);
  const ext = opts.originalFilename ? path16.extname(opts.originalFilename) || ".bin" : ".bin";
  const name = opts.originalFilename ? path16.basename(opts.originalFilename, path16.extname(opts.originalFilename)) : "download";
  const rand = crypto5.randomBytes(4).toString("hex");
  const filePath = path16.join(dir, `${name}_${Date.now()}_${rand}${ext}`);
  fs18.writeFileSync(filePath, buf);
  return { path: filePath };
}

// src/middleware/attachment.ts
init_resolve();
function attachmentProcessor(opts) {
  return async (ctx, next) => {
    const msg = ctx.message;
    const attachments = msg.attachments;
    if (attachments?.length) {
      const runtime2 = opts.getRuntime();
      const adapters = getAdapters(runtime2);
      const cfg = adapters.getConfig?.() ?? {};
      const log4 = ctx.log;
      const result = await processAttachments(attachments, cfg, log4);
      if (result.voiceText || result.imageUrls.length > 0 || result.otherInfo || result.localMediaPaths.length > 0) {
        ctx.state.processedAttachments = result;
      }
    }
    await next();
  };
}
async function processAttachments(attachments, cfg, log4) {
  const sttCfg = resolveSTTConfig(cfg);
  const audioPolicy = resolveAudioPolicy(cfg);
  const imageUrls = [];
  const otherParts = [];
  const transcripts = [];
  const localMediaPaths = [];
  const localMediaTypes = [];
  const remoteMediaUrls = [];
  const tasks = attachments.map(async (att) => {
    const isVoice = isVoiceAttachment(att);
    const isImage = att.content_type?.startsWith("image/");
    const url = normalizeUrl(att.url);
    if (isImage && url) {
      const localPath = await downloadMediaFile(url, att.filename, log4);
      return { type: "image", localPath, url, contentType: att.content_type ?? "image/png" };
    }
    if (isVoice) {
      const transcript = await processVoiceAttachment(att, sttCfg, audioPolicy, log4);
      return { type: "voice", transcript };
    }
    if (url) {
      const localPath = await downloadMediaFile(url, att.filename, log4);
      return { type: "other", localPath, url, filename: att.filename ?? att.content_type };
    }
    return { type: "other", localPath: null, url: "", filename: att.filename ?? att.content_type };
  });
  const results = await Promise.all(tasks);
  for (const result of results) {
    if (result.type === "image") {
      if (result.localPath) {
        imageUrls.push(result.localPath);
        localMediaPaths.push(result.localPath);
        localMediaTypes.push(result.contentType);
      } else {
        imageUrls.push(result.url);
        remoteMediaUrls.push(result.url);
      }
    } else if (result.type === "voice") {
      transcripts.push(result.transcript);
      if (result.transcript.localPath) {
        localMediaPaths.push(result.transcript.localPath);
        localMediaTypes.push("audio/wav");
      } else if (result.transcript.remoteUrl) {
        remoteMediaUrls.push(result.transcript.remoteUrl);
      }
    } else if (result.type === "other") {
      if (result.localPath) {
        otherParts.push(`[Attachment: ${result.localPath}]`);
        localMediaPaths.push(result.localPath);
        localMediaTypes.push("application/octet-stream");
      } else {
        otherParts.push(`[Attachment: ${result.filename}]`);
      }
    }
  }
  return {
    voiceText: formatVoiceText2(transcripts),
    imageUrls,
    otherInfo: otherParts.join("\n"),
    transcripts,
    localMediaPaths,
    localMediaTypes,
    remoteMediaUrls
  };
}
async function processVoiceAttachment(att, sttCfg, audioPolicy, log4) {
  const asrReferText = att.asr_refer_text?.trim() || void 0;
  const remoteUrl = normalizeUrl(att.voice_wav_url) || normalizeUrl(att.url) || void 0;
  if (!sttCfg) {
    if (asrReferText) {
      log4?.debug?.(`Voice: using asr_refer_text (STT not configured)`);
      return { text: asrReferText, source: "asr", asrReferText, remoteUrl };
    }
    return {
      text: "[Voice message - transcription unavailable]",
      source: "fallback",
      asrReferText,
      remoteUrl
    };
  }
  let localPath;
  let duration;
  try {
    const wavUrl = normalizeUrl(att.voice_wav_url);
    if (wavUrl) {
      const downloaded = await downloadMediaFile(wavUrl, void 0, log4);
      if (downloaded) {
        localPath = downloaded;
        log4?.debug?.(`Voice: downloaded WAV from voice_wav_url`);
      }
    }
    if (!localPath) {
      const silkUrl = normalizeUrl(att.url);
      if (silkUrl) {
        const silkPath = await downloadMediaFile(silkUrl, att.filename, log4);
        if (silkPath) {
          const ext = path17.extname(silkPath).toLowerCase();
          if (audioPolicy.sttDirectFormats.includes(ext)) {
            localPath = silkPath;
          } else {
            const wavResult = await convertSilkToWav(silkPath);
            if (wavResult) {
              localPath = wavResult.wavPath;
              duration = wavResult.duration / 1e3;
              log4?.debug?.(`Voice: SILK\u2192WAV (${formatDuration2(duration)})`);
            } else {
              localPath = silkPath;
            }
          }
        }
      }
    }
  } catch (err) {
    log4?.error(`Voice download/convert failed: ${err instanceof Error ? err.message : String(err)}`);
  }
  if (localPath) {
    try {
      const transcript = await transcribeAudio(localPath, cfg2stt(sttCfg));
      if (transcript) {
        log4?.debug?.(`Voice STT: ${transcript.slice(0, 80)}...`);
        return { text: transcript, source: "stt", duration, localPath, remoteUrl, asrReferText };
      }
    } catch (err) {
      log4?.error(`Voice STT failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  }
  if (asrReferText) {
    return { text: asrReferText, source: "asr", duration, localPath, remoteUrl, asrReferText };
  }
  return {
    text: "[Voice message - transcription failed]",
    source: "fallback",
    duration,
    localPath,
    remoteUrl,
    asrReferText
  };
}
function resolveAudioPolicy(cfg) {
  const channels = cfg.channels;
  const qqbot = channels?.qqbot;
  const policy = qqbot?.audioFormatPolicy;
  return {
    sttDirectFormats: normalizeFormats(policy?.sttDirectFormats ?? []),
    uploadDirectFormats: normalizeFormats(
      policy?.uploadDirectFormats ?? qqbot?.voiceDirectUploadFormats ?? [".wav", ".mp3", ".silk"]
    ),
    transcodeEnabled: policy?.transcodeEnabled !== false
  };
}
function normalizeFormats(formats) {
  return formats.map((f) => {
    const lower = f.toLowerCase().trim();
    return lower.startsWith(".") ? lower : `.${lower}`;
  });
}
function cfg2stt(sttCfg) {
  return { channels: { qqbot: { stt: sttCfg } } };
}
function normalizeUrl(url) {
  if (!url) return "";
  return url.startsWith("//") ? `https:${url}` : url;
}
async function downloadMediaFile(url, filename, log4) {
  if (!url.startsWith("https://")) {
    log4?.debug?.(`Skipping non-HTTPS URL: ${url.slice(0, 80)}`);
    return null;
  }
  try {
    const result = await downloadRemoteMedia({
      url,
      subdir: "qqbot/downloads",
      originalFilename: filename,
      maxBytes: 500 * 1024 * 1024,
      timeoutMs: 12e4
    });
    log4?.debug?.(`Downloaded: ${result.path}`);
    return result.path;
  } catch (err) {
    log4?.error(`Download failed: ${url.slice(0, 80)} \u2014 ${err instanceof Error ? err.message : String(err)}`);
    return null;
  }
}

// src/dispatch/body-assembler.ts
init_resolve();
var QUOTE_BEGIN = "[Quoted message begins]";
var QUOTE_END = "[Quoted message ends]";
var REF_BEGIN = "[Reference message begins]";
var REF_END = "[Reference message ends]";
var HISTORY_BEGIN = "[Chat history begins]";
var HISTORY_END = "[Chat history ends]";
var MERGE_CTX_BEGIN = "[Merged messages begins]";
var MERGE_CTX_END = "[Merged messages ends]";
var CURRENT_MSG = "[Current message]";
function assembleBody(ctx, msg, account, getRuntime) {
  const rawBody = msg.content ?? "";
  const isGroup = msg.kind === "group";
  const mentionState = ctx.state.mention;
  const wasMentioned = mentionState?.wasMentioned ?? false;
  const processed = ctx.state.processedAttachments;
  const quote = ctx.state.quote;
  const history = ctx.state.history;
  const mergedMessages = ctx.state.mergedMessages;
  const userContent = buildUserContent(ctx.message.content ?? "", processed);
  const quotePart = buildQuotePart(quote);
  const userMessage = mergedMessages && mergedMessages.length > 0 ? buildMergedUserMessage({ messages: mergedMessages, quotePart, isGroup, wasMentioned, getRuntime }) : buildUserMessage({ msg, userContent, quotePart, isGroup, wasMentioned });
  const dynamicCtx = buildDynamicCtx(processed, msg, quote);
  const agentBody = buildAgentBody({
    userContent,
    base: dynamicCtx + userMessage,
    isGroup,
    wasMentioned,
    history
  });
  const bodyContent = mergedMessages && mergedMessages.length > 0 ? userMessage : `${quotePart}${userContent}`;
  const webBody = getRuntime ? renderWebBody(getRuntime, bodyContent, msg, isGroup) : bodyContent;
  const systemPrompt = account.systemPrompt?.trim() || void 0;
  return { webBody, agentBody, rawBody, systemPrompt };
}
function buildUserContent(sanitizedRaw, processed) {
  const sanitized = sanitizedRaw.trim();
  const voiceText = processed?.voiceText ?? "";
  const attachmentInfo = processed?.otherInfo ? `
${processed.otherInfo}` : "";
  if (voiceText) {
    return (sanitized ? `${sanitized}
${voiceText}` : voiceText) + attachmentInfo;
  }
  return sanitized + attachmentInfo;
}
function buildQuotePart(quote) {
  if (!quote) return "";
  const text = quote.text || "Original content unavailable";
  return `${QUOTE_BEGIN}
${text}
${QUOTE_END}
${CURRENT_MSG}
`;
}
function buildUserMessage(input) {
  const { msg, userContent, quotePart, isGroup, wasMentioned } = input;
  const atYouTag = isGroup && wasMentioned ? " (@you)" : "";
  if (isGroup) {
    const senderLabel = formatSenderLabel(msg.senderName, msg.senderId);
    return `${quotePart}[${senderLabel}] ${userContent}${atYouTag}`;
  }
  return `${quotePart}${userContent}`;
}
function buildMergedUserMessage(input) {
  const { messages, quotePart, isGroup, wasMentioned, getRuntime } = input;
  if (messages.length <= 1) {
    const single = messages[0];
    return buildUserMessage({
      msg: single.message,
      userContent: single.message.content ?? "",
      quotePart,
      isGroup,
      wasMentioned
    });
  }
  const formatEnvelope = getRuntime ? getAdapters(getRuntime()).formatEnvelope : null;
  const lines = messages.map((ctx, i) => {
    const isLast = i === messages.length - 1;
    const line = formatMergedLine(ctx, { isGroup, isLast, wasMentioned, formatEnvelope });
    return line && isLast ? `${quotePart}${line}` : line;
  }).filter(Boolean);
  if (!isGroup || allSameSender(messages)) {
    return lines.join("\n");
  }
  const last = lines.pop();
  return [MERGE_CTX_BEGIN, ...lines, MERGE_CTX_END, CURRENT_MSG, last].join("\n");
}
function formatMergedLine(ctx, opts) {
  const m3 = ctx.message;
  const content = (m3.content ?? "").trim();
  if (opts.formatEnvelope && opts.isGroup) {
    const atYouTag = opts.isLast && opts.wasMentioned ? " (@you)" : "";
    return opts.formatEnvelope({
      channel: "qqbot",
      from: formatSenderLabel(m3.senderName, m3.senderId),
      timestamp: normalizeTimestamp(m3.timestamp),
      body: content + atYouTag,
      chatType: "group"
    });
  }
  return opts.isGroup ? `${formatSenderLabel(m3.senderName, m3.senderId)}: ${content}` : content;
}
function allSameSender(messages) {
  const first = messages[0]?.message.senderId;
  return messages.every((c) => c.message.senderId === first);
}
function buildDynamicCtx(processed, msg, quote) {
  const lines = [];
  if (processed?.imageUrls.length) {
    lines.push(`- Images: ${processed.imageUrls.join(", ")}`);
  }
  const transcripts = processed?.transcripts ?? [];
  const voiceRefs = unique([
    ...transcripts.map((t) => t.localPath).filter(isNonEmpty),
    ...transcripts.map((t) => t.remoteUrl).filter(isNonEmpty)
  ]);
  if (voiceRefs.length > 0) {
    lines.push(`- Voice: ${voiceRefs.join(", ")}`);
  }
  const asrTexts = unique(
    transcripts.map((t) => t.source === "asr" ? t.text : t.asrReferText).filter(isNonEmpty)
  );
  if (asrTexts.length > 0) {
    lines.push(`- ASR: ${asrTexts.join(" | ")}`);
  }
  if (!quote) {
    const elementsCtx = buildMsgElementsContext(msg);
    if (elementsCtx.length > 0) {
      lines.push(REF_BEGIN, ...elementsCtx, REF_END);
    }
  }
  return lines.length > 0 ? `${lines.join("\n")}

` : "";
}
function buildMsgElementsContext(msg) {
  const elements = msg.msgElements;
  if (!elements || elements.length === 0) return [];
  const lines = [];
  let index = 0;
  for (const el of elements) {
    const content = el.content?.trim();
    if (!content) continue;
    index += 1;
    const author = el.author;
    const sender = author?.username ?? "\u672A\u77E5";
    lines.push(
      `=== \u6D88\u606F ${index} ===`,
      `[\u6D88\u606F\u5185\u5BB9] ${content}`,
      `[\u53D1\u9001\u8005] ${sender}`
    );
  }
  return lines;
}
function unique(arr) {
  return [...new Set(arr)];
}
function isNonEmpty(x) {
  return typeof x === "string" && x.length > 0;
}
function buildAgentBody(input) {
  const { userContent, base, isGroup, wasMentioned, history } = input;
  if (userContent.trim().startsWith("/")) {
    return userContent;
  }
  if (isGroup && wasMentioned && history && history.length > 0) {
    const historyText = history.map((h2) => {
      const label = formatSenderLabel(h2.senderName, h2.senderId);
      return `[${label}] ${h2.content}`;
    }).join("\n");
    return [HISTORY_BEGIN, historyText, "", HISTORY_END, CURRENT_MSG, base].join("\n");
  }
  return base;
}
function formatSenderLabel(name, id) {
  if (!name) return id;
  return name.includes(id) ? name : `${name} (${id})`;
}
function renderWebBody(getRuntime, bodyContent, msg, isGroup) {
  try {
    const { formatEnvelope } = getAdapters(getRuntime());
    if (!formatEnvelope) return bodyContent;
    return formatEnvelope({
      channel: "qqbot",
      from: msg.senderName ?? msg.senderId,
      timestamp: normalizeTimestamp(msg.timestamp),
      body: bodyContent,
      chatType: isGroup ? "group" : "direct"
    });
  } catch {
    return bodyContent;
  }
}
function normalizeTimestamp(ts) {
  if (typeof ts === "number") return ts;
  if (typeof ts === "string") {
    const d3 = new Date(ts).getTime();
    if (!Number.isNaN(d3)) return d3;
  }
  return Date.now();
}

// src/middleware/policy-injector.ts
init_config();
function createPolicyInjector(account) {
  return async (ctx, next) => {
    const msg = ctx.message;
    const scope = msg.kind;
    const policy = {
      scope,
      accountId: account.accountId,
      // 访问控制：dmPolicy（c2c） / groupPolicy（group），默认 allowlist
      c2cMode: account.config?.dmPolicy ?? "allowlist",
      groupMode: account.config?.groupPolicy ?? "allowlist",
      allowFrom: account.config?.allowFrom ?? [],
      groupAllowFrom: account.config?.groupAllowFrom ?? []
    };
    if (scope === "group") {
      const groupOpenid = msg.groupOpenid ?? "";
      const groupCfg = resolveGroupConfigFromAccount(account, groupOpenid);
      policy.group = {
        requireMention: groupCfg.requireMention,
        ignoreOtherMentions: groupCfg.ignoreOtherMentions,
        historyLimit: groupCfg.historyLimit,
        prompt: groupCfg.prompt
      };
    }
    ctx.state.policy = policy;
    await next();
  };
}

// src/features/history-store.ts
var _store = null;
function getHistoryStore() {
  if (!_store) _store = new MemoryHistoryStore();
  return _store;
}
function historyGroupKey(accountId, groupId) {
  return `${accountId}:${groupId}`;
}
function clearGroupHistory(accountId, groupId) {
  _store?.clear?.(historyGroupKey(accountId, groupId));
}

// src/middleware/access-control.ts
function dynamicAccessControl(params) {
  const { accountId, getRuntime } = params;
  return async (ctx, next) => {
    const p2 = ctx.state.policy;
    const isGroup = ctx.message.kind === "group";
    const mode = isGroup ? p2?.groupMode ?? "open" : p2?.c2cMode ?? "allowlist";
    if (mode === "disabled") {
      ctx.log?.info?.(`[access] blocked ${isGroup ? "group" : "c2c"} from ${ctx.message.senderId}: policy disabled`);
      ctx.stop("access:policy_disabled");
      return;
    }
    if (mode === "open") {
      await next();
      return;
    }
    const allowList = isGroup ? p2?.groupAllowFrom ?? [] : p2?.allowFrom ?? [];
    if (!allowList.length || allowList.includes("*")) {
      await next();
      return;
    }
    const id = isGroup ? ctx.message.groupOpenid ?? "" : ctx.message.senderId;
    if (allowList.includes(id)) {
      await next();
      return;
    }
    if (mode === "pairing" && !isGroup) {
      await checkPairingMode(ctx, next, {
        accountId,
        getRuntime,
        senderId: ctx.message.senderId
      });
      return;
    }
    const listLabel = isGroup ? "groupAllowFrom" : "allowFrom";
    ctx.log?.info?.(
      `[access] blocked ${isGroup ? "group" : "c2c"} from ${id}: not in ${listLabel}`
    );
    ctx.stop("access:not_allowlisted");
  };
}
async function checkPairingMode(ctx, next, opts) {
  const api = getPairingApi();
  if (!api) {
    ctx.log?.info?.(`[access] pairing unavailable for ${opts.senderId}`);
    ctx.stop("access:pairing_unavailable");
    return;
  }
  try {
    const storeIds = await api.readAllowFromStore({
      channel: "qqbot",
      accountId: opts.accountId
    });
    if (storeIds.includes(opts.senderId) || storeIds.includes("*")) {
      await next();
      return;
    }
    const challenge = await api.issueChallenge({
      channel: "qqbot",
      id: opts.senderId,
      accountId: opts.accountId
    });
    const frameworkReply = api.buildReply({
      code: challenge.code,
      channel: "qqbot"
    });
    const reply = [
      frameworkReply,
      "",
      "QQ \u7BA1\u7406\u5458\u53EF\u76F4\u63A5\u6267\u884C\uFF1A",
      "",
      "```",
      `/bot-pairing approve ${challenge.code}`,
      "```"
    ].join("\n");
    ctx.log?.info?.(`[access] pairing required for ${opts.senderId}`);
    await ctx.bot.sendText(ctx.replyTarget, reply).catch(() => {
    });
    ctx.stop("access:pairing_required");
  } catch (err) {
    ctx.log?.error?.(`[access] pairing error: ${err.message}`);
    ctx.stop(`access:pairing_error: ${err.message}`);
  }
}

// src/utils/mention.ts
function stripMentionText(text, mentions) {
  if (!text || !mentions?.length) return text;
  let cleaned = text;
  for (const m3 of mentions) {
    const openid = m3.member_openid ?? m3.id ?? m3.user_openid;
    if (!openid) continue;
    if (m3.is_you) {
      cleaned = cleaned.replace(new RegExp(`<@!?${openid}>`, "g"), "").trim();
    } else {
      const displayName = m3.nickname ?? m3.username;
      if (displayName) {
        cleaned = cleaned.replace(new RegExp(`<@!?${openid}>`, "g"), `@${displayName}`);
      }
    }
  }
  return cleaned;
}

// src/features/question-response.ts
var import_question_gateway_runtime = require("openclaw/plugin-sdk/question-gateway-runtime");
var QUESTION_TARGET_TTL_MS = 24 * 60 * 60 * 1e3;
var STAGED_QUESTION_TTL_MS = 5 * 60 * 1e3;
var pendingTargets = /* @__PURE__ */ new Map();
var stagedQuestions = /* @__PURE__ */ new Map();
function targetKey(accountId, scope, targetId) {
  return `${accountId}:${scope}:${targetId}`;
}
function hasPendingQuestionTarget(params) {
  return pendingTargets.has(targetKey(params.accountId, params.scope, params.targetId));
}
function stagedKey(accountId, text) {
  return `${accountId}:${text.trim()}`;
}
function stagePendingQuestionPayload(params) {
  const questionId = import_question_gateway_runtime.questionGatewayRuntime.readAskUserQuestionId(params.payload);
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
function takeStagedQuestionId(accountId, text) {
  const key = stagedKey(accountId, text);
  const now = Date.now();
  const queue = (stagedQuestions.get(key) ?? []).filter((entry2) => entry2.expiresAtMs > now);
  const entry = queue.shift();
  if (queue.length > 0) stagedQuestions.set(key, queue);
  else stagedQuestions.delete(key);
  return entry?.questionId;
}
function registerPendingQuestionTarget(params) {
  const payloadQuestionId = params.payload ? import_question_gateway_runtime.questionGatewayRuntime.readAskUserQuestionId(params.payload) : void 0;
  const stagedQuestionId = params.text ? takeStagedQuestionId(params.accountId, params.text) : void 0;
  const questionId = payloadQuestionId ?? stagedQuestionId;
  if (!questionId) return false;
  const key = targetKey(params.accountId, params.scope, params.targetId);
  const existing = pendingTargets.get(key);
  if (existing?.questionId === questionId) return true;
  if (existing) clearTimeout(existing.cleanupTimer);
  const target = {
    questionId,
    resolving: false,
    cleanupTimer: setTimeout(() => {
      if (pendingTargets.get(key) === target) pendingTargets.delete(key);
    }, QUESTION_TARGET_TTL_MS)
  };
  target.cleanupTimer.unref?.();
  pendingTargets.set(key, target);
  import_question_gateway_runtime.questionGatewayRuntime.registerChannelDelivery({
    questionId,
    deliveryId: `qqbot-plain-reply:${key}:${questionId}`,
    finalize: () => {
      if (pendingTargets.get(key) !== target) return;
      clearTimeout(target.cleanupTimer);
      pendingTargets.delete(key);
    }
  });
  params.log?.info(`registered QQ plain-text answer target id=${questionId}`);
  return true;
}
async function resolvePendingQuestionTarget(params) {
  const key = targetKey(params.accountId, params.scope, params.targetId);
  const target = pendingTargets.get(key);
  const answer = params.text.trim();
  if (!target || target.resolving || !answer) return false;
  target.resolving = true;
  try {
    const numericChoice = /^[1-9]\d*$/.test(answer) ? Number(answer) - 1 : void 0;
    const result = await import_question_gateway_runtime.questionGatewayRuntime.resolveOption({
      cfg: params.cfg,
      questionId: target.questionId,
      senderId: params.senderId,
      clientDisplayName: `QQ Bot question (${params.senderId})`,
      ...numericChoice === void 0 ? { optionValue: answer } : { optionIndex: numericChoice }
    });
    if (result.status === "answered" || result.status === "already-terminal") {
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

// src/gateway/middleware-setup.ts
function setupMiddlewares(bot, account, opts) {
  bot.use(errorHandler());
  bot.use(messageFilter({ skipSelfEcho: false }));
  bot.use(createPolicyInjector(account));
  bot.use(historyBuffer({
    store: getHistoryStore(),
    groupKey: (ctx) => {
      const gid = ctx.message.groupOpenid;
      if (ctx.message.kind !== "group" || !gid) return void 0;
      return historyGroupKey(account.accountId, gid);
    }
  }));
  bot.use(dynamicAccessControl({
    accountId: account.accountId,
    getRuntime: opts.getRuntime
  }));
  bot.use(mentionGate());
  bot.use(contentSanitizer({
    parseFaceTags: true,
    transform: (content, ctx) => stripMentionText(content, ctx.message.mentions)
  }));
  bot.use(rateLimiter());
  const slash = slashCommand({ commands: buildCommandList(account, { getRuntime: opts.getRuntime }) });
  bot.use(slash.middleware);
  bot.use(concurrencyGuard({
    strategy: "merge",
    maxQueue: 50,
    maxProcessingMs: account.processingTimeoutMs,
    /** 紧急指令和 ask_user 回答跳过排队，立即处理 */
    urgentPredicate: (ctx) => {
      if ((ctx.message.content ?? "").trim() === "/stop") return true;
      const target = ctx.message.replyTarget;
      return hasPendingQuestionTarget({
        accountId: account.accountId,
        scope: target.scope,
        targetId: target.targetId
      });
    },
    onMerge: (buffered) => {
      const last = buffered[buffered.length - 1];
      if (buffered.length === 1) return last;
      last.state.mergedMessages = buffered;
      const attachments = buffered.flatMap((c) => c.message.attachments ?? []);
      if (attachments.length > 0) {
        last.message.attachments = attachments;
      }
      delete last.state.assembledBody;
      return last;
    }
  }));
  bot.use(typingIndicator());
  bot.use(quoteRef({
    store: getPersistedRefIndexStore(account.accountId)
  }));
  bot.use(attachmentProcessor({ getRuntime: opts.getRuntime }));
  bot.use(envelopeFormatter({
    format: (ctx) => {
      const assembled = assembleBody(ctx, ctx.message, account, opts.getRuntime);
      ctx.state.assembledBody = assembled;
      return assembled.agentBody;
    }
  }));
}

// src/dispatch/envelope-builder.ts
function mapHistory(entries) {
  if (!entries || entries.length === 0) return void 0;
  return entries.map((e) => ({
    role: "user",
    content: e.content,
    senderId: e.senderId,
    senderName: e.senderName
  }));
}
function mapQuote(quote) {
  if (!quote) return void 0;
  return {
    content: quote.text,
    senderId: quote.entry?.senderId ?? "",
    attachments: quote.attachments
  };
}
function buildEnvelope2(ctx, msg, account) {
  const scope = msg.replyTarget.scope;
  const targetId = scope === "group" ? `qqbot:group:${msg.replyTarget.targetId}` : `qqbot:c2c:${msg.replyTarget.targetId}`;
  const envelope = ctx.state.envelope;
  let content = envelope ?? msg.content;
  const processed = ctx.state.processedAttachments;
  if (processed) {
    const parts = [];
    if (processed.voiceText) {
      parts.push(processed.voiceText);
    }
    if (content) {
      parts.push(content);
    }
    if (processed.otherInfo) {
      parts.push(processed.otherInfo);
    }
    content = parts.join("\n");
  }
  return {
    channelId: "qqbot",
    accountId: account.accountId,
    targetId,
    chatScope: scope === "group" ? "group" : "direct",
    senderId: msg.senderId,
    senderName: msg.senderName,
    messageId: msg.messageId,
    content,
    history: mapHistory(ctx.state.history),
    quote: mapQuote(ctx.state.quote),
    attachments: msg.attachments,
    imageUrls: processed?.imageUrls,
    groupId: scope === "group" ? msg.replyTarget.targetId : void 0,
    systemPrompt: account.systemPrompt
  };
}

// src/outbound/deliver-pipeline.ts
var path18 = __toESM(require("path"), 1);
var os7 = __toESM(require("os"), 1);
function resolveMediaUrls(payload) {
  if (payload.mediaUrls?.length) {
    return payload.mediaUrls.filter(Boolean);
  }
  if (payload.mediaUrl) {
    return [payload.mediaUrl];
  }
  return resolveAttachmentPaths(payload);
}
function resolveAttachmentPaths(payload) {
  const attachments = payload.attachments;
  if (!attachments?.length) return [];
  return attachments.map((a) => a.url ?? a.path).filter((p2) => typeof p2 === "string" && p2.length > 0);
}
async function deliverReply(payload, _info, ctx) {
  const text = payload.text?.trim() ?? "";
  const mediaUrls = resolveMediaUrls(payload);
  const hasMedia = mediaUrls.length > 0;
  ctx.log?.debug(`[text] textLen=${text.length} mediaCount=${mediaUrls.length}`);
  if (payload.audioAsVoice) {
    if (ctx.textToSpeech && text) {
      const handled = await handleVoiceIntent(text, ctx);
      if (handled) {
        return;
      }
    }
  }
  if (hasMedia) {
    await sendMediaUrls(ctx, mediaUrls);
    if (text) {
      const result = await ctx.sendText(ctx.qualifiedTarget, text);
      if (result.error) {
        ctx.log?.error(`[media] sendText failed: ${result.error}`);
      }
    }
    return;
  }
  if (!text) return;
  if (ctx.debouncer) {
    await ctx.debouncer.enqueue(ctx.qualifiedTarget, text);
  } else {
    const result = await ctx.sendText(ctx.qualifiedTarget, text);
    if (result.error) {
      ctx.log?.error(`[text] sendText failed: ${result.error}`);
    }
  }
}
async function sendMediaUrls(ctx, urls) {
  const failedUrls = [];
  for (const url of urls) {
    const result = await sendMedia2({
      to: ctx.qualifiedTarget,
      source: url,
      replyToId: ctx.replyToId,
      accountId: ctx.accountId,
      log: ctx.log,
      agentId: ctx.agentId
    });
    if (result.error) {
      ctx.log?.error(`[media] ${result.error}`);
      failedUrls.push(url);
    }
  }
  if (failedUrls.length > 0) {
    const count = failedUrls.length;
    const total = urls.length;
    const failMsg = count === total ? `\u26A0\uFE0F \u5A92\u4F53\u53D1\u9001\u5931\u8D25\uFF08${count} \u4E2A\uFF09\uFF0C\u8BF7\u91CD\u8BD5` : `\u26A0\uFE0F ${count}/${total} \u4E2A\u5A92\u4F53\u53D1\u9001\u5931\u8D25`;
    const textResult = await ctx.sendText(ctx.qualifiedTarget, failMsg);
    if (textResult.error) {
      ctx.log?.error(`[media] failed to send failure notification: ${textResult.error}`);
    }
  }
}
async function handleVoiceIntent(text, ctx) {
  if (!text || !ctx.textToSpeech) return false;
  if (ctx.chatScope && ctx.chatScope !== "direct" && ctx.chatScope !== "group") {
    return false;
  }
  try {
    const ttsResult = await ctx.textToSpeech({
      text,
      cfg: ctx.cfg,
      channel: "qqbot",
      accountId: ctx.accountId
    });
    if (!ttsResult.audioPath) {
      ctx.log?.error(`[tts] TTS failed: ${ttsResult.error ?? "no audio path returned"}`);
      return false;
    }
    if (!isTtsPathSafe(ttsResult.audioPath)) {
      ctx.log?.error(`[tts] TTS audio path blocked: ${ttsResult.audioPath}`);
      return false;
    }
    if (ctx.audioFileToSilkBase64) {
      const silkBase64 = await ctx.audioFileToSilkBase64(ttsResult.audioPath);
      if (silkBase64) {
        const result2 = await ctx.sendMedia(ctx.qualifiedTarget, silkBase64, { mediaKind: "voice" });
        if (result2.error) ctx.log?.error(`[tts] sendVoice(base64) failed: ${result2.error}`);
        return !result2.error;
      }
      ctx.log?.error(`[tts] SILK conversion failed, trying localPath fallback`);
    }
    const result = await ctx.sendMedia(ctx.qualifiedTarget, ttsResult.audioPath, { mediaKind: "voice" });
    if (result.error) {
      ctx.log?.error(`[tts] sendVoice(localPath) failed: ${result.error}`);
      return false;
    }
    return true;
  } catch (err) {
    ctx.log?.error(`[tts] TTS/voice send failed: ${err instanceof Error ? err.message : String(err)}`);
    return false;
  }
}
var TTS_ALLOWED_ROOTS = [
  path18.join(os7.homedir(), ".openclaw"),
  os7.tmpdir(),
  "/tmp"
];
function isTtsPathSafe(audioPath) {
  if (!path18.isAbsolute(audioPath)) return false;
  return isPathInAllowedRoots(audioPath, TTS_ALLOWED_ROOTS);
}

// src/dispatch/ctx-builder.ts
function buildCtxPayload(params) {
  const { assembled, envelope, route, msg, ctx, adapters } = params;
  const isSlashCommand = /^\//.test(assembled.rawBody ?? "");
  const convKind = envelope.chatScope === "group" ? "group" : "direct";
  const peerId = convKind === "group" ? envelope.groupId ?? envelope.senderId : envelope.senderId;
  const groupId = convKind === "group" ? envelope.groupId : void 0;
  const processed = ctx.state.processedAttachments;
  const voicePaths = processed?.localMediaPaths?.filter((_2, i) => processed.localMediaTypes?.[i]?.startsWith("audio/")) ?? [];
  const voiceUrls = processed?.remoteMediaUrls?.filter((_2, i) => processed.remoteMediaUrls?.[i]?.startsWith?.("audio/")) ?? [];
  const msgTimestamp = msg.timestamp ?? msg.Timestamp;
  return adapters.buildInboundContext?.({
    channel: "qqbot",
    accountId: route.accountId,
    provider: "qqbot",
    surface: "qqbot",
    messageId: envelope.messageId,
    timestamp: msgTimestamp ? new Date(msgTimestamp).getTime() : Date.now(),
    from: envelope.targetId,
    sender: { id: envelope.senderId, name: envelope.senderName },
    conversation: {
      kind: convKind,
      id: peerId,
      label: assembled.systemPrompt
    },
    message: {
      body: assembled.webBody,
      bodyForAgent: assembled.agentBody,
      rawBody: assembled.rawBody,
      commandBody: assembled.rawBody
    },
    route: {
      agentId: route.agentId ?? "default",
      routeSessionKey: route.sessionKey,
      accountId: route.accountId
    },
    reply: {
      to: envelope.targetId,
      replyToId: envelope.messageId,
      originatingTo: envelope.targetId
    },
    access: {
      commands: { authorized: isSlashCommand }
    },
    command: isSlashCommand ? { kind: "text-slash", body: assembled.rawBody, authorized: true } : void 0,
    media: voicePaths.length > 0 ? voicePaths.map((p2, i) => ({
      contentType: processed?.localMediaTypes?.[i] ?? "audio/silk",
      localPath: p2,
      url: voiceUrls[i]
    })) : voiceUrls.length > 0 ? voiceUrls.map((u2) => ({ contentType: "audio/wav", url: u2 })) : void 0,
    supplemental: {
      quote: envelope.quote ? { id: envelope.messageId, body: envelope.quote.content, sender: envelope.quote.senderId } : void 0,
      groupSystemPrompt: envelope.systemPrompt
    },
    extra: {
      ...isSlashCommand ? { CommandSource: "text" } : {},
      ...groupId ? { QQGroupOpenid: groupId } : {},
      ...processed?.localMediaPaths?.length ? {
        MediaPaths: processed.localMediaPaths,
        MediaPath: processed.localMediaPaths[0],
        MediaTypes: processed.localMediaTypes,
        MediaType: processed.localMediaTypes?.[0]
      } : {},
      ...processed?.remoteMediaUrls?.length ? {
        MediaUrls: processed.remoteMediaUrls,
        MediaUrl: processed.remoteMediaUrls[0]
      } : {}
    }
  });
}

// src/outbound/debounce.ts
var DEFAULT_WINDOW_MS = 1500;
var DEFAULT_MAX_WAIT_MS = 8e3;
var DEFAULT_SEPARATOR = "\n\n---\n\n";
var DeliverDebouncer = class {
  pending = /* @__PURE__ */ new Map();
  windowMs;
  maxWaitMs;
  separator;
  flush;
  constructor(config, flush) {
    this.windowMs = config?.windowMs ?? DEFAULT_WINDOW_MS;
    this.maxWaitMs = config?.maxWaitMs ?? DEFAULT_MAX_WAIT_MS;
    this.separator = config?.separator ?? DEFAULT_SEPARATOR;
    this.flush = flush;
  }
  get enabled() {
    return this.windowMs > 0;
  }
  /**
   * 入队一条纯文本待发送消息
   * @returns Promise，在文本实际发送时 resolve
   */
  async enqueue(targetId, text) {
    if (!this.enabled) {
      await this.flush(targetId, text);
      return;
    }
    const existing = this.pending.get(targetId);
    if (existing) {
      existing.texts.push(text);
      if (existing.timer) clearTimeout(existing.timer);
      if (Date.now() - existing.firstAt >= this.maxWaitMs) {
        await this.doFlush(targetId);
      } else {
        existing.timer = setTimeout(() => this.doFlush(targetId), this.windowMs);
      }
      return;
    }
    return new Promise((resolve2) => {
      const pending = {
        texts: [text],
        firstAt: Date.now(),
        timer: setTimeout(() => this.doFlush(targetId), this.windowMs),
        resolve: resolve2
      };
      this.pending.set(targetId, pending);
    });
  }
  async doFlush(targetId) {
    const pending = this.pending.get(targetId);
    if (!pending) return;
    this.pending.delete(targetId);
    if (pending.timer) clearTimeout(pending.timer);
    const merged = pending.texts.join(this.separator);
    try {
      await this.flush(targetId, merged);
    } finally {
      pending.resolve();
    }
  }
  /**
   * 强制刷新所有 pending
   */
  async flushAll() {
    const keys = [...this.pending.keys()];
    await Promise.all(keys.map((k) => this.doFlush(k)));
  }
};

// src/outbound/streaming-controller.ts
var StreamingController = class {
  constructor(deps) {
    this.deps = deps;
  }
  deps;
  phase = "idle";
  session = null;
  /** QQ 已接受的最新文本 — 单源真理 */
  lastAcceptedFull = "";
  /** 已成功发送的分片数（降级：=0 则走静态消息兜底） */
  sentChunkCount = 0;
  /** 同步标志：收到第一个 onPartialReply 即置 true（不等 async 完成） */
  _hasStarted = false;
  /** 串行队列 */
  chain = Promise.resolve();
  // ── 公共访问器 ──
  get currentPhase() {
    return this.phase;
  }
  /** 是否已成功发送至少一个流式分片 */
  get hasSentChunks() {
    return this.sentChunkCount > 0;
  }
  /** 同步标志：流式已启动（不等异步完成），用于 final 去重 */
  get hasStarted() {
    return this._hasStarted;
  }
  get isTerminal() {
    return this.phase === "done" || this.phase === "failed";
  }
  get shouldFallbackToStatic() {
    return this.isTerminal && this.sentChunkCount === 0;
  }
  // ── 入口 ──
  onPartialReply(text) {
    this._hasStarted = true;
    this.chain = this.chain.then(() => this.handleChunk(text)).catch((err) => {
      this.deps.log?.error(`onPartialReply error: ${err instanceof Error ? err.message : String(err)}`);
      this.transition("failed", "chunk_error");
    });
    return this.chain;
  }
  finalize() {
    this.chain = this.chain.then(() => this.handleFinalize()).catch((err) => {
      this.deps.log?.error(`finalize error: ${err instanceof Error ? err.message : String(err)}`);
      this.transition("failed", "finalize_error");
    });
    return this.chain;
  }
  async abort(reason) {
    if (this.isTerminal) return;
    this.deps.log?.warn(`aborting stream reason=${reason ?? "manual"} sent=${this.sentChunkCount}`);
    if (this.session) {
      try {
        await this.session.complete();
      } catch (e) {
        this.deps.log?.error(`abort complete failed: ${e instanceof Error ? e.message : String(e)}`);
      }
      this.session = null;
    }
    this.transition("failed", `abort:${reason ?? "manual"}`);
  }
  // ── 核心逻辑 ──
  async handleChunk(text) {
    if (this.isTerminal || !text) return;
    if (prefixMatches(this.lastAcceptedFull, text)) {
      if (text.length !== this.lastAcceptedFull.length) {
        await this.sendUpdate(text);
      }
      return;
    }
    if (!this.lastAcceptedFull) {
      await this.sendUpdate(text);
      return;
    }
    if (text.length < this.lastAcceptedFull.length) {
      this.deps.log?.info(`new reply: lastAccepted=${this.lastAcceptedFull.length}\u2192chunk=${text.length}`);
      await this.completeSession("new_reply");
      this.lastAcceptedFull = "";
      await this.sendUpdate(text);
      return;
    }
    const commonLen = longestCommonPrefix(this.lastAcceptedFull, text);
    const extra = text.slice(Math.max(commonLen, 0));
    const merged = this.lastAcceptedFull + extra;
    this.deps.log?.warn(
      `prefix retry: lastAccepted=${this.lastAcceptedFull.length}\u2192chunk=${text.length} common=${commonLen} extra=${extra.length}, appending`
    );
    await this.sendUpdate(merged);
  }
  async handleFinalize() {
    if (this.isTerminal) return;
    if (this.session) {
      await this.completeSession();
      this.transition("done", "finalize");
      this.deps.log?.info(`stream done chunks=${this.sentChunkCount} chars=${this.lastAcceptedFull.length}`);
      return;
    }
    if (this.sentChunkCount > 0) {
      this.transition("done", "finalize:no_session");
    } else {
      this.transition("failed", "finalize:fallback");
    }
  }
  // ── QQ 交互 ──
  async sendUpdate(text) {
    if (!this.session) {
      this.session = this.deps.gateway.openStream(this.deps.target, this.deps.replyToId);
      this.transition("streaming", "first_chunk");
      this.deps.log?.info(`stream opened (firstChunk=${text.length})`);
    }
    try {
      await this.session.update(text);
      this.lastAcceptedFull = text;
      this.sentChunkCount++;
    } catch (err) {
      this.deps.log?.error(`update failed (len=${text.length}): ${err instanceof Error ? err.message : String(err)}`);
      this.session = null;
      this.transition("failed", "update_error");
    }
  }
  async completeSession(reason) {
    if (!this.session) return;
    this.deps.log?.info(`completing stream (sent=${this.sentChunkCount} chars=${this.lastAcceptedFull.length} reason=${reason ?? "done"})`);
    try {
      await this.session.complete();
    } catch (err) {
      this.deps.log?.error(`complete failed: ${err instanceof Error ? err.message : String(err)}`);
    }
    this.session = null;
  }
  // ── 状态机 ──
  transition(next, reason) {
    if (this.phase === next) return;
    this.deps.log?.info(`phase: ${this.phase} \u2192 ${next} (${reason})`);
    this.phase = next;
  }
};
function normalizeWs(s) {
  return s.replace(/\s+/g, " ");
}
function prefixMatches(accepted, incoming) {
  if (incoming.startsWith(accepted)) return true;
  return normalizeWs(incoming).startsWith(normalizeWs(accepted));
}
function longestCommonPrefix(a, b2) {
  let i = 0;
  while (i < a.length && i < b2.length && a[i] === b2[i]) i++;
  return i;
}
function shouldUseStreaming(account, targetScope) {
  if (targetScope !== "c2c") return false;
  const streaming = account.config?.streaming;
  if (typeof streaming === "boolean") return streaming;
  if (streaming && typeof streaming === "object") {
    return streaming.mode !== "off";
  }
  return false;
}

// src/dispatch/dispatch.ts
init_resolve();
async function dispatchToOpenClaw(ctx, msg, account, runtime2, log4) {
  const dlog = log4?.child("dispatch");
  const adapters = getAdapters(runtime2, dlog);
  const envelope = buildEnvelope2(ctx, msg, account);
  dlog?.debug(`received sender=${envelope.senderId} scope=${envelope.chatScope} msgId=${envelope.messageId}`);
  if (!adapters.dispatchReply) {
    dlog?.error(`runtime adapter dispatchReply not available (openclaw=${adapters.version})`);
    return;
  }
  const assembled = ctx.state.assembledBody ?? assembleBody(ctx, msg, account);
  const cfg = adapters.getConfig?.() ?? {};
  const route = adapters.resolveAgentRoute?.({
    cfg,
    channel: "qqbot",
    accountId: account.accountId,
    peer: {
      kind: envelope.chatScope === "group" ? "group" : "direct",
      id: envelope.chatScope === "group" ? envelope.groupId ?? envelope.senderId : envelope.senderId
    }
  }) ?? { sessionKey: `qqbot:${account.accountId}:${envelope.senderId}`, accountId: account.accountId };
  const qualifiedTarget = envelope.targetId;
  const agentId = route.agentId ?? "default";
  const storePath = adapters.resolveStorePath?.(cfg?.session?.store, { agentId }) ?? "";
  const ctxPayload = buildCtxPayload({ assembled, envelope, route, msg, ctx, adapters });
  const ttsRuntime = runtime2?.tts ?? runtime2?.channel?.runtimeContexts?.get?.("tts");
  const debounceConfig = account.config?.deliverDebounce;
  const debouncer = debounceConfig?.enabled !== false ? new DeliverDebouncer(
    debounceConfig,
    (targetId, mergedText) => sendText({ to: targetId, text: mergedText, accountId: account.accountId, replyToId: envelope.messageId, account }).then(() => {
    })
  ) : void 0;
  const deliverCtx = {
    qualifiedTarget,
    accountId: account.accountId,
    replyToId: envelope.messageId,
    chatScope: envelope.chatScope === "group" ? "group" : "direct",
    cfg,
    debouncer: debouncer?.enabled ? debouncer : void 0,
    sendText: (to, text) => sendText({ to, text, accountId: account.accountId, replyToId: envelope.messageId, account }),
    sendMedia: (to, source, opts) => sendMedia2({
      to,
      source,
      text: opts?.text ?? "",
      replyToId: envelope.messageId,
      accountId: account.accountId,
      agentId: route.agentId,
      log: deliverCtx.log
    }),
    textToSpeech: ttsRuntime?.textToSpeech ? (params) => ttsRuntime.textToSpeech(params) : void 0,
    audioFileToSilkBase64: ttsRuntime?.audioFileToSilkBase64 ? (audioPath) => ttsRuntime.audioFileToSilkBase64(audioPath) : void 0,
    log: log4?.child("deliver"),
    agentId: route.agentId ?? "default"
  };
  const streamingEnabled = shouldUseStreaming(
    account,
    envelope.chatScope === "group" ? "group" : "c2c"
  );
  const streamingController = streamingEnabled ? createStreamingController(envelope, account, log4?.child("streaming")) : null;
  if (streamingController) {
    dlog?.debug(`streaming enabled for ${envelope.senderId}`);
  }
  const deliveredMediaUrls = /* @__PURE__ */ new Set();
  const deliveredTexts = /* @__PURE__ */ new Set();
  const trackQuestionPayload = (payload) => {
    registerPendingQuestionTarget({
      payload,
      accountId: account.accountId,
      scope: msg.replyTarget.scope,
      targetId: msg.replyTarget.targetId,
      log: dlog
    });
  };
  if (!adapters.inboundRun) {
    if (adapters.recordInboundSession) {
      try {
        await adapters.recordInboundSession({
          storePath,
          sessionKey: route.sessionKey,
          ctx: ctxPayload
        });
      } catch {
      }
    }
    await adapters.dispatchReply({
      ctx: ctxPayload,
      cfg,
      dispatcherOptions: {
        deliver: async (payload, info) => {
          trackQuestionPayload(payload);
          const text = payload.text?.trim() ?? "";
          if (!payload.mediaUrl && !payload.mediaUrls?.length && text && (deliveredTexts.has(text) || streamingController?.hasStarted && !streamingController?.shouldFallbackToStatic)) {
            return;
          }
          const filteredPayload = deliveredMediaUrls.size > 0 ? {
            ...payload,
            mediaUrl: payload.mediaUrl && !deliveredMediaUrls.has(payload.mediaUrl) ? payload.mediaUrl : void 0,
            mediaUrls: payload.mediaUrls?.filter((u2) => !deliveredMediaUrls.has(u2))
          } : payload;
          await deliverReply(filteredPayload, info, deliverCtx);
          if (text) deliveredTexts.add(text);
          for (const u2 of filteredPayload.mediaUrls ?? []) deliveredMediaUrls.add(u2);
          if (filteredPayload.mediaUrl) deliveredMediaUrls.add(filteredPayload.mediaUrl);
        }
      },
      replyOptions: {
        abortSignal: ctx.signal,
        runId: envelope.messageId,
        ...streamingController ? {
          onPartialReply: async (p2) => {
            if (p2.text) await streamingController.onPartialReply(p2.text);
          }
        } : {}
      }
    });
    if (streamingController && !streamingController.isTerminal) {
      await streamingController.finalize();
    }
    if (debouncer) await debouncer.flushAll();
  } else {
    await adapters.inboundRun({
      channel: "qqbot",
      accountId: route.accountId,
      raw: envelope,
      adapter: {
        ingest: (raw) => ({
          id: envelope.messageId,
          rawText: assembled.rawBody,
          textForAgent: assembled.agentBody,
          textForCommands: assembled.rawBody,
          raw
        }),
        resolveTurn: (_input, _eventClass, _preflight) => ({
          channel: "qqbot",
          accountId: route.accountId,
          routeSessionKey: route.sessionKey,
          storePath,
          ctxPayload,
          recordInboundSession: adapters.recordInboundSession,
          record: {
            onRecordError: (err) => {
              dlog?.error(`Session record error: ${err}`);
            }
          },
          runDispatchLifecycle: {
            turnAdoptionLifecycle: void 0,
            onDispatchSkipped: (reason) => {
              dlog?.info(`dispatch skipped reason=${reason} sessionKey=${route.sessionKey}`);
            }
          },
          runDispatch: () => {
            return adapters.dispatchReply({
              ctx: ctxPayload,
              cfg,
              dispatcherOptions: {
                deliver: async (payload, info) => {
                  try {
                    trackQuestionPayload(payload);
                    const kind = info?.kind;
                    const text = payload.text?.trim() ?? "";
                    const hasMedia = !!(payload.mediaUrl || payload.mediaUrls?.length);
                    dlog?.debug(`deliver kind=${kind ?? "none"} textLen=${text.length} voice=${!!payload.audioAsVoice} media=${hasMedia}`);
                    if (kind === "block") {
                      if (payload.audioAsVoice) {
                        await deliverReply(payload, info, deliverCtx);
                      } else {
                        await forwardMediaUrls(payload, deliverCtx, deliveredMediaUrls, dlog);
                      }
                    }
                    if (kind === "tool") {
                      await forwardMediaUrls(payload, deliverCtx, deliveredMediaUrls, dlog);
                      if (text) {
                        const textOnlyPayload = {
                          ...payload,
                          mediaUrl: void 0,
                          mediaUrls: void 0
                        };
                        await deliverReply(textOnlyPayload, info, deliverCtx);
                        deliveredTexts.add(text);
                      }
                      return;
                    }
                    if (streamingController?.hasStarted && !streamingController.shouldFallbackToStatic) {
                      if (kind !== "block") await streamingController.finalize();
                      if (!streamingController.shouldFallbackToStatic) return;
                      dlog?.warn(`streaming fallback to static`);
                    }
                    if (kind === "final" && !hasMedia && text && deliveredTexts.has(text)) {
                      return;
                    }
                    const filteredPayload = filterDeliveredMedia(payload, deliveredMediaUrls);
                    await deliverReply(filteredPayload, info, deliverCtx);
                    if (text) deliveredTexts.add(text);
                  } catch (err) {
                    dlog?.error(`deliver error: ${err instanceof Error ? err.message : String(err)}`);
                  }
                }
              },
              replyOptions: {
                abortSignal: ctx.signal,
                runId: envelope.messageId,
                ...streamingController ? {
                  onPartialReply: async (p2) => {
                    if (p2.text) await streamingController.onPartialReply(p2.text);
                  }
                } : {}
              }
            });
          }
        })
      }
    });
  }
  dlog?.debug(`inboundRun completed sessionKey=${route.sessionKey}`);
  if (envelope.chatScope === "group") {
    clearGroupHistory(account.accountId, envelope.groupId ?? envelope.senderId);
  }
  if (streamingController && !streamingController.isTerminal) {
    await streamingController.finalize();
  }
  if (debouncer) {
    await debouncer.flushAll();
  }
}
function createStreamingController(envelope, account, log4) {
  const gw = getGateway(account.accountId);
  if (!gw) {
    log4?.error(`cannot enable streaming \u2014 gateway not running`);
    return null;
  }
  return new StreamingController({
    gateway: gw,
    target: {
      scope: "c2c",
      targetId: envelope.senderId,
      msgId: envelope.messageId
    },
    accountId: account.accountId,
    replyToId: envelope.messageId,
    log: log4
  });
}
async function forwardMediaUrls(payload, ctx, delivered, log4) {
  const urls = [];
  if (payload.mediaUrls?.length) urls.push(...payload.mediaUrls);
  if (payload.mediaUrl && !urls.includes(payload.mediaUrl)) urls.push(payload.mediaUrl);
  const newUrls = urls.filter((u2) => !delivered.has(u2));
  for (const url of newUrls) {
    try {
      await sendMedia2({
        to: ctx.qualifiedTarget,
        source: url,
        text: "",
        replyToId: ctx.replyToId,
        accountId: ctx.accountId,
        log: ctx.log,
        agentId: ctx.agentId
      });
      delivered.add(url);
    } catch (err) {
      log4?.error(`media forward failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  }
}
function filterDeliveredMedia(payload, delivered) {
  if (delivered.size === 0) return payload;
  return {
    ...payload,
    mediaUrl: payload.mediaUrl && !delivered.has(payload.mediaUrl) ? payload.mediaUrl : void 0,
    mediaUrls: payload.mediaUrls?.filter((u2) => !delivered.has(u2))
  };
}

// src/adapter/gateway.ts
var import_node_module5 = require("module");
var import_node_path8 = __toESM(require("path"), 1);
function loadApprovalGatewayRuntime() {
  const req4 = (0, import_node_module5.createRequire)(__filename);
  const pluginRoot = import_node_path8.default.resolve(import_node_path8.default.dirname(__filename), "..", "..");
  const fs21 = req4("node:fs");
  const tryLoadFromRoot = (root) => {
    for (const rel of ["dist/plugin-sdk/gateway-runtime.js", "plugin-sdk/gateway-runtime.js"]) {
      const p2 = import_node_path8.default.join(root, rel);
      try {
        if (fs21.existsSync(p2)) return req4(p2);
      } catch {
      }
    }
    return null;
  };
  try {
    const { findOpenclawRoot } = req4(import_node_path8.default.join(pluginRoot, "scripts", "link-sdk-core.cjs"));
    const root = findOpenclawRoot(pluginRoot);
    if (root) {
      const mod = tryLoadFromRoot(root);
      if (mod) return mod;
    }
  } catch {
  }
  try {
    const entry = process.argv[1];
    if (entry) {
      const realEntry = fs21.realpathSync(entry);
      let dir = import_node_path8.default.dirname(realEntry);
      for (let i = 0; i < 6; i++) {
        const mod = tryLoadFromRoot(dir);
        if (mod) return mod;
        const parent = import_node_path8.default.dirname(dir);
        if (parent === dir) break;
        dir = parent;
      }
    }
  } catch {
  }
  return null;
}

// src/features/approval-handler.ts
function toShortId(approvalId) {
  return approvalId.replace(/^(exec|plugin):/, "").slice(0, 8);
}
function resolveApprovalKind(approvalId) {
  return approvalId.startsWith("plugin:") ? "plugin" : "exec";
}
function buildExecApprovalText(request2) {
  const expiresIn = Math.max(
    0,
    Math.round((request2.expiresAtMs - Date.now()) / 1e3)
  );
  const lines = ["\u{1F510} \u547D\u4EE4\u6267\u884C\u5BA1\u6279", ""];
  const cmd = request2.request.commandPreview ?? request2.request.command ?? "";
  if (cmd) lines.push(`\`\`\`
${cmd.slice(0, 300)}
\`\`\``);
  if (request2.request.cwd) lines.push(`\u{1F4C1} \u76EE\u5F55: ${request2.request.cwd}`);
  if (request2.request.agentId) lines.push(`\u{1F916} Agent: ${request2.request.agentId}`);
  lines.push("", `\u23F1\uFE0F \u8D85\u65F6: ${expiresIn} \u79D2`);
  return lines.join("\n");
}
function buildPluginApprovalText(request2) {
  const timeoutSec = Math.round((request2.request.timeoutMs ?? 12e4) / 1e3);
  const severityIcon = request2.request.severity === "critical" ? "\u{1F534}" : request2.request.severity === "info" ? "\u{1F535}" : "\u{1F7E1}";
  const lines = [`${severityIcon} \u5BA1\u6279\u8BF7\u6C42`, ""];
  lines.push(`\u{1F4CB} ${request2.request.title}`);
  if (request2.request.description) lines.push(`\u{1F4DD} ${request2.request.description}`);
  if (request2.request.toolName) lines.push(`\u{1F527} \u5DE5\u5177: ${request2.request.toolName}`);
  if (request2.request.pluginId) lines.push(`\u{1F50C} \u63D2\u4EF6: ${request2.request.pluginId}`);
  if (request2.request.agentId) lines.push(`\u{1F916} Agent: ${request2.request.agentId}`);
  lines.push("", `\u23F1\uFE0F \u8D85\u65F6: ${timeoutSec} \u79D2`);
  return lines.join("\n");
}
function buildApprovalKeyboard(approvalId) {
  const makeBtn = (id, label, visitedLabel, data, style) => ({
    id,
    render_data: { label, visited_label: visitedLabel, style },
    action: {
      type: 1,
      data,
      permission: { type: 2 },
      click_limit: 1
    },
    group_id: "approval"
  });
  return {
    content: {
      rows: [
        {
          buttons: [
            makeBtn("allow", "\u2705 \u5141\u8BB8\u4E00\u6B21", "\u5DF2\u5141\u8BB8", `approve:${approvalId}:allow-once`, 1),
            makeBtn("always", "\u2B50 \u59CB\u7EC8\u5141\u8BB8", "\u5DF2\u59CB\u7EC8\u5141\u8BB8", `approve:${approvalId}:allow-always`, 1),
            makeBtn("deny", "\u274C \u62D2\u7EDD", "\u5DF2\u62D2\u7EDD", `approve:${approvalId}:deny`, 0)
          ]
        }
      ]
    }
  };
}
function resolveTarget(sessionKey, turnSourceTo) {
  const sk = sessionKey ?? turnSourceTo;
  if (!sk) return null;
  const m3 = sk.match(/qqbot:(c2c|direct|group):([A-F0-9]+)/i);
  if (!m3) return null;
  const type = m3[1].toLowerCase() === "group" ? "group" : "c2c";
  return { type, id: m3[2] };
}
var QQBotApprovalHandler = class {
  gatewayClient = null;
  pending = /* @__PURE__ */ new Map();
  requestCache = /* @__PURE__ */ new Map();
  opts;
  started = false;
  connected = false;
  constructor(opts) {
    this.opts = opts;
  }
  async start() {
    if (this.started) return;
    this.started = true;
    const { log: log4 } = this.opts;
    log4?.debug?.(`[qqbot:${this.opts.accountId}] approval-handler: starting`);
    const gatewayRuntime = loadApprovalGatewayRuntime();
    if (!gatewayRuntime) {
      log4?.debug?.(`[qqbot:${this.opts.accountId}] approval-handler: gateway-runtime not available, approval disabled`);
      this.started = false;
      return;
    }
    try {
      this.gatewayClient = await gatewayRuntime.createOperatorApprovalsGatewayClient({
        config: this.opts.cfg,
        gatewayUrl: this.opts.gatewayUrl,
        clientDisplayName: "QQBot Approval Handler",
        onEvent: (evt) => this.handleGatewayEvent(evt),
        onHelloOk: () => {
          this.connected = true;
          log4?.debug?.(`[qqbot:${this.opts.accountId}] approval-handler: connected to gateway`);
        },
        onConnectError: (err) => log4?.error(`[qqbot:${this.opts.accountId}] approval-handler: connect error: ${err.message}`),
        onClose: (code, reason) => {
          this.connected = false;
          log4?.debug?.(`[qqbot:${this.opts.accountId}] approval-handler: gateway closed: ${code} ${reason}`);
        }
      });
      this.gatewayClient.start();
      setApprovalFeatureAvailable(true);
    } catch (err) {
      log4?.error(`[qqbot:${this.opts.accountId}] approval-handler: failed to create gateway client: ${err}`);
      this.started = false;
    }
  }
  async stop() {
    if (!this.started) return;
    this.started = false;
    for (const entry of this.pending.values()) clearTimeout(entry.timeoutId);
    this.pending.clear();
    this.requestCache.clear();
    await this.gatewayClient?.stop();
    this.gatewayClient = null;
    this.opts.log?.debug(`[qqbot:${this.opts.accountId}] approval-handler: stopped`);
  }
  /** gateway 是否已建立连接 */
  get isConnected() {
    return this.connected;
  }
  /** 检查是否有指定 shortId 对应的 pending 审批 */
  hasShortId(shortId) {
    for (const id of this.pending.keys()) {
      if (toShortId(id) === shortId) return true;
    }
    return false;
  }
  /** 解析审批请求（供 Interaction 回调或 /approve 命令调用） */
  async resolveApproval(approvalId, decision) {
    if (!this.gatewayClient) {
      this.opts.log?.warn(`[qqbot:${this.opts.accountId}] approval-handler: resolve ignored ${approvalId} \u2192 gatewayClient not ready`);
      return false;
    }
    let fullId = approvalId;
    if (this.pending.has(approvalId)) {
      fullId = approvalId;
    } else {
      for (const id of this.pending.keys()) {
        if (id === approvalId) {
          fullId = id;
          break;
        }
        if (id.replace(/^(exec|plugin):/, "") === approvalId) {
          fullId = id;
          break;
        }
        if (toShortId(id) === approvalId) {
          fullId = id;
          break;
        }
      }
      if (fullId === approvalId && !this.requestCache.has(approvalId)) {
        for (const id of this.requestCache.keys()) {
          if (id.replace(/^(exec|plugin):/, "") === approvalId) {
            fullId = id;
            break;
          }
        }
      }
    }
    const kind = resolveApprovalKind(fullId);
    const method = kind === "plugin" ? "plugin.approval.resolve" : "exec.approval.resolve";
    const isPending = this.pending.has(fullId);
    const isCached = this.requestCache.has(fullId);
    this.opts.log?.debug?.(`[qqbot:${this.opts.accountId}] approval-handler: resolving ${fullId} (input=${approvalId}) kind=${kind} \u2192 ${decision}, pending=${isPending}, cached=${isCached}`);
    try {
      await this.gatewayClient.request(method, { id: fullId, decision });
      this.opts.log?.debug(`[qqbot:${this.opts.accountId}] approval-handler: RPC success ${toShortId(fullId)} \u2192 ${decision} (method=${method})`);
      return true;
    } catch (err) {
      this.opts.log?.error(`[qqbot:${this.opts.accountId}] approval-handler: resolve failed: ${err}`);
      return false;
    }
  }
  handleGatewayEvent(evt) {
    if (evt.event === "exec.approval.requested") {
      void this.handleRequested(evt.payload, "exec");
    } else if (evt.event === "plugin.approval.requested") {
      void this.handleRequested(evt.payload, "plugin");
    } else if (evt.event === "exec.approval.resolved") {
      void this.handleResolved(evt.payload);
    } else if (evt.event === "plugin.approval.resolved") {
      void this.handleResolved(evt.payload);
    }
  }
  async handleRequested(request2, kind) {
    const { log: log4, appId, clientSecret, accountId } = this.opts;
    const shortId = toShortId(request2.id);
    const reqAccountId = request2.request.turnSourceAccountId?.trim();
    if (reqAccountId && reqAccountId !== accountId) {
      log4?.debug?.(`[qqbot:${accountId}] approval-handler: ${kind} ${shortId} ignored \u2192 account mismatch (req=${reqAccountId})`);
      return;
    }
    const sessionKey = request2.request.sessionKey;
    const turnSourceTo = request2.request.turnSourceTo;
    const target = resolveTarget(sessionKey, turnSourceTo);
    if (!target) {
      log4?.info(`[qqbot:${accountId}] approval-handler: no QQ target for ${shortId} (session=${sessionKey})`);
      return;
    }
    this.requestCache.set(
      request2.id,
      kind === "plugin" ? { kind: "plugin", request: request2 } : { kind: "exec", request: request2 }
    );
    log4?.info(`[qqbot:${accountId}] approval-handler: sending ${kind} approval ${shortId} to ${target.type}:${target.id}`);
    const text = kind === "plugin" ? buildPluginApprovalText(request2) : buildExecApprovalText(request2);
    const keyboard = buildApprovalKeyboard(request2.id);
    const timeoutMs = kind === "plugin" ? request2.request.timeoutMs ?? 12e4 : Math.max(0, request2.expiresAtMs - Date.now());
    await new Promise((r) => setTimeout(r, 2e3));
    try {
      const bot = getBotForAccount(accountId);
      const target_reply = {
        scope: target.type,
        targetId: target.id
      };
      await bot.sendTextWithKeyboard(target_reply, text, keyboard);
      log4?.info(`[qqbot:${accountId}] approval-handler: sent ${kind} approval ${shortId}`);
      const timeoutId = setTimeout(() => {
        this.handleTimeout(request2.id, target);
      }, timeoutMs + 2e3);
      this.pending.set(request2.id, { targets: [target], timeoutId });
    } catch (err) {
      this.requestCache.delete(request2.id);
      log4?.error(`[qqbot:${accountId}] approval-handler: failed to send approval ${shortId}: ${err}`);
    }
  }
  async handleResolved(resolved) {
    const entry = this.pending.get(resolved.id);
    const resolvedBy = resolved.resolvedBy ?? "unknown";
    const kind = resolveApprovalKind(resolved.id);
    this.opts.log?.info(
      `[qqbot:${this.opts.accountId}] approval-handler: gateway confirmed ${toShortId(resolved.id)} \u2192 ${resolved.decision} (kind=${kind}, resolvedBy=${resolvedBy}, wasPending=${!!entry})`
    );
    if (!entry) return;
    clearTimeout(entry.timeoutId);
    this.pending.delete(resolved.id);
    this.requestCache.delete(resolved.id);
  }
  async handleTimeout(approvalId, target) {
    const { log: log4, accountId } = this.opts;
    if (!this.pending.has(approvalId)) return;
    this.pending.delete(approvalId);
    this.requestCache.delete(approvalId);
    log4?.info(`[qqbot:${accountId}] approval-handler: timeout ${toShortId(approvalId)}`);
  }
};
var _handlers = /* @__PURE__ */ new Map();
var _approvalFeatureAvailable = false;
function setApprovalFeatureAvailable(available) {
  _approvalFeatureAvailable = available;
}
function registerApprovalHandler(accountId, handler) {
  _handlers.set(accountId, handler);
}
function unregisterApprovalHandler(accountId) {
  _handlers.delete(accountId);
}
function getApprovalHandler(accountId) {
  return _handlers.get(accountId);
}

// src/features/proactive.ts
var fs19 = __toESM(require("fs"), 1);
var path20 = __toESM(require("path"), 1);
init_config();
var log2 = createPluginLogger({ prefix: "[proactive]" });
var STORAGE_DIR = getQQBotDataDir("data");
var KNOWN_USERS_FILE = path20.join(STORAGE_DIR, "known-users.json");
var knownUsersCache = null;
var cacheLastModified = 0;
function ensureStorageDir() {
  if (!fs19.existsSync(STORAGE_DIR)) {
    fs19.mkdirSync(STORAGE_DIR, { recursive: true });
  }
}
function getUserKey(type, openid, accountId) {
  return `${accountId}:${type}:${openid}`;
}
function loadKnownUsers() {
  if (knownUsersCache !== null) {
    try {
      const stat = fs19.statSync(KNOWN_USERS_FILE);
      if (stat.mtimeMs <= cacheLastModified) {
        return knownUsersCache;
      }
    } catch {
      return knownUsersCache;
    }
  }
  const users = /* @__PURE__ */ new Map();
  try {
    if (fs19.existsSync(KNOWN_USERS_FILE)) {
      const data = fs19.readFileSync(KNOWN_USERS_FILE, "utf-8");
      const parsed = JSON.parse(data);
      for (const user of parsed) {
        const key = getUserKey(user.type, user.openid, user.accountId);
        users.set(key, user);
      }
      cacheLastModified = fs19.statSync(KNOWN_USERS_FILE).mtimeMs;
    }
  } catch (err) {
    log2.error(`Failed to load known users: ${err}`);
  }
  knownUsersCache = users;
  return users;
}
function saveKnownUsers(users) {
  try {
    ensureStorageDir();
    const data = Array.from(users.values());
    fs19.writeFileSync(KNOWN_USERS_FILE, JSON.stringify(data, null, 2), "utf-8");
    cacheLastModified = Date.now();
    knownUsersCache = users;
  } catch (err) {
    log2.error(`Failed to save known users: ${err}`);
  }
}
function recordKnownUser(user) {
  const users = loadKnownUsers();
  const key = getUserKey(user.type, user.openid, user.accountId);
  const existing = users.get(key);
  const now = user.lastInteractionAt || Date.now();
  users.set(key, {
    ...user,
    lastInteractionAt: now,
    firstInteractionAt: existing?.firstInteractionAt ?? now,
    // 更新昵称（如果有新的）
    nickname: user.nickname || existing?.nickname
  });
  saveKnownUsers(users);
  log2.info(`Recorded user: ${key}`);
}

// src/features/msgid-cache.ts
var MAX_PER_TARGET = 10;
var TTL_GROUP = 5 * 60 * 1e3;
var TTL_C2C = 30 * 60 * 1e3;
var MAX_TARGETS = 200;
var cache = /* @__PURE__ */ new Map();
function cacheMsgId(scope, targetId, msgId) {
  if (!scope || !targetId || !msgId) return;
  const key = `${scope}:${targetId}`;
  const existing = cache.get(key);
  if (existing) {
    cache.delete(key);
    existing.push({ msgId, timestamp: Date.now() });
    if (existing.length > MAX_PER_TARGET) existing.shift();
    cache.set(key, existing);
  } else {
    cache.set(key, [{ msgId, timestamp: Date.now() }]);
    if (cache.size > MAX_TARGETS) {
      const oldest = cache.keys().next().value;
      if (oldest) cache.delete(oldest);
    }
  }
}
function getCachedMsgId(scope, targetId) {
  const key = `${scope}:${targetId}`;
  const list = cache.get(key);
  if (!list || list.length === 0) return void 0;
  const now = Date.now();
  const ttl = scope === "group" ? TTL_GROUP : TTL_C2C;
  for (let i = list.length - 1; i >= 0; i--) {
    if (now - list[i].timestamp < ttl) {
      return list[i].msgId;
    }
  }
  return void 0;
}

// src/gateway/event-handlers.ts
init_resolve();
init_config();
async function handleMessage(ctx, msg, account, runtime2, log4) {
  const hlog = log4.child("handle");
  const scope = msg.replyTarget.scope;
  const targetId = scope === "group" ? `qqbot:group:${msg.replyTarget.targetId}` : `qqbot:c2c:${msg.replyTarget.targetId}`;
  const mergedCount = ctx.state.mergedMessages?.length;
  if (mergedCount) {
    hlog.info(`merged batch count=${mergedCount} msgId=${msg.messageId}`);
  } else {
    hlog.debug(`enter msgId=${msg.messageId} scope=${scope} contentLen=${(msg.content ?? "").length}`);
  }
  try {
    cacheMsgId(scope, msg.replyTarget.targetId, msg.messageId);
    recordKnownUser({
      type: scope === "group" ? "group" : "c2c",
      openid: scope === "group" ? msg.replyTarget.targetId : msg.senderId,
      accountId: account.accountId,
      nickname: msg.senderName,
      lastInteractionAt: Date.now()
    });
    const cfg = getAdapters(runtime2).getConfig?.() ?? {};
    const answeredQuestion = await resolvePendingQuestionTarget({
      accountId: account.accountId,
      scope,
      targetId: msg.replyTarget.targetId,
      text: ctx.message.content ?? msg.content ?? "",
      cfg,
      senderId: msg.senderId,
      log: hlog
    });
    if (answeredQuestion) {
      hlog.info(`claimed QQ answer msgId=${msg.messageId}`);
      return;
    }
    await runWithRequestContext(
      {
        accountId: account.accountId,
        messageId: msg.messageId,
        openId: msg.senderId,
        target: targetId
      },
      () => dispatchToOpenClaw(ctx, msg, account, runtime2, log4)
    );
  } catch (err) {
    hlog.error(`dispatch error: ${err}`);
  }
  hlog.debug(`done msgId=${msg.messageId}`);
}
var INTERACTION_QUERY = 2001;
var INTERACTION_UPDATE = 2002;
async function handleInteraction(event, account, runtime2, log4, acknowledgeInteraction) {
  if (event.data?.type === INTERACTION_QUERY) {
    await handleConfigQuery(event, account, runtime2, log4, acknowledgeInteraction);
    return;
  }
  if (event.data?.type === INTERACTION_UPDATE) {
    await handleConfigUpdate(event, account, runtime2, log4);
    try {
      const adapters = getAdapters(runtime2);
      const cfg = adapters.getConfig?.() ?? {};
      const groupOpenid = event.group_openid ?? "";
      const updatedCfg = groupOpenid ? resolveGroupConfigFromAccount(account, groupOpenid) : null;
      const requireMention = updatedCfg?.requireMention ?? true;
      const clawCfg = buildClawCfg(requireMention, [], resolveGroupPolicy(cfg, account.accountId));
      await acknowledgeInteraction(event.id, 0, { claw_cfg: clawCfg });
    } catch {
      try {
        await acknowledgeInteraction(event.id);
      } catch {
      }
    }
    return;
  }
  await handleApproval(event, account, log4, acknowledgeInteraction);
}
async function handleConfigQuery(event, account, runtime2, log4, ack) {
  const groupOpenid = event.group_openid ?? "";
  try {
    const adapters = getAdapters(runtime2);
    const cfg = adapters.getConfig?.() ?? {};
    const groupCfg = groupOpenid ? resolveGroupConfigFromAccount(account, groupOpenid) : null;
    const requireMention = groupCfg?.requireMention ?? true;
    const agentId = groupOpenid ? adapters.resolveAgentRoute?.({ cfg, channel: "qqbot", accountId: account.accountId, peer: { kind: "group", id: groupOpenid } })?.agentId : void 0;
    const mentionPatterns = resolveMentionPatterns(cfg, agentId);
    const clawCfg = buildClawCfg(requireMention, mentionPatterns, resolveGroupPolicy(cfg, account.accountId));
    log4.info(`interaction query: group=${groupOpenid} requireMention=${requireMention}`);
    await ack(event.id, 0, { claw_cfg: clawCfg });
  } catch (err) {
    log4.warn(`interaction query failed: ${err?.message ?? err}, ack without data`);
    try {
      await ack(event.id);
    } catch {
    }
  }
}
async function handleConfigUpdate(event, account, runtime2, log4) {
  const resolved = event.data?.resolved;
  const update = resolved?.claw_cfg;
  const groupOpenid = event.group_openid ?? "";
  if (update?.require_mention !== void 0 && groupOpenid) {
    try {
      await setGroupRequireMention(runtime2, account.accountId, groupOpenid, update.require_mention === "mention");
      log4.info(`interaction: group=${groupOpenid} requireMention=${update.require_mention}`);
    } catch (err) {
      log4.error(`interaction update failed: ${err}`);
    }
  }
}
async function handleApproval(event, account, log4, ack) {
  try {
    await ack(event.id);
  } catch {
  }
  const buttonData = event.data?.resolved?.button_data;
  if (!buttonData?.startsWith("approve:")) return;
  const operatorId = resolveOperatorId(event);
  if (!isApprovalAuthorized(account, operatorId)) {
    log4.warn(`[approval] unauthorized operator=${operatorId ?? "unknown"} account=${account.accountId}`);
    return;
  }
  const parts = buttonData.split(":");
  if (parts.length < 3) return;
  const handler = getApprovalHandler(account.accountId);
  if (!handler) return;
  const approvalId = parts[1];
  const decision = parts[2];
  try {
    await handler.resolveApproval(approvalId, decision);
  } catch (err) {
    log4.error(`interaction approve error: ${err instanceof Error ? err.message : String(err)}`);
  }
}
var CHANNEL_VER = getPackageVersion();
function resolveOperatorId(event) {
  const evt = event;
  return evt.user_openid ?? evt.data?.resolved?.user_id ?? evt.data?.resolved?.user_openid ?? evt.openid;
}
function isApprovalAuthorized(account, operatorId) {
  if (!operatorId) return false;
  const allowFrom = account.config?.allowFrom ?? [];
  if (!allowFrom.length || allowFrom.includes("*")) return true;
  return allowFrom.includes(operatorId);
}
function buildClawCfg(requireMention, mentionPatterns, groupPolicy) {
  return {
    channel_type: "qqbot",
    channel_ver: CHANNEL_VER,
    claw_type: "openclaw",
    claw_ver: getOpenClawVersion(),
    require_mention: requireMention ? "mention" : "always",
    group_policy: groupPolicy,
    mention_patterns: mentionPatterns.join(","),
    online_state: "online"
  };
}
function setGroupRequireMention(runtime2, accountId, groupOpenid, requireMention) {
  const adapters = getAdapters(runtime2);
  return adapters.persistConfig?.((cfg) => {
    const qqbot = (cfg.channels ?? {})?.qqbot ?? {};
    const groups = accountId !== "default" && qqbot.accounts?.[accountId] ? qqbot.accounts[accountId].groups = { ...qqbot.accounts[accountId].groups } : qqbot.groups = { ...qqbot.groups };
    groups[groupOpenid] = { ...groups[groupOpenid], requireMention };
  }) ?? Promise.resolve();
}

// src/adapter/webhook.ts
var sharedTargets = /* @__PURE__ */ new Map();
var _routeUnregisters = /* @__PURE__ */ new Map();
function createPluginWebhookAdapter(params) {
  let unregistered = false;
  let storedPath = "";
  const accountId = params.account.accountId;
  return {
    async listen(_port, path22, handler) {
      const ingress = await import("openclaw/plugin-sdk/webhook-ingress").catch(() => null);
      if (!ingress?.registerWebhookTargetWithPluginRoute) {
        params.log.error("Webhook ingress not available");
        return;
      }
      const webhookPath = storedPath = path22 && path22 !== "/" ? path22 : params.account.config.webhook?.path ?? "/qqbot/webhook";
      const existing = sharedTargets.get(webhookPath);
      if (existing) {
        const dupIdx = existing.findIndex((t) => t.accountId === accountId);
        if (dupIdx >= 0) {
          existing[dupIdx] = { path: webhookPath, accountId, appId: params.account.appId, clientSecret: params.account.clientSecret, handler };
          params.log.info(`Webhook target refreshed for ${accountId} on ${webhookPath}`);
          return;
        }
      }
      const target = {
        path: webhookPath,
        accountId,
        appId: params.account.appId,
        clientSecret: params.account.clientSecret,
        handler
      };
      const result = ingress.registerWebhookTargetWithPluginRoute({
        targetsByPath: sharedTargets,
        target,
        route: {
          auth: "plugin",
          match: "exact",
          pluginId: "openclaw-qqbot",
          source: "qqbot-webhook",
          accountId,
          replaceExisting: true,
          log: (msg) => params.log.info(msg),
          handler: createSharedHandler(webhookPath, params.log)
        },
        onLastPathTargetRemoved: () => {
          params.log.info(`Last webhook target removed from ${webhookPath}`);
        }
      });
      _routeUnregisters.set(webhookPath, result.unregister);
      params.log.info(`Webhook target added on ${webhookPath} (${sharedTargets.get(webhookPath).length} account(s))`);
    },
    close() {
      if (unregistered) return;
      unregistered = true;
      if (storedPath) {
        _routeUnregisters.get(storedPath)?.();
        _routeUnregisters.delete(storedPath);
      }
    }
  };
}
function createSharedHandler(path22, log4) {
  return async (req4, res) => {
    try {
      const ingress = await import("openclaw/plugin-sdk/webhook-ingress").catch(() => null);
      if (!ingress?.withResolvedWebhookRequestPipeline) {
        await handleSimple(req4, res, path22, log4);
        return;
      }
      await ingress.withResolvedWebhookRequestPipeline({
        req: req4,
        res,
        targetsByPath: sharedTargets,
        rateLimiter: ingress.createFixedWindowRateLimiter?.({
          windowMs: 6e4,
          maxRequests: 600,
          maxTrackedKeys: 4096
        }),
        inFlightLimiter: ingress.createWebhookInFlightLimiter?.({
          maxInFlightPerKey: 8,
          maxTrackedKeys: 4096
        }),
        requireJsonContentType: true,
        handle: async ({ targets }) => {
          const bodyResult = await ingress.readWebhookBodyOrReject({
            req: req4,
            res,
            maxBytes: 1048576,
            timeoutMs: 3e4
          });
          if (!bodyResult.ok) {
            log4.warn?.(`[webhook] body rejected`);
            return;
          }
          const rawBody = Buffer.from(bodyResult.value, "utf-8");
          let payload;
          try {
            payload = JSON.parse(bodyResult.value);
          } catch (err) {
            log4.warn?.(`[webhook] invalid json: ${err.message}`);
            res.statusCode = 400;
            res.end(JSON.stringify({ error: "invalid json" }));
            return;
          }
          if (payload.op === 13) {
            const t = targets[0];
            if (!t) {
              log4.warn?.(`[webhook] op:13 no target on ${path22}`);
              res.statusCode = 500;
              res.end(JSON.stringify({ error: "no target" }));
              return;
            }
            const h3 = resolveTargetHandler(path22, t.accountId);
            if (!h3) {
              log4.warn?.(`[webhook] op:13 no handler for ${t.accountId}`);
              res.statusCode = 500;
              res.end(JSON.stringify({ error: "no handler" }));
              return;
            }
            await delegateToHandler(h3, req4, res, rawBody);
            return;
          }
          const timestamp = getHeader2(req4, "x-signature-timestamp") ?? "";
          const signature = getHeader2(req4, "x-signature-ed25519") ?? "";
          if (!timestamp || !signature) {
            log4.warn?.(`[webhook] missing signature headers on ${req4.url}`);
            res.statusCode = 401;
            res.end(JSON.stringify({ error: "missing signature" }));
            return;
          }
          const matched = ingress.resolveWebhookTargetWithAuthOrRejectSync({
            targets,
            res,
            isMatch: (t) => verifyWebhookSignature({
              body: rawBody,
              timestamp,
              signature,
              botSecret: t.clientSecret
            }),
            unauthorizedStatusCode: 401,
            unauthorizedMessage: JSON.stringify({ error: "invalid signature" })
          });
          if (!matched) {
            log4.warn?.(`[webhook] signature mismatch on ${path22} (${targets.length} target(s))`);
            return;
          }
          const h2 = resolveTargetHandler(path22, matched.accountId);
          if (!h2) {
            log4.error?.(`[webhook] no handler for matched target ${matched.accountId}`);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: "no handler" }));
            return;
          }
          await delegateToHandler(h2, req4, res, rawBody);
        }
      });
    } catch (err) {
      log4.error(`Webhook handler error: ${err.message}`);
      if (!res.headersSent) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ error: "internal error" }));
      }
    }
  };
}
function resolveTargetHandler(path22, accountId) {
  return sharedTargets.get(path22)?.find((t) => t.accountId === accountId)?.handler;
}
async function delegateToHandler(handler, req4, res, rawBody) {
  const headers = {};
  for (const [k, v] of Object.entries(req4.headers)) {
    headers[k.toLowerCase()] = v;
  }
  const resp = await handler({ body: rawBody, headers });
  res.statusCode = resp.status;
  if (resp.headers) {
    for (const [k, v] of Object.entries(resp.headers)) res.setHeader(k, v);
  }
  res.end(resp.body);
}
async function handleSimple(req4, res, path22, log4) {
  try {
    const ct = String(req4.headers["content-type"] ?? "");
    if (!ct.includes("application/json")) {
      res.statusCode = 400;
      res.end(JSON.stringify({ error: "unsupported content type" }));
      return;
    }
    const chunks = [];
    let total = 0;
    for await (const chunk of req4) {
      const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
      total += buf.length;
      if (total > 1048576) {
        res.statusCode = 413;
        res.end(JSON.stringify({ error: "too large" }));
        return;
      }
      chunks.push(buf);
    }
    const rawBody = Buffer.concat(chunks);
    const entries = sharedTargets.get(path22) ?? [];
    for (const entry of entries) {
      const resp = await entry.handler({ body: rawBody, headers: mapHeaders(req4) });
      if (resp.status < 400) {
        res.statusCode = resp.status;
        if (resp.headers) for (const [k, v] of Object.entries(resp.headers)) res.setHeader(k, v);
        res.end(resp.body);
        return;
      }
    }
    res.statusCode = 401;
    res.end(JSON.stringify({ error: "invalid signature" }));
  } catch (err) {
    log4.error(`Webhook simple handler error: ${err.message}`);
    if (!res.headersSent) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: "internal error" }));
    }
  }
}
function mapHeaders(req4) {
  const h2 = {};
  for (const [k, v] of Object.entries(req4.headers ?? {})) h2[k.toLowerCase()] = v;
  return h2;
}
function getHeader2(req4, key) {
  const val = req4.headers[key];
  return Array.isArray(val) ? val[0] : val;
}

// src/gateway/qqbot-gateway.ts
var TEXT_TIMEOUT_MS = 3e4;
var MEDIA_TIMEOUT_MS = 3e5;
function resolveMs(envKey, defaultMs) {
  const env = process.env[envKey];
  if (env) {
    const v = Number(env);
    if (!Number.isNaN(v) && v > 0) return v;
  }
  return defaultMs;
}
function withTimeout(promise, ms, label) {
  if (ms <= 0) return promise;
  return Promise.race([
    promise,
    new Promise(
      (_2, reject) => setTimeout(() => reject(new Error(`\u51FA\u7AD9\u8D85\u65F6: ${label} (${ms}ms)`)), ms)
    )
  ]);
}
var QQBotGateway = class {
  bot;
  account;
  runtime;
  log;
  textTimeout;
  mediaTimeout;
  constructor(account, runtime2, log4) {
    this.textTimeout = resolveMs("OPENCLAW_OUTBOUND_TIMEOUT_MS", TEXT_TIMEOUT_MS);
    this.mediaTimeout = resolveMs("OPENCLAW_OUTBOUND_MEDIA_TIMEOUT_MS", MEDIA_TIMEOUT_MS);
    this.account = account;
    this.runtime = runtime2;
    this.log = log4 ?? createPluginLogger({ prefix: `[qqbot:${account.accountId}]` });
    const dataDir = getQQBotDataDir(account.accountId);
    const isWebhook = account.config.transport === "webhook";
    this.bot = new QQBot({
      appId: account.appId,
      appSecret: account.clientSecret,
      accountId: account.accountId,
      markdownSupport: account.markdownSupport,
      userAgent: buildUserAgent(account.userAgentSuffix),
      baseUrl: process.env.QQBOT_BASE_URL?.replace(/\/+$/, "") || "https://api.sgroup.qq.com",
      tokenBaseUrl: process.env.QQBOT_TOKEN_BASE_URL?.replace(/\/+$/, "") || "https://bots.qq.com",
      transport: account.config.transport,
      webhook: isWebhook ? { path: account.config.webhook?.path, server: createPluginWebhookAdapter({ account, log: this.log }) } : void 0,
      sessionPersistence: kvSessionPersistence({
        store: new FileKVStore({ dir: dataDir, fileName: "session.json" }),
        accountId: account.accountId
      }),
      tokenPrefetch: "sync",
      logger: this.log
    });
    this.wrapBotSendForRefIndex();
    setupMiddlewares(this.bot, account, {
      getRuntime: () => runtime2
    });
  }
  async start(callbacks, signal) {
    const handleReady = () => {
      this.log.info(`Gateway ready`);
      callbacks?.onReady?.();
    };
    this.bot.on(`ready`, handleReady);
    this.bot.on(`resumed`, handleReady);
    this.bot.on("error", (err) => {
      this.log.error(`Gateway error: ${err.message}`);
      callbacks?.onError?.(err);
    });
    const gatewayLog = this.log.child("gateway");
    this.bot.on("message", async (ctx, msg) => {
      gatewayLog.debug(`message msgId=${msg.messageId}`);
      try {
        await handleMessage(ctx, msg, this.account, this.runtime, this.log);
      } catch (err) {
        gatewayLog.error(`Dispatch error: ${err instanceof Error ? err.message : String(err)}`);
      }
    });
    this.bot.on("interaction", (_ctx, event) => {
      handleInteraction(
        event,
        this.account,
        this.runtime,
        this.log,
        (id, code, data) => this.bot.acknowledgeInteraction(id, code, data)
      ).catch((err) => {
        this.log.error(`Interaction error: ${err}`);
      });
    });
    await this.bot.start(signal);
  }
  async stop() {
    await this.bot.stop();
  }
  async sendText(target, text, opts) {
    return withTimeout(
      this.bot.sendText(attachMsgId(target, opts), text),
      this.textTimeout,
      "sendText"
    );
  }
  async sendMedia(target, source, opts) {
    const resolvedTarget = attachMsgId(target, opts);
    const fileType = opts?.fileType ?? MediaFileType.IMAGE;
    const sourceOpts = resolveMediaSource(source);
    const result = await withTimeout(
      this.bot.sendMedia({ target: resolvedTarget, fileType, ...sourceOpts, content: opts?.text }),
      this.mediaTimeout,
      "sendMedia"
    );
    return result.message ?? { id: "", timestamp: Date.now() };
  }
  async sendVoice(target, source, opts) {
    const resolvedTarget = attachMsgId(target, opts);
    if (source.base64) {
      const result2 = await withTimeout(
        this.bot.sendMedia({ target: resolvedTarget, fileType: MediaFileType.VOICE, fileData: source.base64, content: opts?.text }),
        this.mediaTimeout,
        "sendVoice(base64)"
      );
      return result2.message ?? { id: "", timestamp: Date.now() };
    }
    if (source.localPath) {
      const result2 = await withTimeout(
        this.bot.sendMedia({ target: resolvedTarget, fileType: MediaFileType.VOICE, localPath: source.localPath, content: opts?.text }),
        this.mediaTimeout,
        "sendVoice(path)"
      );
      return result2.message ?? { id: "", timestamp: Date.now() };
    }
    const result = await withTimeout(
      this.bot.sendMedia({ target: resolvedTarget, fileType: MediaFileType.VOICE, url: source.url, content: opts?.text }),
      this.mediaTimeout,
      "sendVoice(url)"
    );
    return result.message ?? { id: "", timestamp: Date.now() };
  }
  async sendVideo(target, source, opts) {
    const resolvedTarget = attachMsgId(target, opts);
    const sourceOpts = resolveMediaSource(source);
    const result = await withTimeout(
      this.bot.sendMedia({ target: resolvedTarget, fileType: MediaFileType.VIDEO, ...sourceOpts, content: opts?.text }),
      this.mediaTimeout,
      "sendVideo"
    );
    return result.message ?? { id: "", timestamp: Date.now() };
  }
  async sendFile(target, source, opts) {
    const resolvedTarget = attachMsgId(target, opts);
    const sourceOpts = resolveMediaSource(source);
    const result = await withTimeout(
      this.bot.sendMedia({ target: resolvedTarget, fileType: MediaFileType.FILE, ...sourceOpts, fileName: opts?.fileName, content: opts?.text }),
      this.mediaTimeout,
      "sendFile"
    );
    return result.message ?? { id: "", timestamp: Date.now() };
  }
  openStream(target, msgId) {
    return this.bot.openStream({
      target: { ...target, msgId }
    });
  }
  async sendTyping(target) {
    await this.bot.sendTyping(target);
  }
  wrapBotSendForRefIndex() {
    const { accountId, appId } = this.account;
    const senderName = this.account.config.name ?? appId;
    const storeEntry = (msg, content, scope, mediaKind) => {
      const refIdx = msg.ext_info?.ref_idx;
      if (!refIdx) return;
      const finalContent = content || mediaKind ? mediaKind === "voice" ? "[\u8BED\u97F3]" : mediaKind === "image" ? "[\u56FE\u7247]" : mediaKind ? `[${mediaKind}]` : content : "";
      const entry = {
        messageId: msg.id,
        content: finalContent,
        senderId: appId,
        senderName,
        timestamp: typeof msg.timestamp === "number" ? new Date(msg.timestamp).toISOString() : msg.timestamp,
        isBot: true,
        scope
      };
      getPersistedRefIndexStore(accountId).set(refIdx, entry);
    };
    const origSendText = this.bot.sendText.bind(this.bot);
    this.bot.sendText = async (target, text, ...rest) => {
      const result = await origSendText(target, text, ...rest);
      storeEntry(result, text, target.scope);
      return result;
    };
    const origSendMedia = this.bot.sendMedia.bind(this.bot);
    this.bot.sendMedia = async (params) => {
      const result = await origSendMedia(params);
      const msg = result.message;
      if (msg) storeEntry(msg, "", params.target?.scope ?? "", params.mediaKind);
      return result;
    };
    const origOpenStream = this.bot.openStream.bind(this.bot);
    this.bot.openStream = (opts) => {
      const session = origOpenStream(opts);
      let lastContent = "";
      const origUpdate = session.update.bind(session);
      session.update = async (content) => {
        lastContent = content;
        return origUpdate(content);
      };
      const origComplete = session.complete.bind(session);
      session.complete = async () => {
        const result = await origComplete();
        if (result?.ext_info?.ref_idx) {
          getPersistedRefIndexStore(accountId).set(result.ext_info.ref_idx, {
            messageId: result.id,
            content: lastContent,
            senderId: appId,
            senderName,
            timestamp: typeof result.timestamp === "number" ? new Date(result.timestamp).toISOString() : result.timestamp,
            isBot: true,
            scope: opts.target?.scope ?? ""
          });
        }
        return result;
      };
      return session;
    };
  }
};
function attachMsgId(target, opts) {
  if (opts?.msgId) return { ...target, msgId: opts.msgId };
  const cached = getCachedMsgId(target.scope, target.targetId);
  return cached ? { ...target, msgId: cached } : target;
}
function resolveMediaSource(source) {
  if (source.startsWith("data:")) {
    const commaIdx = source.indexOf(",");
    if (commaIdx > 0) {
      return { fileData: source.slice(commaIdx + 1) };
    }
    return { fileData: source };
  }
  if (source.startsWith("http://") || source.startsWith("https://")) {
    return { url: source };
  }
  if (source.startsWith("file://")) {
    let p2 = source.slice("file://".length);
    if (/^\/[a-zA-Z]:[\\/]/.test(p2)) p2 = p2.slice(1);
    try {
      p2 = decodeURIComponent(p2);
    } catch {
    }
    return { localPath: p2 };
  }
  if (source === "~" || source.startsWith("~/") || source.startsWith("~\\")) {
    return { localPath: source.replace(/^~/, import_node_os4.default.homedir()) };
  }
  if (source.startsWith("/") || source.startsWith("./") || source.startsWith("../") || source.startsWith(".\\") || source.startsWith("..\\") || /^[a-zA-Z]:[\\/]/.test(source) || source.startsWith("\\\\")) {
    return { localPath: source };
  }
  return { url: source };
}

// src/features/credential-backup.ts
var import_node_fs8 = __toESM(require("fs"), 1);
var import_node_path9 = __toESM(require("path"), 1);
var BACKUP_DIR = "credential-backup";
var BACKUP_FILENAME = "current.json";
var LEGACY_FILENAME = "credential-backup.json";
function getBackupPath() {
  return import_node_path9.default.join(getQQBotDataDir("data"), BACKUP_DIR, BACKUP_FILENAME);
}
function saveCredentialBackup(accountId, appId, clientSecret) {
  if (!appId || !clientSecret) return;
  try {
    const backupPath = getBackupPath();
    const dir = import_node_path9.default.dirname(backupPath);
    if (!import_node_fs8.default.existsSync(dir)) {
      import_node_fs8.default.mkdirSync(dir, { recursive: true });
    }
    const data = {
      accountId,
      appId,
      clientSecret,
      savedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    const tmpPath = backupPath + ".tmp";
    import_node_fs8.default.writeFileSync(tmpPath, JSON.stringify(data, null, 2) + "\n", "utf8");
    import_node_fs8.default.renameSync(tmpPath, backupPath);
  } catch {
  }
}
function loadCredentialBackup(accountId) {
  try {
    const backupPath = getBackupPath();
    if (import_node_fs8.default.existsSync(backupPath)) {
      const data = readBackupFile(backupPath, accountId);
      if (data) return data;
    }
    const legacyPath = import_node_path9.default.join(getQQBotDataDir("data"), LEGACY_FILENAME);
    if (import_node_fs8.default.existsSync(legacyPath)) {
      return readBackupFile(legacyPath, accountId);
    }
    return null;
  } catch {
    return null;
  }
}
function readBackupFile(filePath, accountId) {
  const raw = import_node_fs8.default.readFileSync(filePath, "utf8");
  const data = JSON.parse(raw);
  if (!data.appId || !data.clientSecret) return null;
  if (accountId && data.accountId !== accountId) return null;
  return data;
}

// src/gateway/lifecycle.ts
async function startAccountWithCredentialRecovery(ctx) {
  let { account } = ctx;
  const { abortSignal, cfg } = ctx;
  const log4 = createPluginLogger({
    prefix: `[${account.accountId}]`,
    ...ctx.log?.info ? { output: ctx.log } : {}
  });
  const runtime2 = getQQBotRuntime();
  if (!account.appId || !account.clientSecret) {
    const backup = loadCredentialBackup(account.accountId);
    if (backup) {
      log4?.info(`[qqbot:${account.accountId}] \u4ECE\u6682\u5B58\u6587\u4EF6\u6062\u590D\u51ED\u8BC1 (appId=${backup.appId})`);
      try {
        const restoredCfg = applyQQBotAccountConfig(cfg, account.accountId, {
          appId: backup.appId,
          clientSecret: backup.clientSecret
        });
        const adapters = getAdapters(runtime2);
        if (adapters.persistConfig) {
          await adapters.persistConfig(() => restoredCfg);
        }
        account = resolveQQBotAccount(restoredCfg, account.accountId);
      } catch (e) {
        log4?.error(`[qqbot:${account.accountId}] \u51ED\u8BC1\u6062\u590D\u5931\u8D25: ${e}`);
      }
    }
  }
  const gw = new QQBotGateway(account, runtime2, log4);
  registerGateway(account.accountId, gw);
  await gw.start(
    {
      onReady: () => {
        saveCredentialBackup(account.accountId, account.appId, account.clientSecret);
        ctx.setStatus({
          ...ctx.getStatus(),
          running: true,
          connected: true,
          lastConnectedAt: Date.now()
        });
        initFeatures(account, cfg, log4).catch((e) => {
          log4?.error(`[qqbot:${account.accountId}] initFeatures error: ${e}`);
        });
      },
      onError: (error) => {
        log4?.error(`[qqbot:${account.accountId}] Gateway error: ${error.message}`);
        ctx.setStatus({ ...ctx.getStatus(), lastError: error.message });
      }
    },
    abortSignal
  );
}
async function initFeatures(account, cfg, log4) {
  triggerUpdateCheck(log4);
  const existing = getApprovalHandler(account.accountId);
  if (existing) {
    await existing.stop();
    unregisterApprovalHandler(account.accountId);
  }
  const approvalLog = log4.child("approval");
  try {
    const handler = new QQBotApprovalHandler({
      accountId: account.accountId,
      appId: account.appId,
      clientSecret: account.clientSecret,
      cfg,
      log: approvalLog
    });
    registerApprovalHandler(account.accountId, handler);
    await handler.start();
    approvalLog.info("registered");
  } catch (e) {
    approvalLog.debug(`not available: ${e}`);
  }
}
async function stopAccountGracefully(params) {
  const { accountId, log: log4 } = params;
  const gw = getGateway(accountId);
  if (gw) {
    try {
      await gw.stop();
      log4?.info(`[qqbot:${accountId}] gateway stopped`);
    } catch (err) {
      log4?.error(`[qqbot:${accountId}] gateway stop error: ${err instanceof Error ? err.message : String(err)}`);
    }
  }
  unregisterGateway(accountId);
  try {
    const h2 = getApprovalHandler(accountId);
    if (h2) await h2.stop();
  } catch {
  }
  unregisterApprovalHandler(accountId);
}
async function logoutAndClearCredentials(params) {
  const { accountId, cfg } = params;
  unregisterGateway(accountId);
  try {
    const h2 = getApprovalHandler(accountId);
    if (h2) await h2.stop();
  } catch {
  }
  unregisterApprovalHandler(accountId);
  const nextCfg = { ...cfg };
  const nextQQBot = cfg.channels?.qqbot ? { ...cfg.channels.qqbot } : void 0;
  let cleared = false;
  let changed = false;
  if (nextQQBot) {
    const qqbot = nextQQBot;
    if (accountId === DEFAULT_ACCOUNT_ID && qqbot.clientSecret) {
      delete qqbot.clientSecret;
      cleared = true;
      changed = true;
    }
    const accounts = qqbot.accounts;
    if (accounts && accountId in accounts) {
      const entry = accounts[accountId];
      if (entry && "clientSecret" in entry) {
        delete entry.clientSecret;
        cleared = true;
        changed = true;
      }
      if (entry && Object.keys(entry).length === 0) {
        delete accounts[accountId];
        changed = true;
      }
    }
  }
  if (changed && nextQQBot) {
    nextCfg.channels = { ...nextCfg.channels, qqbot: nextQQBot };
    const runtime2 = getQQBotRuntime();
    const adapters = getAdapters(runtime2);
    if (adapters.persistConfig) {
      await adapters.persistConfig(() => nextCfg);
    }
  }
  const resolved = resolveQQBotAccount(changed ? nextCfg : cfg, accountId);
  const loggedOut = resolved.secretSource === "none";
  const envToken = Boolean(process.env.QQBOT_CLIENT_SECRET);
  return { ok: true, cleared, envToken, loggedOut };
}

// src/features/approval-utils.ts
function isApprovalPayload(payload) {
  if (!payload || typeof payload !== "object") return false;
  const p2 = payload;
  const cd = p2.channelData;
  if (cd && typeof cd === "object" && !Array.isArray(cd)) {
    const execApproval = cd.execApproval;
    if (execApproval && typeof execApproval === "object" && !Array.isArray(execApproval)) {
      return true;
    }
  }
  const text = typeof p2.text === "string" ? p2.text : "";
  return /(?:Plugin|Exec) approval (?:required|allowed|denied|expired)/i.test(text);
}
var approvalStubs = {
  execApprovals: {
    getInitiatingSurfaceState: () => ({ kind: "enabled" }),
    shouldSuppressForwardingFallback: () => true,
    shouldSuppressLocalPrompt: ({ payload }) => isApprovalPayload(payload),
    buildPendingPayload: () => null,
    buildResolvedPayload: () => null
  },
  approvals: {
    delivery: {
      hasConfiguredDmRoute: () => true,
      shouldSuppressForwardingFallback: () => true
    },
    render: {
      exec: { buildPendingPayload: () => null, buildResolvedPayload: () => null },
      plugin: { buildPendingPayload: () => null, buildResolvedPayload: () => null }
    }
  }
};

// src/features/onboarding.ts
init_config();
var qqbotOnboardingAdapter = {
  getStatus: (ctx) => {
    const cfg = ctx.config;
    const accountIds = listQQBotAccountIds(cfg);
    if (accountIds.length === 0) {
      return { configured: false, accountCount: 0 };
    }
    const firstAccount = resolveQQBotAccount(cfg, accountIds[0]);
    return {
      configured: Boolean(firstAccount.appId && firstAccount.clientSecret),
      accountCount: accountIds.length,
      defaultAccountId: accountIds[0]
    };
  },
  configure: async (ctx) => {
    return { success: false, message: "Onboarding not yet migrated to new architecture" };
  }
};

// src/channel.ts
var TEXT_CHUNK_LIMIT2 = 5e3;
var GFM_TABLE_DATA_RE = /^\|.+\|.*\|/;
var GFM_TABLE_SEP_RE = /^\|[\s:-]+\|/;
function isGfmTableLine(line) {
  return GFM_TABLE_DATA_RE.test(line) || GFM_TABLE_SEP_RE.test(line);
}
var qqbotPlugin = {
  id: "qqbot",
  meta: {
    id: "qqbot",
    label: "QQ Bot",
    selectionLabel: "QQ Bot",
    docsPath: "/docs/channels/qqbot",
    blurb: "Connect to QQ via official QQ Bot API",
    order: 50
  },
  capabilities: {
    chatTypes: ["direct", "group"],
    media: true,
    reactions: false,
    threads: false,
    blockStreaming: false
  },
  gatewayMethods: ["web.login.start", "web.login.wait"],
  reload: { configPrefixes: ["channels.qqbot"] },
  // ── 群消息策略 ──
  groups: {
    resolveRequireMention: ({ cfg, accountId, groupId }) => {
      if (!groupId) return void 0;
      return resolveRequireMention(cfg, groupId, accountId ?? void 0);
    },
    resolveToolPolicy: ({ cfg, accountId, groupId }) => {
      if (!groupId) return void 0;
      const policy = resolveToolPolicy(cfg, groupId, accountId ?? void 0);
      if (policy === "full") return void 0;
      if (policy === "none") return { allow: [], deny: ["*"] };
      return { allow: [] };
    },
    resolveGroupIntroHint: ({ cfg, accountId, groupId }) => {
      if (!groupId) return void 0;
      const groupCfg = resolveGroupConfig(cfg, groupId, accountId ?? void 0);
      return groupCfg.name ? `\u5F53\u524D\u7FA4: ${groupCfg.name}` : void 0;
    }
  },
  // ── @mention 检测与清理 ──
  mentions: {
    stripMentions: ({ text, ctx }) => {
      const mentions = ctx?.mentions;
      return stripMentionText(text, mentions);
    }
  },
  // @ts-ignore onboarding 兼容
  onboarding: qqbotOnboardingAdapter,
  // ── 配置管理 ──
  config: {
    listAccountIds: (cfg) => listQQBotAccountIds(cfg),
    resolveAccount: (cfg, accountId) => resolveQQBotAccount(cfg, accountId),
    defaultAccountId: (cfg) => resolveDefaultQQBotAccountId(cfg),
    setAccountEnabled: ({ cfg, accountId, enabled }) => (0, import_core.setAccountEnabledInConfigSection)({ cfg, sectionKey: "qqbot", accountId, enabled, allowTopLevel: true }),
    deleteAccount: ({ cfg, accountId }) => (0, import_core.deleteAccountFromConfigSection)({
      cfg,
      sectionKey: "qqbot",
      accountId,
      clearBaseFields: ["appId", "clientSecret", "clientSecretFile", "name"]
    }),
    isConfigured: (account) => {
      if (account?.appId && account?.clientSecret) return true;
      return loadCredentialBackup(account?.accountId) !== null;
    },
    describeAccount: (account) => ({
      accountId: account?.accountId ?? DEFAULT_ACCOUNT_ID,
      name: account?.name,
      enabled: account?.enabled ?? false,
      configured: Boolean(account?.appId && account?.clientSecret),
      tokenSource: account?.secretSource
    }),
    resolveAllowFrom: ({ cfg, accountId }) => {
      const account = resolveQQBotAccount(cfg, accountId ?? void 0);
      return (account.config?.allowFrom ?? []).map((e) => String(e));
    },
    formatAllowFrom: ({ allowFrom }) => allowFrom.map((e) => String(e).trim()).filter(Boolean).map((e) => e.replace(/^qqbot:/i, "").toUpperCase())
  },
  // ── Setup ──
  setup: {
    resolveAccountId: ({ accountId }) => accountId?.trim().toLowerCase() || DEFAULT_ACCOUNT_ID,
    applyAccountName: ({ cfg, accountId, name }) => (0, import_core.applyAccountNameToChannelSection)({ cfg, channelKey: "qqbot", accountId, name }),
    validateInput: ({ input }) => {
      if (!input.token && !input.tokenFile && !input.useEnv) {
        return "QQBot requires --token (format: appId:clientSecret) or --use-env";
      }
      return null;
    },
    applyAccountConfig: ({ cfg, accountId, input }) => {
      let appId = "";
      let clientSecret = "";
      if (input.token) {
        const parts = input.token.split(":");
        if (parts.length === 2) {
          appId = parts[0];
          clientSecret = parts[1];
        }
      }
      return applyQQBotAccountConfig(cfg, accountId, {
        appId,
        clientSecret,
        clientSecretFile: input.tokenFile,
        name: input.name
      });
    }
  },
  setupWizard: qqbotSetupWizard,
  // ── Messaging ──
  messaging: {
    normalizeTarget,
    targetResolver: {
      looksLikeId: isQQBotTarget,
      hint: "QQ Bot \u76EE\u6807\u683C\u5F0F: qqbot:c2c:openid (\u79C1\u804A) \u6216 qqbot:group:groupid (\u7FA4\u804A)"
    }
  },
  // ── 出站 ──
  outbound: {
    deliveryMode: "direct",
    sanitizeText: ({ text, payload, accountId }) => {
      const sanitized = sanitizeQQBotText(text);
      stagePendingQuestionPayload({
        payload,
        accountId: accountId ?? DEFAULT_ACCOUNT_ID,
        text: sanitized
      });
      return sanitized;
    },
    chunker: (text, limit) => {
      const adapters = getAdapters(getQQBotRuntime());
      if (adapters.chunkMarkdownText) return adapters.chunkMarkdownText(text, limit);
      const lines = text.split("\n");
      const chunks = [];
      let current = "";
      let tableBuffer = [];
      const flushTable = () => {
        if (tableBuffer.length === 0) return;
        const tableBlock = tableBuffer.join("\n");
        const candidate = current ? `${current}
${tableBlock}` : tableBlock;
        if (candidate.length > limit && current) {
          chunks.push(current);
          current = tableBlock;
        } else {
          current = candidate;
        }
        tableBuffer = [];
      };
      for (const line of lines) {
        if (isGfmTableLine(line)) {
          tableBuffer.push(line);
          continue;
        }
        flushTable();
        const candidate = current ? `${current}
${line}` : line;
        if (candidate.length > limit && current) {
          chunks.push(current);
          current = line;
        } else {
          current = candidate;
        }
      }
      flushTable();
      if (current) chunks.push(current);
      return chunks.length > 0 ? chunks : [text];
    },
    chunkerMode: "markdown",
    textChunkLimit: TEXT_CHUNK_LIMIT2,
    shouldSuppressLocalPayloadPrompt: ({ payload }) => isApprovalPayload(payload),
    sendText: async (sendCtx) => {
      const { to, text, accountId, replyToId, cfg, payload } = sendCtx;
      const account = resolveQQBotAccount(cfg, accountId ?? void 0);
      const outLog = createOutLog(account.accountId);
      outLog.debug(`sendText to=${to} len=${text.length} replyTo=${replyToId ?? "-"}`);
      const result = await sendText({ to, text, accountId, replyToId, account });
      if (result.error) throw new Error(result.error);
      const target = parseTarget(to);
      registerPendingQuestionTarget({
        payload,
        text,
        accountId: account.accountId,
        scope: target.scope,
        targetId: target.targetId,
        log: outLog
      });
      return { channel: "qqbot", messageId: result.messageId ?? "" };
    },
    sendMedia: async ({ to, text, mediaUrl, accountId, replyToId, cfg }) => {
      const resolvedAccountId = accountId ?? resolveDefaultQQBotAccountId(cfg);
      const outLog = createOutLog(resolvedAccountId);
      outLog.debug(`sendMedia to=${to} url=${mediaUrl?.slice(0, 80)} len=${text?.length ?? 0} replyTo=${replyToId ?? "-"}`);
      const result = await sendMedia2({
        to,
        source: mediaUrl ?? "",
        text,
        replyToId,
        accountId: resolvedAccountId,
        log: outLog,
        agentId: resolveMCPAgentId(to, resolvedAccountId, cfg, outLog)
      });
      if (result.error) {
        outLog.error(`sendMedia failed: ${result.error}`);
        throw new Error(result.error);
      }
      return { channel: "qqbot", messageId: result.messageId ?? "" };
    }
  },
  // ── 网关 ──
  gateway: {
    startAccount: (ctx) => startAccountWithCredentialRecovery(ctx),
    stopAccount: async (ctx) => {
      await stopAccountGracefully({
        accountId: ctx.accountId,
        log: ctx.log
      });
    },
    logoutAccount: (params) => logoutAndClearCredentials(params),
    loginWithQrStart: async ({ accountId }) => startQrLogin(accountId),
    loginWithQrWait: async ({ accountId }) => {
      const result = await waitQrLogin(accountId);
      return { connected: result.connected, message: result.message };
    }
  },
  // ── 登录认证 ──
  auth: {
    login: qqbotLogin,
    // 审批权限（从 approvalStubs 迁移）
    authorizeActorAction: () => ({ authorized: true }),
    getActionAvailabilityState: () => ({ kind: "enabled" })
  },
  // ── 状态 ──
  status: {
    defaultRuntime: {
      accountId: DEFAULT_ACCOUNT_ID,
      running: false,
      connected: false,
      lastConnectedAt: null,
      lastError: null,
      lastInboundAt: null,
      lastOutboundAt: null
    },
    buildChannelSummary: ({ snapshot }) => ({
      configured: snapshot.configured ?? false,
      tokenSource: snapshot.tokenSource ?? "none",
      running: snapshot.running ?? false,
      connected: snapshot.connected ?? false,
      lastConnectedAt: snapshot.lastConnectedAt ?? null,
      lastError: snapshot.lastError ?? null
    }),
    buildAccountSnapshot: ({ account, runtime: runtime2 }) => ({
      accountId: account?.accountId ?? DEFAULT_ACCOUNT_ID,
      name: account?.name,
      enabled: account?.enabled ?? false,
      configured: Boolean(account?.appId && account?.clientSecret),
      tokenSource: account?.secretSource,
      running: Boolean(runtime2?.running ?? false),
      connected: Boolean(runtime2?.connected ?? false),
      lastConnectedAt: runtime2?.lastConnectedAt ?? null,
      lastError: runtime2?.lastError ?? null,
      lastInboundAt: runtime2?.lastInboundAt ?? null,
      lastOutboundAt: runtime2?.lastOutboundAt ?? null
    })
  },
  // ── 审批（stub — 实际由 features/approval-handler 处理）──
  ...approvalStubs
};
function resolveMCPAgentId(to, accountId, cfg, log4) {
  try {
    const parts = to.split(":");
    const scope = parts[1];
    const peerId = parts[2];
    if (!scope || !peerId) return void 0;
    const rt = tryGetQQBotRuntime();
    if (!rt) return void 0;
    const route = getAdapters(rt).resolveAgentRoute?.({
      cfg,
      channel: "qqbot",
      accountId,
      peer: { kind: scope === "group" ? "group" : "direct", id: peerId }
    });
    log4?.debug(`resolveMCPAgentId to=${to} => agentId=${route?.agentId ?? "none"}`);
    return route?.agentId;
  } catch {
    return void 0;
  }
}
function createOutLog(accountId) {
  const gwLog = getGateway(accountId)?.log;
  return gwLog?.child("outbound") ?? {};
}

// src/tools/platform.ts
init_config();
var PlatformApiSchema = {
  type: "object",
  properties: {
    method: {
      type: "string",
      description: "HTTP \u8BF7\u6C42\u65B9\u6CD5\u3002\u53EF\u9009\u503C\uFF1AGET, POST, PUT, PATCH, DELETE",
      enum: ["GET", "POST", "PUT", "PATCH", "DELETE"]
    },
    path: {
      type: "string",
      description: "API \u8DEF\u5F84\uFF08\u4E0D\u542B\u57DF\u540D\uFF09\uFF0C\u5360\u4F4D\u7B26\u9700\u66FF\u6362\u4E3A\u5B9E\u9645\u503C\u3002\u793A\u4F8B\uFF1A/users/@me/guilds, /guilds/{guild_id}/channels, /v2/groups/{group_id}/bot_state"
    },
    body: {
      type: "object",
      description: "\u8BF7\u6C42\u4F53\uFF08JSON\uFF09\uFF0C\u7528\u4E8E POST/PUT/PATCH \u8BF7\u6C42\u3002GET/DELETE \u8BF7\u6C42\u4E0D\u9700\u8981\u6B64\u53C2\u6570\u3002"
    },
    query: {
      type: "object",
      description: 'URL \u67E5\u8BE2\u53C2\u6570\uFF08\u952E\u503C\u5BF9\uFF09\uFF0C\u4F1A\u62FC\u63A5\u5230\u8DEF\u5F84\u540E\u9762\u3002\u5982 { "limit": "100", "after": "0" } \u4F1A\u62FC\u63A5\u4E3A ?limit=100&after=0',
      additionalProperties: { type: "string" }
    }
  },
  required: ["method", "path"]
};
function json(data) {
  return {
    content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
    details: data
  };
}
function validatePath(path22) {
  if (!path22.startsWith("/")) return "path \u5FC5\u987B\u4EE5 / \u5F00\u5934";
  if (path22.includes("..") || path22.includes("//")) return "path \u4E0D\u5141\u8BB8\u5305\u542B .. \u6216 //";
  if (!/^\/[a-zA-Z0-9\-._~:@!$&'()*+,;=/%]+$/.test(path22) && path22 !== "/") {
    return "path \u5305\u542B\u975E\u6CD5\u5B57\u7B26";
  }
  return null;
}
function registerPlatformTool(api) {
  const cfg = api.config;
  if (!cfg) return;
  const accountIds = listQQBotAccountIds(cfg);
  if (accountIds.length === 0) return;
  api.registerTool(
    {
      name: "qqbot_platform_api",
      label: "QQBot Platform API Gateway",
      description: "QQ \u5F00\u653E\u5E73\u53F0\u7EDF\u4E00 HTTP API \u7F51\u5173\uFF0C\u81EA\u52A8\u586B\u5145\u9274\u6743 Token\u3002\u5E38\u7528\u63A5\u53E3\u901F\u67E5\uFF1A\u3010\u9891\u9053\u3011GET /users/@me/guilds | /guilds/{guild_id}/channels | /channels/{channel_id} | \u3010\u7FA4\u3011GET /v2/groups/{group_id}/bot_state | /v2/groups/{group_id}/members/{member_id} | /v2/groups/{group_id}/info\u3002\u66F4\u591A\u63A5\u53E3\u548C\u53C2\u6570\u8BE6\u60C5\u8BF7\u9605\u8BFB qqbot-channel \u548C qqbot-group skill\u3002",
      parameters: PlatformApiSchema,
      async execute(_toolCallId, params) {
        const p2 = params;
        if (!p2.method) return json({ error: "method \u4E3A\u5FC5\u586B\u53C2\u6570" });
        if (!p2.path) return json({ error: "path \u4E3A\u5FC5\u586B\u53C2\u6570" });
        const method = p2.method.toUpperCase();
        if (!["GET", "POST", "PUT", "PATCH", "DELETE"].includes(method)) {
          return json({ error: `\u4E0D\u652F\u6301\u7684 HTTP \u65B9\u6CD5: ${method}` });
        }
        const pathError = validatePath(p2.path);
        if (pathError) return json({ error: pathError });
        const accountId = getRequestAccountId();
        if (!accountId) {
          return json({ error: "\u65E0\u6CD5\u83B7\u53D6\u5F53\u524D\u8BF7\u6C42\u7684\u8D26\u53F7\u4FE1\u606F\uFF0C\u6B64\u5DE5\u5177\u4EC5\u652F\u6301\u5728\u6D88\u606F\u4F1A\u8BDD\u4E2D\u4F7F\u7528" });
        }
        try {
          const bot = getBotForAccount(accountId);
          const apiGateway = bot.api;
          let data;
          switch (method) {
            case "GET":
              data = await apiGateway.get(p2.path, p2.query);
              break;
            case "POST":
              data = await apiGateway.post(p2.path, p2.body);
              break;
            case "PUT":
              data = await apiGateway.put(p2.path, p2.body);
              break;
            case "PATCH":
              data = await apiGateway.patch(p2.path, p2.body);
              break;
            case "DELETE":
              data = await apiGateway.delete(p2.path);
              break;
          }
          return json(data);
        } catch (err) {
          const errMsg = err instanceof Error ? err.message : String(err);
          const apiErr = err;
          return json({
            error: errMsg,
            status: apiErr.httpStatus,
            code: apiErr.bizCode,
            path: p2.path
          });
        }
      }
    },
    { name: "qqbot_platform_api" }
  );
}

// src/tools/remind.ts
var RemindSchema = {
  type: "object",
  properties: {
    action: {
      type: "string",
      description: "\u64CD\u4F5C\u7C7B\u578B\u3002add=\u521B\u5EFA\u63D0\u9192, list=\u67E5\u770B\u5DF2\u6709\u63D0\u9192, remove=\u5220\u9664\u63D0\u9192",
      enum: ["add", "list", "remove"]
    },
    content: {
      type: "string",
      description: '\u63D0\u9192\u5185\u5BB9\uFF0C\u5982"\u559D\u6C34"\u3001"\u5F00\u4F1A"\u3002action=add \u65F6\u5FC5\u586B\u3002'
    },
    to: {
      type: "string",
      description: "\u6295\u9012\u76EE\u6807\u5730\u5740\uFF08\u53EF\u9009\uFF09\u3002\u7CFB\u7EDF\u4F1A\u81EA\u52A8\u4ECE\u5F53\u524D\u4F1A\u8BDD\u83B7\u53D6\uFF0C\u901A\u5E38\u65E0\u9700\u624B\u52A8\u586B\u5199\u3002\u79C1\u804A\u683C\u5F0F\uFF1Aqqbot:c2c:user_openid\uFF0C\u7FA4\u804A\u683C\u5F0F\uFF1Aqqbot:group:group_openid\u3002"
    },
    time: {
      type: "string",
      description: '\u65F6\u95F4\u63CF\u8FF0\u3002\u652F\u6301\u4E24\u79CD\u683C\u5F0F\uFF1A\n1. \u76F8\u5BF9\u65F6\u95F4\uFF1A\u5982 "5m"(5\u5206\u949F\u540E)\u3001"1h"(1\u5C0F\u65F6\u540E)\u3001"1h30m"(1.5\u5C0F\u65F6\u540E)\u3001"2d"(2\u5929\u540E)\n2. cron \u8868\u8FBE\u5F0F\uFF1A\u5982 "0 8 * * *"(\u6BCF\u59298\u70B9)\u3001"0 9 * * 1-5"(\u5DE5\u4F5C\u65E59\u70B9)\n\u7CFB\u7EDF\u4F1A\u81EA\u52A8\u5224\u65AD\uFF1A\u5305\u542B\u7A7A\u683C\u7684\u89C6\u4E3A cron \u8868\u8FBE\u5F0F\uFF08\u5468\u671F\u63D0\u9192\uFF09\uFF0C\u5426\u5219\u89C6\u4E3A\u76F8\u5BF9\u65F6\u95F4\uFF08\u4E00\u6B21\u6027\u63D0\u9192\uFF09\u3002\naction=add \u65F6\u5FC5\u586B\u3002'
    },
    timezone: {
      type: "string",
      description: '\u65F6\u533A\uFF0C\u4EC5\u5468\u671F\u63D0\u9192(cron)\u65F6\u9700\u8981\u3002\u9ED8\u8BA4 "Asia/Shanghai"\u3002'
    },
    name: {
      type: "string",
      description: "\u63D0\u9192\u4EFB\u52A1\u540D\u79F0\uFF08\u53EF\u9009\uFF09\u3002\u9ED8\u8BA4\u81EA\u52A8\u4ECE content \u622A\u53D6\u524D 20 \u5B57\u3002"
    },
    jobId: {
      type: "string",
      description: "\u8981\u5220\u9664\u7684\u4EFB\u52A1 ID\u3002action=remove \u65F6\u5FC5\u586B\uFF0C\u5148\u7528 list \u83B7\u53D6\u3002"
    }
  },
  required: ["action"]
};
function json2(data) {
  return {
    content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
    details: data
  };
}
function parseRelativeTime(timeStr) {
  const s = timeStr.trim().toLowerCase();
  if (/^\d+$/.test(s)) {
    return parseInt(s, 10) * 6e4;
  }
  let totalMs = 0;
  let matched = false;
  const regex = /(\d+(?:\.\d+)?)\s*(d|h|m|s)/g;
  let match;
  while ((match = regex.exec(s)) !== null) {
    matched = true;
    const value = parseFloat(match[1]);
    const unit = match[2];
    switch (unit) {
      case "d":
        totalMs += value * 864e5;
        break;
      case "h":
        totalMs += value * 36e5;
        break;
      case "m":
        totalMs += value * 6e4;
        break;
      case "s":
        totalMs += value * 1e3;
        break;
    }
  }
  return matched ? Math.round(totalMs) : null;
}
function isCronExpression(timeStr) {
  const parts = timeStr.trim().split(/\s+/);
  return parts.length >= 3 && parts.length <= 6;
}
function generateJobName(content) {
  const trimmed = content.trim();
  const short = trimmed.length > 20 ? trimmed.slice(0, 20) + "\u2026" : trimmed;
  return `\u63D0\u9192: ${short}`;
}
function buildOnceJob(params, delayMs, to, accountId) {
  const atMs = Date.now() + delayMs;
  const content = params.content;
  const name = params.name || generateJobName(content);
  return {
    action: "add",
    job: {
      name,
      schedule: { kind: "at", atMs },
      sessionTarget: "isolated",
      wakeMode: "now",
      deleteAfterRun: true,
      payload: {
        kind: "agentTurn",
        message: buildReminderPrompt(content)
      },
      delivery: {
        mode: "announce",
        channel: "qqbot",
        to,
        accountId
      }
    }
  };
}
function buildCronJob(params, to, accountId) {
  const content = params.content;
  const name = params.name || generateJobName(content);
  const tz = params.timezone || "Asia/Shanghai";
  return {
    action: "add",
    job: {
      name,
      schedule: { kind: "cron", expr: params.time.trim(), tz },
      sessionTarget: "isolated",
      wakeMode: "now",
      payload: {
        kind: "agentTurn",
        message: buildReminderPrompt(content)
      },
      delivery: {
        mode: "announce",
        channel: "qqbot",
        to,
        accountId
      }
    }
  };
}
function buildReminderPrompt(content) {
  return `\u4F60\u662F\u4E00\u4E2A\u6696\u5FC3\u7684\u63D0\u9192\u52A9\u624B\u3002\u8BF7\u7528\u6E29\u6696\u3001\u6709\u8DA3\u7684\u65B9\u5F0F\u63D0\u9192\u7528\u6237\uFF1A${content}\u3002\u8981\u6C42\uFF1A(1) \u4E0D\u8981\u56DE\u590DHEARTBEAT_OK (2) \u4E0D\u8981\u89E3\u91CA\u4F60\u662F\u8C01 (3) \u76F4\u63A5\u8F93\u51FA\u4E00\u6761\u6696\u5FC3\u7684\u63D0\u9192\u6D88\u606F (4) \u53EF\u4EE5\u52A0\u4E00\u53E5\u7B80\u77ED\u7684\u9E21\u6C64\u6216\u5173\u6000\u7684\u8BDD (5) \u63A7\u5236\u57282-3\u53E5\u8BDD\u4EE5\u5185 (6) \u7528emoji\u70B9\u7F00`;
}
function formatDelay(ms) {
  const totalSeconds = Math.round(ms / 1e3);
  if (totalSeconds < 60) return `${totalSeconds}\u79D2`;
  const totalMinutes = Math.round(ms / 6e4);
  if (totalMinutes < 60) return `${totalMinutes}\u5206\u949F`;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (minutes === 0) return `${hours}\u5C0F\u65F6`;
  return `${hours}\u5C0F\u65F6${minutes}\u5206\u949F`;
}
function registerRemindTool(api) {
  api.registerTool(
    {
      name: "qqbot_remind",
      label: "QQBot \u5B9A\u65F6\u63D0\u9192",
      description: '\u521B\u5EFA\u3001\u67E5\u8BE2\u3001\u5220\u9664 QQ \u5B9A\u65F6\u63D0\u9192\u3002\u4F7F\u7528\u7B80\u5355\u53C2\u6570\u5373\u53EF\uFF0C\u65E0\u9700\u624B\u52A8\u6784\u9020 cron JSON\u3002\n\u521B\u5EFA\u63D0\u9192\uFF1Aaction=add, content=\u63D0\u9192\u5185\u5BB9, to=\u76EE\u6807\u5730\u5740, time=\u65F6\u95F4\n\u67E5\u770B\u63D0\u9192\uFF1Aaction=list\n\u5220\u9664\u63D0\u9192\uFF1Aaction=remove, jobId=\u4EFB\u52A1ID\uFF08\u5148 list \u83B7\u53D6\uFF09\n\u65F6\u95F4\u683C\u5F0F\u793A\u4F8B\uFF1A"5m"(5\u5206\u949F\u540E) "1h"(1\u5C0F\u65F6\u540E) "0 8 * * *"(\u6BCF\u59298\u70B9)',
      parameters: RemindSchema,
      execute(_toolCallId, params) {
        const p2 = params;
        if (p2.action === "list") {
          return json2({
            _instruction: "\u8BF7\u7ACB\u5373\u4F7F\u7528 cron \u5DE5\u5177\u6267\u884C\u4EE5\u4E0B\u53C2\u6570",
            cronParams: { action: "list" }
          });
        }
        if (p2.action === "remove") {
          if (!p2.jobId) {
            return json2({ error: "action=remove \u65F6 jobId \u4E3A\u5FC5\u586B\u53C2\u6570\u3002\u8BF7\u5148\u7528 action=list \u83B7\u53D6 jobId\u3002" });
          }
          return json2({
            _instruction: "\u8BF7\u7ACB\u5373\u4F7F\u7528 cron \u5DE5\u5177\u6267\u884C\u4EE5\u4E0B\u53C2\u6570",
            cronParams: { action: "remove", jobId: p2.jobId }
          });
        }
        if (!p2.content) {
          return json2({ error: "action=add \u65F6 content\uFF08\u63D0\u9192\u5185\u5BB9\uFF09\u4E3A\u5FC5\u586B\u53C2\u6570" });
        }
        const resolvedTo = p2.to || getRequestTarget();
        if (!resolvedTo) {
          return json2({ error: "action=add \u65F6\u65E0\u6CD5\u786E\u5B9A\u6295\u9012\u76EE\u6807\u5730\u5740\u3002\u8BF7\u7A0D\u540E\u91CD\u8BD5\u3002" });
        }
        const resolvedAccountId = getRequestAccountId() || "default";
        if (!p2.time) {
          return json2({ error: 'action=add \u65F6 time\uFF08\u65F6\u95F4\uFF09\u4E3A\u5FC5\u586B\u53C2\u6570\u3002\u793A\u4F8B\uFF1A"5m"\u3001"1h30m"\u3001"0 8 * * *"' });
        }
        if (isCronExpression(p2.time)) {
          const cronJob = buildCronJob(p2, resolvedTo, resolvedAccountId);
          return json2({
            _instruction: "\u8BF7\u7ACB\u5373\u4F7F\u7528 cron \u5DE5\u5177\uFF0C\u5C06 cronParams \u7684\u503C\u539F\u6837\u4F5C\u4E3A\u53C2\u6570\u4F20\u5165\uFF08\u4E0D\u8981\u4FEE\u6539\u6216\u7701\u7565\u4EFB\u4F55\u5B57\u6BB5\uFF0C\u7279\u522B\u662F delivery.accountId\uFF09\uFF0C\u7136\u540E\u56DE\u590D\u7528\u6237\u63D0\u9192\u5DF2\u8BBE\u7F6E",
            cronParams: cronJob,
            summary: `\u23F0 \u5468\u671F\u63D0\u9192: "${p2.content}" (${p2.time}, tz=${p2.timezone || "Asia/Shanghai"})`
          });
        }
        const delayMs = parseRelativeTime(p2.time);
        if (!delayMs || delayMs <= 0) {
          return json2({
            error: `\u65E0\u6CD5\u89E3\u6790\u65F6\u95F4 "${p2.time}"\u3002\u652F\u6301\u683C\u5F0F\uFF1A\u76F8\u5BF9\u65F6\u95F4\u5982 "5m"\u3001"1h"\u3001"1h30m"\u3001"2d"\uFF1Bcron \u8868\u8FBE\u5F0F\u5982 "0 8 * * *"\uFF08\u6BCF\u59298\u70B9\uFF09`
          });
        }
        if (delayMs < 3e4) {
          return json2({ error: "\u63D0\u9192\u65F6\u95F4\u4E0D\u80FD\u5C11\u4E8E 30 \u79D2" });
        }
        const onceJob = buildOnceJob(p2, delayMs, resolvedTo, resolvedAccountId);
        return json2({
          _instruction: "\u8BF7\u7ACB\u5373\u4F7F\u7528 cron \u5DE5\u5177\uFF0C\u5C06 cronParams \u7684\u503C\u539F\u6837\u4F5C\u4E3A\u53C2\u6570\u4F20\u5165\uFF08\u4E0D\u8981\u4FEE\u6539\u6216\u7701\u7565\u4EFB\u4F55\u5B57\u6BB5\uFF0C\u7279\u522B\u662F delivery.accountId\uFF09\uFF0C\u7136\u540E\u56DE\u590D\u7528\u6237\u63D0\u9192\u5DF2\u8BBE\u7F6E",
          cronParams: onceJob,
          summary: `\u23F0 ${formatDelay(delayMs)}\u540E\u63D0\u9192: "${p2.content}"`
        });
      }
    },
    { name: "qqbot_remind" }
  );
}

// src/adapter/contract.ts
var log3 = createPluginLogger({ prefix: "[contract]", forceConsole: false });
var REQUIRED = [];
var OPTIONAL = [
  {
    name: "channel.reply.dispatchReplyWithBufferedBlockDispatcher",
    probe: (rt) => typeof rt.channel?.reply?.dispatchReplyWithBufferedBlockDispatcher === "function"
  },
  { name: "channel.inbound.run (degraded)", probe: (rt) => {
    const c = rt.channel;
    return typeof c?.inbound?.run === "function" || typeof c?.turn?.run === "function";
  } },
  { name: "channel.inbound.buildContext", probe: (rt) => typeof rt.channel?.inbound?.buildContext === "function" },
  { name: "channel.reply.formatAgentEnvelope", probe: (rt) => typeof rt.channel?.reply?.formatAgentEnvelope === "function" },
  { name: "channel.text.chunkMarkdownText", probe: (rt) => typeof rt.channel?.text?.chunkMarkdownText === "function" },
  { name: "channel.routing.resolveAgentRoute", probe: (rt) => typeof rt.channel?.routing?.resolveAgentRoute === "function" },
  { name: "channel.session.resolveStorePath (deprecated)", probe: (rt) => typeof rt.channel?.session?.resolveStorePath === "function" },
  { name: "channel.session.recordInboundSession (deprecated)", probe: (rt) => typeof rt.channel?.session?.recordInboundSession === "function" },
  { name: "channel.reply.finalizeInboundContext (deprecated)", probe: (rt) => typeof rt.channel?.reply?.finalizeInboundContext === "function" },
  { name: "channel.reply.formatInboundEnvelope (deprecated)", probe: (rt) => typeof rt.channel?.reply?.formatInboundEnvelope === "function" },
  { name: "config.current", probe: (rt) => typeof rt.config?.current === "function" }
];
function verifyRuntimeContract(rt) {
  const version = rt.version ?? "unknown";
  const missing = [];
  const degraded = [];
  for (const r of REQUIRED) {
    if (!r.probe(rt)) missing.push(r.name);
  }
  for (const r of OPTIONAL) {
    if (!r.probe(rt)) degraded.push(r.name);
  }
  log3.debug(`openclaw=${version} required=${REQUIRED.length - missing.length}/${REQUIRED.length} degraded=${degraded.length}/${OPTIONAL.length}`);
  if (missing.length) {
    log3.error(`BROKEN \u2014 missing: ${missing.join(", ")}`);
  }
  if (degraded.length) {
    log3.debug(`degraded: ${degraded.join(", ")}`);
  }
  return { ok: missing.length === 0, version, missing, degraded };
}

// src/types.ts
var MSG_TYPE_TEXT = 0;
var MSG_TYPE_QUOTE2 = 103;
var StreamInputMode2 = {
  /** 每次发送的 content_raw 替换整条消息内容 */
  REPLACE: "replace"
};
var StreamInputState2 = {
  /** 正文生成中 */
  GENERATING: 1,
  /** 正文生成结束（终结状态） */
  DONE: 10
};
var StreamContentType2 = {
  MARKDOWN: "markdown"
};

// index.ts
init_config();
var registered = false;
var plugin = {
  id: "openclaw-qqbot",
  name: "QQ Bot",
  description: "QQ Bot channel plugin",
  configSchema: (0, import_core2.emptyPluginConfigSchema)(),
  register(api) {
    setQQBotRuntime(api.runtime);
    if (!registered) {
      registered = true;
      const contract = verifyRuntimeContract(api.runtime);
      if (!contract.ok) {
        throw new Error(
          `openclaw-qqbot incompatible with openclaw ${contract.version}: missing required APIs: ${contract.missing.join(", ")}. Please upgrade openclaw or downgrade the plugin.`
        );
      }
    }
    api.registerChannel({ plugin: qqbotPlugin });
    registerPlatformTool(api);
    registerRemindTool(api);
  }
};
var index_default = plugin;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DEFAULT_ACCOUNT_ID,
  MSG_TYPE_QUOTE,
  MSG_TYPE_TEXT,
  PersistedRefIndexStore,
  QQBotGateway,
  StreamContentType,
  StreamInputMode,
  StreamInputState,
  StreamingController,
  applyQQBotAccountConfig,
  buildUserAgent,
  dispatchToOpenClaw,
  flushAllRefIndexStores,
  getBotForAccount,
  getPersistedRefIndexStore,
  getQQBotRuntime,
  isGroupAllowed,
  listQQBotAccountIds,
  parseTarget,
  qqbotOnboardingAdapter,
  qqbotPlugin,
  resolveDefaultQQBotAccountId,
  resolveGroupAllowFrom,
  resolveGroupConfig,
  resolveGroupConfigFromAccount,
  resolveGroupName,
  resolveGroupPolicy,
  resolveGroupPrompt,
  resolveHistoryLimit,
  resolveIgnoreOtherMentions,
  resolveMentionPatterns,
  resolveProcessingTimeoutMs,
  resolveQQBotAccount,
  resolveRequireMention,
  resolveToolPolicy,
  resolveUserAgentSuffix,
  sendMedia,
  sendText,
  setQQBotRuntime,
  shouldUseStreaming,
  tryGetBotForAccount
});
//# sourceMappingURL=index.cjs.map