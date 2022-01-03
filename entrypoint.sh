#!/usr/bin/env sh

source /etc/profile
dataplane-sdk-entrypoint

if [ $? -ne 0 ]; then
  exit 1
else
  cd /sdk-repos
  sh
fi
