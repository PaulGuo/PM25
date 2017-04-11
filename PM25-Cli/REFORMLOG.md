##### 静态配置信息调整

```
KEYMETRICS_ROOT_URL : 'root.pm25.io',
DEFAULT_MODULE_JSON : 'package.json',
REMOTE_PORT_TCP : 8080,
REMOTE_PORT : 41624,
REMOTE_REVERSE_PORT : 43554,
REMOTE_HOST : 's1.pm25.io',
SEND_INTERVAL : 1000
```

##### 基础握手信息服务

```
端口：443 -> 80
```

##### 安装包元信息调整

```
包名称、版本号、BIN路径
```

##### [Keymetrics.io] 提示文案批量替换

```
[Keymetrics.io] -> [PM25.io]
PM2: Keymetrics.io Agent -> PM2: PM25.io Agent
```

##### README 文案信息更改

```
pm2 -> pm25
PM2 -> PM25
Keymetrics -> PM25
Unitech/PM2 -> PaulGuo/PM2.5
```

##### 改动文件列表

- `constants.js`
- `lib/Interactor/Daemon.js`
- `package.json`
- `bin/pm2`
- `lib/Interactor/Daemon.js`
- `lib/Interactor/InteractorDaemonizer.js`
- `README.md`
