# BookMultiRole — Multi-Role Book Management Web Application

A full-stack book management platform with role-based access for **Admins**, **Authors**, and **Users (Readers)**.

**Stack:** React.js · Python · FastAPI · PostgreSQL · SQLAlchemy · JWT Authentication

## Features

- 🔐 JWT-based authentication with role-based access control (RBAC)
- 👑 **Admin** — manage all users, manage/approve all books, view platform stats
- ✍️ **Author** — create, update, delete their own books
- 📖 **User/Reader** — browse books, view details, leave reviews & ratings
- ⚛️ Responsive React.js dashboards per role
- 🚀 FastAPI REST API with auto-generated OpenAPI docs (`/docs`)

## Project Structure

```
BookMultiRole/
├── backend/          # FastAPI + SQLAlchemy + PostgreSQL
│   ├── app/
│   │   ├── main.py          # App entrypoint
│   │   ├── config.py        # Settings / env vars
│   │   ├── database.py      # DB engine & session
│   │   ├── models.py        # SQLAlchemy models
│   │   ├── schemas.py       # Pydantic schemas
│   │   ├── auth.py          # Password hashing & JWT
│   │   ├── dependencies.py  # Auth/role guards
│   │   └── routers/
│   │       ├── auth.py      # /auth/register /auth/login
│   │       ├── users.py     # user & admin-user-management endpoints
│   │       └── books.py     # book CRUD + reviews
│   ├── requirements.txt
│   └── .env.example
└── frontend/         # React.js (Vite-free CRA-style structure)
    ├── src/
    │   ├── api/axios.js
    │   ├── context/AuthContext.jsx
    │   ├── components/
    │   ├── pages/
    │   └── App.jsx
    └── package.json
```

## Getting Started

### 1. Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env            # then edit DATABASE_URL & SECRET_KEY

# Create the PostgreSQL database first, e.g.:
# createdb bookmultirole

uvicorn app.main:app --reload
```

API docs available at: http://127.0.0.1:8000/docs

Tables are auto-created on startup via SQLAlchemy metadata (see `app/main.py`).

### 2. Frontend Setup

```bash
cd frontend
npm install
npm start
```

App runs at: http://localhost:3000

Make sure `REACT_APP_API_URL` in a `.env` file (or `frontend/src/api/axios.js`) points to your backend, default `http://127.0.0.1:8000`.

## Roles & Permissions

| Action                     | Admin | Author | User |
|-----------------------------|:-----:|:------:|:----:|
| Register / Login            | ✅    | ✅     | ✅   |
| View own profile            | ✅    | ✅     | ✅   |
| Browse / search books       | ✅    | ✅     | ✅   |
| Leave review & rating       | ✅    | ✅     | ✅   |
| Create / edit own books     | ✅    | ✅     | ❌   |
| Delete own books            | ✅    | ✅     | ❌   |
| Manage **all** books        | ✅    | ❌     | ❌   |
| Manage users (list/promote/deactivate) | ✅ | ❌ | ❌ |
| View platform stats         | ✅    | ❌     | ❌   |

## Environment Variables (`backend/.env`)

```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/bookmultirole
SECRET_KEY=change-this-to-a-long-random-string
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

## Tech Notes

- Passwords are hashed with `passlib[bcrypt]`.
- Auth uses OAuth2 Password Bearer flow + JWT (`python-jose`).
- Role checks are implemented as reusable FastAPI dependencies (`require_role(...)`).
- CORS is enabled for `http://localhost:3000` by default — update in `app/main.py` for production.

## License

MIT
