# FixFlow roadmap

## Phase 1 - Foundation

- Initialize monorepo structure
- Set up Java backend and React frontend
- Add PostgreSQL through Docker
- Define domain enums and workflow rules
- Create health endpoint and base security config

## Phase 2 - Core domain

- Create `User`, `Organization`, `Property`, `Unit`, and `MaintenanceRequest` entities
- Add Flyway migration scripts
- Implement request creation and lifecycle validation
- Build repository layer with filtering and pagination

## Phase 3 - Access control and business logic

- Add authentication, JWT, and RBAC
- Implement status transition service
- Add technician assignment algorithm
- Build SLA status calculations and scheduler

## Phase 4 - User experience

- Create customer dashboard and request form
- Add technician dashboard with job queue
- Add manager overview and analytics
- Add notification and audit views

## Phase 5 - Operations

- Add Azure Blob upload metadata handling
- Add email notifications and async processing
- Add integration tests with Testcontainers
- Add GitHub Actions CI/CD workflow

## Phase 6 - Deployment

- Deploy backend and frontend to Azure
- Configure environment variables and secrets
- Enable monitoring and basic observability
- Prepare project for portfolio presentation
