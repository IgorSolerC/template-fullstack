from sqlalchemy.orm import Session
import httpx

from app.core.config import settings
from . import models, schemas, security

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = security.get_password_hash(user.password)
    db_user = models.User(
        email=user.email,
        hashed_password=hashed_password,
        full_name=user.full_name
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

async def get_or_create_user_from_google(db: Session, authorization_code: str):
    token_url = "https://oauth2.googleapis.com/token"
    token_data = {
        "code": authorization_code,
        "client_id": settings.GOOGLE_CLIENT_ID,
        "client_secret": settings.GOOGLE_CLIENT_SECRET,
        "redirect_uri": settings.GOOGLE_REDIRECT_URI,
        "grant_type": "authorization_code",
    }
    
    async with httpx.AsyncClient() as client:
        # Exchange code for access token
        token_response = await client.post(token_url, data=token_data)
        token_response.raise_for_status()
        access_token = token_response.json().get("access_token")

        # Get user info from Google
        userinfo_url = "https://www.googleapis.com/oauth2/v1/userinfo"
        headers = {"Authorization": f"Bearer {access_token}"}
        userinfo_response = await client.get(userinfo_url, headers=headers)
        userinfo_response.raise_for_status()
        user_info = userinfo_response.json()

    user = get_user_by_email(db, email=user_info["email"])
    if not user:
        user = models.User(
            email=user_info["email"],
            google_id=user_info["id"],
            full_name=user_info.get("name"),
            is_active=True
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    elif not user.google_id:
        user.google_id = user_info["id"]
        db.commit()
        db.refresh(user)
        
    return user


def get_all_users(db: Session):
    """
    Retrieves all users from the database.
    """
    return db.query(models.User).all()