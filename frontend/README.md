# **Bank Sync Validations Frontend**

This project is the frontend for the **Bank Synchronisation Validation** application. It is built using **Angular 18** and is designed to interface with the backend **API**, providing users with the ability to manage bank movements, checkpoints, and validation periods.

## Table of Contents

- [Installation](#installation)
- [Development](#development)
- [Building](#building)
- [Testing](#testing)
- [Docker Setup](#docker-setup)
- [Usage](#usage)
- [Features](#features)
- [Project Structure](#project-structure)

## Installation

Before starting, ensure you have **Node.js (20+)** and **npm** installed on your machine.

### 1. Clone the Repository

```bash
git clone https://github.com/maximetourzel/bank-transaction-validation.git
cd bank-transaction-validation/frontend
```

### 2. Install Dependencies

Run the following command to install the necessary packages:

```bash
npm install
```

## Development

To run the application in development mode, use the following command:

```bash
npm run start
```

This will start a local development server and the application will be available at http://localhost:4200.

### API Connection

By default, the application is set up to connect to the **Bank Synchronisation Validation API** running on http://localhost:3000. If your backend is hosted elsewhere, you can update the API endpoint in ``src/environments/environment.ts``

```ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',
};
```

## Build

To build the project for production, run:

```bash
npm run build
```

This will compile the project and output the static files to the dist/ folder. The application is then ready to be served by a web server like Nginx.

## Testing (under development)

## Usage

Once the frontend is running, you can interact with the system by:

- **Choosing or creating a period** for which you want to view or manage bank movements and checkpoints.
- **Adding bank movements** for the selected period.
- **Creating balance checkpoints.**
- **Validations will be run automatically** to ensure that the bank movements and balance checkpoints are consistent.

## Features

- Create, update, and delete bank movements and balance checkpoints.
- Manage validation periods.
- Perform bank synchronisation validation checks for:
    - Missing movements
    - Missing checkpoints
    - Balance mismatches
    - Potential Movement Duplicates
    - Unexpected Amount for movement (threshhold hardcoded : 10000)

## Project structure (to be implemented)

The frontend will follow the standard Angular structure, with some additional folders for domain-specific logic.

```
src/
  ├── app/
  │   ├── core/                    # Core modules and services
  │   ├── features/                # Feature modules (e.g., Periods, Movements, Checkpoints)
  │   ├── shared/                  # Shared components and services
  │   ├── app.module.ts            # Main module file
  │   └── app.component.ts         # Root component
  ├── assets/                      # Static assets (images, fonts, etc.)
  ├── environments/                # Environment configuration files
  ├── index.html                   # Main HTML file
  └── styles.css                   # Global styles
```