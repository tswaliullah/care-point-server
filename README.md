# 🩺 Telemedicine Backend

A complete backend for a modern telemedicine platform built with **TypeScript**, **Express.js**, **Prisma**, and **PostgreSQL**.  
This project includes authentication, doctor & patient management, appointments, payments, AI suggestions, video calls, and more.

---

## 🚀 Features

### 🔐 Authentication
- JWT-based login & registration  
- Role-based access (user, doctor, admin)

### 👤 User Module
- User profile  
- Patient health data  
- Account settings

### 🩺 Doctor Module
- Doctor profile  
- Specialties  
- Doctor schedule  
- Availability management

### 📅 Appointments
- Book, update, cancel appointment  
- Check doctor availability  
- Appointment history

### ⭐ Reviews
- Patient can review doctor  
- Avg rating calculation

### 💳 Payments (Stripe)
- Stripe payment intent  
- Transaction records

### 📞 Video Calling (Agora)
- Token generation API

### 🧠 AI Suggestions
- Doctor recommendation  
- Smart time suggestion

### 📊 Dashboard & Analytics
- Appointments stats  
- Patients overview  
- Doctor performance  
- Revenue analytics

### 📝 Task Scheduling
- Cron-based auto reminders  
- Auto cleanup tasks

---

## 🛠️ Tech Stack

- **TypeScript**
- **Node.js + Express.js**
- **PostgreSQL**
- **Prisma ORM**
- **Stripe**
- **JWT Auth**
- **AI (OpenAI/Gemini/Custom)**

---

# ⚙️ Installation & Local Setup

Follow these steps to run the backend locally.

---

## 1️⃣ Clone the repo

```bash
git clone https://github.com/gowaliullah/care-point-server.git
cd care-point-server
