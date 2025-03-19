import * as vscode from 'vscode';
import { getMessages } from './i18n';

/**
 * 动态更新扩展贡献点的管理器，用于支持国际化
 */
export class PackageContributionsManager {
  /**
   * 更新命令标题以符合当前语言
   */
  public static updateCommandsTitle(): void {
    const messages = getMessages();
    
    this.updateCommandTitle('bookmark.addBookmark', messages.commands.addBookmark);
    this.updateCommandTitle('bookmark.removeBookmark', messages.commands.removeBookmark);
    this.updateCommandTitle('bookmark.clearBookmarks', messages.commands.clearBookmarks);
    this.updateCommandTitle('bookmark.renameBookmark', messages.commands.renameBookmark);
    this.updateCommandTitle('bookmark.addDirectory', messages.commands.addDirectory);
    this.updateCommandTitle('bookmark.renameDirectory', messages.commands.renameDirectory);
    this.updateCommandTitle('bookmark.removeDirectory', messages.commands.removeDirectory);
    this.updateCommandTitle('bookmark.addBookmarkToDirectory', messages.commands.addBookmarkToDirectory);
    this.updateCommandTitle('bookmark.setLanguage', messages.commands.setLanguage);
  }

  /**
   * 更新视图标题以符合当前语言
   */
  public static updateViewsTitle(): void {
    const messages = getMessages();
    
    // 更新书签视图标题
    this.updateViewTitle('bookmarkExplorer', messages.views.bookmarkExplorer);
  }

  /**
   * 刷新所有国际化贡献点
   */
  public static refreshAllContributions(): void {
    this.updateCommandsTitle();
    this.updateViewsTitle();
  }
  
  /**
   * 更新指定命令的标题
   */
  private static updateCommandTitle(commandId: string, title: string): void {
    try {
      // 通过内部API设置命令标题
      // 这种方式可能在future版本变化，但目前是动态更新命令标题的最佳方法
      const commands = vscode.commands as any;
      if (commands._commands && commands._commands.get(commandId)) {
        const command = commands._commands.get(commandId);
        if (command && command.title !== title) {
          command.title = title;
        }
      }
    } catch (error) {
      console.error(`Failed to update command title for ${commandId}:`, error);
    }
  }
  
  /**
   * 更新指定视图的标题
   */
  private static updateViewTitle(viewId: string, title: string): void {
    try {
      // 由于API限制，目前没有完美的方法更新视图标题
      // 可能需要通过扩展激活事件或重新加载窗口来完全应用视图标题更改
      // 这里我们记录一条消息，在实际实现中可能需要使用其他方法
      console.log(`View title update for '${viewId}' to '${title}' is not fully supported in runtime`);
      
      // 下面的代码在当前VS Code API中可能不可靠，仅用于示例
      /* 
      const viewRegistry = (vscode as any).window._registry;
      if (viewRegistry && viewRegistry._views) {
        const view = Array.from(viewRegistry._views.values())
          .find((v: any) => v.id === viewId);
        
        if (view && view.name !== title) {
          view.name = title;
        }
      }
      */
    } catch (error) {
      console.error(`Failed to update view title for ${viewId}:`, error);
    }
  }
} 