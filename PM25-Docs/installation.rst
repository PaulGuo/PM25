.. PM2.5 documentation master file, created by
   sphinx-quickstart on Mon Jul  6 21:16:59 2015.
   You can adapt this file completely to your liking, but it should at least
   contain the root `toctree` directive.

PM2.5 CLI基于PM2，使用方法和API同PM2完全一致，如果你目前正在使用PM2，能够快速无痛的迁移到PM2.5中。如果局部安装需要在当前目录下执行，安装方式完全看你的个人喜好，但我们推荐全局安装的方式。

如何安装
========

NPM安装包地址：https://www.npmjs.com/package/pm25

.. code-block:: bash
   :emphasize-lines: 0

   npm install -g pm25

接入指南
--------

.. code-block:: bash
   :emphasize-lines: 0

    npm install -g pm25
    pm25 interact <secret_key> <public_key>
    pm25 start processes.json

命令行使用
----------

.. code-block:: bash
   :emphasize-lines: 1

    Usage: pm25 [cmd] app

    Commands:

        start [options] <file|json|stdin>                          start and daemonize an app
        deploy <file|environment>                                  deploy your json
        startOrRestart <json>                                      start or restart JSON file
        startOrReload <json>                                       start or gracefully reload JSON file
        startOrGracefulReload <json>                               start or gracefully reload JSON file
        stop [options] <id|name|all|json|stdin>                    stop a process (to start it again, do pm2 restart <app>)
        restart [options] <id|name|all|json|stdin>                 restart a process
        reload <name|all>                                          reload processes (note that its for app using HTTP/HTTPS)
        gracefulReload <name|all>                                  gracefully reload a process. Send a "shutdown" message to close all connections.
        delete <name|id|script|all|json|stdin>                     stop and delete a process from pm2 process list
        sendSignal <signal> <pm2_id|name>                          send a system signal to the target process
        ping                                                       ping pm2 daemon - if not up it will launch it
        updatePM2                                                  update in-memory PM2 with local PM2
        update                                                     (alias) update in-memory PM2 with local PM2
        install <module|git:/>                                     install or update a module and run it forever
        uninstall <module>                                         stop and uninstall a module
        publish                                                    Publish the module you are currently on
        set <key> <value>                                          sets the specified config <key> <value>
        unset <key>                                                clears the specified config <key>
        interact [secret_key|command] [public_key] [machine_name]  linking action to keymetrics.io - command can be stop|info|delete|restart
        link [secret_key|command] [public_key] [machine_name]      linking action to keymetrics.io - command can be stop|info|delete|restart
        web                                                        launch an health API on port 9615
        dump                                                       dump all processes for resurrecting them later
        save                                                       (alias) dump all processes for resurrecting them later
        resurrect                                                  resurrect previously dumped processes
        startup [platform]                                         auto resurrect process at startup. [platform] = ubuntu, centos, redhat, gentoo, systemd, darwin, amazon
        generate                                                   generate an ecosystem.json configuration file
        ecosystem                                                  generate an ecosystem.json configuration file
        reset <name|id|all>                                        reset counters for process
        describe <id>                                              describe all parameters of a process id
        desc <id>                                                  (alias) describe all parameters of a process id
        info <id>                                                  (alias) describe all parameters of a process id
        show <id>                                                  (alias) describe all parameters of a process id
        list                                                       list all processes
        ls                                                         (alias) list all processes
        l                                                          (alias) list all processes
        status                                                     (alias) list all processes
        jlist                                                      list all processes in JSON format
        prettylist                                                 print json in a prettified JSON
        monit                                                      launch termcaps monitoring
        m                                                          (alias) launch termcaps monitoring
        flush                                                      flush logs
        reloadLogs                                                 reload all logs
        logs [options] [id|name]                                   stream logs file. Default stream all logs
        ilogs                                                      advanced interface to display logs
        kill                                                       kill daemon
        pull <name> [commit_id]                                    updates repository for a given app
        forward <name>                                             updates repository to the next commit for a given app
        backward <name>                                            downgrades repository to the previous commit for a given app
        *                                                          undefined

    Options:

        -h, --help                           output usage information
        -V, --version                        output the version number
        -v --version                         get version
        -s --silent                          hide all messages
        -m --mini-list                       display a compacted list without formatting
        -f --force                           force actions
        -n --name <name>                     set a <name> for script
        -i --instances <number>              launch [number] instances (for networked app)(load balanced)
        -l --log [path]                      specify entire log file (error and out are both included)
        -o --output <path>                   specify out log file
        -e --error <path>                    specify error log file
        -p --pid <pid>                       specify pid file
        --max-memory-restart <memory>        specify max memory amount used to autorestart (in megaoctets)
        --env <environment_name>             specify environment to get specific env variables (for JSON declaration)
        -x --execute-command                 execute a program using fork system
        -u --user <username>                 define user when generating startup script
        -c --cron <cron_pattern>             restart a running process based on a cron pattern
        -w --write                           write configuration in local folder
        --interpreter <interpreter>          the interpreter pm2 should use for executing app (bash, python...)
        --log-date-format <momentjs format>  add custom prefix timestamp to logs
        --no-daemon                          run pm2 daemon in the foreground if it doesn't exist already
        --merge-logs                         merge logs from different instances but keep error and out separated
        --watch                              watch application folder for changes
        --ignore-watch <folders|files>       folder/files to be ignored watching, chould be a specific name or regex - e.g. --ignore-watch="test node_modules "some scripts""
        --node-args <node_args>              space delimited arguments to pass to node in cluster mode - e.g. --node-args="--debug=7001 --trace-deprecation"
        --no-color                           skip colors

    Basic Examples:

        Start an app using all CPUs available + set a name :
        $ pm25 start app.js -i max --name "api"

        Restart the previous app launched, by name :
        $ pm25 restart api

        Stop the app :
        $ pm25 stop api

        Restart the app that is stopped :
        $ pm25 restart api

        Remove the app from the process list :
        $ pm25 delete api

        Kill daemon pm2 :
        $ pm25 kill

        Update pm2 :
        $ npm install pm25@latest -g ; pm25 updatePM2

        More examples in https://github.com/PaulGuo/PM2.5#usagefeatures

    Deployment help:

        $ pm25 deploy help
