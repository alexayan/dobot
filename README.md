# Dobot
直播助手，支持多直播平台。

## Build

Run `npm install` for installing the requires  
Run `bower install` for installing the requires  

## Mudules

- *common.alert*
  提供`DoAlert`服务
- *common.config*
  配置定义
- *common.danmu*
  通用弹幕发送与接收模块，封装各个平台接口.提供`DoDanmu`服务
- *common.i18n*
  国际化模块
- *common.model*
  Model模块。提供`DoModel`服务
- *common.platform*
  平台层。封装各个平台接口,提供`DoPlatform`服务
- *common.user*
  Dobot用户模块，管理用户登录状态。提供`DoUser`服务
- *common.utils*
  工具模块。提供`DoTools`服务
- *features.custom_command*
  用户自定义指令模块，提供`CustomCommandService`服务
- *features.system_command*
  系统指令模块，提供`SystemCommandService`服务,注册!list,!help系统指令
- *features.music*
  音乐模块，注册!music系统指令，实现弹幕点歌，提供音乐播放管理

## demo

![image](https://raw.githubusercontent.com/alexayan/dobot/master/demo/login.png)
![image](https://raw.githubusercontent.com/alexayan/dobot/master/demo/commands.png)
![image](https://raw.githubusercontent.com/alexayan/dobot/master/demo/music.png)

##Todo

- 提供指令的恢复功能，对于某些未完成指令，在重新进入应用后进行恢复
