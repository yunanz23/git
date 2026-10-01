# git

这是一个 Codex 插件市场仓库（marketplace），插件放在 `plugins/` 下面；市场清单位于 `.agents/plugins/marketplace.json`。

## 已收录

| 插件 | 说明 | 版本 |
|---|---|---|
| `zhangxuefeng-perspective` | 张雪峰视角：5 个核心心智模型、8 条决策启发式与完整表达 DNA | 1.0.1 |

## 安装

```bash
codex plugin marketplace add yunanz23/git
codex plugin add zhangxuefeng-perspective@yunanz23-plugins
```

装完**新开一个对话**即可使用（例如「用张雪峰的视角分析一下这个专业」）。

## 更新

改了插件内容后，记得把 `plugins/<插件名>/.codex-plugin/plugin.json` 里的 `version` 加一，然后推上来；本地用
`codex plugin marketplace upgrade` 拉取最新版。