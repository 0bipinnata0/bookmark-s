import * as vscode from 'vscode';
import { Bookmark, BookmarkManager, BookmarkDirectory } from './bookmarkModel';

export enum TreeItemType {
  Bookmark,
  Directory
}

export class BookmarkTreeItem extends vscode.TreeItem {
  public readonly type: TreeItemType;

  constructor(
    public readonly bookmark: Bookmark | undefined,
    public readonly directory: BookmarkDirectory | undefined,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly parentId?: string
  ) {
    // 根据类型设置不同的标签和属性
    let label: string;
    let type: TreeItemType;
    
    if (bookmark) {
      label = bookmark.customName || bookmark.lineText || '[empty line]';
      type = TreeItemType.Bookmark;
    } else if (directory) {
      label = directory.name;
      type = TreeItemType.Directory;
    } else {
      label = '未知项目';
      type = TreeItemType.Bookmark; // 默认类型
    }
    
    super(label, collapsibleState);
    
    this.type = type;
    
    if (bookmark) {
      this.contextValue = 'bookmark';
      this.description = `${bookmark.fileName}:${bookmark.lineNumber + 1}`;
      this.tooltip = bookmark.fullText;
      
      this.command = {
        command: 'bookmark.gotoBookmark',
        title: 'Go to Bookmark',
        arguments: [bookmark]
      };

      // 添加文件图标
      this.resourceUri = vscode.Uri.file(bookmark.filePath);
      this.iconPath = new vscode.ThemeIcon('bookmark');

      // 添加拖拽属性
      this.id = bookmark.id;
    } else if (directory) {
      this.contextValue = 'directory';
      this.iconPath = new vscode.ThemeIcon('folder');
      this.id = directory.id;
    } else {
      this.contextValue = 'unknown';
    }
  }
}

export class BookmarkTreeDataProvider implements vscode.TreeDataProvider<BookmarkTreeItem>, vscode.TreeDragAndDropController<BookmarkTreeItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<BookmarkTreeItem | undefined | null | void> = new vscode.EventEmitter<BookmarkTreeItem | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<BookmarkTreeItem | undefined | null | void> = this._onDidChangeTreeData.event;

  // 拖放功能的属性
  dropMimeTypes = ['application/vnd.code.tree.bookmarkExplorer'];
  dragMimeTypes = ['application/vnd.code.tree.bookmarkExplorer'];

  constructor(private bookmarkManager: BookmarkManager) {
    this.bookmarkManager.onDidChangeBookmarks(() => {
      this._onDidChangeTreeData.fire();
    });

    // 监听主题变化，刷新树视图以更新图标颜色
    vscode.window.onDidChangeActiveColorTheme(() => {
      this._onDidChangeTreeData.fire();
    });
  }

  getTreeItem(element: BookmarkTreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: BookmarkTreeItem): Thenable<BookmarkTreeItem[]> {
    if (!element) {
      // 根级别，显示目录和未分类的书签
      const directories = this.bookmarkManager.getDirectories().map(dir => 
        new BookmarkTreeItem(
          undefined, 
          dir, 
          vscode.TreeItemCollapsibleState.Expanded
        )
      );
      
      const rootBookmarks = this.bookmarkManager.getBookmarksInDirectory(undefined).map(bookmark => 
        new BookmarkTreeItem(
          bookmark,
          undefined,
          vscode.TreeItemCollapsibleState.None
        )
      );
      
      return Promise.resolve([...directories, ...rootBookmarks]);
    } else if (element.type === TreeItemType.Directory && element.directory) {
      // 目录内的书签
      const bookmarksInDir = this.bookmarkManager.getBookmarksInDirectory(element.directory.id).map(bookmark => 
        new BookmarkTreeItem(
          bookmark,
          undefined,
          vscode.TreeItemCollapsibleState.None,
          element.directory?.id
        )
      );
      
      return Promise.resolve(bookmarksInDir);
    } else {
      return Promise.resolve([]);
    }
  }

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  // 处理拖放操作
  handleDrag(source: readonly BookmarkTreeItem[], dataTransfer: vscode.DataTransfer, token: vscode.CancellationToken): void {
    // 将项目ID和类型传递给数据传输对象
    const dragData = source.map(item => ({
      id: item.id,
      type: item.type
    }));
    dataTransfer.set('application/vnd.code.tree.bookmarkExplorer', new vscode.DataTransferItem(dragData));
  }

  // 处理放置操作
  async handleDrop(target: BookmarkTreeItem | undefined, dataTransfer: vscode.DataTransfer, token: vscode.CancellationToken): Promise<void> {
    const transferItem = dataTransfer.get('application/vnd.code.tree.bookmarkExplorer');
    if (!transferItem) {
      return;
    }

    const sourceData: Array<{id: string, type: TreeItemType}> = transferItem.value;
    if (!sourceData || sourceData.length === 0) {
      return;
    }

    const sourceItem = sourceData[0]; // 目前只处理单个拖动项
    if (!sourceItem || !sourceItem.id) {
      return;
    }

    // 检查源类型
    if (sourceItem.type === TreeItemType.Bookmark) {
      // 处理书签拖拽
      this.handleBookmarkDrop(sourceItem.id, target);
    } else if (sourceItem.type === TreeItemType.Directory) {
      // 处理目录拖拽
      this.handleDirectoryDrop(sourceItem.id, target);
    }
  }

  // 处理书签拖放
  private handleBookmarkDrop(sourceId: string, target: BookmarkTreeItem | undefined): void {
    if (target?.type === TreeItemType.Directory && target.directory) {
      // 拖放到目录上，移动书签到该目录
      this.bookmarkManager.moveBookmarkToDirectory(sourceId, target.directory.id);
    } else if (!target) {
      // 拖放到根级别，移除目录关联
      this.bookmarkManager.moveBookmarkToDirectory(sourceId, undefined);
    } else if (target?.type === TreeItemType.Bookmark && target.bookmark) {
      // 拖放到另一个书签上，可能需要处理排序
      // 如果在同一目录中，则重新排序；否则，移动到相同目录
      const targetDirId = target.bookmark.directoryId;
      if (target.id !== sourceId) { // 避免对自身排序
        this.bookmarkManager.moveBookmarkToDirectory(sourceId, targetDirId);
        this.bookmarkManager.reorderBookmarks(sourceId, target.id!);
      }
    }
  }

  // 处理目录拖放
  private handleDirectoryDrop(sourceId: string, target: BookmarkTreeItem | undefined): void {
    if (!target) {
      // 拖放到根级别，可能是重新排序目录的起始位置
      return;
    }

    if (target.type === TreeItemType.Directory && target.directory && target.id !== sourceId) {
      // 拖放到另一个目录上，只需要重新排序目录
      this.bookmarkManager.reorderDirectories(sourceId, target.id!);
    }
    // 目录不能拖放到书签上，因此不处理其他情况
  }
} 