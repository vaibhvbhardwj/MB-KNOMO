CREATE TABLE contact_rate_limits (
  key TEXT PRIMARY KEY NOT NULL,
  bucket INTEGER NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 1
);
--> statement-breakpoint
CREATE INDEX contact_rate_bucket_idx ON contact_rate_limits (bucket);
