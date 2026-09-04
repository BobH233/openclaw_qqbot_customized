# Custom QQ Bot patches

This repository starts from `@tencent-connect/openclaw-qqbot@2.0.3` and keeps
the local QQ integration fixes as reviewable Git commits.

## Baseline

- Package: `@tencent-connect/openclaw-qqbot@2.0.3`
- Package tarball SHA-256:
  `679e97f5318435497214d69599228b2373dd1c3d523daa206a4e3284873cddda`

## Patches

### Verbose tool progress in QQ

Tool delivery payloads now forward both media and text. This makes OpenClaw
verbose progress visible in QQ while a task is running, instead of showing only
the final Markdown response.

### Plain-text `ask_user` replies in QQ

When OpenClaw sends an `ask_user` question, the plugin records its question ID
for the QQ conversation. The next direct reply can bypass the normal merged
message queue and resolve the pending choice through OpenClaw's question gateway.

Both one-based numeric choices such as `2` and text option values are supported.
If resolution fails, the message falls back to the normal inbound path.

### Same-turn steering from QQ direct messages

QQ direct messages now bypass the plugin's per-target merge buffer while a task
is active. This lets the message reach OpenClaw's core queue immediately, where
the configured `steer`, `followup`, or `interrupt` mode can handle it. Group
messages keep the plugin's serial merge protection to avoid concurrent QQ
streaming conflicts.

### Intermediate assistant text in QQ direct messages

Enabling QQ streaming now also enables OpenClaw core block streaming. Completed
assistant text before tool calls is delivered immediately instead of being
visible only in the Control UI while QQ receives just the final reply.

## Verification

- A live QQ direct-message test resolved numeric choice `2`.
- The pending `question.waitAnswer` operation resumed and completed with status
  `answered`.
- The QQ gateway remained connected after the response.

## Generated files

The corresponding compiled artifacts are committed under `dist/` so this
repository can be deployed in the same form as the npm package.

Runtime configuration, credentials, logs, QQ identifiers, and `node_modules/`
are intentionally excluded from this repository. Keep plugin auto-update
disabled on deployments using these local patches, because replacing the npm
package would overwrite them.
