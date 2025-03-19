# Bookmark-S

A VS Code extension for easy code navigation with bookmarks and folders.

*[中文文档](#bookmark-s-中文文档)*

![Bookmark-S Overview](https://raw.githubusercontent.com/username/vscode-bookmark-s/main/images/overview.png)

## Installation

You can install this extension through the VS Code Marketplace:

1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X / Cmd+Shift+X)
3. Search for "Bookmark-S"
4. Click Install

Alternatively, you can download and install from the [VS Code Marketplace page](https://marketplace.visualstudio.com/items?itemName=username.bookmark-s).

## Features

- Create bookmarks in your code files for quick navigation
- Organize bookmarks in customizable directories
- Drag and drop functionality for easy organization
- Custom naming of bookmarks and directories
- High visibility bookmark icon in all themes
- Multi-language interface support (English and Simplified Chinese)

![Bookmark Features](https://raw.githubusercontent.com/username/vscode-bookmark-s/main/images/features.png)

## Usage

### Adding Bookmarks

1. Place your cursor on the line you want to bookmark
2. Use one of the following methods to add a bookmark:
   - Press `Ctrl+Shift+B` (`Cmd+Shift+B` on macOS)
   - Right-click and select "Bookmark: Add Bookmark" from the context menu
   - Click the bookmark icon in the activity bar, then use the "Add Bookmark" button

![Adding Bookmarks](https://raw.githubusercontent.com/username/vscode-bookmark-s/main/images/add-bookmark.gif)

### Managing Bookmarks

- Click on a bookmark in the sidebar to navigate to it
- Rename, delete or organize bookmarks using the context menu options
- Drag and drop bookmarks to reorder them

![Managing Bookmarks](https://raw.githubusercontent.com/username/vscode-bookmark-s/main/images/manage-bookmarks.gif)

### Using Directories

- Create directories to organize related bookmarks
- Drag and drop bookmarks between directories
- Add bookmarks directly to directories
- Rename or delete directories using the context menu

![Using Directories](https://raw.githubusercontent.com/username/vscode-bookmark-s/main/images/directories.gif)

### Language Settings

The extension supports multiple languages:

- By default, it follows your VS Code interface language
- You can manually set the language using the language selector in the bookmarks view
- Currently supported languages:
  - English
  - Simplified Chinese (简体中文)

![Language Settings](https://raw.githubusercontent.com/username/vscode-bookmark-s/main/images/language-settings.png)

## Commands

| Command | Description |
|---------|-------------|
| `Bookmark: Add Bookmark` | Add a bookmark at the current cursor position |
| `Bookmark: Remove Bookmark` | Remove the selected bookmark |
| `Bookmark: Clear All Bookmarks` | Remove all bookmarks |
| `Bookmark: Rename Bookmark` | Change the name of the selected bookmark |
| `Bookmark: Add Directory` | Create a new directory for organizing bookmarks |
| `Bookmark: Rename Directory` | Change the name of a directory |
| `Bookmark: Remove Directory` | Delete a directory |
| `Bookmark: Set Language` | Change the interface language |

## Keyboard Shortcuts

| Command | Windows/Linux | macOS |
|---------|---------------|-------|
| Add Bookmark | Ctrl+Shift+B | Cmd+Shift+B |

You can customize these shortcuts in the Keyboard Shortcuts editor (File > Preferences > Keyboard Shortcuts).

## Configuration

You can customize the extension through the following settings:

```json
{
  "bookmark.language": "auto" // Options: "auto", "en", "zh-cn"
}
```

## Tips & Tricks

### Working with Large Codebases

For large codebases, consider creating directories based on features or modules to keep your bookmarks organized. For example:
- API Endpoints
- UI Components
- Database Models
- Configuration Files

### Adding Context to Bookmarks

When creating a bookmark, consider adding a brief description to help you remember why you marked this line. This is especially helpful when sharing projects with teammates.

## Known Issues

- View title localization may require VS Code to be restarted to fully reflect language changes
- Directories are currently limited to one level (no nested directories yet)

## Roadmap

Features planned for future releases:

- Support for nested directories
- Bookmark synchronization across devices
- Additional language support
- Bookmark search functionality
- Bookmark export/import
- Color-coded bookmarks

## Contributing

Contributions are welcome! Here's how you can contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

For major changes, please open an issue first to discuss what you would like to change.

## Release Notes

### 1.0.0

- Initial release with bookmark and directory support
- Multi-language interface (English and Simplified Chinese)
- Drag and drop organization system
- Customizable names for bookmarks and directories

## License

This extension is licensed under the [MIT License](LICENSE).

---

# Bookmark-S (中文文档)

一个用于轻松导航代码的 VS Code 书签扩展，支持文件夹组织。

![书签概览](https://raw.githubusercontent.com/username/vscode-bookmark-s/main/images/overview.png)

## 安装

您可以通过 VS Code 插件市场安装此扩展：

1. 打开 VS Code
2. 转到扩展（Ctrl+Shift+X / Cmd+Shift+X）
3. 搜索 "Bookmark-S"
4. 点击安装

或者，您可以从 [VS Code 插件市场页面](https://marketplace.visualstudio.com/items?itemName=username.bookmark-s) 下载并安装。

## 功能特点

- 在代码文件中创建书签，实现快速导航
- 使用自定义目录组织书签
- 支持拖放功能，轻松整理书签
- 可自定义书签和目录名称
- 在所有主题中提供高可见度的书签图标
- 支持多语言界面（英文和简体中文）

![书签功能](https://raw.githubusercontent.com/username/vscode-bookmark-s/main/images/features.png)

## 使用方法

### 添加书签

1. 将光标放在要添加书签的行上
2. 使用以下任一方法添加书签：
   - 按下 `Ctrl+Shift+B`（在 macOS 上为 `Cmd+Shift+B`）
   - 右键点击并从上下文菜单中选择"书签: 添加书签"
   - 点击活动栏中的书签图标，然后使用"添加书签"按钮

![添加书签](https://raw.githubusercontent.com/username/vscode-bookmark-s/main/images/add-bookmark.gif)

### 管理书签

- 点击侧边栏中的书签可导航到对应位置
- 使用上下文菜单选项重命名、删除或整理书签
- 拖放书签可重新排序

![管理书签](https://raw.githubusercontent.com/username/vscode-bookmark-s/main/images/manage-bookmarks.gif)

### 使用目录

- 创建目录来组织相关书签
- 在目录之间拖放书签
- 直接向目录添加书签
- 使用上下文菜单重命名或删除目录

![使用目录](https://raw.githubusercontent.com/username/vscode-bookmark-s/main/images/directories.gif)

### 语言设置

扩展支持多种语言：

- 默认情况下，它会跟随您的 VS Code 界面语言
- 您可以使用书签视图中的语言选择器手动设置语言
- 当前支持的语言：
  - 英文（English）
  - 简体中文

![语言设置](https://raw.githubusercontent.com/username/vscode-bookmark-s/main/images/language-settings.png)

## 命令

| 命令 | 描述 |
|------|------|
| `书签: 添加书签` | 在当前光标位置添加书签 |
| `书签: 移除书签` | 删除选定的书签 |
| `书签: 清除所有书签` | 删除所有书签 |
| `书签: 重命名书签` | 更改选定书签的名称 |
| `书签: 添加目录` | 创建一个新目录用于组织书签 |
| `书签: 重命名目录` | 更改目录名称 |
| `书签: 删除目录` | 删除目录 |
| `书签: 设置语言` | 更改界面语言 |

## 键盘快捷键

| 命令 | Windows/Linux | macOS |
|------|---------------|-------|
| 添加书签 | Ctrl+Shift+B | Cmd+Shift+B |

您可以在键盘快捷键编辑器（文件 > 首选项 > 键盘快捷键）中自定义这些快捷键。

## 配置选项

您可以通过以下设置自定义扩展：

```json
{
  "bookmark.language": "auto" // 选项: "auto", "en", "zh-cn"
}
```

## 技巧与窍门

### 处理大型代码库

对于大型代码库，建议基于功能或模块创建目录以保持书签的组织结构。例如：
- API 端点
- UI 组件
- 数据库模型
- 配置文件

### 为书签添加上下文

创建书签时，考虑添加简短描述，以帮助您记住为什么标记这一行。这在与团队成员共享项目时特别有用。

## 已知问题

- 视图标题本地化可能需要重启 VS Code 才能完全反映语言更改
- 目录当前仅限一级（尚不支持嵌套目录）

## 开发路线图

计划在未来版本中添加的功能：

- 支持嵌套目录
- 跨设备的书签同步
- 更多语言支持
- 书签搜索功能
- 书签导出/导入
- 彩色编码书签

## 参与贡献

欢迎参与贡献！以下是贡献方式：

1. Fork 仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m '添加一些惊人的特性'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开 Pull Request

对于重大更改，请先打开 issue 讨论您想要更改的内容。

## 版本说明

### 1.0.0

- 首次发布，支持书签和目录功能
- 多语言界面（英文和简体中文）
- 拖放组织系统
- 可自定义书签和目录名称

## 许可证

本扩展基于 [MIT 许可证](LICENSE) 授权。 