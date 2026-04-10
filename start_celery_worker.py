#!/usr/bin/env python3
"""
Startup script for Celery worker.
Run this script to start the Celery worker for async task processing.
"""

import os
import sys
from src.celery_app import celery_app

if __name__ == "__main__":
    # Set environment variables
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "settings")
    
    # Start Celery worker
    celery_app.start([
        "worker",
        "--loglevel=info",
        "--concurrency=4",
        "--prefetch-multiplier=1",
        "--max-tasks-per-child=1000"
    ])
