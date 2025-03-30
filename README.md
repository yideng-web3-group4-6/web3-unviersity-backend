# Yideng University Backend Service

Yideng University is a comprehensive education platform that integrates both Web3 and traditional Web2 functionalities. This backend service is built with NestJS and Node.js v20 using TypeScript, and is designed to provide secure and scalable APIs for user management, video uploads, course management, and blockchain contract interactions.

## Table of Contents
- [Overview](#overview)
- [Modules](#modules)
- [Technologies](#technologies)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [Future Plans](#future-plans)
- [License](#license)

## Overview
This backend service combines Web2 and Web3 functionalities to support:
- **User Management**: Wallet-signature based login, JWT authentication, and user profile management.
- **Video Courses**: Video file uploads, course data management, and purchase workflows.
- **Blockchain Integration**: Interacting with smart contracts for token issuance, NFT minting, and DAO governance (to be integrated in the future).
- **API Documentation**: Auto-generated API docs via Swagger.
- **Global Error Handling**: Unified error responses and logging.

## Modules
The project is organized into the following modules:
- **UserModule**: Manages user registration, wallet signature login, JWT authentication, and profile updates.
- **CourseModule**: Handles course creation, editing, querying, and purchase records.
- **VideoModule**: Provides video file upload functionality using Multer and integrates with cloud/local storage.
- **ContractModule**: Encapsulates smart contract interactions (e.g., token issuance, NFT minting, DAO voting).
- **Common**: Contains global exception filters, guards, and interceptors.

> **Note:** The admin management and SEO features are implemented on the front-end using NextJS, with internationalization to be added later.

## Technologies
- **Framework**: NestJS (Node.js v20, TypeScript)
- **Database**: MySQL via TypeORM (using AWS RDS or local MySQL)
- **Authentication**: Wallet signature verification, JWT-based authentication
- **File Uploads**: Multer (via @nestjs/platform-express)
- **Blockchain Interaction**: ethers.js for smart contract operations
- **API Documentation**: @nestjs/swagger and Swagger UI

## Installation
Ensure you have Node.js v20 and pnpm installed. Then, in the project root directory, run:
```bash
pnpm install
```
Configuration

Create a .env file in the root directory with the following settings:
```env
  # Database configuration
  DB_TYPE=mysql
  DB_HOST=localhost
  DB_PORT=3306
  DB_USERNAME=root
  DB_PASSWORD=your_password
  DB_NAME=yideng_university
  DB_SYNC=true

  # JWT configuration
  JWT_SECRET=your_jwt_secret

  # Blockchain configuration (for future use)
  RPC_URL=https://goerli.infura.io/v3/YOUR_INFURA_API_KEY
  CONTRACT_ADDRESS=0xYourContractAddress
  PRIVATE_KEY=0xYourPrivateKey
```
For AWS RDS, set DB_HOST to your RDS endpoint and ensure proper security group settings.

Running the Application

Start the development server with:
``` bash
pnpm run start:dev
```
All API endpoints use a global prefix /api. For example:
	•	Video upload: POST http://localhost:3000/api/video/upload
	•	User login: POST http://localhost:3000/api/user/login

Future Plans
	•	Database Migrations: Transition from synchronize: true to managed migrations for production.
	•	Blockchain Features: Enhance the ContractModule with token, NFT, and DAO functionalities.
	•	Logging & Monitoring: Integrate centralized logging (Winston/Pino) and monitoring tools (Prometheus, Grafana).
	•	CI/CD Pipeline: Set up automated testing and deployment with GitHub Actions or similar services.
	•	Internationalization: Add multi-language support in future releases.

License

This project is licensed under the MIT License.