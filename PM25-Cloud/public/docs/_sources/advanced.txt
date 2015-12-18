.. PM2.5 documentation master file, created by
   sphinx-quickstart on Mon Jul  6 21:16:59 2015.
   You can adapt this file completely to your liking, but it should at least
   contain the root `toctree` directive.

进阶指南
========

内部实现
--------

**PM2.5的服务架构**

简单介绍下PM2.5的服务架构：生产环境的Node服务通过PM2.5 CLI进行部署，PM2.5 CLI会持续不断的将Node进程的各项数据上报到PM2.5的云端。云端收到上报的数据后会对原始数据进行处理并存储至MongoDB。而Web端和iOS应用都会通过WebSocket服务从服务端获得实时的数据流，然后通过前端进行可视化的信息展示。

.. image:: images/pm25_how_it_works_001.jpg

**PM2.5的内部实现**

当Node进程通过PM2.5启动时，PM2.5 CLI会同云端服务进行握手，握手成功后才会源源不断的进行数据的上报。上报时首先会将数据进行AES256加密，然后使用TCP通信将数据上报到服务器，这里用到了开源的Axon，云端服务器收到数据后会将数据入库存储到MongoDB中，同时会进行监控报警的扫描，如果当前数据符合用户订阅的监控报警条件，则会通过云端的Push服务向iOS客户端推送报警信息。云端同时运行WebSocket服务，为多个终端（Web平台、iOS应用）提供实时数据的推送。

.. image:: images/pm25_how_it_works_002.jpg

这里值得一提的是，PM2.5的客户端是基于React-Native开发，目前已经提交Apple Store正在审核，审核通过后就可以从Apple Store中下载到了，客户端提供了服务和进程基本指标的查看，同时可以配合Web平台的监控报警设置实现7x24小时对服务的监控。

