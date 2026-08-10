CREATE TABLE IF NOT EXISTS ocr_documents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  owner_id TEXT NOT NULL REFERENCES users(id),
  file_key TEXT NOT NULL,
  original_name TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  subject TEXT NOT NULL DEFAULT '',
  year INTEGER,
  exam_type TEXT NOT NULL DEFAULT 'Final',
  status TEXT NOT NULL DEFAULT 'processing',
  extracted_text TEXT NOT NULL DEFAULT '',
  error TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_ocr_documents_file_key ON ocr_documents(file_key);
CREATE INDEX IF NOT EXISTS idx_ocr_documents_status_created ON ocr_documents(status, created_at);
