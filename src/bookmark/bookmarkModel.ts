import * as vscode from 'vscode';
import { getMessages, format } from '../config/i18n';

export interface Bookmark {
  id: string;
  filePath: string;
  fileName: string;
  lineNumber: number;
  lineText: string;
  fullText: string;
  order?: number;
  customName?: string;
  directoryId?: string;
}

export interface BookmarkDirectory {
  id: string;
  name: string;
  order?: number;
}

export class BookmarkManager {
  private _bookmarks: Bookmark[] = [];
  private _directories: BookmarkDirectory[] = [];
  private _onDidChangeBookmarks: vscode.EventEmitter<void> = new vscode.EventEmitter<void>();
  
  public readonly onDidChangeBookmarks: vscode.Event<void> = this._onDidChangeBookmarks.event;

  constructor() {}

  public getBookmarks(): Bookmark[] {
    return [...this._bookmarks].sort((a, b) => {
      const orderA = a.order !== undefined ? a.order : Number.MAX_SAFE_INTEGER;
      const orderB = b.order !== undefined ? b.order : Number.MAX_SAFE_INTEGER;
      return orderA - orderB;
    });
  }

  public getDirectories(): BookmarkDirectory[] {
    return [...this._directories].sort((a, b) => {
      const orderA = a.order !== undefined ? a.order : Number.MAX_SAFE_INTEGER;
      const orderB = b.order !== undefined ? b.order : Number.MAX_SAFE_INTEGER;
      return orderA - orderB;
    });
  }

  public getBookmarksInDirectory(directoryId: string | undefined): Bookmark[] {
    return this.getBookmarks().filter(b => b.directoryId === directoryId);
  }

  public async addDirectory(): Promise<void> {
    const messages = getMessages();
    const directoryName = await vscode.window.showInputBox({
      prompt: messages.directory.addPrompt,
      placeHolder: messages.directory.newDirPlaceholder
    });

    if (!directoryName) {
      return;
    }

    const id = `dir_${Date.now()}`;
    const maxOrder = Math.max(-1, ...this._directories.map(d => d.order !== undefined ? d.order : -1));
    const nextOrder = maxOrder + 1;

    const directory: BookmarkDirectory = {
      id,
      name: directoryName,
      order: nextOrder
    };

    this._directories.push(directory);
    this._onDidChangeBookmarks.fire();
    
    vscode.window.showInformationMessage(format(messages.directory.addSuccess, directoryName));
  }

  public removeDirectory(id: string): void {
    const index = this._directories.findIndex(dir => dir.id === id);
    if (index !== -1) {
      const dirName = this._directories[index].name;
      this._directories.splice(index, 1);
      
      this._bookmarks.forEach(bookmark => {
        if (bookmark.directoryId === id) {
          bookmark.directoryId = undefined;
        }
      });
      
      this._onDidChangeBookmarks.fire();
      
      const messages = getMessages();
      vscode.window.showInformationMessage(format(messages.directory.removeSuccess, dirName));
    }
  }

  public async renameDirectory(id: string): Promise<void> {
    const directory = this._directories.find(d => d.id === id);
    if (!directory) {
      return;
    }

    const messages = getMessages();
    const newName = await vscode.window.showInputBox({
      prompt: messages.directory.renamePrompt,
      value: directory.name,
      placeHolder: messages.directory.namePlaceholder
    });

    if (newName === undefined) {
      return;
    }

    directory.name = newName;
    this._onDidChangeBookmarks.fire();
  }

  public async addBookmark(directoryId?: string): Promise<void> {
    const messages = getMessages();
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showInformationMessage(messages.bookmark.noActiveEditor);
      return;
    }

    const document = editor.document;
    const selection = editor.selection;
    const lineNumber = selection.active.line;
    const lineText = document.lineAt(lineNumber).text.trim();

    const existingBookmark = this._bookmarks.find(
      bookmark => 
        bookmark.filePath === document.uri.fsPath && 
        bookmark.lineNumber === lineNumber
    );

    if (existingBookmark) {
      vscode.window.showInformationMessage(messages.bookmark.alreadyExists);
      return;
    }

    const pathParts = document.uri.fsPath.split(/[/\\]/);
    const fileName = pathParts[pathParts.length - 1];
    const id = `${document.uri.fsPath}:${lineNumber}`;
    const contextLines = this.getContextLines(document, lineNumber);

    const maxOrder = Math.max(-1, ...this._bookmarks.map(b => b.order !== undefined ? b.order : -1));
    const nextOrder = maxOrder + 1;

    const customName = await vscode.window.showInputBox({
      prompt: messages.common.namePrompt,
      placeHolder: lineText.substring(0, 30) + (lineText.length > 30 ? '...' : '')
    });

    const bookmark: Bookmark = {
      id,
      filePath: document.uri.fsPath,
      fileName,
      lineNumber,
      lineText,
      fullText: contextLines,
      order: nextOrder,
      customName: customName || undefined,
      directoryId
    };

    this._bookmarks.push(bookmark);
    this._onDidChangeBookmarks.fire();
    
    vscode.window.showInformationMessage(format(messages.bookmark.addSuccess, customName || lineText));
  }

  public moveBookmarkToDirectory(bookmarkId: string, directoryId: string | undefined): void {
    const bookmark = this._bookmarks.find(b => b.id === bookmarkId);
    if (bookmark) {
      bookmark.directoryId = directoryId;
      this._onDidChangeBookmarks.fire();
    }
  }

  public removeBookmark(id: string): void {
    const index = this._bookmarks.findIndex(bookmark => bookmark.id === id);
    if (index !== -1) {
      const bookmark = this._bookmarks[index];
      this._bookmarks.splice(index, 1);
      this._onDidChangeBookmarks.fire();
      
      const messages = getMessages();
      vscode.window.showInformationMessage(format(messages.bookmark.removeSuccess, bookmark.customName || bookmark.lineText));
    }
  }

  public clearBookmarks(): void {
    this._bookmarks = [];
    this._directories = [];
    this._onDidChangeBookmarks.fire();
    
    const messages = getMessages();
    vscode.window.showInformationMessage(messages.bookmark.clearAll);
  }

  public async renameBookmark(id: string): Promise<void> {
    const bookmark = this._bookmarks.find(b => b.id === id);
    if (!bookmark) {
      return;
    }

    const currentName = bookmark.customName || bookmark.lineText;
    const messages = getMessages();
    
    const newName = await vscode.window.showInputBox({
      prompt: messages.common.namePrompt,
      value: currentName,
      placeHolder: messages.common.namePlaceholder
    });

    if (newName === undefined) {
      return;
    }

    bookmark.customName = newName || undefined;
    this._onDidChangeBookmarks.fire();
  }

  public reorderBookmarks(sourceId: string, targetId: string): void {
    const bookmarks = this.getBookmarks();
    const sourceIndex = bookmarks.findIndex(b => b.id === sourceId);
    const targetIndex = bookmarks.findIndex(b => b.id === targetId);

    if (sourceIndex === -1 || targetIndex === -1) {
      return;
    }

    let targetOrder: number;

    if (sourceIndex > targetIndex) {
      if (targetIndex === 0) {
        targetOrder = bookmarks[0].order !== undefined ? bookmarks[0].order - 1 : 0;
      } else {
        const prevBookmark = bookmarks[targetIndex - 1];
        const currBookmark = bookmarks[targetIndex];
        const prevOrder = prevBookmark.order !== undefined ? prevBookmark.order : 0;
        const currOrder = currBookmark.order !== undefined ? currBookmark.order : 1;
        targetOrder = prevOrder + (currOrder - prevOrder) / 2;
      }
    } else {
      if (targetIndex === bookmarks.length - 1) {
        targetOrder = bookmarks[targetIndex].order !== undefined ? bookmarks[targetIndex].order + 1 : bookmarks.length;
      } else {
        const currBookmark = bookmarks[targetIndex];
        const nextBookmark = bookmarks[targetIndex + 1];
        const currOrder = currBookmark.order !== undefined ? currBookmark.order : targetIndex;
        const nextOrder = nextBookmark.order !== undefined ? nextBookmark.order : targetIndex + 1;
        targetOrder = currOrder + (nextOrder - currOrder) / 2;
      }
    }

    const bookmark = this._bookmarks.find(b => b.id === sourceId);
    if (bookmark) {
      bookmark.order = targetOrder;
      this._onDidChangeBookmarks.fire();
    }
  }

  public reorderDirectories(sourceId: string, targetId: string): void {
    const directories = this.getDirectories();
    const sourceIndex = directories.findIndex(d => d.id === sourceId);
    const targetIndex = directories.findIndex(d => d.id === targetId);

    if (sourceIndex === -1 || targetIndex === -1) {
      return;
    }

    let targetOrder: number;

    if (sourceIndex > targetIndex) {
      if (targetIndex === 0) {
        targetOrder = directories[0].order !== undefined ? directories[0].order - 1 : 0;
      } else {
        const prevDirectory = directories[targetIndex - 1];
        const currDirectory = directories[targetIndex];
        const prevOrder = prevDirectory.order !== undefined ? prevDirectory.order : 0;
        const currOrder = currDirectory.order !== undefined ? currDirectory.order : 1;
        targetOrder = prevOrder + (currOrder - prevOrder) / 2;
      }
    } else {
      if (targetIndex === directories.length - 1) {
        targetOrder = directories[targetIndex].order !== undefined ? directories[targetIndex].order + 1 : directories.length;
      } else {
        const currDirectory = directories[targetIndex];
        const nextDirectory = directories[targetIndex + 1];
        const currOrder = currDirectory.order !== undefined ? currDirectory.order : targetIndex;
        const nextOrder = nextDirectory.order !== undefined ? nextDirectory.order : targetIndex + 1;
        targetOrder = currOrder + (nextOrder - currOrder) / 2;
      }
    }

    const directory = this._directories.find(d => d.id === sourceId);
    if (directory) {
      directory.order = targetOrder;
      this._onDidChangeBookmarks.fire();
    }
  }

  private getContextLines(document: vscode.TextDocument, lineNumber: number): string {
    const startLine = Math.max(0, lineNumber - 2);
    const endLine = Math.min(document.lineCount - 1, lineNumber + 2);
    
    let result = '';
    for (let i = startLine; i <= endLine; i++) {
      const line = document.lineAt(i).text;
      if (i === lineNumber) {
        result += `→ ${i+1}: ${line}\n`;
      } else {
        result += `  ${i+1}: ${line}\n`;
      }
    }
    
    return result;
  }
} 