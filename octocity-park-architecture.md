# Octocity Park System - Network Architecture Diagram

## System Overview
The Octocity Park system is a comprehensive parking management platform deployed on AWS infrastructure with microservices architecture.

## Core Components

### Frontend Layer
- **Angular Web Application**
  - Served via Nginx
  - Communicates with backend via HTTPS
  - Located in Public Zone

### Backend Layer
- **NestJS REST API**
  - Deployed on AWS EKS (Elastic Kubernetes Service)
  - Handles business logic and data processing
  - Located in Application Zone

### Microservices
- **Firebase Service**: Manages Firebase notifications
- **Notification Service**: Handles general notifications  
- **WhatsApp Service**: Processes WhatsApp messaging
- All microservices deployed on EKS

## Data Layer

### Primary Database
- **PostgreSQL (AWS RDS)**
  - Database: parking_management_v2
  - SSL enabled
  - Located in Data Zone

### Caching Layer
- **Redis Cache**
  - Local Redis (application-specific caching)
  - Global Redis (shared caching across services)
  - Located in Data Zone

### File Storage
- **Amazon S3**
  - Bucket: mawgif-test-bucket
  - Stores documents, images, files
  - Located in Data Zone

## Message Queue System
- **Amazon SQS**
  - sync-v1-v2.fifo: V1/V2 synchronization
  - firebase-notifications: Firebase notification queue
  - thumbnails: Image processing queue
  - tm1.fifo: TM1 integration queue
  - government-platform.fifo: Government platform integration
  - invoice-retry.fifo: Invoice processing retry
  - notification.fifo: General notification queue

## Serverless Components
- **AWS Lambda Functions**
  - Scheduled tasks (cron jobs)
  - SQS Event Handlers
  - Located in Application Zone

## External Integrations
- **OSES API**: http://37.216.242.221:8081
- **V1 API**: https://api.mapst.mawgifservices.com
- **Gupshup Messaging API**: https://media.smsgupshup.com/GatewayAPI/rest
- **HyperPay Payment Gateway**: Payment processing
- **Firebase**: Push notifications
- **Government Platform**: Government services integration
- **TM1 Integration**: Financial system integration

## Monitoring & Observability
- **Prometheus**: Metrics collection (port 9090)
- **Grafana**: Visualization and dashboards (port 3000)
- **Push Gateway**: Metrics pushing (port 9091)

## Security Zones

### Public Zone
- Frontend application (HTTPS)
- API Gateway (HTTPS)
- Security: TLS/SSL, WAF, rate limiting

### Application Zone
- Backend API services
- Microservices
- Lambda functions
- Security: JWT authentication, RBAC, Kubernetes policies

### Data Zone
- PostgreSQL database
- Redis cache
- S3 storage
- Security: VPC isolation, encryption at rest, SSL

### Integration Zone
- SQS queues
- External API integrations
- Security: API keys, HTTPS, message encryption

## Network Infrastructure
- **VPC**: vpc-0867cd8d4bf499081 (me-south-1, Bahrain)
- **CIDR**: 192.168.0.0/16
- **Container Orchestration**: AWS EKS
- **Load Balancing**: AWS NLB
- **Security Groups**: 3 main groups for cluster communication

## Communication Protocols
- **Internal**: PostgreSQL over SSL, Redis with auth, HTTPS with IAM
- **External**: REST over HTTPS, Firebase Admin SDK
- **Payment**: Encrypted communication with HyperPay

## High Availability
- Multi-AZ deployment (me-south-1a, me-south-1b, me-south-1c)
- Auto-scaling for application components
- RDS automatic failover
- SQS message persistence 