#!/bin/bash
set -e

source /usr/local/nvm/nvm.sh
nvm use 0.12.0
node --version

./node_modules/babel/bin/babel.js --stage 0 ./src --out-dir ./build
./node_modules/.bin/pm25 kill
./node_modules/.bin/pm25 start ./build/PullInteractorService.js -i max -o /opt/logs/wwwlogs/PullInteractorService.out.log -e /opt/logs/wwwlogs/PullInteractorService.err.log
./node_modules/.bin/pm25 start ./build/RealTimeWebSocket.js -i max -o /opt/logs/wwwlogs/RealTimeWebSocket.out.log -e /opt/logs/wwwlogs/RealTimeWebSocket.err.log
./node_modules/.bin/pm25 start ./build/index.js -i max -o /opt/logs/wwwlogs/index.out.log -e /opt/logs/wwwlogs/index.err.log
./node_modules/.bin/pm25 start ./build/ReverseInteractorService.js -i max -o /opt/logs/wwwlogs/ReverseInteractorService.out.log -e /opt/logs/wwwlogs/ReverseInteractorService.err.log
