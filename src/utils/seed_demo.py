import os
import shutil
import sqlite3
import hashlib
from datetime import datetime
from langchain_core.documents import Document

def clear_data():
    """Clear existing data to ensure a clean state."""
    chroma_path = os.path.join(os.getcwd(), 'data', 'chroma_regintel_semantic')
    bm25_path = os.path.join(os.getcwd(), 'data', 'bm25_regintel_semantic.pkl')
    graph_path = os.path.join(os.getcwd(), 'data', 'regulatory_graph.gpickle')
    db_path = os.path.join(os.getcwd(), 'data', 'seen_urls.db')

    if os.path.exists(chroma_path):
        shutil.rmtree(chroma_path)
    if os.path.exists(bm25_path):
        os.remove(bm25_path)
    if os.path.exists(graph_path):
        os.remove(graph_path)
    
    if os.path.exists(db_path):
        try:
            conn = sqlite3.connect(db_path)
            cur = conn.cursor()
            cur.execute("DELETE FROM seen")
            conn.commit()
            conn.close()
        except:
            pass

def seed_chroma():
    """Seed ChromaDB vector store with RBI and SEBI KYC contradictions."""
    # Import inside function to avoid loading issues if run from wrong directory
    from src.engine.retriever import VectorEngine
    
    engine = VectorEngine()
    
    docs = [
        Document(
            page_content="RBI Master Direction KYC 2023: V-CIP is acceptable for all regulated entities including NBFCs for customer verification.",
            metadata={"circular_id": "RBI/2023-24/73", "issuing_body": "RBI"}
        ),
        Document(
            page_content="SEBI KRA Circular 2022: In-Person Verification (IPV) is mandatory for all securities accounts and cannot be substituted entirely by video.",
            metadata={"circular_id": "SEBI/HO/MIRSD/2022/45", "issuing_body": "SEBI"}
        )
    ]
    engine.add_documents(docs)

def seed_graph():
    """Seed the RegulatoryGraph with circulars and the CONTRADICTS edge."""
    from src.engine.graph import RegulatoryGraph
    
    rg = RegulatoryGraph()
    
    rg.add_circular_node(
        "RBI/2023-24/73", 
        {"issuing_body": "RBI", "title": "RBI Master Direction KYC 2023", "topic": "KYC", "entity_affected": "Listed NBFC"}
    )
    rg.add_circular_node(
        "SEBI/HO/MIRSD/2022/45",
        {"issuing_body": "SEBI", "title": "SEBI KRA Circular 2022", "topic": "KYC", "entity_affected": "Listed NBFC"}
    )
    
    # Add CONTRADICTS edge
    rg.add_relationship("RBI/2023-24/73", "SEBI/HO/MIRSD/2022/45", "CONTRADICTS")

def seed_early_warning():
    """Insert a mock draft record for the Early Warning Radar."""
    from src.agents.monitor import init_db
    
    # Ensure tables and columns exist
    init_db()
    
    db_path = os.path.join(os.getcwd(), 'data', 'seen_urls.db')
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    
    url = "https://www.sebi.gov.in/reports-and-statistics/cybersecurity-2025"
    url_hash = hashlib.md5(url.encode()).hexdigest()
    
    cur.execute('''
        INSERT OR IGNORE INTO seen 
        (url_hash, url, title, issuing_body, scraped_at, status, early_warning_flag, urgency, probability)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (url_hash, url, "SEBI Cybersecurity Framework 2025", "SEBI", datetime.now(), "draft", 1, "High", "85%"))
    
    conn.commit()
    conn.close()

def run_seed():
    print("Clearing existing data...")
    clear_data()
    
    print("Seeding ChromaDB...")
    seed_chroma()
    
    print("Seeding Graph...")
    seed_graph()
    
    print("Seeding Early Warning Radar...")
    seed_early_warning()
    
    # Required exactly as per specifications
    print("Wow Moment Seeded: CONF-001 (RBI vs SEBI KYC) is now live in the graph.")

if __name__ == "__main__":
    run_seed()
