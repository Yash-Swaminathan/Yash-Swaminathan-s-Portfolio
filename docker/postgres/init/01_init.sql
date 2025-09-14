-- Portfolio Database Schema Initialization
-- This script runs automatically when the PostgreSQL container starts

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create button clicks tracking table
CREATE TABLE button_clicks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    button_name VARCHAR(100) NOT NULL,
    click_count INTEGER NOT NULL DEFAULT 0,
    last_clicked TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create unique index for button names
CREATE UNIQUE INDEX idx_button_clicks_button_name ON button_clicks(button_name);

-- Insert initial button tracking records
INSERT INTO button_clicks (button_name, click_count) VALUES
    ('download_resume', 0),
    ('view_project', 0),
    ('contact_form_submit', 0),
    ('social_linkedin', 0),
    ('social_github', 0),
    ('portfolio_demo', 0);

-- Create projects table for portfolio showcase
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    short_description VARCHAR(500),
    technologies JSONB,
    github_url VARCHAR(500),
    demo_url VARCHAR(500),
    image_url VARCHAR(500),
    featured BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create skills table
CREATE TABLE skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    proficiency_level INTEGER CHECK (proficiency_level >= 1 AND proficiency_level <= 10),
    years_experience DECIMAL(3,1),
    display_order INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create experiences table
CREATE TABLE experiences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company VARCHAR(200) NOT NULL,
    position VARCHAR(200) NOT NULL,
    location VARCHAR(100),
    start_date DATE NOT NULL,
    end_date DATE,
    is_current BOOLEAN DEFAULT FALSE,
    description TEXT,
    technologies JSONB,
    achievements TEXT[],
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create contact messages table
CREATE TABLE contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(200) NOT NULL,
    subject VARCHAR(200),
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'unread',
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP WITH TIME ZONE
);

-- Create analytics table for general tracking
CREATE TABLE analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type VARCHAR(100) NOT NULL,
    event_data JSONB,
    session_id UUID,
    ip_address INET,
    user_agent TEXT,
    referrer VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_projects_featured ON projects(featured) WHERE featured = TRUE;
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_display_order ON projects(display_order);
CREATE INDEX idx_skills_category ON skills(category);
CREATE INDEX idx_skills_featured ON skills(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_experiences_current ON experiences(is_current) WHERE is_current = TRUE;
CREATE INDEX idx_experiences_dates ON experiences(start_date DESC, end_date DESC);
CREATE INDEX idx_contact_messages_status ON contact_messages(status);
CREATE INDEX idx_contact_messages_created ON contact_messages(created_at DESC);
CREATE INDEX idx_analytics_event_type ON analytics(event_type);
CREATE INDEX idx_analytics_created ON analytics(created_at DESC);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_button_clicks_updated_at BEFORE UPDATE ON button_clicks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to increment button clicks
CREATE OR REPLACE FUNCTION increment_button_click(button_name_param VARCHAR)
RETURNS INTEGER AS $$
DECLARE
    new_count INTEGER;
BEGIN
    INSERT INTO button_clicks (button_name, click_count, last_clicked)
    VALUES (button_name_param, 1, CURRENT_TIMESTAMP)
    ON CONFLICT (button_name)
    DO UPDATE SET
        click_count = button_clicks.click_count + 1,
        last_clicked = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP;

    SELECT click_count INTO new_count
    FROM button_clicks
    WHERE button_name = button_name_param;

    RETURN new_count;
END;
$$ LANGUAGE plpgsql;

-- Insert some sample data for development
INSERT INTO projects (title, description, short_description, technologies, featured, display_order) VALUES
    ('Portfolio Website', 'A modern, responsive portfolio website built with cutting-edge technologies', 'Personal portfolio showcasing projects and skills', '["PostgreSQL", "Docker", "React", "Node.js"]', TRUE, 1),
    ('Sample Project', 'A demonstration project for the portfolio', 'Example project entry for portfolio display', '["JavaScript", "HTML", "CSS"]', FALSE, 2);

INSERT INTO skills (name, category, proficiency_level, is_featured, display_order) VALUES
    ('PostgreSQL', 'Database', 8, TRUE, 1),
    ('Docker', 'DevOps', 7, TRUE, 2),
    ('JavaScript', 'Programming', 9, TRUE, 3),
    ('React', 'Frontend', 8, TRUE, 4),
    ('Node.js', 'Backend', 7, TRUE, 5);

-- Create a view for button click statistics
CREATE VIEW button_click_stats AS
SELECT
    button_name,
    click_count,
    last_clicked,
    created_at,
    CASE
        WHEN last_clicked >= CURRENT_DATE THEN 'Today'
        WHEN last_clicked >= CURRENT_DATE - INTERVAL '7 days' THEN 'This Week'
        WHEN last_clicked >= CURRENT_DATE - INTERVAL '30 days' THEN 'This Month'
        ELSE 'Older'
    END as recency
FROM button_clicks
ORDER BY click_count DESC, last_clicked DESC;