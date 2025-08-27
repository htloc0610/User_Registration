# NestJS Student API Boilerplate 🎓

A comprehensive NestJS boilerplate for student management system with authentication, CRUD operations, and comprehensive API documentation.

## 🚀 Features

- **🔐 JWT Authentication & Authorization** - Secure login/register with role-based access
- **👥 User Management** - Admin, Teacher, Student roles with full CRUD operations  
- **🎓 Student Management** - Complete student information management
- **📄 Swagger API Documentation** - Interactive API documentation
- **🗄️ PostgreSQL Integration** - TypeORM with database migrations
- **🔍 Advanced Search & Filtering** - Pagination, sorting, and search capabilities
- **🛡️ Input Validation & Error Handling** - Comprehensive validation with class-validator
- **🧪 Mock Data Seeding** - Built-in test data generation
- **🐳 Docker Support** - Complete containerization setup
- **📊 Health Checks** - Application monitoring endpoints

## 🏗️ Project Structure

```
src/
├── students/           # Student module (CRUD operations)
│   ├── dto/           # Data Transfer Objects
│   ├── entities/      # Database entities
│   ├── interfaces/    # TypeScript interfaces
│   └── ...
├── users/             # User management module
├── auth/              # Authentication & JWT strategy
├── common/            # Shared utilities
│   ├── decorators/    # Custom decorators
│   ├── guards/        # Authentication guards
│   ├── interceptors/  # Response transformers
│   ├── filters/       # Exception filters
│   └── ...
├── config/            # Configuration files
├── database/          # Database module & migrations
└── ...
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18.0.0+
- PostgreSQL 12.0+
- npm or yarn

### Installation

1. **Clone and install dependencies**
```bash
git clone <repository-url>
cd nestjs-boilerplate
npm install
```

2. **Environment setup**
```bash
cp .env.example .env
# Update your database credentials and JWT secret
```

3. **Start the application**
```bash
npm run start:dev
```

4. **Access the application**
- API: http://localhost:3000
- Swagger Docs: http://localhost:3000/api/docs
- Health Check: http://localhost:3000/api/health

### 🧪 Testing the API

1. **Seed admin user**
```bash
curl -X POST http://localhost:3000/api/auth/seed-admin
```

2. **Login with admin credentials**
```json
POST /api/auth/login
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

3. **Seed mock student data**
```bash
curl -X GET http://localhost:3000/api/students/seed-mock-data \
  -H "Authorization: Bearer <your-jwt-token>"
```

## 📚 API Endpoints

### 🔐 Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/register` | User registration |
| GET | `/api/auth/profile` | Get current user profile |
| POST | `/api/auth/seed-admin` | Seed admin user |

### 🎓 Students
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/students` | Get all students (paginated) | ❌ |
| POST | `/api/students` | Create new student | ✅ |
| GET | `/api/students/:id` | Get student by ID | ❌ |
| PATCH | `/api/students/:id` | Update student | ✅ |
| PATCH | `/api/students/:id/deactivate` | Deactivate student | ✅ |
| DELETE | `/api/students/:id` | Delete student | ✅ |
| GET | `/api/students/seed-mock-data` | Seed test data | ✅ |

### 👥 Users
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/users` | Get all users | ✅ |
| POST | `/api/users` | Create new user | ✅ |
| GET | `/api/users/:id` | Get user by ID | ✅ |
| PATCH | `/api/users/:id` | Update user | ✅ |
| DELETE | `/api/users/:id` | Delete user | ✅ |

## 🐳 Docker Deployment

### Development
```bash
docker-compose up -d
```

### Production
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 📊 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run start` | Start application |
| `npm run start:dev` | Start in development mode |
| `npm run start:debug` | Start in debug mode |
| `npm run build` | Build for production |
| `npm run test` | Run unit tests |
| `npm run test:e2e` | Run E2E tests |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code |

## 🔧 Configuration

Key environment variables:

```env
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=student_api
DATABASE_PASSWORD=password
DATABASE_NAME=student_db

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h

# Application
PORT=3000
NODE_ENV=development
SWAGGER_ENABLED=true
```

## 🏛️ Architecture

- **Modular Structure**: Each feature is organized in its own module
- **Clean Code**: Following NestJS best practices and SOLID principles
- **Type Safety**: Full TypeScript implementation
- **Database**: PostgreSQL with TypeORM for robust data management
- **Security**: JWT authentication with bcrypt password hashing
- **Documentation**: Swagger/OpenAPI integration
- **Testing**: Jest setup for unit and integration tests
- **Error Handling**: Global exception filters and validation

## 🧪 Mock Data

The boilerplate includes built-in mock data seeding:

- **Admin User**: `admin@example.com` / `admin123`
- **Sample Students**: 5 pre-configured student records with various grades

## 📖 Documentation

- [API Documentation](docs/api.md) - Detailed API endpoints
- [Setup Guide](docs/setup.md) - Installation and configuration
- [Deployment Guide](docs/deployment.md) - Production deployment

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [NestJS](https://nestjs.com/) - Progressive Node.js framework
- [TypeORM](https://typeorm.io/) - ORM for TypeScript
- [Swagger](https://swagger.io/) - API documentation

---

