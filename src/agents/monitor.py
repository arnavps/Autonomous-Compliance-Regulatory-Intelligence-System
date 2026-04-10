import os
import asyncio
import json
import sqlite3
import hashlib
import random
from typing import Any
from src.utils.llm_config import config
from src.utils.db_utils import log_decision
import time
import requests
from bs4 import BeautifulSoup
from datetime import datetime
from typing import List, Dict, Optional
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Constants
# Relative to current workspace root
DB_PATH = os.path.join(os.getcwd(), 'data', 'seen_urls.db')
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
    'Referer': 'https://www.google.com/'
}

def init_db():
    """Initialize the SQLite database for deduplication."""
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS seen (
            url_hash TEXT PRIMARY KEY,
            url TEXT,
            title TEXT,
            issuing_body TEXT,
            scraped_at TIMESTAMP
        )
    ''')
    
    # Add new columns if they don't exist
    columns_to_add = [
        ("status", "TEXT DEFAULT 'final'"),
        ("early_warning_flag", "BOOLEAN DEFAULT FALSE"),
        ("proposed_change", "TEXT"),
        ("affected_entities", "TEXT"),
        ("urgency", "TEXT"),
        ("probability", "TEXT")
    ]
    for col_name, col_type in columns_to_add:
        try:
            cursor.execute(f"ALTER TABLE seen ADD COLUMN {col_name} {col_type}")
        except sqlite3.OperationalError:
            pass # Column already exists
            
    conn.commit()
    conn.close()
    logger.info(f"Database initialized at {DB_PATH}")

def get_url_hash(url: str) -> str:
    """Generate MD5 hash for a URL."""
    return hashlib.md5(url.encode()).hexdigest()

def is_new(url: str) -> bool:
    """Check if a URL has already been processed."""
    url_hash = get_url_hash(url)
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('SELECT 1 FROM seen WHERE url_hash = ?', (url_hash,))
    result = cursor.fetchone()
    conn.close()
    return result is None

def save_url(url: str, title: str, body: str, metadata: dict = None):
    """Save a processed URL to the database."""
    url_hash = get_url_hash(url)
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    if metadata:
        cursor.execute('''
            INSERT OR IGNORE INTO seen (url_hash, url, title, issuing_body, scraped_at, status, early_warning_flag, proposed_change, affected_entities, urgency, probability)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (url_hash, url, title, body, datetime.now(), 
              metadata.get("status", "final"),
              metadata.get("early_warning_flag", False),
              metadata.get("proposed_change"),
              metadata.get("affected_entities"),
              metadata.get("urgency"),
              metadata.get("probability")))
    else:
        cursor.execute('''
            INSERT OR IGNORE INTO seen (url_hash, url, title, issuing_body, scraped_at)
            VALUES (?, ?, ?, ?, ?)
        ''', (url_hash, url, title, body, datetime.now()))
        
    conn.commit()
    conn.close()

def fetch_page(url: str, session: Optional[requests.Session] = None) -> Optional[str]:
    """Fetch HTML content with error handling and polite delay."""
    time.sleep(random.uniform(0.5, 2.0))
    try:
        if session:
            response = session.get(url, headers=HEADERS, timeout=15)
        else:
            response = requests.get(url, headers=HEADERS, timeout=15)
        response.raise_for_status()
        return response.text
    except Exception as e:
        logger.error(f"Error fetching {url}: {e}")
        return None

def scrape_rbi() -> List[Dict]:
    """Scrape the RBI circulars portal."""
    base_url = config.RBI_BASE_URL
    logger.info("Scraping RBI portal...")
    html = fetch_page(base_url)
    if not html:
        return []

    soup = BeautifulSoup(html, 'html.parser')
    new_docs = []
    
    # RBI Index Table links usually have class 'link2'
    links = soup.select('a.link2')
    for link in links[:5]:  # Limit for demo
        href = link.get('href', '')
        if not href or 'Id=' not in href:
            continue
            
        detail_url = "https://rbi.org.in/Scripts/" + href
        title = link.text.strip()
        
        if is_new(detail_url):
            logger.info(f"Found potential new RBI doc: {title}")
            detail_html = fetch_page(detail_url)
            if detail_html:
                detail_soup = BeautifulSoup(detail_html, 'html.parser')
                pdf_link = detail_soup.find('a', href=lambda x: x and x.upper().endswith('.PDF'))
                if pdf_link:
                    actual_pdf_url = pdf_link['href']
                    if not actual_pdf_url.startswith('http'):
                        actual_pdf_url = "https://rbi.org.in" + actual_pdf_url
                    
                    new_item = {
                        'url': actual_pdf_url,
                        'title': title,
                        'issuing_body': 'RBI'
                    }
                    new_docs.append(new_item)
                    save_url(detail_url, title, 'RBI')
    
    return new_docs

def scrape_sebi() -> List[Dict]:
    """Scrape the SEBI circulars portal."""
    index_url = config.SEBI_CIRCULARS_URL
    logger.info("Scraping SEBI portal...")
    
    session = requests.Session()
    fetch_page("https://www.sebi.gov.in/", session)
    
    html = fetch_page(index_url, session)
    if not html:
        return []

    soup = BeautifulSoup(html, 'html.parser')
    new_docs = []
    
    # SEBI links
    links = soup.select('a.points')
    for link in links[:5]:
        detail_url = link.get('href', '')
        if not detail_url:
            continue
            
        title = link.text.strip()
        
        if is_new(detail_url):
            logger.info(f"Found potential new SEBI doc: {title}")
            detail_html = fetch_page(detail_url, session)
            if detail_html:
                detail_soup = BeautifulSoup(detail_html, 'html.parser')
                # Find PDF link containing 'attachdocs'
                pdf_link = detail_soup.find('a', href=lambda x: x and 'attachdocs' in x.lower())
                if pdf_link:
                    actual_pdf_url = pdf_link['href']
                    if not actual_pdf_url.startswith('http'):
                        actual_pdf_url = "https://www.sebi.gov.in" + actual_pdf_url
                        
                    new_item = {
                        'url': actual_pdf_url,
                        'title': title,
                        'issuing_body': 'SEBI'
                    }
                    new_docs.append(new_item)
                    save_url(detail_url, title, 'SEBI')
                    
    return new_docs

def check_for_drafts() -> List[Dict]:
    """Check for early warning draft regulations and extract intelligence."""
    try:
        from src.engine.llm_config import extract_early_warning_metadata
    except ImportError:
        logger.warning("Could not import extract_early_warning_metadata")
        return []
        
    new_drafts = []
    
    # 1. RBI Drafts
    logger.info("Checking for RBI Drafts...")
    rbi_draft_url = getattr(config, 'RBI_DRAFT_URL', "https://rbi.org.in/Scripts/bs_viewcontent.aspx")
    html = fetch_page(rbi_draft_url)
    if html:
        soup = BeautifulSoup(html, 'html.parser')
        links = soup.select('a.link2')
        for link in links[:3]:  # Demo limit
            title = link.text.strip()
            # Simple heuristic since actual structure varies
            is_draft = any(word in title.lower() for word in ['draft', 'consultation', 'discussion', 'comments'])
            if is_draft or True:  # Forcing true for demo purposes
                href = link.get('href', '')
                detail_url = "https://rbi.org.in/Scripts/" + href if 'Id=' in href else href
                
                if detail_url and is_new(detail_url):
                    logger.info(f"Found RBI Draft: {title}")
                    metadata = extract_early_warning_metadata(title)
                    metadata["status"] = "draft"
                    metadata["early_warning_flag"] = True
                    
                    new_item = {
                        'url': detail_url,
                        'title': title,
                        'issuing_body': 'RBI',
                        **metadata
                    }
                    new_drafts.append(new_item)
                    save_url(detail_url, title, 'RBI', metadata=metadata)
    
    # 2. SEBI Drafts
    logger.info("Checking for SEBI Drafts...")
    sebi_draft_url = getattr(config, 'SEBI_DRAFT_URL', "https://www.sebi.gov.in/reports-and-statistics/")
    session = requests.Session()
    fetch_page("https://www.sebi.gov.in/", session)
    html = fetch_page(sebi_draft_url, session)
    if html:
        soup = BeautifulSoup(html, 'html.parser')
        links = soup.select('a.points')
        for link in links[:3]:
            title = link.text.strip()
            detail_url = link.get('href', '')
            
            if detail_url and is_new(detail_url):
                logger.info(f"Found SEBI Draft: {title}")
                metadata = extract_early_warning_metadata(title)
                metadata["status"] = "draft"
                metadata["early_warning_flag"] = True
                
                new_item = {
                    'url': detail_url,
                    'title': title,
                    'issuing_body': 'SEBI',
                    **metadata
                }
                new_drafts.append(new_item)
                save_url(detail_url, title, 'SEBI', metadata=metadata)
                
    return new_drafts


def run_discovery() -> List[Dict[str, Any]]:
    """
    Primary interface for the Orchestrator to discover new regulatory documents.
    """
    init_db()
    all_new = []
    try:
        all_new.extend(scrape_rbi())
        all_new.extend(scrape_sebi())
        all_new.extend(check_for_drafts())
    except Exception as e:
        logger.error(f"Unexpected error during scraping: {e}")
    
    return all_new

if __name__ == "__main__":
    init_db()
    docs = run_discovery()
    print(f"Found {len(docs)} new documents.")