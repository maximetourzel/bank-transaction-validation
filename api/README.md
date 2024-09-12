# **Bank Sync Validations API**

This project is a **NestJS**-based API designed for validating bank movements and balance checkpoints during financial reconciliation. The API supports functionalities like validating movements for specific periods, detecting potential duplicates, and managing the synchronization of banking data. It uses **PostgreSQL** as the database and supports **end-to-end (E2E) testing** with a clean database.

## Table of Contents

- [**Bank Sync Validations API**](#bank-sync-validations-api)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Architecture](#architecture)
  - [Setup](#setup)
    - [Requirements](#requirements)
    - [Installation](#installation)
    - [Environment Variables](#environment-variables)
  - [Running the Application](#running-the-application)
    - [Development](#development)
    - [Testing](#testing)
      - [Unit tests](#unit-tests)
      - [End-to-End Tests](#end-to-end-tests)
  - [API Documentation](#api-documentation)
  - [Project Structure](#project-structure)

## Features

- **Create, read, and delete bank validation records**: Support for creating validations based on bank movements and balance checkpoints.
- **Validation logic**:
  - Check for missing movements and checkpoints.
  - Validate balance mismatches between movements and checkpoints.
  - Detect potential duplicate bank movements.
- **Historical validation tracking**: Manage versions of validations, marking older ones as historical.
- **Automated tests**: Comprehensive unit and E2E testing with PostgreSQL.
- **Swagger API documentation** for easy interaction and visualization of API endpoints.

## Architecture

- **NestJS**: A progressive Node.js framework for building efficient and scalable server-side applications.
- **PostgreSQL**: A robust and open-source relational database system for storing validation and reconciliation data.
- **TypeORM**: An ORM (Object Relational Mapper) framework that works with PostgreSQL to map TypeScript entities to database tables.
- **Swagger**: Auto-generated API documentation.
- **Jest**: For unit and end-to-end testing.

## Setup

### Requirements

- **Node.js** (v20 or higher)
- **PostgreSQL** (v13 or higher)
- **Docker** (for running PostgreSQL in a container during testing)
- **Nest CLI** (globally installed)

### Installation

1. **Clone the repository**:

    ```bash
    git clone https://github.com/maximetourzel/bank-transaction-validation
    cd bank-transaction-validation/api
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

3. **Set up your PostgreSQL database**:

    Ensure you have PostgreSQL installed locally or running via Docker ([See here](../README.md#docker-setup)), and create a database for the project.
  
### Environment Variables
Create a **.env.developement** file in the root of the project and set the following environment variables:

```ini
# PostgreSQL Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your-db-username
DB_PASSWORD=your-db-password
DB_DATABASE=your-db-name
```

## Running the Application

### Development

To start the development server, run:
```bash
npm run start:dev
```

This will start the NestJS application on the port 3000. The API will be accessible at http://localhost:3000/.

### Testing

#### Unit tests

To run the unit tests, use:
```bash
npm run test
```

#### End-to-End Tests

E2E tests use PostgreSQL for integration. Ensure the database is properly configured for testing. To use docker test container make sure to run the docker compose ([See here](../README.md#docker-setup))

To run the unit tests, use:
```bash
npm run test:e2e
```

## API Documentation

This project uses Swagger to provide an interactive API documentation interface. Once the application is running, you can access the Swagger UI at http://localhost:3000/api

## Project Structure

```plaintext
test/                                         # e2e folder
src/
│
├── bank-sync-validations/
│   ├── bank-sync-validations.controller.ts   # Controller for the Bank Sync Validation routes
│   ├── bank-sync-validations.service.ts      # Service implementing validation logic
│   ├── entities/                             # TypeORM entities for the validation
|   ├── dto/                                  # Dto
│   ├── interfaces/                           # Classes for validation errors
│
├── bank-movements/                           # Module for handling bank movements
│
├── balance-checkpoints/                      # Module for handling balance checkpoints
│
├── periods/                                  # Module for handling periods
│
├── config/                                   # Typeorm service config
│
├── main.ts                                   # Application entry point
│
├── app.module.ts                             # Main module file
```
