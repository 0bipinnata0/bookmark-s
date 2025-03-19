import * as vscode from 'vscode';

export interface Messages {
  bookmark: {
    addSuccess: string;
    alreadyExists: string;
    removeSuccess: string;
    noActiveEditor: string;
    clearAll: string;
  };
  directory: {
    addPrompt: string;
    renamePrompt: string;
    newDirPlaceholder: string;
    addSuccess: string;
    removeSuccess: string;
    namePlaceholder: string;
  };
  common: {
    namePrompt: string;
    namePlaceholder: string;
    languageChanged: string;
    selectLanguage: string;
    autoDetect: string;
  };
  commands: {
    addBookmark: string;
    removeBookmark: string;
    clearBookmarks: string;
    renameBookmark: string;
    addDirectory: string;
    renameDirectory: string;
    removeDirectory: string;
    addBookmarkToDirectory: string;
    setLanguage: string;
  };
  views: {
    bookmarkExplorer: string;
  };
  languages: {
    auto: string;
    en: string;
    zhCN: string;
  };
}

// 简体中文消息
const zhCN: Messages = {
  bookmark: {
    addSuccess: '书签已添加: {0}',
    alreadyExists: '此行已添加书签',
    removeSuccess: '已删除书签: {0}',
    noActiveEditor: '没有打开的编辑器，无法添加书签',
    clearAll: '所有书签和目录已清除'
  },
  directory: {
    addPrompt: '输入新目录名称',
    renamePrompt: '输入新的目录名称',
    newDirPlaceholder: '新目录',
    addSuccess: '目录已创建: {0}',
    removeSuccess: '目录已删除: {0}',
    namePlaceholder: '目录名称'
  },
  common: {
    namePrompt: '输入书签名称（可选）',
    namePlaceholder: '书签名称',
    languageChanged: '书签扩展语言已更改为: {0}',
    selectLanguage: '选择书签扩展语言',
    autoDetect: '自动检测 (当前: {0})'
  },
  commands: {
    addBookmark: '书签: 添加书签',
    removeBookmark: '书签: 移除书签',
    clearBookmarks: '书签: 清除所有书签',
    renameBookmark: '书签: 重命名书签',
    addDirectory: '书签: 添加目录',
    renameDirectory: '书签: 重命名目录',
    removeDirectory: '书签: 删除目录',
    addBookmarkToDirectory: '书签: 在目录中添加书签',
    setLanguage: '书签: 设置语言'
  },
  views: {
    bookmarkExplorer: '书签'
  },
  languages: {
    auto: '自动 (跟随 VS Code 设置)',
    en: '英文 (English)',
    zhCN: '简体中文'
  }
};

// 英文消息
const enUS: Messages = {
  bookmark: {
    addSuccess: 'Bookmark added: {0}',
    alreadyExists: 'This line is already bookmarked',
    removeSuccess: 'Removed bookmark: {0}',
    noActiveEditor: 'No active editor to add bookmark',
    clearAll: 'All bookmarks and directories cleared'
  },
  directory: {
    addPrompt: 'Enter new directory name',
    renamePrompt: 'Enter new directory name',
    newDirPlaceholder: 'New Directory',
    addSuccess: 'Directory created: {0}',
    removeSuccess: 'Directory removed: {0}',
    namePlaceholder: 'Directory name'
  },
  common: {
    namePrompt: 'Enter bookmark name (optional)',
    namePlaceholder: 'Bookmark name',
    languageChanged: 'Bookmark extension language changed to: {0}',
    selectLanguage: 'Select Bookmark Extension Language',
    autoDetect: 'Auto-detect (Current: {0})'
  },
  commands: {
    addBookmark: 'Bookmark: Add Bookmark',
    removeBookmark: 'Bookmark: Remove Bookmark',
    clearBookmarks: 'Bookmark: Clear All Bookmarks',
    renameBookmark: 'Bookmark: Rename Bookmark',
    addDirectory: 'Bookmark: Add Directory',
    renameDirectory: 'Bookmark: Rename Directory',
    removeDirectory: 'Bookmark: Remove Directory',
    addBookmarkToDirectory: 'Bookmark: Add Bookmark to Directory',
    setLanguage: 'Bookmark: Set Language'
  },
  views: {
    bookmarkExplorer: 'Bookmarks'
  },
  languages: {
    auto: 'Auto (Follow VS Code setting)',
    en: 'English',
    zhCN: 'Simplified Chinese (简体中文)'
  }
};

// 语言映射
const messagesMap: Record<string, Messages> = {
  'zh-cn': zhCN,
  'en': enUS,
  // 可以添加更多语言
};

// 默认语言
let currentLanguage: string = 'en';

// 获取用户配置的语言设置
function getUserLanguageSetting(): string {
  const config = vscode.workspace.getConfiguration('bookmark');
  return config.get<string>('language', 'auto');
}

// 获取系统语言
function getSystemLanguage(): string {
  const config = vscode.workspace.getConfiguration();
  return config.get<string>('window.displayLanguage') || 
         vscode.env.language || 
         'en';
}

// 初始化并获取当前语言
export function initializeLanguage(): void {
  const userSetting = getUserLanguageSetting();
  
  if (userSetting !== 'auto') {
    // 用户明确设置了语言，使用用户设置
    currentLanguage = userSetting.toLowerCase();
  } else {
    // 自动检测语言
    currentLanguage = getSystemLanguage().toLowerCase();
  }
  
  console.log(`Initialized language: ${currentLanguage} (from setting: ${userSetting})`);
}

// 更新语言设置
export async function setLanguage(langCode?: string): Promise<void> {
  const messages = getMessages();
  
  if (!langCode) {
    // 如果没有传入语言代码，显示选择菜单
    const currentSetting = getUserLanguageSetting();
    const systemLang = getSystemLanguage();

    const options = [
      { label: messages.languages.auto, value: 'auto', description: format(messages.common.autoDetect, getLocalizedLanguageName(systemLang)) },
      { label: messages.languages.en, value: 'en' },
      { label: messages.languages.zhCN, value: 'zh-cn' }
    ];
    
    const selected = await vscode.window.showQuickPick(
      options.map(opt => ({ 
        label: opt.label, 
        description: opt.description,
        value: opt.value
      })), 
      { 
        placeHolder: messages.common.selectLanguage,
        canPickMany: false
      }
    );
    
    if (!selected) {
      return; // 用户取消了选择
    }
    
    langCode = selected.value;
  }
  
  // 更新配置
  await vscode.workspace.getConfiguration('bookmark').update('language', langCode, vscode.ConfigurationTarget.Global);
  
  // 重新初始化语言
  initializeLanguage();
  
  // 显示语言已更改的消息
  const newMessages = getMessages();
  vscode.window.showInformationMessage(
    format(newMessages.common.languageChanged, getLocalizedLanguageName(langCode))
  );
}

// 获取语言的本地化名称
function getLocalizedLanguageName(langCode: string): string {
  const messages = getMessages();
  
  switch (langCode.toLowerCase()) {
    case 'auto':
      return messages.languages.auto;
    case 'en':
      return messages.languages.en;
    case 'zh-cn':
      return messages.languages.zhCN;
    default:
      return langCode;
  }
}

// 获取当前语言的消息
export function getMessages(): Messages {
  // 先尝试精确匹配
  if (messagesMap[currentLanguage]) {
    return messagesMap[currentLanguage];
  }
  
  // 如果没有精确匹配，尝试匹配语言基础部分（如 'zh-cn' -> 'zh'）
  const baseLang = currentLanguage.split('-')[0];
  if (messagesMap[baseLang]) {
    return messagesMap[baseLang];
  }
  
  // 如果都没有匹配，返回英文
  return enUS;
}

// 格式化消息，替换占位符
export function format(message: string, ...args: string[]): string {
  return args.reduce((msg, arg, index) => {
    return msg.replace(`{${index}}`, arg);
  }, message);
}