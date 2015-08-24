/**
 * @module common.translate
 *
 * i18n
 */
(function(){
  var module = angular.module('common.i18n',['pascalprecht.translate']);
  module.config(function ($translateProvider) {
    $translateProvider.translations('en', {
      DASHBOARD : 'Dashboard'
    });
    $translateProvider.translations('cn', {
      DASHBOARD : 'Dashboard',
      TIMER : '定时器',
      CUSTOM_COMMAND : '自定义指令',
      MESSAGE : '留言',
      MUSIC : '音乐',
      SPAM_PROTECT : '弹幕监控',
      SYSTEM_COMMAND : '系统指令'
    });
    $translateProvider.preferredLanguage('cn');
  });
})();