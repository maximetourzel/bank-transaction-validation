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
  - [Example Usage](#example-usage)

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

If you prefer to use Postman for interacting with the API, you can generate a collection by importing the Swagger JSON file.

1. Go to: [http://localhost:3000/api-json](http://localhost:3000/api-json)
2. Copy the JSON content.
3. Open Postman, navigate to **File** > **Import**, and select the **Raw Text** option.
4. Paste the copied JSON, then click **Continue**.
5. A new collection will be created in Postman with all available API endpoints.

This allows you to easily test the API using Postman and reuse requests for testing or development purposes.

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

## Example Usage

Here's an example workflow that demonstrates how to use the API to create a period, validate it, handle validation errors, and then resolve them by adding movements and a balance checkpoint.

### Step 1: Create a Period

First, create a new period. This period will represent a specific month and year.

**Endpoint**: `POST /periods`

**Request Body**:
```json
{
  "year": 2024,
  "month": "septembre"
}
```
**Response**
```json
{
  "id": "b2c8c9b6-0b7a-4a6f-9c1d-2e3f4a5b6c7d",
  "year": 2024,
  "month": "septembre",
  "startDate": "2024-09-01T00:00:00.000Z",
  "endDate": "2024-09-30T23:59:59.000Z"
}
```

### Step 2: Create a Validation for the Period

Now that the period is created, let's validate it. This will check if the period has necessary movements and balance checkpoints.

**Endpoint**: `POST /periods/{periodId}/validations`

- Replace `{periodId}` with the ID of the period you just created.

**Response**
```json
{
    "isValid": false,
    "validationErrors": [
        {
            "type": "MISSING_MOVEMENTS",
            "message": "No movements found"
        },
        {
            "type": "MISSING_CHECKPOINT",
            "message": "No checkpoint found"
        }
    ],
    "previousValidation": null,
    "id": "202d1a6b-8fc4-42d4-9d54-41f0b9e2691b",
    "isHistorical": false,
}
```

This indicates that the period has no movements and no balance checkpoints yet, which need to be addressed.

### Step 3: Add Bank Movements

Next, let's add some bank movements for the period.

**Endpoint**: `POST /periods/{periodId}/movements`

- Replace `{periodId}` with the ID of your period.

**Request Body**:

```json
{
  "date": "2024-09-15",
  "wording": "Salary",
  "amount": 3000
}

```

**Response**
```json
{
  "id": "1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed",
  "date": "2024-09-15",
  "wording": "Salary",
  "amount": 3000
}

```

### Step 4: Add a Balance Checkpoint

After adding a movement, we need to add a balance checkpoint for the period.

**Endpoint**: `POST /periods/{periodId}/checkpoints`

**Request Body**:

```json
{
  "date": "2024-09-30",
  "balance": 3000
}
```

**Response**
```json
{
  "id": "d9b6bcd-bbfd-4b2d-9b5d-1c8a9b6f1ebd",
  "date": "2024-09-30",
  "balance": 3000
}
```

### Step 5: Revalidate the Period

Now that we have both movements and a balance checkpoint for the period, we can validate it again.

**Endpoint**: `POST /periods/{periodId}/validations`

**Response**:

```json
{
  "isValid": true,
  "errors": {}
}
```

### Step 6: Validation Errors Explained

When validating a period, the system checks whether certain financial data is complete and consistent. Below are the possible validation errors you might encounter:

- **MISSING_CHECKPOINT**: This error occurs when no balance checkpoints are set for the period. A balance checkpoint is required to ensure that the account's balance is correctly recorded at a specific date.

- **MISSING_MOVEMENTS**: This error is triggered when there are no bank movements associated with the period. Bank movements represent financial transactions, and their absence suggests incomplete financial data for the period.

- **BALANCE_MISMATCH**: This error indicates a discrepancy between the balance in the checkpoints and the expected balance based on the movements recorded. It suggests that the movements and checkpoints are not aligning correctly.


- **UNEXPECTED_AMOUNT**: This error occurs when there are movements with unexpected amounts. It will consider a movement as having an unexpected amount if the absolute value of the amount is greater than a given threshold (Currently hardcoded, threshold = 10000)

- **POTENTIAL_MOVEMENT_DUPLICATE**: This warning indicates that there are movements that might be duplicates based on similar date, amount, or wording, but they are not exact duplicates. It serves as a caution to review those movements for potential redundancy.
