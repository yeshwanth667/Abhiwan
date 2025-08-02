# ✅ Collaborative To-Do App (Manager-Employee)

A full-stack task management application designed for collaborative work between **managers** and **employees**. Managers can assign, edit, and delete tasks. Employees can view and update task statuses in real-time.

:

🔥 **Project Description**
Collaborative To-Do App is a role-based task management system built for organizations to streamline task delegation and tracking between managers and employees. Managers can assign, update, or delete tasks, while employees can view their assigned tasks and update their progress in real-time.

The project features:
Authentication & Authorization (JWT-based)

Role-based dashboards for Manager and Employee

Real-time updates using Socket.IO

Responsive UI built with React, TypeScript, Bootstrap

RESTful API with Express.js and MongoDB

Designed to simulate a real-world task collaboration tool with scalable architecture, intuitive UI, and production-ready deployment on Vercel (frontend) and Render (backend).

## 📂 Project Structure

	├── frontend/ # React + TypeScript + Bootstrap (Vite)
	├── backend/ # Node.js + Express.js + MongoDB
	├── README.md

## 🚀 Features

### 👥 Authentication
- JWT-based login system.

- Role-based routing: `manager` and `employee`.

### 👨‍💼 Manager Dashboard
- Assign new tasks to employees.
  
- Edit/update existing tasks.
  
- Delete tasks.
  
- View all assigned tasks.
  
- Real-time sync via **Socket.IO**.

### 👷 Employee Dashboard
- View only assigned tasks.
  
- Update task status (`Pending`, `In Progress`, `Completed`).
  
- Real-time updates when manager adds or updates tasks.

### Employee Login
	{
  		"email": "Ravi@gmail.com",
  		"password": "Ravi@123"
	}

### Manager Login
	{
  		"email": "manager@example.com",
  		"password": "password123"
	} 

📡 API Endpoints

**🔑 Auth Routes**
POST /api/auth/register — User registration

POST /api/auth/login — User login

**✅ Task Routes**
POST /api/tasks — Manager assigns task

GET /api/tasks/manager — Get tasks assigned by manager

GET /api/tasks/my — Get tasks assigned to current user

PATCH /api/tasks/:id — Update task (Manager)

PATCH /api/tasks/:id/status — Update task status (Employee)

DELETE /api/tasks/:id — Delete task (Manager)


**🧪 Running the Project Locally**
Clone the repo
	git clone https://github.com/yeshwanth667/Abhiwan.git

**🛠 Setup Backend**

	cd backend
 
	npm install
 
	npm run dev

**⚛️ Setup Frontend**

	cd frontend
 
	npm install
 
	npm run dev



