# Code Logic Validator (CLV)

> **Empowering Algorithmic Thinking through Interactive Logic Evaluation, Flowchart AST Synthesis, and Automated Multi-Language Code Generation.**

[![Live Demo](https://img.shields.io/badge/Demo-Live%20on%20Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://codelogicvalidator.netlify.app)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.4-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB%20Atlas-Cloud%20Database-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

---

## 🔗 Live Application Access

Experience the fully deployed platform online:

👉 **[Explore the Live Project (https://codelogicvalidator.netlify.app)](https://codelogicvalidator.netlify.app)**

* **Frontend:** Hosted on [Netlify](https://codelogicvalidator.netlify.app) (Continuous Deployment from `main`)
* **Backend:** Containerized Spring Boot 3 running on [Render](https://render.com)
* **Cloud Database:** High-availability [MongoDB Atlas](https://www.mongodb.com/atlas) Cluster

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Live Preview & Visual Tour](#2-live-preview--visual-tour)
3. [Key Features](#3-key-features)
4. [Screenshots](#4-screenshots)
5. [Technology Stack](#5-technology-stack)
6. [System Architecture](#6-system-architecture)
7. [Project Folder Structure](#7-project-folder-structure)
8. [Prerequisites](#8-prerequisites)
9. [Installation and Local Setup](#9-installation-and-local-setup)
10. [Environment Variables and Configuration](#10-environment-variables-and-configuration)
11. [Application Usage Guide](#11-application-usage-guide)
12. [API Documentation](#12-api-documentation)
13. [Database Design](#13-database-design)
14. [Authentication and Security](#14-authentication-and-security)
15. [Testing and Quality Assurance](#15-testing-and-quality-assurance)
16. [Deployment Guide](#16-deployment-guide)
17. [Troubleshooting & Common Issues](#17-troubleshooting--common-issues)
18. [Limitations and Future Roadmap](#18-limitations-and-future-roadmap)
19. [Contributing](#19-contributing)
20. [License](#20-license)
21. [Author & Acknowledgments](#21-author--acknowledgments)
22. [Live Demo](#22-live-demo)

---

## 1. Project Overview

### The Problem
Traditional competitive programming platforms (such as LeetCode, HackerRank, and Codeforces) evaluate solutions by compiling code against test cases. While effective for experienced developers, this paradigm creates a steep barrier for computer science students and beginner programmers:
* **Syntax-First Frustration:** Learners frequently get stuck debugging obscure syntax errors (e.g., missing semicolons, type mismatches, pointer errors) rather than mastering core problem-solving logic.
* **Lack of Reasoning Feedback:** Standard online judges return opaque verdicts (`Wrong Answer`, `Time Limit Exceeded`) without explaining *where* the algorithmic reasoning broke down.
* **Disconnected Visualization:** Beginners struggle to mentally trace state variables, control loops, and flowchart branches.

### The Solution: Code Logic Validator (CLV)
**Code Logic Validator (CLV)** is an educational platform designed to decouple **algorithmic reasoning** from **programming language syntax**. Instead of forcing students to write full code immediately:
1. Students express their step-by-step logic in natural, structured algorithmic pseudocode.
2. The platform's dual evaluation pipeline (Smart Deterministic Static Analyzer + Google Gemini LLM fallback) inspects algorithmic flow, boundary constraints, variable declarations, and state updates.
3. The platform generates an interactive **Abstract Syntax Tree (AST) Flowchart** depicting program execution.
4. Once the student's logic is approved and validated, CLV automatically synthesizes production-ready source code in **Java**, **Python**, **C++**, or **JavaScript**.
5. Gamification elements—including daily solving streaks, animated celebration modals, and rank progressions from Bronze to Diamond—keep students motivated.

---

## 2. Live Preview & Visual Tour

The application is deployed across cloud infrastructure:

* **Production URL:** [https://codelogicvalidator.netlify.app](https://codelogicvalidator.netlify.app)
* **Backend API Base:** [Render Web Service (Docker Container)](https://render.com)
* **Database:** MongoDB Atlas M0 Replica Set (`clv-cluster`)

---

## 3. Key Features

### 🧠 1. Dual-Core Logic Evaluation Engine
* **Deterministic Problem-Aware Validator:** Uses lexical tokens, keyword heuristics, loop condition parsing, and variable trace simulation to evaluate step-by-step logic with fine-grained scoring (0–100%).
* **AI Fallback Pipeline:** Leverages Google Gemini (`gemini-2.0-flash`) to analyze edge-case algorithmic approaches, offering constructive hints without giving away the complete solution.

### 📊 2. Flowchart AST Synthesizer
* Parses plain-text logic steps into an Abstract Syntax Tree (AST).
* Classifies operations into `START`, `INPUT`, `PROCESS`, `DECISION`, `OUTPUT`, and `END` nodes.
* Renders visual step diagrams to help visual learners connect logic with program control flow.

### 💻 3. Multi-Language Code Generation
* Automatically translates validated algorithmic logic into complete, syntactically valid code in:
  * **Java** (OOP structure, standard I/O)
  * **Python** (Pythonic, clean scripting)
  * **C++** (High-performance STL)
  * **JavaScript** (Modern ES6+)

### 🔒 4. Role-Based Access Control & Admin Portal
* Dedicated admin console restricted to administrative privileges (`nitheesh25bls@gmail.com`).
* **Problem Authoring:** Create, edit, and delete challenge problems with tags, sample test cases, hints, and constraints.
* **Batch Question Ingestion:** Ingest bulk problems via structured JSON payloads.
* **System Audit Logging:** Real-time log inspection tracking problem modifications and user actions.

### 🔥 5. Daily Streak System & Celebrations
* Automated calculation of current and longest solving streaks stored per user in MongoDB.
* Confetti-powered celebration modals triggered upon successful daily problem completion.

### 🏆 6. Rank Tier Progression
* Transparent multi-tier rating system based on total points and accuracy:
  * 🥉 **Bronze** (Beginner Logic Explorer)
  * 🥈 **Silver** (Algorithmic Thinker)
  * 🥇 **Gold** (Logic Architect)
  * 💎 **Platinum** (Optimization Specialist)
  * 👑 **Diamond** (Master Problem Solver)

### 🏫 7. Classroom Collaboration Mode
* Teachers and mentors can generate 6-digit room codes (e.g., `CLV-104928`) to host virtual classrooms with real-time accuracy and score tracking.

### 🎨 8. User Profile Customizer
* Profile personalization with gold avatar badge and direct local system image upload support.

---

## 4. Screenshots

| Problem Bank & Dashboard | Logic Solver & AST Flowchart |
| :---: | :---: |
| ![Problem Dashboard](e2e_dashboard_test.png) | ![Logic Solver](e2e_solver_test.png) |
| *Algorithmic problem bank with difficulty filters and streak badge* | *Pseudocode logic editor, flowchart visualizer & code synthesis* |

| Admin Management Console | Daily Streak Celebration |
| :---: | :---: |
| ![Admin Portal](e2e_admin_test.png) | ![Streak Modal](streak_modal_clean.png) |
| *Restricted admin dashboard for batch JSON uploads & audit logging* | *Confetti celebration and daily streak tracker* |

| Developer Profile & Avatar Customizer | Rank Progression Matrix |
| :---: | :---: |
| ![Profile Page](e2e_profile_test.png) | ![Rank Modal](e2e_rank_modal_test.png) |
| *User stats, accuracy metrics, solved history & custom avatar* | *Tier progress view from Bronze to Diamond* |

---

## 5. Technology Stack

### Frontend
* **Core:** React 18.2.0, Vite 5.1.6
* **Styling:** Tailwind CSS 3.4.1, PostCSS, Autoprefixer
* **3D Visuals & Canvas:** Three.js 0.162.0, `@react-three/fiber` 8.16.0, `@react-three/drei` 9.102.0
* **Animations:** Framer Motion 11.0.8, Canvas Confetti 1.9.2
* **Icons:** Lucide React 0.354.0
* **Routing & HTTP:** React Router DOM 6.22.3, Axios 1.6.8

### Backend
* **Runtime & Framework:** Java 17 (Eclipse Temurin JDK), Spring Boot 3.2.4
* **Security & Auth:** Spring Security 6.2, JJWT (io.jsonwebtoken: 0.11.5), BCrypt
* **Data Layer:** Spring Data MongoDB 4.2.4
* **Validation & Utilities:** Spring Boot Starter Validation (Jakarta Validation), Project Lombok

### Database & Cloud Storage
* **Primary Database:** MongoDB Atlas Cloud (Shared M0 3-Node Replica Set)
* **Local Fallback:** MongoDB Community Server (v6.0+)

### DevOps & Hosting
* **Frontend Hosting:** Netlify (Automated SPA deployments with `_redirects` proxy)
* **Backend Hosting:** Render (Eclipse Temurin 17 JRE Docker Container)
* **Containerization:** Multi-stage Docker build with JVM heap tuning (`-Xmx384m -Xms128m`)

---

## 6. System Architecture

```mermaid
graph TD
    User["Learner / Admin (Browser)"]
    
    subgraph "Frontend Layer (Netlify CDN)"
        SPA["React 18 + Vite SPA"]
        AuthContext["Auth Context & JWT Store"]
        CanvasEngine["Three.js Background & Visuals"]
    end
    
    subgraph "Backend Layer (Render Cloud)"
        Gateway["Tomcat Server (Port :10000 / :8080)"]
        JWTSecurity["Spring Security + JWT Auth Filter"]
        
        subgraph "Controllers"
            AuthCtrl["AuthController"]
            ProblemCtrl["ProblemController"]
            LogicCtrl["LogicController"]
            AdminCtrl["AdminController (RBAC)"]
            UserCtrl["UserController"]
        end
        
        subgraph "Core Services"
            EvalService["LogicEvaluationService"]
            CodeService["CodeGenerationService"]
            StreakService["StreakService"]
            AdminService["AdminService"]
        end
        
        LLMFallback["Google Gemini API (gemini-2.0-flash)"]
    end
    
    subgraph "Persistence Layer (MongoDB Atlas)"
        DB[("MongoDB Atlas (clv_db)")]
        UsersColl["users Collection"]
        ProblemsColl["problems Collection"]
        SubmissionsColl["submissions Collection"]
        AuditColl["audit_logs Collection"]
    end

    User -->|HTTPS| SPA
    SPA -->|Axios Bearer JWT| Gateway
    Gateway --> JWTSecurity
    JWTSecurity --> AuthCtrl & ProblemCtrl & LogicCtrl & AdminCtrl & UserCtrl
    LogicCtrl --> EvalService & CodeService
    EvalService -->|Optional AI fallback| LLMFallback
    EvalService --> StreakService
    AdminCtrl --> AdminService
    
    AuthCtrl & ProblemCtrl & EvalService & AdminService & UserCtrl --> DB
    DB --> UsersColl & ProblemsColl & SubmissionsColl & AuditColl
```

---

## 7. Project Folder Structure

```text
codelogicvalidator/
├── .gitignore
├── e2e_admin_test.png             # Actual E2E verification screenshot (Admin portal)
├── e2e_dashboard_test.png         # Actual E2E verification screenshot (Problems table)
├── e2e_profile_test.png           # Actual E2E verification screenshot (Profile view)
├── e2e_rank_modal_test.png        # Actual E2E verification screenshot (Ranks modal)
├── e2e_request_modal_test.png     # Actual E2E verification screenshot (Problem request)
├── e2e_solver_test.png            # Actual E2E verification screenshot (Logic editor)
├── streak_modal_clean.png         # Actual E2E verification screenshot (Streak celebration)
│
├── backend/                       # Spring Boot 3 Java Service
│   ├── Dockerfile                 # Multi-stage Eclipse Temurin 17 build
│   ├── pom.xml                    # Maven project dependencies & plugins
│   └── src/
│       └── main/
│           ├── java/com/clv/
│           │   ├── CodeLogicValidatorApplication.java # Spring Boot entry point
│           │   ├── config/        # WebMvc & Application Configurations
│           │   ├── controller/    # REST API endpoints (Auth, Logic, Admin, Problems)
│           │   ├── dto/           # Request / Response payloads
│           │   ├── model/         # MongoDB entity documents (User, Problem, Submission)
│           │   ├── repository/    # Spring Data MongoDB repositories
│           │   ├── security/      # JWT Filter, UserDetailsService, SecurityConfig
│           │   └── service/       # Logic evaluation, code gen, streaks, admin logic
│           └── resources/
│               └── application.yml# Cloud/Local database and port properties
│
└── frontend/                      # React 18 + Vite Web Application
    ├── index.html                 # HTML shell & font definitions
    ├── netlify.toml               # Netlify SPA build and redirect rules
    ├── package.json               # Node.js dependencies and build scripts
    ├── postcss.config.js          # PostCSS configuration for Tailwind
    ├── tailwind.config.js         # Custom design tokens, dark palette, animations
    ├── vite.config.js             # Vite build options & local backend proxying
    ├── public/
    │   └── _redirects             # SPA URL rewrite fallback rule for Netlify
    └── src/
        ├── App.jsx                # Application routing and route guards
        ├── main.jsx               # React DOM bootstrapping
        ├── components/            # Reusable UI (Navbar, Modals, 3D Canvas, Flowcharts)
        ├── context/               # AuthContext (JWT management & session sync)
        ├── data/                  # Seed problems & curriculum configurations
        ├── pages/                 # Full-screen view pages (Solver, Admin, Dashboard, Login)
        ├── services/              # Axios HTTP client configured with interceptors
        └── styles/
            └── index.css          # Design system, glassmorphism, keyframes
```

---

## 8. Prerequisites

To build and run this project locally, ensure you have the following installed:

| Tool | Required Version | Verification Command |
| :--- | :--- | :--- |
| **Java Development Kit (JDK)** | 17 or higher | `java -version` |
| **Apache Maven** | 3.8.0 or higher | `mvn -version` |
| **Node.js** | 18.0.0 or higher | `node -v` |
| **npm** | 9.0.0 or higher | `npm -v` |
| **MongoDB** | 6.0+ (or MongoDB Atlas Cloud) | `mongosh --version` |
| **Git** | 2.30+ | `git --version` |

---

## 9. Installation and Local Setup

### 1. Clone the Repository
```bash
git clone https://github.com/NITHEESHRAMASAMY/CodeLogicValidator.git
cd CodeLogicValidator
```

### 2. Configure & Start the Backend
1. Open a terminal in the `backend/` directory:
   ```bash
   cd backend
   ```
2. Build the project using Maven:
   ```bash
   mvn clean package -DskipTests
   ```
3. Run the Spring Boot application:
   ```bash
   java -jar target/codelogicvalidator-backend-1.0.0.jar
   ```
   *(Alternatively: `mvn spring-boot:run`)*
   
   The backend will start on **`http://localhost:8080`**.

### 3. Configure & Start the Frontend
1. Open a new terminal in the `frontend/` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Access the web application at **`http://localhost:5173`**.

---

## 10. Environment Variables and Configuration

### Backend Configuration (`backend/src/main/resources/application.yml`)

The backend automatically loads settings from environment variables with sensible local defaults:

| Variable | Description | Default (Local) | Production Example |
| :--- | :--- | :--- | :--- |
| `PORT` | HTTP port for Tomcat | `8080` | `10000` (Render) |
| `SPRING_DATA_MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/clv_db` | `mongodb+srv://user:pass@cluster.mongodb.net/clv_db` |
| `JAVA_TOOL_OPTIONS` | JVM memory limits for cloud containers | *(None)* | `-Xmx384m -Xms128m` |
| `GEMINI_API_KEY` | *(Optional)* Google Gemini API key for AI fallback | *(Empty string)* | `AIzaSy...` |
| `GEMINI_MODEL` | Gemini LLM model identifier | `gemini-2.0-flash` | `gemini-2.0-flash` |

### Frontend Configuration (`frontend/.env`)

| Variable | Description | Local Value | Production Value (Netlify) |
| :--- | :--- | :--- | :--- |
| `VITE_API_BASE_URL` | Base URL pointing to Spring Boot API | `http://localhost:8080` *(or proxy)* | `https://your-render-backend.onrender.com` |

---

## 11. Application Usage Guide

### 1. User Registration & Login
* Navigate to `/register` to create a learner account, or `/login` with existing credentials.
* The system issues a stateless **JWT Bearer Token** stored in `localStorage` and synchronized across all HTTP requests via Axios interceptors.

### 2. Solving Algorithmic Logic
1. Visit the **Problem Bank** (`/problems`) and select a challenge (e.g., *Check Leap Year*, *Sum of Two Numbers*, *Factorial Calculation*).
2. Enter your pseudocode step-by-step into the **Logic Editor**.
3. Click **"Evaluate Logic"**:
   * The platform evaluates your algorithm for variables, boundary constraints, and correct sequencing.
   * View the step breakdown, accuracy percentage, and test results.
4. Click **"Flowchart AST"** to view your algorithm's visual state transition diagram.
5. Click **"Generate Code"** to synthesize clean source code in Java, Python, C++, or JavaScript.

### 3. Tracking Streaks & Ranks
* Solving at least one problem daily increments your **Active Streak**.
* View your current solving streak, solved count, and accuracy progression on the **Profile Page** (`/profile`).

### 4. Admin Management Console
* Accounts with administrative rights (`nitheesh25bls@gmail.com`) can access the **Admin Portal** (`/admin`).
* Author new questions, upload JSON batch problem sets, and inspect security audit logs.

---

## 12. API Documentation

All API responses follow a uniform JSON structure:
```json
{
  "success": true,
  "message": "Operation description",
  "data": { ... }
}
```

### Authentication Endpoints (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user account | No |
| `POST` | `/api/auth/login` | Authenticate with email/password; returns JWT | No |
| `POST` | `/api/auth/google` | Google OAuth token login | No |
| `GET` | `/api/auth/me` | Fetch currently authenticated user session | Yes (`Bearer <token>`) |

### Problem Management (`/api/problems`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/problems` | List all available algorithmic problems | No |
| `GET` | `/api/problems/{id}` | Retrieve details and test cases for a single problem | No |
| `POST` | `/api/problems/request` | Submit a request for a new problem topic | Yes |

### Logic Evaluation & Synthesis (`/api/logic`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/logic/evaluate` | Evaluate logic steps against problem constraints | Optional |
| `POST` | `/api/logic/flowchart` | Generate Flowchart AST nodes from logic steps | No |
| `POST` | `/api/logic/generate-code` | Synthesize source code (Java/Python/C++/JS) | No |

### Admin Console (`/api/admin`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/admin/problems` | Create or update a problem definition | Admin Only |
| `POST` | `/api/admin/problems/batch` | Batch ingest multiple problems via JSON | Admin Only |
| `DELETE` | `/api/admin/problems/{id}` | Remove a problem by ID | Admin Only |
| `GET` | `/api/admin/problem-requests` | View submitted problem requests | Admin Only |
| `GET` | `/api/admin/audit-logs` | Retrieve security and action audit logs | Admin Only |

### User Profile & Stats (`/api/user` & `/api/analytics`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `PUT` | `/api/user/avatar` | Update user avatar URL | Yes |
| `GET` | `/api/user/preferences` | Retrieve user preferences | Yes |
| `GET` | `/api/analytics/streak` | Fetch active streak count and last solve date | Yes |
| `GET` | `/api/analytics/summary` | Fetch problem-solving accuracy metrics | Yes |

---

## 13. Database Design

The system uses **MongoDB** for document persistence with automatic index synchronization:

```mermaid
erDiagram
    USER ||--o{ SUBMISSION : submits
    USER ||--o{ AUDIT_LOG : generates
    USER ||--o| USER_PREFERENCE : configures
    PROBLEM ||--o{ SUBMISSION : evaluates

    USER {
        string id PK
        string email UK
        string fullName
        string password
        string provider
        set roles
        int currentStreak
        int longestStreak
        int totalSolved
        string lastSolvedDate
    }

    PROBLEM {
        string id PK
        int number UK
        string title
        string slug UK
        string difficulty
        string category
        list tags
        string description
        list sampleCases
        list hints
        list expectedKeywords
    }

    SUBMISSION {
        string id PK
        string userId FK
        string problemId FK
        string logicText
        int score
        boolean passed
        string generatedCode
        date timestamp
    }

    AUDIT_LOG {
        string id PK
        string action
        string performedBy
        date timestamp
        string details
    }
```

---

## 14. Authentication and Security

1. **Stateless JWT Authorization:** Every sensitive request requires an `Authorization: Bearer <token>` header, parsed by [`JwtAuthenticationFilter`](backend/src/main/java/com/clv/security/JwtAuthenticationFilter.java).
2. **Password Cryptography:** User passwords are encrypted using `BCryptPasswordEncoder` before storage.
3. **Role-Based Access Control (RBAC):** Administrative actions are protected at two levels:
   * Spring Security authority matching (`ROLE_ADMIN`).
   * Explicit controller-level email verification (`nitheesh25bls@gmail.com`).
4. **CORS Security:** Cross-Origin Resource Sharing is centrally governed in [`SecurityConfig`](backend/src/main/java/com/clv/security/SecurityConfig.java) with explicit headers (`Authorization`, `Content-Type`) and allowed methods.

---

## 15. Testing and Quality Assurance

### Backend Automated Tests
Run the comprehensive Spring Boot test suite:
```bash
cd backend
mvn test
```

### End-to-End API Verification
The repository includes an end-to-end verification script testing the entire API lifecycle:
```powershell
# From the project root:
powershell -ExecutionPolicy Bypass -File backend/test_e2e_backend.ps1
```
*Tests login, JWT issuance, problem fetching, logic evaluation, AST flowchart generation, code generation, avatar update, and RBAC 403 enforcement.*

### Frontend Production Build Test
Verify that the frontend builds without syntax or bundling errors:
```bash
cd frontend
npm run build
```

---

## 16. Deployment Guide

### Deploying Frontend to Netlify
1. Connect your GitHub repository to [Netlify](https://netlify.com).
2. Configure the build parameters:
   * **Base directory:** `frontend`
   * **Build command:** `npm run build`
   * **Publish directory:** `frontend/dist`
3. Add Environment Variable:
   * `VITE_API_BASE_URL` = `https://<your-render-backend-url>.onrender.com`
4. Deploy. The included `frontend/public/_redirects` ensures SPA client-side routes resolve properly.

### Deploying Backend to Render
1. Create a new **Web Service** on [Render](https://render.com) connected to your repository.
2. Configure settings:
   * **Root Directory:** `backend`
   * **Runtime:** `Docker`
   * **Plan:** Free
3. Add Environment Variables:
   * `SPRING_DATA_MONGODB_URI`: Your MongoDB Atlas URI.
   * `JAVA_TOOL_OPTIONS`: `-Xmx384m -Xms128m` *(critical to keep memory safely within the free 512 MB tier)*.
4. Deploy.

---

## 17. Troubleshooting & Common Issues

| Issue / Error | Root Cause | Solution |
| :--- | :--- | :--- |
| **`Received fatal alert: internal_error` on MongoDB connection** | MongoDB Atlas IP whitelist is blocking cloud IP | In Atlas $\rightarrow$ **Network Access**, add `0.0.0.0/0` (Allow Access from Anywhere). |
| **`No write concern mode named 'majority\n' found`** | Trailing newline/line break pasted into environment variable | Backspace the trailing newline in Render's `SPRING_DATA_MONGODB_URI` field. |
| **Render container killed (Out of Memory)** | Java 17 default heap exceeds 512 MB free tier | Add environment variable `JAVA_TOOL_OPTIONS = -Xmx384m -Xms128m`. |
| **Frontend 404 on page refresh in Netlify** | SPA routing requires rewriting all routes to `index.html` | Verify `frontend/public/_redirects` contains `/* /index.html 200`. |

---

## 18. Limitations and Future Roadmap

### Current Limitations
* Code execution is simulated via AST validation and code synthesis; dynamic in-browser sandboxed execution (e.g., WebAssembly/Piston) is planned for a future update.

### Future Roadmap
- [ ] Real-time peer-to-peer logic battles via WebSockets.
- [ ] Interactive gamified logic puzzle quests.
- [ ] Chrome extension for LeetCode logic scaffolding.
- [ ] Multi-tenant institutional analytics dashboard for universities.

---

## 19. Contributing

Contributions are welcomed! Follow these steps:
1. **Fork** the repository.
2. **Create a branch:** `git checkout -b feature/MyFeature`
3. **Commit your changes:** `git commit -m "Add my new feature"`
4. **Push to branch:** `git push origin feature/MyFeature`
5. **Open a Pull Request** describing your additions.

---

## 20. License

This project is distributed under the **MIT License**. See the `LICENSE` file for details.

---

## 21. Author & Acknowledgments

* **Lead Developer & Architect:** Nitheesh R ([@NITHEESHRAMASAMY](https://github.com/NITHEESHRAMASAMY))
* **Contact:** `nitheesh25bls@gmail.com`
* Developed as a comprehensive Final Year Computer Science Engineering capstone project.

---

## 22. Live Demo

Explore the live platform, test algorithmic logic, and generate multi-language code:

👉 **[Explore the Live Project](https://codelogicvalidator.netlify.app)**
