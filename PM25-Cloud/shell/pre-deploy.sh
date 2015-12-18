#!/bin/bash
set -e

export NVM_NODEJS_ORG_MIRROR=http://npm.taobao.org/mirrors/node

NVM_HOME=~/.nvm
PORJECT_HOME=`pwd`

if [ ! -d $NVM_HOME ]; then
    git clone https://github.com/creationix/nvm.git $NVM_HOME && cd $NVM_HOME && git checkout `git describe --abbrev=0 --tags` && cd $PORJECT_HOME
fi

source ~/.nvm/nvm.sh
nvm install 0.12.0
nvm use 0.12.0

npm --registry=http://registry.cnpmjs.org install
npm outdated --depth=0
