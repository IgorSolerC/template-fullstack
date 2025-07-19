from fastapi import APIRouter
from app.api.v1.endpoints import examples

api_router = APIRouter()
api_router.include_router(examples.router, prefix="/examples", tags=["Examples"])