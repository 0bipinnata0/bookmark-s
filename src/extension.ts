import * as vscode from 'vscode';
import { BookmarkManager } from './bookmark/bookmarkModel';
import { BookmarkTreeDataProvider, BookmarkTreeItem, TreeItemType } from './bookmark/bookmarkTreeProvider';
import { BookmarkStorage } from './bookmark/persistence';
import { BookmarkDecorator } from './bookmark/bookmarkDecorator';
import { initializeLanguage, getMessages, format, setLanguage } from './config/i18n';
import { PackageContributionsManager } from './config/packagesManager';

export function activate(context: vscode.ExtensionContext) {
  console.log('Extension "bookmark" is now active!');

  // 初始化国际化
  initializeLanguage();
  
  // 更新命令标题为当前语言
  PackageContributionsManager.refreshAllContributions();

  // 监听语言变化
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration(e => {
      if (e.affectsConfiguration('window.displayLanguage') || 
          e.affectsConfiguration('locale') ||
          e.affectsConfiguration('bookmark.language')) {
        initializeLanguage();
        PackageContributionsManager.refreshAllContributions();
      }
    })
  );

  // Register hello world command (可以在实际使用中移除)
  let helloWorldDisposable = vscode.commands.registerCommand('bookmark.helloWorld', () => {
    vscode.window.showInformationMessage('Hello World from Bookmark!');
  });
  context.subscriptions.push(helloWorldDisposable);

  // Register language setting command
  context.subscriptions.push(
    vscode.commands.registerCommand('bookmark.setLanguage', () => {
      setLanguage().then(() => {
        PackageContributionsManager.refreshAllContributions();
      });
    })
  );

  // Initialize Bookmark functionality
  const bookmarkManager = new BookmarkManager();
  const bookmarkTreeDataProvider = new BookmarkTreeDataProvider(bookmarkManager);
  
  // Setup persistence for bookmarks
  BookmarkStorage.setupPersistence(context, bookmarkManager);
  
  // Initialize bookmark decorators (line icons)
  const bookmarkDecorator = new BookmarkDecorator(bookmarkManager);
  context.subscriptions.push({ dispose: () => bookmarkDecorator.dispose() });
  
  // Register the tree view with drag and drop support
  const treeView = vscode.window.createTreeView('bookmarkExplorer', {
    treeDataProvider: bookmarkTreeDataProvider,
    showCollapseAll: true,
    dragAndDropController: bookmarkTreeDataProvider
  });
  context.subscriptions.push(treeView);

  // 添加目录命令
  context.subscriptions.push(
    vscode.commands.registerCommand('bookmark.addDirectory', () => {
      console.log('Add directory command triggered');
      bookmarkManager.addDirectory().then(() => {
        bookmarkTreeDataProvider.refresh();
      });
    })
  );

  // 重命名目录命令
  context.subscriptions.push(
    vscode.commands.registerCommand('bookmark.renameDirectory', (item) => {
      console.log('Rename directory command triggered for item:', item);
      if (item && item.directory) {
        bookmarkManager.renameDirectory(item.directory.id).then(() => {
          bookmarkTreeDataProvider.refresh();
        });
      } else {
        console.error('No directory item to rename');
      }
    })
  );

  // 删除目录命令
  context.subscriptions.push(
    vscode.commands.registerCommand('bookmark.removeDirectory', (item) => {
      console.log('Remove directory command triggered for item:', item);
      if (item && item.directory) {
        bookmarkManager.removeDirectory(item.directory.id);
      } else {
        console.error('No directory item to remove');
      }
    })
  );

  // 在目录中添加书签命令
  context.subscriptions.push(
    vscode.commands.registerCommand('bookmark.addBookmarkToDirectory', (item) => {
      console.log('Add bookmark to directory command triggered for item:', item);
      if (item && item.directory) {
        bookmarkManager.addBookmark(item.directory.id).then(() => {
          bookmarkTreeDataProvider.refresh();
          bookmarkDecorator.updateDecorations();
        });
      } else {
        console.error('No directory to add bookmark to');
      }
    })
  );

  // Register bookmark commands
  context.subscriptions.push(
    vscode.commands.registerCommand('bookmark.addBookmark', () => {
      console.log('Add bookmark command triggered');
      bookmarkManager.addBookmark().then(() => {
        console.log('Current bookmarks:', bookmarkManager.getBookmarks());
        bookmarkDecorator.updateDecorations();
      });
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('bookmark.removeBookmark', (item) => {
      console.log('Remove bookmark command triggered for item:', item);
      if (item && item.bookmark) {
        bookmarkManager.removeBookmark(item.bookmark.id);
        bookmarkDecorator.updateDecorations();
      } else {
        console.error('No bookmark item to remove');
      }
    })
  );

  // 注册重命名命令
  context.subscriptions.push(
    vscode.commands.registerCommand('bookmark.renameBookmark', (item) => {
      console.log('Rename bookmark command triggered for item:', item);
      if (item && item.bookmark) {
        bookmarkManager.renameBookmark(item.bookmark.id).then(() => {
          bookmarkTreeDataProvider.refresh();
        });
      } else {
        console.error('No bookmark item to rename');
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('bookmark.clearBookmarks', () => {
      console.log('Clear bookmarks command triggered');
      bookmarkManager.clearBookmarks();
      bookmarkDecorator.updateDecorations();
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('bookmark.gotoBookmark', (bookmark) => {
      console.log('Go to bookmark command triggered for:', bookmark);
      if (bookmark) {
        const uri = vscode.Uri.file(bookmark.filePath);
        vscode.workspace.openTextDocument(uri).then(document => {
          vscode.window.showTextDocument(document).then(editor => {
            // Position is zero-based
            const position = new vscode.Position(bookmark.lineNumber, 0);
            const selection = new vscode.Selection(position, position);
            editor.selection = selection;
            editor.revealRange(
              new vscode.Range(position, position),
              vscode.TextEditorRevealType.InCenter
            );
            
            // Update decorations after navigating
            setTimeout(() => bookmarkDecorator.updateDecorations(), 100);
          });
        });
      } else {
        console.error('No bookmark to navigate to');
      }
    })
  );
}

export function deactivate() {} 