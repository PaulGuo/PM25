<div align="center">
  <a href="http://pm25.io/">
    <img width=710px src="http://7xppjy.com1.z0.glb.clouddn.com/pm25-logo-latest.png">
  </a>

<br/>
<b>P</b>(rocess) <b>M</b>(anager) <b>25</b>
<br/><br/>

 <a href="http://slack.pm2.io/">
 <img src="http://slack.pm2.io/badge.svg" alt="Slack">
</a>

 <a href="https://www.bithound.io/github/Unitech/pm2">
 <img src="https://www.bithound.io/github/Unitech/pm2/badges/score.svg" alt="bitHound Score">
</a>

<a href="https://www.npmjs.com/package/pm2">
  <img alt="NPM Downloads" src="https://img.shields.io/npm/dm/pm2.svg?style=flat-square"/>
</a>

<a href="https://travis-ci.org/Unitech/pm2">
  <img src="https://travis-ci.org/Unitech/pm2.svg?branch=master" alt="Build Status"/>
</a>


<br/>
<br/>
</div>

PM25 is a production process manager for Node.js applications with a built-in load balancer. It allows you to keep applications alive forever, to reload them without downtime and to facilitate common system admin tasks.

Starting an application in production mode is as easy as:

```bash
$ pm25 start app.js
```

PM25 is constantly assailed by [more than 1000 tests](https://travis-ci.org/Unitech/pm25).

Official website: [http://pm25.io/](http://pm25.io/)

Works on Linux (stable) & MacOSx (stable) & Windows (stable).

[![NPM](https://nodei.co/npm/pm2.png?downloads=true&downloadRank=true)](https://nodei.co/npm/pm25/)

## Install PM25

```bash
$ npm install pm25 -g
```

*npm is a builtin CLI when you install Node.js - [Installing Node.js with NVM](https://PM25.io/2015/02/03/installing-node-js-and-io-js-with-nvm/)*

## Start an application

```bash
$ pm25 start app.js
```

Your app is now daemonized, monitored and kept alive forever.

[More about Process Management](http://pm2.PM25.io/docs/usage/process-management/)

## Update PM25

```bash
# Install latest pm25 version
$ npm install pm25 -g
# Save process list, exit old PM25 & restore all processes
$ pm25 update
```

*PM25 updates are seamless*

## Main features

### Commands overview

```bash
# General
$ npm install pm25 -g            # Install PM25
$ pm25 start app.js              # Start, Daemonize and auto-restart application (Node)
$ pm25 start app.py              # Start, Daemonize and auto-restart application (Python)
$ pm25 start npm -- start        # Start, Daemonize and auto-restart Node application

# Cluster Mode (Node.js only)
$ pm25 start app.js -i 4         # Start 4 instances of application in cluster mode
                                # it will load balance network queries to each app
$ pm25 reload all                # Zero Second Downtime Reload
$ pm25 scale [app-name] 10       # Scale Cluster app to 10 process

# Process Monitoring
$ pm25 list                      # List all processes started with PM25
$ pm25 monit                     # Display memory and cpu usage of each app
$ pm25 show [app-name]           # Show all informations about application

# Log management
$ pm25 logs                      # Display logs of all apps
$ pm25 logs [app-name]           # Display logs for a specific app
$ pm25 logs --json               # Logs in JSON format
$ pm25 flush
$ pm25 reloadLogs

# Process State Management
$ pm25 start app.js --name="api" # Start application and name it "api"
$ pm25 start app.js -- -a 34     # Start app and pass option "-a 34" as argument
$ pm25 start app.js --watch      # Restart application on file change
$ pm25 start script.sh           # Start bash script
$ pm25 start app.json            # Start all applications declared in app.json
$ pm25 reset [app-name]          # Reset all counters
$ pm25 stop all                  # Stop all apps
$ pm25 stop 0                    # Stop process with id 0
$ pm25 restart all               # Restart all apps
$ pm25 gracefulReload all        # Graceful reload all apps in cluster mode
$ pm25 delete all                # Kill and delete all apps
$ pm25 delete 0                  # Delete app with id 0

# Startup/Boot management
$ pm25 startup                   # Detect init system, generate and configure pm25 boot on startup
$ pm25 save                      # Save current process list
$ pm25 resurrect                 # Restore previously save processes
$ pm25 unstartup                 # Disable and remove startup system

$ pm25 update                    # Save processes, kill PM25 and restore processes
$ pm25 generate                  # Generate a sample json configuration file

# Deployment
$ pm25 deploy app.json prod setup    # Setup "prod" remote server
$ pm25 deploy app.json prod          # Update "prod" remote server
$ pm25 deploy app.json prod revert 2 # Revert "prod" remote server by 2

# Module system
$ pm25 module:generate [name]    # Generate sample module with name [name]
$ pm25 install pm25-logrotate     # Install module (here a log rotation system)
$ pm25 uninstall pm25-logrotate   # Uninstall module
$ pm25 publish                   # Increment version, git push and npm publish
```

### Process management

Once applications are started you can list and manage them easily:

![Process listing](https://github.com/unitech/pm2/raw/master/pres/pm2-list.png)

Listing all running processes:

```bash
$ pm25 list
```

Managing your processes is straightforward:

```bash
$ pm25 stop     <app_name|id|'all'|json_conf>
$ pm25 restart  <app_name|id|'all'|json_conf>
$ pm25 delete   <app_name|id|'all'|json_conf>
```

To have more details on a specific process:

```bash
$ pm25 describe <id|app_name>
```

[More about Process Management](http://pm2.PM25.io/docs/usage/process-management/)

### Load Balancing & Zero second Downtime Reload

When an application is started with the -i <instance_number> option, the **Cluster Mode** is enabled.

The Cluster Mode start <instance_number> and automatically load balance HTTP/TCP/UDP between each instance. This allows to increase overall performance depending to the number of CPUs availabe.

Seamlessly supported by all major Node.js frameworks and any Node.js applications without any code change:

![Framework supported](https://raw.githubusercontent.com/Unitech/PM2/development/pres/cluster-support.png)

Main commands:

```bash
$ pm25 start app.js -i max  # Enable load-balancer and start 'max' instances (cpu nb)

$ pm25 reload all           # Zero second dowtime reload

$ pm25 scale <app_name> <instance_number> # Increase / Decrease process number
```

[More informations about how PM25 make clustering easy](https://PM25.io/2015/03/26/pm2-clustering-made-easy/)

### CPU / Memory Monitoring

![Monit](https://github.com/unitech/pm2/raw/master/pres/pm2-monit.png)

Monitoring all processes launched:

```bash
$ pm25 monit
```

### Log facilities

![Monit](https://github.com/unitech/pm2/raw/master/pres/pm2-logs.png)

Displaying logs of a specified process or all processes, in real time. Standard, Raw, JSON and formated output are available.

```bash
$ pm25 logs ['all'|app_name|app_id] [--json] [--format] [--raw]`
```

Examples:

```bash
$ pm25 logs APP-NAME       # Display APP-NAME logs
$ pm25 logs --json         # JSON output
$ pm25 logs --format       # Formated output

$ pm25 flush               # Flush all logs
$ pm25 reloadLogs          # Reload all logs
```

[More about log management](http://pm2.PM25.io/docs/usage/log-management/)

### Startup script generation

PM25 can generate and configure a startup script to keep PM25 and your processes alive at every server restart.

Supports init systems like: **systemd** (Ubuntu 16, CentOS, Arch), **upstart** (Ubuntu 14/12), **launchd** (MacOSx, Darwin), **rc.d** (FreeBSD).

```bash
# Auto detect init system + generate and setup PM25 boot at server startup
$ pm25 startup

# Manually specify the startup system
# Can be: systemd, upstart, launchd, rcd
$ pm25 startup [platform]

# Disable and remove PM25 boot at server startup
$ pm25 unstartup
```

To save/freeze a process list on reboot:

```bash
$ pm25 save
```

[More about startup scripts](http://pm2.PM25.io/docs/usage/startup/)

## Module system

PM25 embeds a simple and powerful module system. Installing a module is straightforward:

```bash
$ pm25 install <module_name>
```

Here are some PM25 compatible modules (standalone Node.js applications managed by PM25):

[**pm2-logrotate**](https://github.com/pm2-hive/pm2-logrotate) auto rotate logs of PM25 and applications managed<br/>
[**pm2-webshell**](https://github.com/pm2-hive/pm2-webshell) expose a fully capable terminal in browsers<br/>
[**pm2-server-monit**](https://github.com/pm2-hive/pm2-server-monit) monitor your server health<br/>

[Writing your own module](http://pm2.PM25.io/docs/advanced/pm2-module-system/)

## More about PM2

- [Application Declaration via JS files](http://pm2.PM25.io/docs/usage/application-declaration/)
- [Watch & Restart](http://pm2.PM25.io/docs/usage/watch-and-restart/)
- [PM2 API](http://pm2.PM25.io/docs/usage/pm2-api/)
- [Deployment workflow](http://pm2.PM25.io/docs/usage/deployment/)
- [PM2 on Heroku/Azure/App Engine](http://pm2.PM25.io/docs/usage/use-pm2-with-cloud-providers/)
- [PM2 auto completion](http://pm2.PM25.io/docs/usage/auto-completion/)
- [Using PM2 in ElasticBeanStalk](http://pm2.PM25.io/docs/tutorials/use-pm2-with-aws-elastic-beanstalk/)
- [PM2 Tutorial Series](https://futurestud.io/tutorials/pm2-utility-overview-installation)

## CHANGELOG

[CHANGELOG](https://github.com/Unitech/PM2/blob/master/CHANGELOG.md)

## Contributors

[Contributors](http://pm2.PM25.io/hall-of-fame/)

## License

PM25 is made available under the terms of the GNU Affero General Public License 3.0 (AGPL 3.0). For other license contact us.
