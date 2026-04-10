import re
import logging
from dataclasses import dataclass
from datetime import datetime
from typing import List, Dict, Optional
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.documents import Document


# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

@dataclass
class ParsedDocument:
    """Standardized structure for parsed regulatory documents."""
    text: str
    circular_id: str
    issuing_body: str
    date_issued: str
    title: Optional[str] = None

def clean_text(text: str) -> str:
    """Normalize whitespace and remove non-standard characters."""
    # Replace multiple spaces/newlines with single ones
    text = re.sub(r'\s+', ' ', text)
    # Remove non-printable characters but keep standard punctuation
    text = re.sub(r'[^\x20-\x7E\n]', '', text)
    return text.strip()

def chunk_document(doc: ParsedDocument) -> List[Document]:
    """
    Splits a ParsedDocument into semantic chunks while preserving 
    regulatory obligation integrity.
    """
    # Clean the text before chunking
    cleaned_text = clean_text(doc.text)
    
    # Configure RecursiveCharacterTextSplitter
    # Prioritizing paragraph breaks (\n\n) then newlines (\n) then sentence boundaries (. )
    # This prevents splitting in the middle of "SHALL/SHALL NOT" statements where possible.
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=512,
        chunk_overlap=50,
        separators=["\n\n", "\n", ". ", " ", ""],
        length_function=len
    )
    
    # Generate raw chunks
    raw_chunks = splitter.split_text(cleaned_text)
    
    # Create LangChain Document objects with enriched metadata
    documents = []
    for i, chunk_content in enumerate(raw_chunks):
        metadata = {
            "circular_id": doc.circular_id,
            "issuing_body": doc.issuing_body,
            "date_issued": doc.date_issued,
            "title": doc.title or "Unknown Title",
            "status": "active",
            "chunk_index": i,
            "scraped_at": datetime.now().isoformat()
        }
        documents.append(Document(page_content=chunk_content, metadata=metadata))
    
    logger.info(f"Generated {len(documents)} chunks for circular {doc.circular_id}")
    return documents

if __name__ == "__main__":
    # Example usage for manual testing
    example_text = """
    Section 12: KYC Requirements.
    Banks shall ensure that all customer documents are verified within 24 hours.
    Multiple occurrences of SHALL NOT should also be handled.
    
    Section 13: Penalties.
    Non-compliance will result in penalties as per RBI guidelines.
    """
    
    example_doc = ParsedDocument(
        text=example_text,
        circular_id="RBI/2024/001",
        issuing_body="RBI",
        date_issued="2024-04-10",
        title="KYC and Penalties Update"
    )
    
    chunks = chunk_document(example_doc)
    for i, c in enumerate(chunks):
        print(f"--- Chunk {i} ---")
        print(f"Content: {c.page_content}")
        print(f"Metadata: {c.metadata}")