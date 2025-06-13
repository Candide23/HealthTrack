
# 🩺 HealthTrack — Personal Health Record Tracker

**HealthTrack** is a comprehensive full-stack web application designed to help users manage and monitor their personal health records in one centralized platform. Users can log symptoms, track vital health metrics, manage medical appointments, and receive intelligent health notifications.

Built with enterprise-grade security and modern development practices, this application showcases professional full-stack development, robust authentication systems, and scalable architecture patterns.

## 🚀 Key Features

### 🔐 **Secure User Management**
- User registration and authentication with encrypted passwords
- HTTP Basic Authentication via Spring Security
- Protected routes and API endpoints
- Automatic session management and token handling

### 📊 **Intelligent Health Metrics**
- Track weight, height, blood pressure, and other vital signs
- **Automatic BMI calculation** when height and weight data are available
- Historical data visualization and trends
- Real-time metric validation and alerts

### 🩺 **Comprehensive Symptom Tracking**
- Log symptoms with severity levels and descriptions
- Associate symptoms with specific dates and times
- Track symptom patterns and frequency
- Export symptom reports for medical consultations

### 📅 **Appointment Management**
- Schedule and manage medical appointments
- Calendar integration with timezone awareness
- Appointment reminders and notifications
- Doctor and clinic information storage

### 🔔 **Smart Notification System**
- Automated health alerts for abnormal readings
- Appointment reminders
- Medication and checkup notifications
- Customizable notification preferences

### 🌐 **Modern User Experience**
- Responsive design for desktop and mobile
- Intuitive dashboard with health insights
- Real-time data updates
- Accessibility-compliant interface

## 🛠️ Technology Stack

### **Backend (Spring Boot)**
```
Java 17 + Spring Boot 3.x
├── Spring Security (Authentication & Authorization)
├── Spring Data JPA (Database Operations)
├── Spring Web (REST APIs)
├── BCrypt (Password Encryption)
├── JUnit 5 + Mockito (Testing)
└── Maven (Build Management)
```

### **Frontend (React)**
```
React 18+ with Modern Hooks
├── Axios (HTTP Client with Interceptors)
├── React Router (Navigation & Protected Routes)
├── Day.js (Date/Time Management)
├── CSS3 (Responsive Styling)
└── ESLint (Code Quality)
```

### **Database & Infrastructure**
```
MySQL (Production) / H2 (Development)
├── JPA/Hibernate (ORM)
├── Connection Pooling
├── UTC Timezone Storage
└── Data Validation & Constraints
```

## 🏗️ Architecture Highlights

### **Clean Architecture Patterns**
- **Controller → Service → Repository** separation
- DTO pattern for API data transfer
- Entity-DTO mapping for data transformation
- Dependency injection throughout

### **Security Implementation**
- Custom `AuthenticationEntryPoint` for JSON error responses
- CORS configuration for cross-origin requests
- Protected API endpoints with role-based access
- Secure password storage with BCrypt hashing

### **Advanced Features**
- **Smart BMI Calculation**: Automatically calculates BMI when both height and weight metrics are available
- **Timezone Awareness**: Stores all timestamps in UTC, displays in America/Chicago timezone
- **Comprehensive Testing**: Unit tests with Mockito for service layer validation
- **Error Handling**: Consistent error responses across all API endpoints

## 📸 Application Preview

### Dashboard Overview
*A clean, intuitive interface showing health metrics, recent symptoms, and upcoming appointments*

### Health Metrics Tracking
*Visual charts and graphs displaying health trends over time with automatic BMI calculations*

### Symptom Management
*Comprehensive symptom logging with severity tracking and pattern analysis*

## 📁 Project Structure

```
healthtrack/
├── backend/
│   ├── src/main/java/
│   │   ├── config/           # Spring Security & CORS configuration
│   │   ├── controllers/      # REST API endpoints
│   │   ├── dto/             # Data Transfer Objects
│   │   ├── entities/        # JPA entities (User, HealthMetric, etc.)
│   │   ├── mappers/         # Entity-DTO conversion utilities
│   │   ├── repositories/    # Spring Data JPA interfaces
│   │   ├── services/        # Business logic implementation
│   │   └── exceptions/      # Custom exception handling
│   └── src/test/java/       # JUnit + Mockito tests
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   ├── pages/          # Main application pages
│   │   ├── services/       # API service layer with Axios
│   │   ├── utils/          # Helper functions and utilities
│   │   └── styles/         # CSS modules and styling
│   └── public/             # Static assets

## License
This project is licensed under the MIT License.


