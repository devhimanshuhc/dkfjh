from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.errors import register_error_handlers
from app.routers import wind
from config import config, logger


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("App starting")
    yield
    logger.info("App stopping")


app = FastAPI(
    title="Wind Forecast Monitor API",
    description="UK national wind generation: actuals vs forecasts for "
    "January 2026 day-ahead purchase decisions (Elexon BMRS data).",
    version="0.1.0",
    lifespan=lifespan,
    debug=config.DEBUG,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=config.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

register_error_handlers(app)
app.include_router(wind.router)


@app.get("/health")
async def health():
    return {"status": "healthy", "message": "OK"}


@app.get("/")
async def root():
    return {"message": "Hello World"}
