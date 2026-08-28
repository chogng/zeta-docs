---
ContentId: 04b3a201-fbf7-4302-acd4-151bdfe4c4ee
DateApproved: 8/27/2026
MetaDescription: 使用 Skill 为 Zeta 添加可复用的任务说明、脚本、参考资料和资源。
Keywords:
  - Skill
  - 自定义
  - 工作流
  - SKILL.md
---
# 使用 Skills 扩展工作流

Skill 是一组可复用的任务说明。它可以把专门的写作规范、验证步骤、脚本和参考资料打包成 Agent 能发现并按需加载的能力。

## Skill 的组成

每个 Skill 使用一个目录，并以 `SKILL.md` 作为入口。按需要添加：

* `scripts/`：可重复运行的脚本。
* `references/`：只在任务需要时读取的详细资料。
* `assets/`：模板、图片或其他产物资源。

把核心触发条件和执行规则写在 `SKILL.md`。不要把所有参考资料都复制进入口文件。

## 发现和运行 Skill

Zeta 只在浏览列表时加载 Skill 元数据。选中或自动触发某个 Skill 后，Agent 才读取完整的 `SKILL.md`。

打开统一命令面板并使用 `/skills` 浏览可用 Skills。已启用的 Skill 也会显示为动态斜杠命令，例如 `/commit`。你还可以在任务中直接点名 Skill。

## 选择合适的作用范围

把只适合个人习惯的 Skill 放在用户范围。把团队必须共享的流程放在工作区，并提交到版本控制。工作区 Skill 仍受工作区信任、来源校验和权限规则限制。

Skill 本身不绕过权限。Skill 调用命令、写文件或访问网络时，仍使用与普通 Agent 任务相同的批准流程。

## 下一步

* [连接 MCP 服务器](/docs/customize/mcp-servers.md)
* [配置权限与批准](/docs/configure/permissions.md)
