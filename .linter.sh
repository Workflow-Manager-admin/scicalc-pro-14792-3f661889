#!/bin/bash
cd /home/kavia/workspace/code-generation/scicalc-pro-14792-3f661889/scicalc_pro
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

