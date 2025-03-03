# Teacher Student API

A RESTful API for managing teacher-student relationships and notifications, built with Node.js, Express, TypeScript, and MySQL.

## Features

- Register students to teachers
- Retrieve common students for multiple teachers
- Suspend students
- Retrieve notification recipients based on registration and mentions

## Requirements

- Node.js 20+
- MySQL 8+
- Docker (If you want to run the app using containerization)

## Installation

### Without Docker

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/teacher-student-api.git
cd teacher-student-api

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# Run database migrations
npm run db:generate
npm run db:migrate

# Seed the database with initial data
npm run db:seed

# Start the server
npm run dev
```

### With Docker

```bash
# Build and start the Docker containers in detached mode
docker-compose up --build -d

# Check if containers are running
docker-compose ps

# Check application logs
docker-compose logs app

# Check database logs
docker-compose logs db

# Generate migrations
docker-compose exec app npm run db:generate

# Apply migrations
docker-compose exec app npm run db:migrate

# Seed the database
docker-compose exec app npm run db:seed

# Connect to MySQL inside the database container
docker-compose exec db mysql -u root -ppassword teacher_student

# Inside MySQL, list tables
SHOW TABLES;

# Examine table structure
DESCRIBE teachers;
DESCRIBE students;
DESCRIBE teacher_students;

# Check seed data
SELECT * FROM teachers;
SELECT * FROM students;
SELECT * FROM teacher_students;

# Exit MySQL
EXIT;

# Endpoint health check
curl http://localhost:3000/health

# Stop existing containers
docker-compose down
```

## API Documentation

### 1. Register Students

Register one or more students to a specified teacher.

- **Endpoint:** `POST /api/register`
- **Headers:** `Content-Type: application/json`
- **Success Response:** HTTP 204
- **Request Body Example:**

```json
{
  "teacher": "teacherken@gmail.com",
  "students": [
    "studentjon@gmail.com",
    "studenthon@gmail.com"
  ]
}
```

### 2. Get Common Students

Retrieve students who are registered to all specified teachers.

- **Endpoint:** `GET /api/commonstudents`
- **Success Response:** HTTP 200
- **Request Example:** `GET /api/commonstudents?teacher=teacherken%40gmail.com&teacher=teacherjoe%40gmail.com`
- **Response Example:**

```json
{
  "students": [
    "commonstudent1@gmail.com",
    "commonstudent2@gmail.com"
  ]
}
```

### 3. Suspend Student

Suspend a specified student.

- **Endpoint:** `POST /api/suspend`
- **Headers:** `Content-Type: application/json`
- **Success Response:** HTTP 204
- **Request Body Example:**

```json
{
  "student": "studentmary@gmail.com"
}
```

### 4. Retrieve Notification Recipients

Retrieve a list of students who can receive a notification.

- **Endpoint:** `POST /api/retrievefornotifications`
- **Headers:** `Content-Type: application/json`
- **Success Response:** HTTP 200
- **Request Body Example:**

```json
{
  "teacher": "teacherken@gmail.com",
  "notification": "Hello students! @studentagnes@gmail.com @studentmiche@gmail.com"
}
```

- **Response Example:**

```json
{
  "recipients": [
    "studentbob@gmail.com",
    "studentagnes@gmail.com",
    "studentmiche@gmail.com"
  ]
}
```

## Database Schema

- **teachers**: Stores teacher information with email as unique identifier
- **students**: Stores student information with email and suspension status
- **teacher_students**: Many-to-many relationship between teachers and students