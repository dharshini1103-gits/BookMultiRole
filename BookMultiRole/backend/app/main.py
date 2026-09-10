from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.routers import auth, users, books

# Auto-create tables (use Alembic migrations for production)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="BookMultiRole API",
    description="Multi-role book management platform: Admin, Author, User",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(books.router)


@app.get("/", tags=["Health"])
def root():
    return {"status": "ok", "message": "BookMultiRole API is running"}
