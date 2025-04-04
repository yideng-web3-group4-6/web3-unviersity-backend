#!/bin/bash

if [ -z "$1" ]; then
    echo "❌ Environment parameter is required! Please use: ./sam-build.sh [development|production|test]"
    exit 1
fi

ENV=$1
ENV_FILE=".env.$ENV"

if [ ! -f "$ENV_FILE" ]; then
    echo "❌ Environment file $ENV_FILE does not exist!"
    exit 1
fi

# 清理旧的构建文件
echo "🧹 Cleaning up old build files..."
rm -rf dist/
rm -rf .aws-sam/
rm -rf layer/

# 创建必要的目录
mkdir -p dist/
mkdir -p layer/{core,database,aws,auth,utils}/nodejs

# 构建 NestJS 应用
echo "🏗️ Building NestJS application..."
pnpm run build

# 设置 Lambda Layers
echo "📦 Setting up Lambda layers..."

# Core Layer
echo "📦 Setting up Core layer..."
cat > layer/core/nodejs/package.json << EOF
{
  "dependencies": {
    "@nestjs/common": "^9.4.3",
    "@nestjs/config": "^3.1.1",
    "@nestjs/core": "^9.4.3",
    "@nestjs/platform-express": "^9.4.3",
    "reflect-metadata": "^0.1.13",
    "rxjs": "^7.2.0"
  }
}
EOF

# Database Layer
echo "📦 Setting up Database layer..."
cat > layer/database/nodejs/package.json << EOF
{
  "dependencies": {
    "@nestjs/typeorm": "^9.0.1",
    "typeorm": "^0.3.21",
    "mysql2": "^3.14.0"
  }
}
EOF

# AWS Layer
# echo "📦 Setting up AWS layer..."
# cat > layer/aws/nodejs/package.json << EOF
# {
#   "dependencies": {
#     "@aws-sdk/client-rds": "^3.777.0",
#     "@aws-sdk/client-s3": "^3.777.0",
#     "@aws-sdk/lib-storage": "^3.777.0",
#     "@aws-sdk/rds-signer": "^3.778.0",
#     "@aws-sdk/s3-request-presigner": "^3.779.0"
#   }
# }
# EOF

# Auth Layer
echo "📦 Setting up Auth layer..."
cat > layer/auth/nodejs/package.json << EOF
{
  "dependencies": {
    "@nestjs/passport": "^10.0.3",
    "@nestjs/jwt": "^10.2.0",
    "passport": "^0.7.0",
    "passport-jwt": "^4.0.1"
  }
}
EOF

# Utils Layer
echo "📦 Setting up Utils layer..."
cat > layer/utils/nodejs/package.json << EOF
{
  "dependencies": {
    "@nestjs/swagger": "^7.0.0",
    "class-transformer": "^0.5.1",
    "class-validator": "^0.14.1",
    "@vendia/serverless-express": "^4.12.6"
  }
}
EOF

# 在每个 layer 中安装依赖
echo "📦 Installing dependencies for all layers..."
for layer in core database auth utils; do
    echo "📦 Installing dependencies for $layer layer..."
    cd layer/$layer/nodejs
    pnpm install --prod
    echo "📊 $layer layer size:"
    du -sh node_modules/
    cd ../../..
done

# 准备函数部署包
echo "📦 Preparing function package..."
cp "$ENV_FILE" "dist/.env"

# 执行 sam build 和部署
echo "🚀 Running sam build..."
sam build --skip-pull-image

if [ $? -eq 0 ]; then
    if [ "$ENV" = "production" ] || [ "$ENV" = "test" ]; then
        echo "🚀 Deploying to production..."
        sam deploy -g
    else
        echo "🌍 Starting local API..."
        sam local start-api --warm-containers EAGER
    fi
else
    echo "❌ Sam build failed!"
    exit 1
fi