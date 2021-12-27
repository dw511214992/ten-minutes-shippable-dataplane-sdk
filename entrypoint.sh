#!/usr/bin/env sh
dataplane-sdk-entrypoint

if [ $? -ne 0 ]; then
  exit 1
else
  cd /sdk-repos
  sh
fi
