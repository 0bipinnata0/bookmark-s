# 贡献 Bookmark-S 扩展

感谢您有兴趣为 Bookmark-S 扩展贡献代码！本文档提供了确保贡献过程顺利进行的指南和工作流程。

## 开发工作流程

1. Fork 仓库并在本地克隆
2. 使用 `pnpm install` 安装依赖
3. 进行代码修改
4. 使用 `pnpm build` 构建并测试您的更改
5. 使用规范化的提交信息提交您的更改

## 使用 Changesets 进行版本管理

我们使用 [changesets](https://github.com/changesets/changesets) 来管理版本和更新日志。

### 添加 Changeset

在进行更改后，运行：

```bash
pnpm changeset
```

这将：
1. 询问您正在进行的更改类型（patch, minor, or major）
2. 提示您输入更改的摘要
3. 在 `.changeset` 目录中创建新文件

### 更改类型

- **patch**：Bug 修复和不影响 API 的小更改
- **minor**：不破坏向后兼容性的新功能
- **major**：需要用户更新代码的重大更改

## Pull Request 流程

1. 创建具有描述性名称的分支
2. 进行更改并添加适当的测试
3. 确保所有测试都通过 `pnpm build`
4. 添加 changeset（如果您的更改需要发布）
5. 推送您的分支并创建 pull request
6. 完整填写 PR 模板

## CI/CD 流水线

我们的 CI/CD 流水线自动：

1. 在每个 pull request 上检查和构建代码
2. 验证在需要时是否包含 changeset
3. 创建更新包版本和更新日志的版本 PR
4. 当版本 PR 合并到 main 分支时发布到 VS Code 插件市场

## 发布流程

1. 当更改合并到 main 分支时，Changesets 自动创建"Version Packages"PR
2. 审核生成的更新日志后，合并该 PR
3. GitHub Actions 将自动将新版本发布到 VS Code 插件市场

## 本地测试

您可以通过以下方式在 VS Code 中本地测试扩展：

```bash
# 在开发模式下运行扩展
pnpm watch

# 在 VS Code 中，按 F5 开始调试
```

## 获取帮助

如果您对贡献过程有任何问题或需要帮助，请在仓库中开启 issue 或讨论。

感谢您的贡献！

## 详细文档

有关 CI/CD 流程的详细信息，请参阅 [CI/CD 指南](CI-CD-GUIDE.zh-CN.md)。 