angular.module('pm25').controller('hostListController', ['$scope', '$filter', '$http', '$cookies', function HostListCtrl($scope, $filter, $http, $cookies) {
    'use strict';

    // disabled console.log
    if(!location.href.match(/debug=true/igm)) {
        console.log = function() {};
    }

    var ProcessData = function(config, data) {
        Object.defineProperty(this, "_config", {
            enumerable: false,
            value: config
        });

        this._map(data);
    };

    ProcessData.prototype.update = function(data) {
        this._map(data);
    };

    ProcessData.prototype._map = function(data) {
        Object.keys(data).forEach(function(key) {
            this[key] = data[key];
        }.bind(this));
    };

    var HostData = function(host, config) {
        Object.defineProperty(this, "_config", {
            enumerable: false,
            value: config
        });

        this.server_name = host.data.server_name;
        this.processes = [];
        this.server = host.data.status.data.server;
        this.monitoring = host.data.monitoring;
        this.public_key = host.public_key;
        this.sent_at = host.sent_at;
        this.delay = host.delay;
        this.update(host);
    };

    HostData.prototype.update = function(host) {
        this.lastUpdated = Date.now();
        this.sent_at = host.sent_at;
        this.delay = host.delay ? host.delay : null;

        // Clear HostData While Processes Empty
        if(host.data.status.data.process.length === 0) {
            this.clear();
            return;
        }

        // Update Server Infos
        Object.keys(this.server).forEach(function(key) {
            this.server[key] = host.data.status.data.server[key];
        }.bind(this));

        // Update Monitoring Infos
        Object.keys(this.monitoring).forEach(function(key) {
            this.monitoring[key] = host.data.monitoring[key];
        }.bind(this));

        this._removeMissingProcesses(host.data.status.data.process);
        this._mixProcessExceptions(host.data.status.data.process, host.data['process:exception']);
        this._sortProcessByPmId(host.data.status.data.process);

        host.data.status.data.process.forEach(function(reportedProcess) {
            var existingProcess = this.findProcessByPid(reportedProcess.pid);

            console.log(existingProcess);

            if(!existingProcess) {
                existingProcess = new ProcessData(this._config, reportedProcess);
                this.processes.push(existingProcess);
            }

            existingProcess.update(reportedProcess);
        }.bind(this));

        this._sortProcessByPmId(this.processes);
    };

    HostData.prototype._removeMissingProcesses = function(reportedProcesses) {
        this.processes = this.processes.filter(function(existingProcess) {
            for(var i = 0; i < reportedProcesses.length; i++) {
                if(reportedProcesses[i].name == existingProcess.name &&
                   reportedProcesses[i].pid == existingProcess.pid) {
                    return true;
                }
            }

            return false;
        });
    };

    HostData.prototype.findProcessByPid = function(pid) {
        for(var i = 0; i < this.processes.length; i++) {
            if(this.processes[i].pid == pid) {
                return this.processes[i];
            }
        }

        return null;
    };

    HostData.prototype.clear = function() {
        this.processes = [];
        this.server = {};
        this.monitoring = {};
        this.public_key = null;
        this.sent_at = null;
    };

    HostData.prototype._mixProcessExceptions = function(processes, exceptions) {
        var that = this;

        processes && processes.forEach(function(process) {
            var logs = [];

            exceptions && exceptions.forEach(function(exception) {
                if(exception.data && exception.data.exception) {
                    exception.data.exception.forEach(function(e, index) {
                        if(process.pm_id === e.process.pm_id) {
                            e.data.at = e.at;
                            logs.push(e.data);
                        }
                    });
                }
            });

            that.logs = that.logs || {};
            that.logs[process.pm_id] = logs;
        });
    };

    HostData.prototype._sortProcessByPmId = function(processes) {
        processes.sort(function(a, b) {
            return a.pm_id - b.pm_id;
        });
    };

    var hostListProcess = function(hostList, reportedHostList) {
        reportedHostList.forEach(function(host, index) {
            if(host === null) {
                return;
            }

            var server_name = host.data.server_name;

            if(new Date().getTime() - host.sent_at - __lags > 31000 ||
              host.data.status.data.process.length === 0) {
                console.log('socket data expired or process list is empty');
                console.log('host.sent_at: ' + host.sent_at);
                console.log('time delay: ' + (new Date().getTime() - host.sent_at));
                console.log('server name: ' + host.data.server_name);

                if(location.href.match(/view=live/igm)) {
                    host = { data: { status: { data: { process: [], server: {} } }, monitoring: {} } };
                } else {
                    host.delay = (new Date().getTime() - host.sent_at);
                }
            } else {
                console.log('socket data fetch success');
                console.log('host.sent_at: ' + host.sent_at);
                console.log('time delay: ' + (new Date().getTime() - host.sent_at));
                console.log('server name: ' + host.data.server_name);

                if(host.delay) delete host.delay;
            }

            if(hostList.hasOwnProperty(server_name)) {
                hostList[server_name].update(host);
            } else {
                hostList[server_name] = new HostData(host);
            }

            // Remove HostData While Processes Empty
            if(host.data.status.data.process.length === 0) {
                delete hostList[server_name];
                return;
            }
        });

        updateHostListLength(hostList);
    };

    var updateHostListLength = function(hostList) {
        $scope.hostListLength = Object.keys(hostList).length;
    };

    var socketOptions = { rememberTransport: false };
    var socket = new WebSocket('ws://service.pm25.io:8042');
    var session_id = decodeURIComponent($cookies['connect.sid']).match(/s\:([^.]+)/im)[1];
    var channel = session_id + ':' + __public_key;
    var ask = function() {
        socket.send('ask:-:-:' + JSON.stringify({
            t: new Date().getTime() - __lags,
            public_key: __public_key,
            session_id: session_id
        }));
    };

    $scope.hostList = {};
    $scope.hostListLength = 0;
    $scope.hostListPending = true;
    setTimeout(ask, 1000);

    // socket.io wrapper for clean websocket
    socket.on = (function(channel, handler) {
        var channels = {};
        var messageParse = function(message, data) {
            message = message.split(':-:-:');
            data = message[1];
            message = message[0];

            try {
                data = JSON.parse(data);
            } catch(e) {}

            return [message, data];
        };

        socket.onmessage = function(event, message, data, result) {
            result = messageParse(event.data);
            message = result[0];
            data = result[1];

            if(channels.hasOwnProperty(message)) {
                channels[message].call(this, data);
            }
        };

        return function(channel, handler) {
            channels[channel] = handler;
        };
    })();

    socket.on(channel, function(data) {
        $scope.$apply(function($scope) {
            hostListProcess($scope.hostList, data);
            $scope.hostListPending = false;
        });

        setTimeout(ask, 1000);
    });

    $scope.showDetails = {};

    $scope.toggleDetails = function(pm_id, server_name, pid) {
        $scope.showDetails[pm_id + server_name] = !$scope.showDetails[pm_id + server_name];
    };

    $scope.clearLogs = function(process) {
        process.logs.length = 0;
    };

    $scope.doLogout = function() {
        location.href = 'https://sso.yourdomain.com/logout';
    };

    $scope.triggerManage = function() {
        location.href = '/trigger/' + __bucket + '/' + __public_key;
    };

    $scope.execute = function(server_name, public_key, process_name, method_name, $event) {
        $event.stopPropagation();
        socket.send('execute:-:-:' + JSON.stringify({
            machine_name: server_name,
            public_key: public_key,
            method_name: method_name,
            parameters: {
                name: process_name
            }
        }));
    };

    $scope.filter = {};

}]);
