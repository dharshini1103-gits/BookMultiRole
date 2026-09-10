from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user, require_role
from app.models import User, RoleEnum
from app.schemas import UserOut, UserUpdateRole

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me", response_model=UserOut)
def get_my_profile(current_user: User = Depends(get_current_user)):
    return current_user


# ---------- Admin-only user management ----------

@router.get(
    "/",
    response_model=List[UserOut],
    dependencies=[Depends(require_role([RoleEnum.admin]))],
)
def list_users(db: Session = Depends(get_db)):
    return db.query(User).order_by(User.created_at.desc()).all()


@router.patch(
    "/{user_id}/role",
    response_model=UserOut,
    dependencies=[Depends(require_role([RoleEnum.admin]))],
)
def change_user_role(user_id: int, payload: UserUpdateRole, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.role = payload.role
    db.commit()
    db.refresh(user)
    return user


@router.patch(
    "/{user_id}/deactivate",
    response_model=UserOut,
    dependencies=[Depends(require_role([RoleEnum.admin]))],
)
def deactivate_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.is_active = 0
    db.commit()
    db.refresh(user)
    return user


@router.patch(
    "/{user_id}/activate",
    response_model=UserOut,
    dependencies=[Depends(require_role([RoleEnum.admin]))],
)
def activate_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.is_active = 1
    db.commit()
    db.refresh(user)
    return user
