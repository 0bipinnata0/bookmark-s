import * as vscode from 'vscode';
import { Bookmark, BookmarkManager } from './bookmarkModel';

export class BookmarkDecorator {
  private bookmarkManager: BookmarkManager;
  private decorationType: vscode.TextEditorDecorationType;
  private activeDecorations: Map<string, vscode.DecorationOptions[]> = new Map();

  constructor(bookmarkManager: BookmarkManager) {
    this.bookmarkManager = bookmarkManager;
    
    // 创建装饰类型，定义书签行的外观
    this.decorationType = vscode.window.createTextEditorDecorationType({
      gutterIconPath: this.getBookmarkIconPath(),
      gutterIconSize: '60%' // 调整图标大小为编辑器行高的60%
    });

    // 监听书签变化，更新装饰
    this.bookmarkManager.onDidChangeBookmarks(() => {
      this.updateDecorations();
    });

    // 监听编辑器变化
    vscode.window.onDidChangeActiveTextEditor(() => {
      this.updateDecorations();
    });

    // 初始化
    this.updateDecorations();
  }

  private getBookmarkIconPath(): vscode.Uri {
    // 创建一个内联SVG图标作为装饰器 - 窄版本
    const svg = `<svg width="12" height="16" viewBox="0 0 12 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2.5 1C1.67157 1 1 1.67157 1 2.5V14.5C1 14.7035 1.09115 14.8974 1.24497 15.0251C1.39879 15.1528 1.60212 15.1971 1.79389 15.1436L6 13.763L10.2061 15.1436C10.3979 15.1971 10.6012 15.1528 10.755 15.0251C10.9088 14.8974 11 14.7035 11 14.5V2.5C11 1.67157 10.3284 1 9.5 1H2.5Z" 
        fill="#FFCC00" stroke="#DDB100" stroke-width="1" />
    </svg>`;
    
    // 转换SVG为数据URI
    const dataUri = `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
    return vscode.Uri.parse(dataUri);
  }

  public updateDecorations(): void {
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor) {
      return;
    }
    
    const activeFilePath = activeEditor.document.uri.fsPath;
    const bookmarks = this.bookmarkManager.getBookmarks();
    const decorations: vscode.DecorationOptions[] = [];

    // 过滤出当前文件的书签
    const fileBookmarks = bookmarks.filter(bookmark => bookmark.filePath === activeFilePath);
    
    for (const bookmark of fileBookmarks) {
      const line = bookmark.lineNumber;
      const range = new vscode.Range(
        new vscode.Position(line, 0),
        new vscode.Position(line, 0)
      );
      
      decorations.push({
        range,
        hoverMessage: `Bookmark: ${bookmark.lineText}`
      });
    }

    // 保存装饰信息
    this.activeDecorations.set(activeFilePath, decorations);
    
    // 应用装饰
    activeEditor.setDecorations(this.decorationType, decorations);
  }

  public dispose(): void {
    this.decorationType.dispose();
  }
} 