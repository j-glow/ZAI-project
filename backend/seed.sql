-- Drop existing tables
DROP TABLE IF EXISTS "Measurements";
DROP TABLE IF EXISTS "Series";
DROP TABLE IF EXISTS "Users";

-- Create Users table
CREATE TABLE "Users" (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Create Series table
CREATE TABLE "Series" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    min_value FLOAT NOT NULL,
    max_value FLOAT NOT NULL,
    color VARCHAR(255),
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Create Measurements table
CREATE TABLE "Measurements" (
    id SERIAL PRIMARY KEY,
    value FLOAT NOT NULL,
    "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL,
    "seriesId" INTEGER REFERENCES "Series" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Clear existing data
TRUNCATE TABLE "Users", "Series", "Measurements" RESTART IDENTITY CASCADE;

-- Insert Users
-- Passwords are pre-hashed using bcrypt.
-- admin:admin, sensor1:sensor1, sensor2:sensor2, sensor3:sensor3
INSERT INTO "Users" (username, password, "createdAt", "updatedAt") VALUES
('admin', '$2b$10$Hw7b7ei04rfA9EPal6Qite936S5qv6rmY/XK2oXaOPXc0P.viXyEi', NOW(), NOW()),
('sensor1', '$2b$10$ZR818hu.gsaiQy0lM33wL.bGkz5Iu8IZSpSvMHdmN3P5HPb.EUO..', NOW(), NOW()),
('sensor2', '$2b$10$PrfZsWGGCJRcxOLff4LJ0eTslhOQsxbm96YqxLuGip3HefC3IsmSK', NOW(), NOW()),
('sensor3', '$2b$10$Uh2NG9E7uw6skEX2oYc2qejrm9y/iZZdNiRRY3SrDUwpBwei/L62a', NOW(), NOW());

-- Insert Series
INSERT INTO "Series" (name, min_value, max_value, color, "createdAt", "updatedAt") VALUES
('Temperature', -20, 50, '#ff6384', NOW(), NOW()),
('Humidity', 0, 100, '#36a2eb', NOW(), NOW()),
('Pressure', 900, 1100, '#cc65fe', NOW(), NOW());

-- Insert Measurements
-- Generate 100 sample measurements
DO $$
DECLARE
    series_count INTEGER := 3;
    v_series_id INTEGER;
    v_min_value NUMERIC;
    v_max_value NUMERIC;
    v_value NUMERIC;
    v_timestamp TIMESTAMP;
BEGIN
    FOR i IN 1..100 LOOP
        -- Cycle through series IDs 1, 2, 3
        v_series_id := (i - 1) % series_count + 1;

        -- Get min/max for the selected series
        SELECT min_value, max_value INTO v_min_value, v_max_value FROM "Series" WHERE id = v_series_id;

        -- Generate a random value within the series' range
        v_value := random() * (v_max_value - v_min_value) + v_min_value;

        -- Generate a timestamp, one per hour for the last 100 hours
        v_timestamp := NOW() - (i * interval '1 hour');

        INSERT INTO "Measurements" (value, "timestamp", "seriesId", "createdAt", "updatedAt")
        VALUES (v_value, v_timestamp, v_series_id, NOW(), NOW());
    END LOOP;
END $$;

-- Verify insertion counts
SELECT 'Users' as table_name, COUNT(*) FROM "Users"
UNION ALL
SELECT 'Series', COUNT(*) FROM "Series"
UNION ALL
SELECT 'Measurements', COUNT(*) FROM "Measurements";