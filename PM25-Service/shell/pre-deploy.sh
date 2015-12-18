#!/bin/bash
set -e

npm --registry=http://r.npm.yourdomainname.com install
npm outdated --depth=0
