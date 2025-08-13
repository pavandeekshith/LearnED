from fastapi import FastAPI, APIRouter, HTTPException, Depends, Header
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Dict
import uuid
from datetime import datetime, timedelta
import jwt


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Security
security = HTTPBearer()
SECRET_KEY = "learned_admin_secret_key_2024"  # In production, use environment variable
ALGORITHM = "HS256"

# Hardcoded admin credentials
ADMIN_EMAIL = "abcdef_pavan@gmail.com"
ADMIN_PASSWORD = "abcdef_pavan@gmail.com"


# Define Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

# Auth Models
class LoginRequest(BaseModel):
    email: str
    password: str

class LoginResponse(BaseModel):
    token: str
    message: str

# Content Models  
class ContentUpdate(BaseModel):
    key: str
    value: str

class ContentItem(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    key: str
    value: str
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    updated_by: str = "admin"

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# Auth helper functions
def create_access_token(data: dict):
    expire = datetime.utcnow() + timedelta(hours=24)
    to_encode = data.copy()
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None or email != ADMIN_EMAIL:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
        return email
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")

# Auth Routes
@api_router.post("/auth/login", response_model=LoginResponse)
async def login(request: LoginRequest):
    if request.email == ADMIN_EMAIL and request.password == ADMIN_PASSWORD:
        access_token = create_access_token(data={"sub": request.email})
        return LoginResponse(token=access_token, message="Login successful")
    else:
        raise HTTPException(status_code=401, detail="Invalid email or password")

# Content Management Routes
@api_router.get("/content")
async def get_all_content():
    try:
        content_items = await db.content.find({}, {"_id": 0}).to_list(1000)
        # Convert to key-value pairs for easy frontend consumption
        content_dict = {}
        for item in content_items:
            content_dict[item.get("key")] = item.get("value")
        return content_dict
    except Exception as e:
        logger.error(f"Error fetching content: {str(e)}")
        return {}

@api_router.put("/content/update")
async def update_content(request: ContentUpdate, admin_email: str = Depends(verify_token)):
    try:
        # Check if content exists
        existing = await db.content.find_one({"key": request.key})
        
        if existing:
            # Update existing content
            result = await db.content.update_one(
                {"key": request.key},
                {"$set": {"value": request.value, "updated_at": datetime.utcnow()}}
            )
        else:
            # Create new content
            content_item = ContentItem(key=request.key, value=request.value)
            result = await db.content.insert_one(content_item.dict())
        
        if result:
            return {"success": True, "message": "Content updated successfully"}
        else:
            raise HTTPException(status_code=500, detail="Failed to update content")
            
    except Exception as e:
        logger.error(f"Error updating content: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@api_router.get("/content/{key}")
async def get_content_by_key(key: str):
    try:
        content = await db.content.find_one({"key": key}, {"_id": 0})
        if content:
            return {"key": key, "value": content.get("value")}
        else:
            return {"key": key, "value": None}
    except Exception as e:
        logger.error(f"Error fetching content by key: {str(e)}")
        return {"key": key, "value": None}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
