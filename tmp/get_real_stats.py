import sqlite3
import os
import pickle

def get_stats():
    # 1. Circulars count
    db_path = 'data/seen_urls.db'
    circulars = 0
    if os.path.exists(db_path):
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        try:
            cursor.execute('SELECT COUNT(*) FROM seen')
            circulars = cursor.fetchone()[0]
        except:
            pass
        conn.close()
    
    # 2. Conflicts (from graph)
    conflicts = 0
    graph_path = 'data/regulatory_graph.gpickle'
    if os.path.exists(graph_path):
        import networkx as nx
        try:
            with open(graph_path, 'rb') as f:
                G = pickle.load(f)
                # Count 'CONTRADICTS' edges
                conflicts = sum(1 for _, _, d in G.edges(data=True) if d.get('type') == 'CONTRADICTS')
        except:
            pass

    # 3. Draft Warnings (from reports)
    warnings = 0
    reports_dir = 'reports'
    if os.path.exists(reports_dir):
        for f in os.listdir(reports_dir):
            if f.endswith('.md'):
                with open(os.path.join(reports_dir, f), 'r', encoding='utf-8') as rf:
                    if 'HUMAN REVIEW REQUIRED' in rf.read():
                        warnings += 1

    print(f"Stats: {{'circulars': {circulars}, 'conflicts': {conflicts // 2}, 'warnings': {warnings}}}")

if __name__ == "__main__":
    get_stats()
