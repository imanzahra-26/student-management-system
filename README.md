
# Student Management System

A full-stack web application to manage student records, including adding, viewing, updating, searching, sorting, and deleting students.

Built as **Task 2 (Easy)** of the Full Stack Development Internship at **Auspify Technologies**.

## 📌 Overview

This project is a CRUD application built using React, Node.js, Express.js, and MySQL. It provides a REST API for managing student records and a responsive user interface.

## 🚀 Tech Stack

- **Frontend:** React (Vite), Axios, CSS3
- **Backend:** Node.js, Express.js
- **Database:** MySQL 8.0
- **Tools:** VS Code, Postman, MySQL Workbench

## ✨ Features

- Add new student records
- View all students in a table
- Update student information
- Delete students with confirmation
- Validate unique email addresses
- Search students by name, email, or course
- Sort records by name, age, or ID
- Display total students, unique courses, and average age
- Show loading indicators while fetching data
- Use course badges and a responsive design
- Support desktop, tablet, and mobile screens

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/students` | Get all students |
| GET | `/students/:id` | Get a student by ID |
| POST | `/students` | Add a new student |
| PUT | `/students/:id` | Update a student |
| DELETE | `/students/:id` | Delete a student |

## 🗄️ Database Schema

**Database:** `student_management`

**Table:** `students`

| Column | Type | Constraints |
|--------|------|-------------|
| id | INT | Primary Key, Auto Increment |
| name | VARCHAR(100) | Not Null |
| email | VARCHAR(150) | Not Null, Unique |
| age | INT | Not Null |
| course | VARCHAR(100) | Not Null |
| created_at | TIMESTAMP | Default Current Timestamp |

## 📁 Folder Structure

```text
student-management/
├── backend/
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── studentApi.js
│   │   ├── components/
│   │   │   ├── StudentForm.jsx
│   │   │   └── StudentTable.jsx
│   │   ├── pages/
│   │   │   └── Home.jsx
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── database/
│   └── schema.sql
├── screenshots/
└── README.md
```

## 🛠️ How to Run Locally

### Prerequisites

- Node.js v18 or higher
- MySQL Server 8.0 or higher
- npm
- MySQL Workbench (optional)

### Step 1: Set Up the Database

Open MySQL Workbench and execute the following SQL:

```sql
CREATE DATABASE IF NOT EXISTS student_management;

USE student_management;

CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    age INT NOT NULL,
    course VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Step 2: Set Up the Backend

Open a terminal and run:

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=student_management
```

Replace `your_mysql_password` with your actual MySQL password.

Start the backend using:

```bash
npm run dev
```

The backend should run at:

`http://localhost:5000`

### Step 3: Set Up the Frontend

Open a second terminal and run:

```bash
cd frontend
npm install
npm run dev
```

Open the frontend URL displayed in the terminal. The default Vite URL is:

`http://localhost:5173`

## 📸 Screenshots

Add screenshots of your completed application to the `screenshots/` folder.

Recommended screenshots:

1. Home page
2. Add student form
3. Edit student form
4. Delete confirmation
5. Search and sorting features
6. Responsive mobile view
7. Student records in MySQL Workbench

## 🧠 Key Concepts

- CRUD operations
- REST API development
- MySQL database connectivity
- Parameterized SQL queries
- Environment variables
- CORS configuration
- React Hooks: `useState`, `useEffect`, and `useMemo`
- Controlled form components
- Searching, filtering, and sorting
- Responsive CSS
- Frontend and backend error handling

## 👩‍💻 Author

**Iman Zahra**

- **Email:** imanzahra2005@gmail.com
- **LinkedIn:** https://linkedin.com/in/iman-zahra-28793a358
- **GitHub:** https://github.com/imanzahra-26

## 🏷️ Tags

`Auspify` `AuspifyTechnologies` `AuspifyInternship` `AuspifyProjects`

## 📝 License

This project was developed for educational and internship purposes.