from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user, require_role
from app.models import Book, Review, User, RoleEnum
from app.schemas import BookCreate, BookUpdate, BookOut, BookDetailOut, ReviewCreate, ReviewOut

router = APIRouter(prefix="/books", tags=["Books"])


def _serialize_book(db: Session, book: Book) -> dict:
    avg = db.query(func.avg(Review.rating)).filter(Review.book_id == book.id).scalar()
    return {
        **BookOut.model_validate(book).model_dump(),
        "author_name": book.author.full_name if book.author else None,
        "average_rating": round(avg, 2) if avg else 0.0,
    }


@router.get("/", response_model=List[BookOut])
def list_books(
    search: Optional[str] = Query(None, description="Search by title"),
    genre: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(Book)
    if search:
        query = query.filter(Book.title.ilike(f"%{search}%"))
    if genre:
        query = query.filter(Book.genre.ilike(f"%{genre}%"))
    books = query.order_by(Book.created_at.desc()).all()
    return [_serialize_book(db, b) for b in books]


@router.get("/my-books", response_model=List[BookOut])
def my_books(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([RoleEnum.author, RoleEnum.admin])),
):
    books = db.query(Book).filter(Book.author_id == current_user.id).all()
    return [_serialize_book(db, b) for b in books]


@router.get("/{book_id}", response_model=BookDetailOut)
def get_book(book_id: int, db: Session = Depends(get_db)):
    book = db.query(Book).filter(Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    data = _serialize_book(db, book)
    reviews = []
    for r in book.reviews:
        reviews.append({
            **ReviewOut.model_validate(r).model_dump(),
            "user_name": r.user.full_name if r.user else None,
        })
    data["reviews"] = reviews
    return data


@router.post(
    "/",
    response_model=BookOut,
    dependencies=[Depends(require_role([RoleEnum.author, RoleEnum.admin]))],
)
def create_book(
    payload: BookCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    book = Book(**payload.model_dump(), author_id=current_user.id)
    db.add(book)
    db.commit()
    db.refresh(book)
    return _serialize_book(db, book)


@router.put("/{book_id}", response_model=BookOut)
def update_book(
    book_id: int,
    payload: BookUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    book = db.query(Book).filter(Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    if current_user.role != RoleEnum.admin and book.author_id != current_user.id:
        raise HTTPException(status_code=403, detail="You can only edit your own books")

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(book, field, value)
    db.commit()
    db.refresh(book)
    return _serialize_book(db, book)


@router.delete("/{book_id}", status_code=204)
def delete_book(
    book_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    book = db.query(Book).filter(Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    if current_user.role != RoleEnum.admin and book.author_id != current_user.id:
        raise HTTPException(status_code=403, detail="You can only delete your own books")
    db.delete(book)
    db.commit()
    return None


# ---------- Reviews ----------

@router.post("/{book_id}/reviews", response_model=ReviewOut, status_code=201)
def add_review(
    book_id: int,
    payload: ReviewCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    book = db.query(Book).filter(Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")

    review = Review(**payload.model_dump(), book_id=book_id, user_id=current_user.id)
    db.add(review)
    db.commit()
    db.refresh(review)
    return {
        **ReviewOut.model_validate(review).model_dump(),
        "user_name": current_user.full_name,
    }
