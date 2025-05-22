# 🏥 Medical Scheduling Backend

[![Serverless](https://img.shields.io/badge/Serverless-Framework-FF4F8B?logo=serverless&logoColor=white)](https://www.serverless.com/)
[![AWS](https://img.shields.io/badge/AWS-FF9900?logo=amazonaws&logoColor=white)](https://aws.amazon.com/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A highly scalable, serverless backend for managing medical appointments, built with AWS Lambda, API Gateway, DynamoDB, and other AWS services. This project follows clean architecture principles and is designed for high availability and scalability.

## 🌟 Features

- **RESTful API** for managing medical appointments
- **Multi-region support** for Chile (CL) and Peru (PE)
- **Event-driven architecture** using AWS EventBridge
- **Asynchronous processing** with SQS queues
- **Real-time notifications** via SNS
- **Infrastructure as Code** with Serverless Framework
- **TypeScript** for type safety and better developer experience
- **Comprehensive testing** with Jest
- **API documentation** with OpenAPI/Swagger

## 🚀 Quick Start

### Prerequisites

- Node.js 20.x
- npm 9.x or yarn 1.22.x
- AWS CLI configured with appropriate credentials
- Serverless Framework 3.x

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/medical-scheduling-backend.git
cd medical-scheduling-backend

# Install dependencies
npm install

# Install Serverless Framework globally (if not already installed)
npm install -g serverless
```

### Configuration

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Update the `.env` file with your configuration:
   ```env
   # AWS Configuration
   AWS_ACCOUNT_ID=your-account-id
   AWS_REGION=us-east-1
   
   # Database Configuration
   RDS_HOST=your-rds-host
   RDS_PORT=5432
   RDS_USER=your-db-user
   RDS_PASSWORD=your-db-password
   RDS_DATABASE=medical_scheduling
   
   # Environment (dev, staging, production)
   NODE_ENV=development
   ```

### Local Development

```bash
# Start local development server with hot-reload
npm run dev

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix
```

### Deployment

Deploy to AWS:

```bash
# Deploy to development environment
npm run deploy:dev

# Deploy to production
npm run deploy:prod

# Remove all resources
npm run remove
```

## 📚 API Documentation

Once deployed, you can access the interactive API documentation at:
- Development: https://{api-id}.execute-api.{region}.amazonaws.com/dev/docs
- Production: https://{api-id}.execute-api.{region}.amazonaws.com/prod/docs

### Available Endpoints

#### Appointments

- `POST /appointments` - Create a new appointment
  ```json
  {
    "patientId": "123e4567-e89b-12d3-a456-426614174000",
    "doctorId": "123e4567-e89b-12d3-a456-426614174001",
    "appointmentDate": "2025-06-01T14:00:00Z",
    "duration": 30,
    "country": "CL",
    "reason": "Annual checkup"
  }
  ```

- `GET /appointments/{appointmentId}` - Get appointment by ID
- `GET /appointments/patient/{patientId}` - Get appointments by patient ID
- `PUT /appointments/{appointmentId}` - Update an appointment
- `DELETE /appointments/{appointmentId}` - Cancel an appointment

## 🏗 Project Structure

```
src/
├── adapters/           # External service integrations
│   ├── dynamodb/       # DynamoDB repositories
│   ├── eventbridge/    # Event publishers
│   ├── rds/            # Relational database access
│   ├── sns/            # Notification publishers
│   └── sqs/            # Queue consumers
├── application/        # Business logic and use cases
│   └── appointment/    # Appointment-specific logic
├── domain/             # Core business models and interfaces
│   └── appointment/    # Appointment domain models
├── handler/            # AWS Lambda entry points
│   ├── api/            # REST API handlers
│   └── queue/          # Queue processors
└── infrastructure/     # AWS service clients
```

## 🔧 Development Workflow

### Branching Strategy

We follow the [Git Flow](https://nvie.com/posts/a-successful-git-branching-model/) branching model:

- `main` - Production releases
- `develop` - Integration branch for features
- `feature/*` - New features
- `bugfix/*` - Bug fixes
- `release/*` - Release preparation

### Commit Messages

We use [Conventional Commits](https://www.conventionalcommits.org/) for consistent commit messages:

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

Example:
```
feat(appointments): add appointment cancellation

- Added cancellation logic
- Updated tests
- Updated documentation

Closes #123
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Serverless Framework](https://www.serverless.com/)
- [AWS](https://aws.amazon.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Jest](https://jestjs.io/)
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)
