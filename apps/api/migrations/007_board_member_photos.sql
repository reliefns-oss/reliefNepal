-- Add photo fields to board_members table
ALTER TABLE board_members
ADD COLUMN IF NOT EXISTS photo_url TEXT,
ADD COLUMN IF NOT EXISTS photo_public_id VARCHAR(255); -- Format: relief-nepal/board/uuid