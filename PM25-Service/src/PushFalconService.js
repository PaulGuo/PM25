/* jshint node: true */
'use strict';

var Falcon = require('open-falcon').init('http://127.0.0.1:1988/v1/push', 'pm25');
var falcon = new Falcon({ step: 60 });

function pushDataHandler(data, options = undefined) {
    options = {
        type: 'pm25',
        server_name: data.server_name,
        endpoint: data.server_name.split('.')[0]
    };

    if(!data.monitoring['req/sec']) {
        data.monitoring['req/sec'] = 0;
    }

    if(!data.monitoring['current_req_processed']) {
        data.monitoring['current_req_processed'] = 0;
    }

    if(!data.monitoring['restart_time']) {
        data.monitoring['restart_time'] = 0;
    }

    if(!data.monitoring['pmx_http_latency']) {
        data.monitoring['pmx_http_latency'] = 0;
    }

    for(var i = 0; i < data.status.data.process.length; i++) {
        var process = data.status.data.process[i];

        falcon
            .gauge('pm25.process.' + process.pm_id + '.restart_time', process.restart_time, options)
            .gauge('pm25.process.' + process.pm_id + '.status', process.status, options)
            .gauge('pm25.process.' + process.pm_id + '.cpu', process.cpu, options)
            .gauge('pm25.process.' + process.pm_id + '.memory', process.memory, options);

        data.monitoring['restart_time'] = data.monitoring['restart_time'] + process.restart_time;

        if(process.axm_monitor) {
            if(process.axm_monitor['req/sec']) {
                falcon.gauge('pm25.process.' + process.pm_id + '.req/sec', process.axm_monitor['req/sec'].value, options);
                data.monitoring['req/sec'] = data.monitoring['req/sec'] + Number(process.axm_monitor['req/sec'].value);
            }

            if(process.axm_monitor['Current req processed']) {
                falcon.gauge('pm25.process.' + process.pm_id + '.current_req_processed', process.axm_monitor['Current req processed'].value, options);
                data.monitoring['current_req_processed'] = data.monitoring['current_req_processed'] + Number(process.axm_monitor['Current req processed'].value);
            }

            if(process.axm_monitor['pmx:http:latency']) {
                falcon.gauge('pm25.process.' + process.pm_id + '.pmx_http_latency', parseFloat(process.axm_monitor['pmx:http:latency'].value), options);
                data.monitoring['pmx_http_latency'] = data.monitoring['pmx_http_latency'] + parseFloat(process.axm_monitor['pmx:http:latency'].value);
            }
        }
    }

    if(data.monitoring) {
        falcon
            .gauge('pm25.monitoring.loadavg.1min', data.monitoring.loadavg[0], options)
            .gauge('pm25.monitoring.loadavg.5min', data.monitoring.loadavg[1], options)
            .gauge('pm25.monitoring.loadavg.20min', data.monitoring.loadavg[2], options)
            .gauge('pm25.monitoring.total_mem', data.monitoring.total_mem, options)
            .gauge('pm25.monitoring.free_mem', data.monitoring.free_mem, options)
            .gauge('pm25.monitoring.req/sec', data.monitoring['req/sec'], options)
            .gauge('pm25.monitoring.current_req_processed', data.monitoring.current_req_processed, options)
            .gauge('pm25.monitoring.pmx_http_latency', data.monitoring.pmx_http_latency, options)
            .gauge('pm25.monitoring.restart_time', data.monitoring.restart_time, options);
    }

    return data;
}

module.exports = {
    pushData: pushDataHandler
};
