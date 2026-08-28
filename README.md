# 🏥 MediCore HMS (Hospital Management System)

> نظام إدارة مستشفى متكامل لإدارة المرضى، المواعيد، السجلات الطبية، والفواتير بكفاءة عالية.
>
> A comprehensive, full-stack web application designed for small-to-medium hospitals to manage patients, appointments, medical records, invoices, and administrative settings efficiently.

---

## 🛠️ Tech Stack | التقنيات المستخدمة

### Backend (`/HospitalBackend`)

- **Language/Framework:** C# .NET (ASP.NET Core Web API)
- **Documentation:** Swagger / OpenAPI
- **Architecture:** Controller-based RESTful API

### Frontend (`/HospitalFrontend`)

- **Languages:** HTML5, CSS3, JavaScript (ES6+)
- **Styling & Design:** Tailwind CSS & FontAwesome Icons
- **Fonts:** Cairo & Inter (Supports RTL/LTR layouts)

---

## 📂 Project Structure | هيكل المشروع

HospitalSystem/
│
├── HospitalBackend/ # ASP.NET Core Web API (الخلفية)
│ ├── Controllers/ # API Endpoints (Patients, Appointments, Invoices, etc.)
│ ├── Models/ # Data Entities & Database Context
│ ├── Migrations/ # Database Migrations
│ └── Program.cs # Application Entry Point & Services Config
│
└── HospitalFrontend/ # Client-side Web App (الواجهة الأمامية)
├── assets/ # CSS and styling files
├── js/ # Page-specific JavaScript controllers & config
├── appointments.html # Appointments management interface
├── dashboard.html # Main admin dashboard
├── invoices.html # Billing and invoicing view
├── login.html # Authentication portal
├── medical-records.html # Patient medical history view
├── patients.html # Patient records management
└── settings.html # System configurations

```

---

## 🚀 Key Features | المميزات الرئيسية

* **Patient Management | إدارة المرضى:** Add, update, and track patient profiles and personal details.
* **Appointment Scheduling | جدولة المواعيد:** Book, reschedule, and monitor doctor appointments seamlessly.
* **Medical Records | السجلات الطبية:** Securely log and review patient diagnoses, prescriptions, and treatments.
* **Invoicing & Billing | الفواتير:** Generate and manage medical bills and payment statuses.
* **Interactive UI | واجهة مستخدم تفاعلية:** Clean, responsive interface styled with Tailwind CSS supporting Arabic and English layouts.

---

## ⚙️ Getting Started Locally | التشغيل محلياً

### Prerequisites | المتطلبات المسبقة

* .NET SDK installed
* A modern Web Browser / Live Server extension

### 1. Run the Backend | تشغيل الباك‌اند

cd HospitalBackend
dotnet restore
dotnet run

```

### 2. Run the Frontend | تشغيل الفرت‌أند

- Open the `HospitalFrontend` folder and launch `login.html` (or use VS Code Live Server).
- Make sure your API base URL in `config.js` points to your backend endpoint.

---

## 👨‍💻 Author | المؤلف

Developed by **Maher Al-Haidari**.

```

```
