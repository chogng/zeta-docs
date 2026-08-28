---
ContentId: 0d20f0c8-43c1-4c3f-a69a-79f8c9b558e1
DateApproved: 8/27/2026
MetaDescription: 了解 Zeta 的三种使用方式，并选择适合当前工作的产品。
Keywords:
  - Zeta
  - 入门
  - Desktop
  - TUI
---
# Zeta 概览

Zeta 是一个以 Agent 为中心的开发工作区。你可以在桌面工作台、终端界面或 Rust 桌面应用中使用它。

## 选择使用方式

| 产品 | 适合什么工作 | 启动命令 |
| --- | --- | --- |
| `zeta` | 在完整桌面工作台中编辑代码、管理会话和使用开发工具 | `just zeta-desktop` |
| `zeta code` | 在终端中向 Agent 提问、执行任务和查看会话 | `just zeta` |
| `app` | 使用 Rust 桌面终端工作区 | `just app` |

三种产品共享同一套会话和 Agent 后端契约，但界面和宿主能力不同。`app` 当前以终端工作区为主，不等同于桌面工作台的另一种皮肤。

## 开始一次 Agent 任务

1. 打开包含项目代码的工作区。
2. 创建或选择一个会话。
3. 用一句话说明结果、范围和限制。例如：`修复登录页的键盘焦点问题，并运行相关测试。`
4. 在 Agent 请求写文件、运行命令或访问外部系统时检查批准信息。
5. 查看改动和验证结果，再决定是否继续下一步。

Agent 会把读取、搜索、修改和验证拆成工具调用。权限策略决定哪些调用可以直接运行，哪些调用必须由你批准。

## 下一步

* [从源码运行 Zeta](/docs/getstarted/run-from-source.md)
* [了解 Agent 如何工作](/docs/agents/overview.md)
* [配置权限与批准](/docs/configure/permissions.md)
