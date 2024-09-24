# Bank Synchronization Project

[![Dougs Logo](https://cdn-images.welcometothejungle.com/qAwE90kqjR9uItnrfyPK8vuz4lfHMLAexVOCIzjD1ZE/rs:auto:2000:450:/g:fp:0:0.5/q:85/czM6Ly93dHRqLXByb2R1Y3Rpb24vdXBsb2Fkcy93ZWJzaXRlX29yZ2FuaXphdGlvbi9jb3Zlcl9pbWFnZS93dHRqX2ZyL2ZyLWI5MDg3NTk2LTU4NzEtNDkwMi1hMDQ3LTUwMTE0NWM5NzU4NS5qcGc)](https://www.dougs.fr/)

This project is developed as part of a technical test for an interview with **Dougs**, a French online accounting firm. The objective of this test is to demonstrate the ability to design and implement a bank synchronization system using **NestJS** technology. The project includes a backend API to handle bank movements and validations, a frontend using **Angular**, and a Docker setup for easy development and testing environments.

---

# **Project Overview**

This project is a financial management platform that consists of the following components:

- **API**: A NestJS-based backend handling bank synchronization, validations, movements, and balance checkpoints.
- **Frontend**: An Angular application to interact with the API.
- **Docker**: A setup using Docker Compose to provision essential services like PostgreSQL for development and testing, along with PgAdmin for database management.

## **Project Structure**

```plaintext
/
├── api/                        # Backend API built with NestJS
├── frontend/                   # Frontend application in Angular
├── docker/                     # Docker Compose setup for database and other services
│   ├── docker-compose.yaml     # Defines PostgreSQL, PgAdmin, and future services
```

## API

The API handles all business logic, data validation, and communication with the PostgreSQL database. The validation logic ensures that bank movements align with balance checkpoints, flagging any discrepancies for review.

For more details on the API, including setup, endpoints, and testing, please see the [API README](api/README.md).

## Frontend (Work in Progress)

The frontend, under development with Angular, will allow users to interact with the backend for managing their financial data. It will offer a user-friendly interface for validating bank movements, viewing reports, and correcting errors.

## Docker Setup

This project provides two Docker Compose configurations:

1. **Development Environment** (`docker-compose.dev.yml`):
   - Sets up the following containers:
     - **PostgreSQL** for development (port 5432)
     - **PostgreSQL** for e2e testing (port 5434)
     - **pgAdmin** for managing the databases (port 5050)
     - **SonarQube** for code quality analysis (port 9000)

2. **Production/Build Environment** (`docker-compose.prod.yml`):
   - Sets up:
     - **PostgreSQL** for the production environment
     - **API** container that builds and runs the API connected to the PostgreSQL container

### Development Setup

To bring up the development environment, including multiple PostgreSQL containers, pgAdmin, and SonarQube, use the following command:

```bash
docker-compose -f docker-compose.dev.yml up --build
```
After running the command, the services will be available on the following ports:

- **PostgreSQL** (dev) on `localhost:5432`
- **PostgreSQL** (test) on `localhost:5434`
- **pgAdmin** on `localhost:5050`
- **SonarQube** on `localhost:9000`

### Production Setup

To bring up the production environment with the API and PostgreSQL, use:

```bash
docker-compose -f docker-compose.prod.yml up --build
```

This will set up:

- **PostgreSQL** for production on port `5432`
- **API** on port `3000`
- **Frontend** on port `4200`


# Getting Started

1. **Clone the repository**:
    ```bash
    git clone https://github.com/maximetourzel/bank-transaction-validation
    cd bank-transaction-validation
    ```
2. **Set up Docker containers**: 
Navigate to the ``docker/`` folder and run:
    ```bash
    docker-compose up -d
    ```

# Future Plans

- **Frontend Development**: 
Continue building the Angular-based frontend and integrate it with the backend.
- **Testing**:
Expand test coverage with e2e tests for both the frontend and backend.
- **Dockerization**:
Once the frontend is fully developed, include it in the Docker Compose configuration to provide a seamless full-stack development experience.