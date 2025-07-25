from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.db.session import get_db
from . import schemas, service, security, models

router = APIRouter()

@router.post("/register", response_model=schemas.UserRead, status_code=status.HTTP_201_CREATED)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = service.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email já registrado")
    return service.create_user(db=db, user=user)

@router.post("/login", response_model=schemas.Token)
def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: Session = Depends(get_db),
):
    user = service.get_user_by_email(db, email=form_data.username)
    if not user or not user.hashed_password or not security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou senha incorretos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = security.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/google/login", response_model=schemas.Token)
async def google_login(
    request: schemas.GoogleLoginRequest,
    db: Session = Depends(get_db)
):
    try:
        user = await service.get_or_create_user_from_google(db, request.code)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Login Google falhou: {e}")

    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Não foi possível validar as credenciais do Google")

    access_token = security.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/users/me", response_model=schemas.UserRead)
def read_users_me(current_user: Annotated[models.User, Depends(security.get_current_active_user)]):
    return current_user

@router.get("/users/", response_model=list[schemas.UserRead], tags=["users"])
def read_all_users(
    current_user: Annotated[models.User, Depends(security.get_current_active_user)],
    db: Session = Depends(get_db),
):
    """
    Retrieve all users.
    This is a protected endpoint that requires authentication.
    """
    users = service.get_all_users(db=db)
    return users
