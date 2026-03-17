## Complaint Portal (MERN + Firebase Auth)

This project is a complaint/issue portal for **Classroom**, **Mess**, and **Hostel** issues.

### Tech
- **Frontend**: React + Tailwind CSS
- **Auth**: Firebase Authentication (front) + Firebase ID token verification (backend)
- **Backend**: Node.js + Express
- **DB**: MongoDB (Mongoose)

### Routes (frontend)
- `/login` – Firebase login (Admin / Teacher / Student)
- `/` – Home cards (Classroom / Mess / Hostel)
- `/classroom` `/mess` `/hostel` – Category dashboard + submit issue
- `/profile` – Profile + counts
- `/admin` – Admin approvals
- `/faculty` – Faculty dashboard (approved issues)

### Setup
1) Install dependencies

```bash
npm install
```

2) Create environment files

- `front/.env` (Vite env vars)
- `backend/.env`

Templates are in:
- `front/.env.example`
- `backend/.env.example`

3) Run

```bash
npm run dev
```

