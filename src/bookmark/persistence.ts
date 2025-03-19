import * as vscode from 'vscode';
import { Bookmark, BookmarkManager, BookmarkDirectory } from './bookmarkModel';

export class BookmarkStorage {
  private static readonly BOOKMARK_STORAGE_KEY = 'bookmarkExtension.bookmarks';
  private static readonly DIRECTORY_STORAGE_KEY = 'bookmarkExtension.directories';
  
  static async setupPersistence(context: vscode.ExtensionContext, bookmarkManager: BookmarkManager): Promise<void> {
    // 加载保存的书签
    try {
      await this.loadBookmarks(context, bookmarkManager);
    } catch (error) {
      console.error('Error loading bookmarks:', error);
      vscode.window.showErrorMessage('Failed to load bookmarks from storage');
    }
    
    // 监听变化以保存书签
    bookmarkManager.onDidChangeBookmarks(async () => {
      try {
        await this.saveBookmarks(context, bookmarkManager);
      } catch (error) {
        console.error('Error saving bookmarks:', error);
        vscode.window.showErrorMessage('Failed to save bookmarks to storage');
      }
    });
  }
  
  private static async loadBookmarks(context: vscode.ExtensionContext, bookmarkManager: BookmarkManager): Promise<void> {
    // 从全局存储中加载书签
    const storedBookmarksJson = context.globalState.get<string>(this.BOOKMARK_STORAGE_KEY);
    const storedDirectoriesJson = context.globalState.get<string>(this.DIRECTORY_STORAGE_KEY);
    
    if (storedDirectoriesJson) {
      try {
        const directories: BookmarkDirectory[] = JSON.parse(storedDirectoriesJson);
        if (Array.isArray(directories)) {
          // 加载目录
          for (const directory of directories) {
            if (this.isValidDirectory(directory)) {
              // 添加目录，跳过验证，因为我们直接加载
              this.addDirectoryRaw(bookmarkManager, directory);
            }
          }
        }
      } catch (e) {
        console.error('Error parsing stored directories:', e);
      }
    }
    
    if (storedBookmarksJson) {
      try {
        const bookmarks: Bookmark[] = JSON.parse(storedBookmarksJson);
        if (Array.isArray(bookmarks)) {
          // 验证每个书签并加载有效的书签
          for (const bookmark of bookmarks) {
            if (this.isValidBookmark(bookmark)) {
              // 添加书签，跳过验证，因为我们直接加载
              this.addBookmarkRaw(bookmarkManager, bookmark);
            }
          }
        }
      } catch (e) {
        console.error('Error parsing stored bookmarks:', e);
      }
    }
  }
  
  private static async saveBookmarks(context: vscode.ExtensionContext, bookmarkManager: BookmarkManager): Promise<void> {
    // 获取所有书签，并转换为JSON
    const bookmarks = bookmarkManager.getBookmarks();
    const directories = bookmarkManager.getDirectories();
    
    // 保存到全局存储
    await context.globalState.update(this.BOOKMARK_STORAGE_KEY, JSON.stringify(bookmarks));
    await context.globalState.update(this.DIRECTORY_STORAGE_KEY, JSON.stringify(directories));
  }
  
  private static isValidBookmark(bookmark: any): bookmark is Bookmark {
    return (
      bookmark &&
      typeof bookmark === 'object' &&
      typeof bookmark.id === 'string' &&
      typeof bookmark.filePath === 'string' &&
      typeof bookmark.fileName === 'string' &&
      typeof bookmark.lineNumber === 'number' &&
      typeof bookmark.lineText === 'string' &&
      typeof bookmark.fullText === 'string' &&
      (bookmark.order === undefined || typeof bookmark.order === 'number') &&
      (bookmark.customName === undefined || typeof bookmark.customName === 'string') &&
      (bookmark.directoryId === undefined || typeof bookmark.directoryId === 'string')
    );
  }
  
  private static isValidDirectory(directory: any): directory is BookmarkDirectory {
    return (
      directory &&
      typeof directory === 'object' &&
      typeof directory.id === 'string' &&
      typeof directory.name === 'string' &&
      (directory.order === undefined || typeof directory.order === 'number')
    );
  }
  
  private static addBookmarkRaw(bookmarkManager: BookmarkManager, bookmark: Bookmark): void {
    // 使用反射获取私有字段 _bookmarks
    const anyManager = bookmarkManager as any;
    if (Array.isArray(anyManager._bookmarks)) {
      anyManager._bookmarks.push(bookmark);
    }
  }
  
  private static addDirectoryRaw(bookmarkManager: BookmarkManager, directory: BookmarkDirectory): void {
    // 使用反射获取私有字段 _directories
    const anyManager = bookmarkManager as any;
    if (Array.isArray(anyManager._directories)) {
      anyManager._directories.push(directory);
    }
  }
} 