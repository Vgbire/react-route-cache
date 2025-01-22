import i18n from 'i18next';

const getLanguage = () => {
  const lng = navigator?.language || 'en_US';
  if (lng.includes('zh')) {
    return 'zh_CN';
  }
  if (lng.includes('en')) {
    return 'en_US';
  }
  return 'en_US';
};

i18n.init({
  lng: getLanguage(),
  resources: {
    zh_CN: {
      translation: {
        closeAllTabTip: '你确定要关闭其他标签吗？',
        closeAllTabContent: '关闭的标签页将不会被缓存',
        cancel: '取消',
        confirm: '确认',
      },
    },
    en_US: {
      translation: {
        closeAllTabTip: 'Are you sure you want to close other tags?',
        closeAllTabContent: 'Closed tabs will not be cached',
        cancel: 'Cancel',
        confirm: 'Confirm',
      },
    },
  },
});

export default i18n;
