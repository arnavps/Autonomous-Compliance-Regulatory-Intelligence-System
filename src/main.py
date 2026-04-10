from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="RegIntel API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "ok", "message": "RegIntel FastAPI Server is running."}

@app.get("/health")
def health_check():
    return {"status": "healthy"}