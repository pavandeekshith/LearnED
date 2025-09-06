from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List
import uuid
from datetime import datetime


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Define Models - Simplified for static site
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

# Contact form model
class ContactForm(BaseModel):
    name: str
    email: str
    phone: str = ""
    message: str

# Basic routes - keeping minimal functionality
@api_router.get("/")
async def root():
    return {"message": "LearnED Static API - Admin functionality removed"}

@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "message": "Static LearnED API is running"}

# Simple contact form endpoint (no database storage)
@api_router.post("/contact")
async def contact_form(contact_data: ContactForm):
    # In a static setup, you might want to use a service like EmailJS or similar
    # For now, just return success - in production you could integrate with email service
    logger.info(f"Contact form submitted: {contact_data.name} - {contact_data.email}")
    return {"success": True, "message": "Contact form submitted successfully"}

# Demo booking endpoint
@api_router.post("/demo")
async def book_demo(demo_data: dict):
    # Similar to contact form - could integrate with scheduling service
    logger.info(f"Demo booking: {demo_data}")
    return {"success": True, "message": "Demo booking submitted successfully"}

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
