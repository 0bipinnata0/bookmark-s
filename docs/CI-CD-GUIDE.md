# Complete CI/CD Workflow Guide

This document explains the end-to-end CI/CD workflow for the Bookmark-S extension.

*[中文文档](CI-CD-GUIDE.zh-CN.md)*

## Overview

Our CI/CD system uses:
- GitHub Actions for automation
- Changesets for versioning and changelog
- ESLint for code quality
- Husky for git hooks
- Conventional commits for standardized commit messages

## Workflow Diagram

```
Code Changes → Commit (with commitlint) → Push to Branch → Create PR
    → CI Checks → Review → Merge to Main → Version PR Created 
    → Merge Version PR → Automated Release to VS Code Marketplace
```

## Local Development Process

1. **Clone and Setup**:
   ```bash
   git clone <repository-url>
   cd bookmark
   pnpm install
   ```

2. **Create a Feature Branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Changes and Commit**:
   Your commits will be checked with commitlint to ensure they follow the conventional commits format:
   ```
   <type>(<scope>): <description>
   
   [optional body]
   
   [optional footer(s)]
   ```
   
   Types include: feat, fix, docs, style, refactor, test, chore, etc.
   
   Example:
   ```
   feat(bookmarks): add multi-selection support
   ```

4. **Add a Changeset**:
   ```bash
   pnpm changeset
   ```
   Follow the prompts to:
   - Select affected packages
   - Choose a bump type (patch, minor, major)
   - Write a description of the changes

5. **Push and Create PR**:
   ```bash
   git push origin feature/your-feature-name
   ```
   Then create a PR through GitHub UI and fill out the PR template.

## CI Process (Automated)

1. **Pull Request Checks**:
   - Code is built
   - Linting is performed
   - Tests are run
   - Presence of changeset is verified (when appropriate)

2. **Version PR Creation**:
   After merging changes to main:
   - Changesets bot creates a "Version Packages" PR
   - This PR updates package versions based on changesets
   - It also updates CHANGELOG.md

3. **Release Process**:
   After merging the Version PR:
   - GitHub Actions workflow publishes to VS Code Marketplace
   - Tags are created in the repository
   - Release notes are generated

## Maintaining the CI/CD System

### GitHub Secrets Required

For the workflow to function correctly, these secrets need to be set:
- `VSCE_PAT`: A VS Code Marketplace Personal Access Token with publish permissions
- `GITHUB_TOKEN`: Automatically provided by GitHub Actions

### Getting a VS Code Marketplace Token

1. Sign in to [Visual Studio Marketplace publisher management](https://marketplace.visualstudio.com/manage)
2. Create a publisher if you don't have one
3. Generate a Personal Access Token in Azure DevOps with the "Marketplace (publish)" scope
4. Add this token as a secret named `VSCE_PAT` in your GitHub repository

### Modifying Workflows

The workflows are defined in:
- `.github/workflows/ci.yml`
- `.github/workflows/release.yml`

### Troubleshooting

If the CI/CD pipeline fails:

1. Check the GitHub Actions logs for detailed error messages
2. Common issues include:
   - Missing changesets
   - Linting errors
   - Build failures
   - Marketplace publish permission issues

## Special Cases

### Skipping Version Bumps

To make changes that don't require a version bump:
```bash
git commit -m "chore: update docs [skip changeset]"
```

### Emergency Hotfix Process

For critical fixes requiring immediate deployment:

1. Create a hotfix branch from main
2. Make the fix and add a changeset
3. Create and merge PR
4. Immediately merge the resulting Version PR
5. The release workflow will publish the new version

## Manual Publishing

If you need to publish manually:

```bash
# Build the extension
pnpm build

# Package the extension to a .vsix file
pnpm package

# Publish to VS Code Marketplace
pnpm vscode:publish
```

## Best Practices

1. **Keep changesets focused**: Each changeset should describe a single feature or fix
2. **Use descriptive commit messages**: They help with automated changelog generation
3. **Regular small releases**: Prefer regular small releases over large infrequent ones
4. **Monitor the GitHub Actions dashboard**: Address failures promptly

## References

- [Changesets Documentation](https://github.com/changesets/changesets)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [VS Code Extension Publishing](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)
- [Conventional Commits](https://www.conventionalcommits.org/) 