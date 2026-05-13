from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

import os
import uuid
import logging
import bcrypt
import jwt
from datetime import datetime, timezone, timedelta
from typing import Optional, List
from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Depends
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, EmailStr, ConfigDict


# ---------- DB ----------
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# ---------- App ----------
app = FastAPI(title="Asphalt Armour API")
api_router = APIRouter(prefix="/api")

JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_MINUTES = 60 * 24  # 24h for admin convenience


# ---------- Auth helpers ----------
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
    except Exception:
        return False


def get_jwt_secret() -> str:
    return os.environ["JWT_SECRET"]


def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_MINUTES),
        "type": "access",
    }
    return jwt.encode(payload, get_jwt_secret(), algorithm=JWT_ALGORITHM)


async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, get_jwt_secret(), algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user = await db.users.find_one({"id": payload["sub"]}, {"_id": 0, "password_hash": 0})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


# ---------- Models ----------
class LoginInput(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    email: EmailStr
    name: str
    role: str


class QuoteCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    email: EmailStr
    phone: str = Field(..., min_length=5, max_length=40)
    address: str = Field(..., min_length=1, max_length=300)
    service_type: str = Field(..., min_length=1)  # sealcoating | crack_filling | both
    property_type: str = Field(..., min_length=1)  # residential | commercial
    square_footage: Optional[str] = None
    notes: Optional[str] = Field(None, max_length=2000)


class QuoteOut(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    name: str
    email: EmailStr
    phone: str
    address: str
    service_type: str
    property_type: str
    square_footage: Optional[str] = None
    notes: Optional[str] = None
    status: str
    created_at: str


class QuoteStatusUpdate(BaseModel):
    status: str  # new | contacted | quoted | archived


class ContactCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    email: EmailStr
    phone: Optional[str] = None
    message: str = Field(..., min_length=1, max_length=2000)


class ContactOut(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    name: str
    email: EmailStr
    phone: Optional[str] = None
    message: str
    is_read: bool
    created_at: str


# ---------- Auth Routes ----------
@api_router.post("/auth/login", response_model=UserOut)
async def login(payload: LoginInput, response: Response):
    email = payload.email.lower().strip()
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_access_token(user["id"], user["email"])
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=True,
        samesite="none",
        max_age=ACCESS_TOKEN_MINUTES * 60,
        path="/",
    )
    return UserOut(id=user["id"], email=user["email"], name=user["name"], role=user["role"])


@api_router.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie("access_token", path="/")
    return {"message": "Logged out"}


@api_router.get("/auth/me", response_model=UserOut)
async def me(current_user: dict = Depends(get_current_user)):
    return UserOut(**current_user)


# ---------- Quotes ----------
@api_router.post("/quotes", response_model=QuoteOut, status_code=201)
async def create_quote(payload: QuoteCreate):
    doc = {
        "id": str(uuid.uuid4()),
        **payload.model_dump(),
        "status": "new",
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.quotes.insert_one(doc)
    doc.pop("_id", None)
    return QuoteOut(**doc)


@api_router.get("/quotes", response_model=List[QuoteOut])
async def list_quotes(current_user: dict = Depends(get_current_user)):
    cursor = db.quotes.find({}, {"_id": 0}).sort("created_at", -1)
    return [QuoteOut(**doc) async for doc in cursor]


@api_router.patch("/quotes/{quote_id}/status", response_model=QuoteOut)
async def update_quote_status(quote_id: str, payload: QuoteStatusUpdate, current_user: dict = Depends(get_current_user)):
    if payload.status not in ("new", "contacted", "quoted", "archived"):
        raise HTTPException(status_code=400, detail="Invalid status")
    result = await db.quotes.find_one_and_update(
        {"id": quote_id},
        {"$set": {"status": payload.status}},
        projection={"_id": 0},
        return_document=True,
    )
    if not result:
        raise HTTPException(status_code=404, detail="Quote not found")
    return QuoteOut(**result)


# ---------- Contact ----------
@api_router.post("/contact", response_model=ContactOut, status_code=201)
async def create_contact(payload: ContactCreate):
    doc = {
        "id": str(uuid.uuid4()),
        **payload.model_dump(),
        "is_read": False,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.contacts.insert_one(doc)
    doc.pop("_id", None)
    return ContactOut(**doc)


@api_router.get("/contact", response_model=List[ContactOut])
async def list_contact(current_user: dict = Depends(get_current_user)):
    cursor = db.contacts.find({}, {"_id": 0}).sort("created_at", -1)
    return [ContactOut(**doc) async for doc in cursor]


@api_router.patch("/contact/{contact_id}/read", response_model=ContactOut)
async def mark_contact_read(contact_id: str, current_user: dict = Depends(get_current_user)):
    result = await db.contacts.find_one_and_update(
        {"id": contact_id},
        {"$set": {"is_read": True}},
        projection={"_id": 0},
        return_document=True,
    )
    if not result:
        raise HTTPException(status_code=404, detail="Contact not found")
    return ContactOut(**result)


# ---------- Health ----------
@api_router.get("/")
async def root():
    return {"message": "Asphalt Armour API"}


# ---------- Startup ----------
@app.on_event("startup")
async def startup_seed():
    await db.users.create_index("email", unique=True)
    await db.quotes.create_index("created_at")
    await db.contacts.create_index("created_at")

    admin_email = os.environ.get("ADMIN_EMAIL", "admin@asphaltarmour.com").lower()
    admin_password = os.environ.get("ADMIN_PASSWORD", "admin123")
    existing = await db.users.find_one({"email": admin_email})
    if existing is None:
        await db.users.insert_one({
            "id": str(uuid.uuid4()),
            "email": admin_email,
            "password_hash": hash_password(admin_password),
            "name": "Admin",
            "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
    elif not verify_password(admin_password, existing["password_hash"]):
        await db.users.update_one(
            {"email": admin_email},
            {"$set": {"password_hash": hash_password(admin_password)}},
        )


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()


app.include_router(api_router)

# CORS — must allow credentials and reflect specific origins
frontend_url = os.environ.get("FRONTEND_URL", "http://localhost:3000")
cors_origins = [frontend_url, "http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)
