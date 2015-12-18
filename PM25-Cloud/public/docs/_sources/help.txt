.. PM2.5 documentation master file, created by
   sphinx-quickstart on Mon Jul  6 21:16:59 2015.
   You can adapt this file completely to your liking, but it should at least
   contain the root `toctree` directive.

帮助
====

**1. 为什么我的主机状态当前是飘红的？**

如下图所示，出现这种情况的原因很可能是你的服务端时间同标准时间不同步，或者服务端的数据上报有延迟导致的，飘红状态下会在主机名右侧显示延迟的时间差，如果延迟的时间差居高不下并持续增长则意味着你的服务器可能停止了向服务端的数据上报。

.. image:: images/host_red.png

