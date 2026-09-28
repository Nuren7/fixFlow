ALTER TABLE maintenance_requests
ADD COLUMN IF NOT EXISTS owner_id BIGINT;
DO $$ BEGIN IF NOT EXISTS (
  SELECT 1
  FROM pg_constraint
  WHERE conname = 'fk_requests_owner'
    AND conrelid = 'maintenance_requests'::regclass
) THEN
ALTER TABLE maintenance_requests
ADD CONSTRAINT fk_requests_owner FOREIGN KEY (owner_id) REFERENCES users(id);
END IF;
END $$;