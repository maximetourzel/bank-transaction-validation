# Bank Synchronization Project

[![Dougs Logo](https://cdn-images.welcometothejungle.com/qAwE90kqjR9uItnrfyPK8vuz4lfHMLAexVOCIzjD1ZE/rs:auto:2000:450:/g:fp:0:0.5/q:85/czM6Ly93dHRqLXByb2R1Y3Rpb24vdXBsb2Fkcy93ZWJzaXRlX29yZ2FuaXphdGlvbi9jb3Zlcl9pbWFnZS93dHRqX2ZyL2ZyLWI5MDg3NTk2LTU4NzEtNDkwMi1hMDQ3LTUwMTE0NWM5NzU4NS5qcGc)](https://www.dougs.fr/)

This project is developed as part of a technical test for an interview with **Dougs**, a French online accounting firm. The objective of this test is to demonstrate the ability to design and implement a bank synchronization system using **NestJS** technology. The project includes a backend API to handle bank movements and validations, a frontend (currently in development), and a Docker setup for easy development and testing environments.

---

# **Project Overview**

This project is a financial management platform that consists of the following components:

- **API**: A NestJS-based backend handling bank synchronization, validations, movements, and balance checkpoints.
- **Frontend**: An Angular application (currently under development) to interact with the API.
- **Docker**: A setup using Docker Compose to provision essential services like PostgreSQL for development and testing, along with PgAdmin for database management.

## **Project Structure**

```plaintext
/
├── api/                        # Backend API built with NestJS
├── frontend/                   # Frontend application in Angular (under development)
├── docker/                     # Docker Compose setup for database and other services
│   ├── docker-compose.yaml     # Defines PostgreSQL, PgAdmin, and future services
```

## API

The API handles all business logic, data validation, and communication with the PostgreSQL database. The validation logic ensures that bank movements align with balance checkpoints, flagging any discrepancies for review.

For more details on the API, including setup, endpoints, and testing, please see the [API README](api/README.md).

## Frontend (Work in Progress)

The frontend, under development with Angular, will allow users to interact with the backend for managing their financial data. It will offer a user-friendly interface for validating bank movements, viewing reports, and correcting errors.

## Docker Setup

The Docker Compose setup currently includes:

- **PostgreSQL**: The database used for storing all financial data.
- **PgAdmin**: A web-based interface for managing PostgreSQL databases.
- **Future Expansion**: The Docker setup will be expanded to include the Angular frontend as a service.

To set up the development environment with Docker, run:

1. Navigate to the ```docker/``` directory:
2. Start the containers:
    ```bash
    docker-compose up -d
    ```
    This command starts the PostgreSQL (dev and test) and PgAdmin services in the background.

3. PostgreSQL for developpement will be running at ```localhost:5432``` and PostgreSQL for tests at ```localhost:5434```

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