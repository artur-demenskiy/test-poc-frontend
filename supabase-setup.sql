-- Supabase Database Setup Script
-- Run this in your Supabase SQL editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create items table
CREATE TABLE IF NOT EXISTS items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_items_updated_at 
    BEFORE UPDATE ON items 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE items ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users to read all items
CREATE POLICY "Users can view all items" ON items
    FOR SELECT USING (auth.role() = 'authenticated');

-- Create policy for authenticated users to insert items
CREATE POLICY "Users can insert items" ON items
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create policy for users to update their own items (optional - for more security)
-- CREATE POLICY "Users can update their own items" ON items
--     FOR UPDATE USING (auth.uid()::text = user_id);

-- Create policy for users to delete their own items (optional - for more security)
-- CREATE POLICY "Users can delete their own items" ON items
--     FOR DELETE USING (auth.uid()::text = user_id);

-- Alternative: Allow all authenticated users to update/delete any item
CREATE POLICY "Users can update all items" ON items
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can delete all items" ON items
    FOR DELETE USING (auth.role() = 'authenticated');

-- Insert some sample data
INSERT INTO items (name, description) VALUES
    ('Sample Item 1', 'This is a sample item for testing'),
    ('Sample Item 2', 'Another sample item with description'),
    ('Sample Item 3', 'Third sample item');

-- Create a more secure version with user ownership (uncomment if needed)
-- ALTER TABLE items ADD COLUMN user_id UUID REFERENCES auth.users(id);
-- 
-- CREATE POLICY "Users can view their own items" ON items
--     FOR SELECT USING (auth.uid() = user_id);
-- 
-- CREATE POLICY "Users can insert their own items" ON items
--     FOR INSERT WITH CHECK (auth.uid() = user_id);
-- 
-- CREATE POLICY "Users can update their own items" ON items
--     FOR UPDATE USING (auth.uid() = user_id);
-- 
-- CREATE POLICY "Users can delete their own items" ON items
--     FOR DELETE USING (auth.uid() = user_id); 