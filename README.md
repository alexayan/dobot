# Dobot
直播助手，支持多直播平台。

## Build

Run `npm install` for installing the requires  
Run `bower install` for installing the requires  

## Mudules

- *common.alert*
  提供*DoAlert*服务,支持success, error, info
- *common.config*
  配置定义
- *common.danmu*
  通用弹幕发送与接收模块，封装各个平台接口.提供*DoDanmu*服务
- *common.i18n*
  国际化模块
- *common.model*
  Model模块。提供*DoModel*服务
- *common.platform*
  平台层。封装各个平台接口,提供*DoPlatform*服务
- *common.user*
  Dobot用户模块，管理用户登录状态。提供*DoUser*服务
- *common.utils*
  工具模块。提供*DoTools*服务
- *features.custom_command*
  自定义指令模块，提供*CustomCommandService*服务

## demo

![image](https://raw.githubusercontent.com/alexayan/dobot/master/demo/login.png)
![image](https://raw.githubusercontent.com/alexayan/dobot/master/demo/register.png)
![image](https://raw.githubusercontent.com/alexayan/dobot/master/demo/commands.png)
