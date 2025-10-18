# Fullstack JS Developer Assignment

A full-stack project built with **NestJS** (backend) and **Next.js** (frontend).  
It demonstrates  user management with email hashing, RSA digital signatures, Protobuf serialization, and frontend verification.

---

##  Tech Stack

- **Backend:** NestJS, TypeScript, SQLite  
- **Frontend:** Next.js, shadcn/ui, Tailwind CSS    
- **Docs:** Swagger (`/api/docs`)

---

## ⚙️ Requirements

| Tool | Version |
|------|----------|
| Node.js | **≥ 20.10.0** |
| npm | **≥ 9.x** |

---

## 🧩 Setup & Run
### Clone the Repository in terminal
```bash
git clone https://github.com/iBiziCode/fullstackjs-practical-test.git
cd fullstackjs-practical-test
```
---

### Install & Run

#### Backend 
```bash
cd backend
npm install
```

Run the backend
```bash
npm run start
```

Runs at http://localhost:3001 \
Swagger Docs at http://localhost:3001/api/docs \


#### Frontend in other terminal
```bash
cd frontend
npm install
```
Run the frontend
```bash
npm run dev
```
Runs at http://localhost:3002

---

### Notes

- Assumed authentication will be added at a later phase
- Assumed the frontend needs to do CRUD also
- Everything run is in development mode, please use dev branch
- Known Issue: A URL validation bypass vulnerability exists in the validator.js library (versions ≤ 13.15.15). The isURL() function uses '://' as a delimiter to parse protocols, whereas browsers use ':'. This discrepancy allows attackers to craft URLs that bypass protocol and domain validation, potentially leading to XSS and Open Redirect attacks. As of now, there is no patched version available. [Link](https://github.com/advisories/GHSA-9965-vmph-33xx)
