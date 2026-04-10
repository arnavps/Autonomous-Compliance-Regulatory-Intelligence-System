from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import shutil
import os

class QueryRequest(BaseModel):
    query: str

app = FastAPI(title="ACRIS API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "ok", "message": "ACRIS FastAPI Server is running."}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.post("/api/upload")
async def upload_document(file: UploadFile = File(...)):
    # Define save directory
    save_dir = os.path.join("data", "policies")
    os.makedirs(save_dir, exist_ok=True)
    
    file_path = os.path.join(save_dir, file.filename)
    
    # Save the file safely
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    return {
        "status": "success",
        "message": "File uploaded successfully",
        "filename": file.filename,
        "path": file_path
    }

@app.post("/api/ask")
def query_acris(request: QueryRequest):
    # Simulated compliance response for UI testing
    return {
        "answer": f"Based on our analysis of the regulatory corpus regarding '{request.query}', the latest RBI guidelines stipulate strict enforcement of algorithmic lending caps. You must ensure all third-party API partnerships undergo a quarterly audit and report compliance directly to the supervisor.",
        "confidence": 88.5,
        "citations": [
            "RBI/2024-25/112 (Digital Lending Framework)",
            "SEBI Circular CIR/2023/89 (Algorithmic Trading)"
        ]
    }