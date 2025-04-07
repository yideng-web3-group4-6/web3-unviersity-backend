#!/bin/bash
pnpm nx build user-service
cp -r dist/apps/user-service infrastructure/user-service/build/