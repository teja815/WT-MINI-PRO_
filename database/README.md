## Database (MongoDB)

This project uses **MongoDB**.

### Option A: MongoDB Atlas
Use your Atlas connection string in `backend/.env` as `MONGODB_URI`.

### Option B: Local MongoDB via Docker
Use the `docker-compose.yml` in this folder.

Start:

```bash
docker compose up -d
```

Then set:

```bash
MONGODB_URI=mongodb://127.0.0.1:27017/complaint_portal
```

