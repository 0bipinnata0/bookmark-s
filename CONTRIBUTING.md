# Contributing to Bookmark-S Extension

Thank you for your interest in contributing to the Bookmark-S Extension! This document provides guidelines and workflows to ensure a smooth contribution process.

*[中文贡献指南](docs/CONTRIBUTING.zh-CN.md)*

## Development Workflow

1. Fork the repository and clone it locally
2. Install dependencies with `pnpm install`
3. Make your changes
4. Build and test your changes with `pnpm build`
5. Commit your changes using conventional commit messages

## Using Changesets for Versioning

We use [changesets](https://github.com/changesets/changesets) to manage versions and changelogs.

### Adding a Changeset

After making your changes, run:

```bash
pnpm changeset
```

This will:
1. Ask you what kind of change you're making (patch, minor, or major)
2. Prompt for a summary of the changes
3. Create a new file in the `.changeset` directory

### Types of Changes

- **patch**: Bug fixes and small changes that don't affect the API
- **minor**: New features that don't break backward compatibility
- **major**: Breaking changes that require users to update their code

## Pull Request Process

1. Create a branch with a descriptive name
2. Make your changes and add appropriate tests
3. Ensure all tests pass with `pnpm build`
4. Add a changeset (if your change should be released)
5. Push your branch and create a pull request
6. Fill out the PR template completely

## CI/CD Pipeline

Our CI/CD pipeline automatically:

1. Checks and builds the code on every pull request
2. Verifies that a changeset is included when needed
3. Creates version PRs that update package versions and changelogs
4. Publishes to VS Code Marketplace when version PRs are merged to main

## Release Process

1. Changesets automatically creates a "Version Packages" PR when changes are merged to main
2. After reviewing the generated changelog updates, merge the PR
3. GitHub Actions will automatically publish the new version to VS Code Marketplace

## Testing Locally

You can test the extension locally in VS Code by:

```bash
# Run the extension in development mode
pnpm watch

# In VS Code, press F5 to start debugging
```

## Getting Help

If you have any questions or need help with the contribution process, please open an issue or discussion in the repository.

Thank you for contributing! 