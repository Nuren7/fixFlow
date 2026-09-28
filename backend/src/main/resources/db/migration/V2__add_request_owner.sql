ALTER TABLE maintenance_requests
ADD COLUMN IF NOT EXISTS owner_id BIGINT;
ALTER TABLE maintenance_requests
ADD CONSTRAINT fk_requests_owner FOREIGN KEY (owner_id) REFERENCES users(id);