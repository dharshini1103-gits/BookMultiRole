from datetime import datetime
from typing import Optional, List

from pydantic import BaseModel, EmailStr, Field

from app.models import RoleEnum


# ---------- Auth / User ----------

class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str = Field(min_length=6)
    role: RoleEnum = RoleEnum.user


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    role: RoleEnum
    is_active: int
    created_at: datetime

    class Config:
        from_attributes = True


class UserUpdateRole(BaseModel):
    role: RoleEnum


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


# ---------- Review ----------

class ReviewCreate(BaseModel):
    rating: float = Field(ge=1, le=5)
    comment: Optional[str] = None


class ReviewOut(BaseModel):
    id: int
    rating: float
    comment: Optional[str]
    user_id: int
    user_name: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


# ---------- Book ----------

class BookCreate(BaseModel):
    title: str
    description: Optional[str] = None
    genre: Optional[str] = None
    cover_url: Optional[str] = None
    published_year: Optional[int] = None


class BookUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    genre: Optional[str] = None
    cover_url: Optional[str] = None
    published_year: Optional[int] = None


class BookOut(BaseModel):
    id: int
    title: str
    description: Optional[str]
    genre: Optional[str]
    cover_url: Optional[str]
    published_year: Optional[int]
    author_id: int
    author_name: Optional[str] = None
    average_rating: Optional[float] = 0.0
    created_at: datetime

    class Config:
        from_attributes = True


class BookDetailOut(BookOut):
    reviews: List[ReviewOut] = []
