#!/bin/bash
set -e

source /usr/local/nvm/nvm.sh
nvm use 0.12.0
node --version
gulp default

./node_modules/.bin/pm25 kill
./node_modules/.bin/pm25 start index.js -i max -o /opt/logs/wwwlogs/pm25.out.log -e /opt/logs/wwwlogs/pm25.err.log
