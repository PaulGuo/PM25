.. PM2.5 documentation master file, created by
   sphinx-quickstart on Mon Jul  6 21:16:59 2015.
   You can adapt this file completely to your liking, but it should at least
   contain the root `toctree` directive.

简介
====

PM2是一款优秀且开源的Node进程管理工具。我们在PM2的基础上做了一些改造，同时在云端部署了数据收集、数据实时获取的服务，从而形成了我们目前已经应用到线上的Node部署监控平台PM2.5，它可以将线上Node服务进程级别的细粒度信息聚合在云端进行处理和可视化展现，PM2.5能够监控Node Server和进程的各项指标状态，且可以配置报警并在各终端（Web、iPhone、Apple Watch）展示。

服务架构
--------

简单介绍下PM2.5的服务架构：生产环境的Node服务通过PM2.5 CLI进行部署，PM2.5 CLI会持续不断的将Node进程的各项数据上报到PM2.5的云端。云端收到上报的数据后会对原始数据进行处理并存储至MongoDB。而Web端和iOS应用都会通过WebSocket服务从服务端获得实时的数据流，然后通过前端进行可视化的信息展示。

功能简介
--------

* 进程数
* CPU数
* CPU负载
* 上线时长
* 内存占用情况
* 进程详细信息（PID、重启次数、上线时长、内存占用、错误日志）
* 7x24 实时监控报警

