-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE Users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    profile_picture VARCHAR(255),
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- WebsiteThemes table
CREATE TABLE WebsiteThemes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    config_json JSONB
);

-- Websites table
CREATE TABLE Websites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    theme_id UUID,
    domain VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255),
    cv_name VARCHAR(255),
    page_name VARCHAR(255),
    page_slug VARCHAR(255),
    is_cv_page BOOLEAN DEFAULT TRUE,
    page_content JSONB,
    description TEXT,
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (theme_id) REFERENCES WebsiteThemes(id)
);

-- BlockTypes table
CREATE TABLE BlockTypes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Blocks table
CREATE TABLE Blocks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    website_id UUID NOT NULL,
    block_type_id UUID NOT NULL,
    x INTEGER NOT NULL,
    y INTEGER NOT NULL,
    width INTEGER NOT NULL,
    height INTEGER NOT NULL,
    order_index INTEGER NOT NULL,
    content JSONB,
    FOREIGN KEY (website_id) REFERENCES Websites(id),
    FOREIGN KEY (block_type_id) REFERENCES BlockTypes(id)
);

-- Technologies table
CREATE TABLE Technologies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) UNIQUE NOT NULL,
    category VARCHAR(50),
    logo VARCHAR(255)
);

-- ProficiencyLevels table
CREATE TABLE ProficiencyLevels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL
);

-- UserTechnologies table
CREATE TABLE UserTechnologies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    website_id UUID NOT NULL,
    technology_id UUID NOT NULL,
    proficiency_level_id UUID,
    years_of_experience NUMERIC(4,2),
    FOREIGN KEY (website_id) REFERENCES Websites(id),
    FOREIGN KEY (technology_id) REFERENCES Technologies(id),
    FOREIGN KEY (proficiency_level_id) REFERENCES ProficiencyLevels(id)
);

-- ProjectTypes table
CREATE TABLE ProjectTypes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL
);

-- Projects table
CREATE TABLE Projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    url VARCHAR(255),
    start_date DATE,
    end_date DATE,
    image VARCHAR(255),
    project_type_id UUID,
    FOREIGN KEY (project_type_id) REFERENCES ProjectTypes(id)
);

-- Roles table
CREATE TABLE Roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL
);

-- UserProjects table
CREATE TABLE UserProjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    website_id UUID NOT NULL,
    project_id UUID NOT NULL,
    role_id UUID,
    FOREIGN KEY (website_id) REFERENCES Websites(id),
    FOREIGN KEY (project_id) REFERENCES Projects(id),
    FOREIGN KEY (role_id) REFERENCES Roles(id)
);

-- SocialNetworks table
CREATE TABLE SocialNetworks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL
);

-- SocialNetworkIntegrations table
CREATE TABLE SocialNetworkIntegrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    website_id UUID NOT NULL,
    network_id UUID NOT NULL,
    username VARCHAR(255),
    access_token VARCHAR(255),
    refresh_token VARCHAR(255),
    token_expiration_date TIMESTAMP WITH TIME ZONE,
    last_synced TIMESTAMP WITH TIME ZONE,
    additional_data JSONB,
    FOREIGN KEY (website_id) REFERENCES Websites(id),
    FOREIGN KEY (network_id) REFERENCES SocialNetworks(id)
);

-- Insert initial block types
INSERT INTO BlockTypes (name, description) VALUES
('Project', 'Displays project information'),
('Technology', 'Shows technology skills'),
('SocialIntegration', 'Integrates social media profiles'),
('ProfileInfo', 'Displays user profile information'),
('CustomText', 'Custom text content');

-- Create indexes for foreign keys and frequently queried fields
CREATE INDEX idx_websites_user_id ON Websites(user_id);
CREATE INDEX idx_blocks_website_id ON Blocks(website_id);
CREATE INDEX idx_usertechnologies_website_id ON UserTechnologies(website_id);
CREATE INDEX idx_userprojects_website_id ON UserProjects(website_id);
CREATE INDEX idx_socialnetworkintegrations_website_id ON SocialNetworkIntegrations(website_id);


-- First, drop the Blocks table
DROP TABLE IF EXISTS public.blocks;

-- Next, add the blocks column to the Websites table
ALTER TABLE public.websites
ADD COLUMN blocks JSONB DEFAULT '[]'::jsonb;

-- Add a check constraint to ensure the blocks array contains valid objects
ALTER TABLE public.websites
ADD CONSTRAINT valid_blocks CHECK (
  jsonb_typeof(blocks) = 'array' AND
  (
    SELECT bool_and(
      jsonb_typeof(block->'i') = 'string' AND
      jsonb_typeof(block->'x') = 'number' AND
      jsonb_typeof(block->'y') = 'number' AND
      jsonb_typeof(block->'w') = 'number' AND
      jsonb_typeof(block->'h') = 'number' AND
      jsonb_typeof(block->'isResizable') = 'boolean'
    )
    FROM jsonb_array_elements(blocks) AS block
  )
);

-- Create an index on the blocks column for better query performance
CREATE INDEX idx_websites_blocks ON public.websites USING GIN (blocks);