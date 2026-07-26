-- Migration: Add user_email column for Multi-Tenant Isolation
-- Fixes: AI Research Assistant Chat History Leak

-- Add user_email column to conversations table
ALTER TABLE conversations 
ADD COLUMN IF NOT EXISTS user_email VARCHAR NOT NULL DEFAULT 'unknown';

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_conversations_user_email ON conversations(user_email);

-- Backfill existing conversations with a placeholder
-- NOTE: These conversations will NOT be visible to any user until assigned
UPDATE conversations 
SET user_email = 'legacy_conversation' 
WHERE user_email IS NULL OR user_email = 'unknown';

-- Make the column NOT NULL after backfill
ALTER TABLE conversations ALTER COLUMN user_email SET NOT NULL;

-- Add check constraint to prevent empty emails
ALTER TABLE conversations 
ADD CONSTRAINT chk_user_email_not_empty 
CHECK (user_email <> '' AND user_email <> 'null' AND user_email <> 'undefined');
