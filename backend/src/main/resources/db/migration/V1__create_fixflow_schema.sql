CREATE TABLE organizations (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  role VARCHAR(50) NOT NULL,
  primary_skill VARCHAR(100),
  location VARCHAR(255),
  active_jobs INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
CREATE TABLE properties (
  id BIGSERIAL PRIMARY KEY,
  organization_id BIGINT NOT NULL,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_properties_organization FOREIGN KEY (organization_id) REFERENCES organizations(id)
);
CREATE TABLE units (
  id BIGSERIAL PRIMARY KEY,
  property_id BIGINT NOT NULL,
  unit_number VARCHAR(100) NOT NULL,
  location VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_units_property FOREIGN KEY (property_id) REFERENCES properties(id)
);
CREATE TABLE maintenance_requests (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  priority VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL,
  property_id BIGINT,
  unit_id BIGINT,
  customer_id BIGINT,
  assigned_technician_id BIGINT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_requests_property FOREIGN KEY (property_id) REFERENCES properties(id),
  CONSTRAINT fk_requests_unit FOREIGN KEY (unit_id) REFERENCES units(id),
  CONSTRAINT fk_requests_customer FOREIGN KEY (customer_id) REFERENCES users(id),
  CONSTRAINT fk_requests_technician FOREIGN KEY (assigned_technician_id) REFERENCES users(id)
);