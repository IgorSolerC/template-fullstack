from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import os
import sys

sys.path.insert(0, os.path.realpath(os.path.join(os.path.dirname(__file__), '..')))

from app.api.v1.api import api_router

app = FastAPI(title="My Project API")

# --- CORS MIDDLEWARE SETUP ---
origins = [
    "http://localhost:4200",  # Angular app's origin
    # Add your production frontend origin here later
    # e.g., "https://my-awesome-app.com"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows specific origins
    allow_credentials=True,
    allow_methods=["*"],    # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],    # Allows all headers
)

@app.get("/", tags=["Root"])
def read_root():
    return {"message": "Welcome to the API!"}

# Include the V1 router
app.include_router(api_router, prefix="/api/v1")

# You can add more routers for other versions or functionalities here
# e.g., app.include_router(admin_router, prefix="/admin")