from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import CORS_ORIGINS
from app.routers import assess, generate_path, update_path

app = FastAPI(title="Curriculum Generation Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(assess.router)
app.include_router(generate_path.router)
app.include_router(update_path.router)


@app.get("/")
def health():
    return {"status": "ok", "service": "curriculum-engine-api"}
