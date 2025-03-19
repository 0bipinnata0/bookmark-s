# CI/CD 完整工作流指南

本文档详细说明了 Bookmark-S 扩展的端到端 CI/CD 工作流程。

## 概述

我们的 CI/CD 系统使用：
- GitHub Actions 进行自动化处理
- Changesets 管理版本和更新日志
- ESLint 保证代码质量
- Husky 处理 git 钩子
- Conventional commits 规范化提交信息

## 工作流程图

```
代码修改 → 提交(经过 commitlint 检查) → 推送到分支 → 创建 PR
    → CI 检查 → 审核 → 合并到 main → 创建版本 PR 
    → 合并版本 PR → 自动发布到 VS Code 插件市场
```

## 本地开发流程

1. **克隆和设置**：
   ```bash
   git clone <仓库-url>
   cd bookmark-s
   pnpm install
   ```

2. **创建功能分支**：
   ```bash
   git checkout -b feature/你的功能名称
   ```

3. **修改代码并提交**：
   你的提交将通过 commitlint 检查，确保它们遵循约定式提交格式：
   ```
   <类型>(<范围>): <描述>
   
   [可选的正文]
   
   [可选的脚注]
   ```
   
   类型包括：feat, fix, docs, style, refactor, test, chore 等。
   
   示例：
   ```
   feat(bookmarks): 添加多选支持
   ```

4. **添加 Changeset**：
   ```bash
   pnpm changeset
   ```
   按照提示进行操作：
   - 选择受影响的包
   - 选择变更类型（patch, minor, major）
   - 编写变更描述

5. **推送并创建 PR**：
   ```bash
   git push origin feature/你的功能名称
   ```
   然后通过 GitHub UI 创建 PR 并填写 PR 模板。

## CI 流程（自动化）

1. **PR 检查**：
   - 代码构建
   - 代码风格检查
   - 运行测试
   - 验证是否包含 changeset（在需要时）

2. **版本 PR 创建**：
   合并更改到 main 分支后：
   - Changesets bot 创建"版本更新"PR
   - 此 PR 根据 changesets 更新包版本
   - 同时更新 CHANGELOG.md

3. **发布流程**：
   合并版本 PR 后：
   - GitHub Actions 工作流将发布到 VS Code 插件市场
   - 在代码仓库中创建标签
   - 生成发布说明

## 维护 CI/CD 系统

### 所需的 GitHub Secrets

为了使工作流正常运行，需要设置以下密钥：
- `VSCE_PAT`：一个具有发布权限的 VS Code 插件市场个人访问令牌
- `GITHUB_TOKEN`：由 GitHub Actions 自动提供

### 获取 VS Code 插件市场令牌

1. 登录 [Visual Studio Marketplace 发布者管理](https://marketplace.visualstudio.com/manage)
2. 如果没有，创建一个发布者
3. 在 Azure DevOps 中生成一个具有"Marketplace (publish)"范围的个人访问令牌
4. 将此令牌作为名为 `VSCE_PAT` 的密钥添加到你的 GitHub 仓库中

### 修改工作流

工作流定义在：
- `.github/workflows/ci.yml`
- `.github/workflows/release.yml`

### 故障排除

如果 CI/CD 管道失败：

1. 查看 GitHub Actions 日志获取详细错误信息
2. 常见问题包括：
   - 缺少 changesets
   - 代码风格错误
   - 构建失败
   - 插件市场发布权限问题

## 特殊情况

### 跳过版本更新

对于不需要版本更新的变更：
```bash
git commit -m "chore: 更新文档 [skip changeset]"
```

### 紧急修复流程

对于需要立即部署的关键修复：

1. 从 main 分支创建一个 hotfix 分支
2. 进行修复并添加 changeset
3. 创建并合并 PR
4. 立即合并生成的版本 PR
5. 发布工作流将发布新版本

## 手动发布

如果需要手动发布：

```bash
# 构建扩展
pnpm build

# 打包扩展为 .vsix 文件
pnpm package

# 发布到 VS Code 插件市场
pnpm vscode:publish
```

## 最佳实践

1. **保持 changesets 专注**：每个 changeset 应描述单个功能或修复
2. **使用描述性的提交信息**：它们有助于自动生成更新日志
3. **定期小规模发布**：优先考虑定期的小型发布，而不是大型不频繁的发布
4. **监控 GitHub Actions 仪表板**：及时解决失败问题

## 参考资料

- [Changesets 文档](https://github.com/changesets/changesets)
- [GitHub Actions 文档](https://docs.github.com/zh/actions)
- [VS Code 扩展发布](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)
- [约定式提交](https://www.conventionalcommits.org/zh-hans/) 