---
ContentId: 9bf1c576-5af4-43c5-a84b-5a8272c69a2c
DateApproved: 8/27/2026
MetaDescription: 安装开发依赖并从源码启动 Zeta 桌面工作台、终端界面或 Rust 桌面应用。
Keywords:
  - 源码
  - 安装
  - 开发环境
  - pnpm
  - Rust
---
# 从源码运行 Zeta

从源码运行 Zeta 时，先准备 Rust 和 Protocol Buffers。桌面工作台还需要仓库指定的 Node.js 与 pnpm 环境。

## 安装基础依赖

在 macOS 上安装 Protocol Buffers：

```bash
brew install protobuf
```

在 Debian 或 Ubuntu 上安装 Protocol Buffers：

```bash
apt-get install protobuf-compiler
```

安装 Rust 后，在 Zeta 仓库根目录运行后续命令。桌面工作台和浏览器开发还需要先安装 JavaScript 依赖：

```bash
corepack pnpm install
```

## 启动产品

启动终端界面：

```bash
just zeta
```

启动桌面工作台：

```bash
just zeta-desktop
```

启动 Rust 桌面应用：

```bash
just app
```

如果系统没有 `just`，可以直接启动终端界面：

```bash
cargo run -p zeta-cli --bin zeta
```

## 运行浏览器开发界面

使用不连接 Rust 后端的界面开发模式：

```bash
corepack pnpm dev:web
```

使用连接本地 Rust 后端的开发模式：

```bash
corepack pnpm dev:web:full
```

浏览器开发界面用于本地开发和测试，不是公开部署的网页产品。

## 下一步

* [Zeta 概览](/docs/getstarted/overview.md)
* [会话与任务](/docs/agents/sessions.md)
