import os
import sqlite3
import hashlib
import random
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

def save_url(url: str, title: str, body: str):
    """Save a processed URL to the database."""
    url_hash = get_url_hash(url)
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
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
    base_url = "https://rbi.org.in/Scripts/BS_CircularIndexDisplay.aspx"
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
    index_url = "https://www.sebi.gov.in/sebiweb/home/HomeAction.do?doListing=yes&sid=1&ssid=7&smid=0"
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

def main():
    """Entry point for the Monitor Agent."""
    init_db()
    
    all_new = []
    try:
        all_new.extend(scrape_rbi())
        all_new.extend(scrape_sebi())
    except Exception as e:
        logger.error(f"Unexpected error during scraping: {e}")
    
    if all_new:
        logger.info(f"Monitor Agent completed. Found {len(all_new)} new documents.")
    else:
        logger.info("Monitor Agent completed. No new items found.")
    
    return all_new

if __name__ == "__main__":
    main()