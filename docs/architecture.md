# FixFlow architecture

## Overview

FixFlow is designed as a production-style maintenance operations platform for property businesses. The architecture follows a standard full-stack application pattern with a Java Spring Boot API, a React frontend, and a PostgreSQL database.

## Main components

### Frontend

- React + TypeScript
- Tailwind-based UI
- Customer, technician, manager dashboards
- Role-aware navigation and API integration

### Backend

- Spring Boot 3
- Spring Security + JWT
- REST controllers and service layers
- Domain-driven workflow validation
- Scheduled SLA monitoring and notifications

### Data layer

- PostgreSQL database
- Flyway migrations
- JPA entities and repositories
- PostgreSQL-native constraints and indexing

### Cloud integration

- Azure Blob Storage for attachments
- Azure Container Apps or App Services for deployment
- Azure Database for PostgreSQL
- Application Insights for logging and monitoring

## Domain flow

1. Customer creates maintenance request
2. Manager reviews and triages request
3. Technician is assigned through scoring engine
4. Request moves through workflow states
5. SLA job checks risk and overdue conditions
6. Notifications are sent to relevant users
7. Completion and verification are recorded
8. Audit events capture each important action

## Suggested package layout

```text
backend/
  src/main/java/com/fixflow/
    config/
    controller/
    domain/
    dto/
    entity/
    exception/
    mapper/
    repository/
    scheduler/
    security/
    service/
```

## MVP priorities

- Authentication and access control
- Status transition enforcement
- Request lifecycle logic
- Assignment and SLA logic
- Audit logging and notifications
- File upload metadata handling
- Dashboard analytics
- Docker and CI/CD deployment setup
