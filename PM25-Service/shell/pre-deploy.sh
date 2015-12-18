#!/bin/bash
set -e

npm --registry=http://registry.cnpmjs.org install
npm outdated --depth=0
