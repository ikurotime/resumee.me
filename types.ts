/* eslint-disable @typescript-eslint/no-explicit-any */
// Common type for UUID
type UUID = string

// User related types
interface User {
  id: UUID
  email?: string | undefined
  name?: string
  profile_picture?: string
  password_hash?: string
  created_at?: string | undefined
  updated_at?: string | undefined
}

// Website theme related types
interface WebsiteTheme {
  id: UUID
  name: string
  description?: string
  config_json?: Record<string, any>
}

// Website related types
interface Website {
  id: UUID
  user_id: UUID
  theme_id?: UUID
  domain?: string
  title?: string
  cv_name?: string
  page_name?: string
  page_slug?: string
  is_cv_page?: boolean
  page_content?: Record<string, any>
  description?: string
  is_published?: boolean
  created_at?: Date
  updated_at?: Date
  blocks: Block[]
}

// Block type related types
interface BlockType {
  id: UUID
  name: string
  description?: string
  created_at: Date
  updated_at: Date
}

// Block related types
interface Block {
  id: UUID
  website_id: UUID
  block_type_id: UUID
  x: number
  y: number
  width: number
  height: number
  order_index: number
  content?: Record<string, any>
}

// Technology related types
interface Technology {
  id: UUID
  name: string
  category?: string
  logo?: string
}

// Proficiency level related types
interface ProficiencyLevel {
  id: UUID
  name: string
}

// User technology related types
interface UserTechnology {
  id: UUID
  website_id: UUID
  technology_id: UUID
  proficiency_level_id?: UUID
  years_of_experience?: number
}

// Project type related types
interface ProjectType {
  id: UUID
  name: string
}

// Project related types
interface Project {
  id: UUID
  name: string
  description?: string
  url?: string
  start_date?: Date
  end_date?: Date
  image?: string
  project_type_id?: UUID
}

// Role related types
interface Role {
  id: UUID
  name: string
}

// User project related types
interface UserProject {
  id: UUID
  website_id: UUID
  project_id: UUID
  role_id?: UUID
}

// Social network related types
interface SocialNetwork {
  id: UUID
  name: string
}

// Social network integration related types
interface SocialNetworkIntegration {
  id: UUID
  website_id: UUID
  network_id: UUID
  username?: string
  access_token?: string
  refresh_token?: string
  token_expiration_date?: Date
  last_synced?: Date
  additional_data?: Record<string, any>
}

// Enum for predefined block types
enum PredefinedBlockType {
  Project = 'Project',
  Technology = 'Technology',
  SocialIntegration = 'SocialIntegration',
  ProfileInfo = 'ProfileInfo',
  CustomText = 'CustomText'
}

export type {
  UUID,
  User,
  WebsiteTheme,
  Website,
  BlockType,
  Block,
  Technology,
  ProficiencyLevel,
  UserTechnology,
  ProjectType,
  Project,
  Role,
  UserProject,
  SocialNetwork,
  SocialNetworkIntegration
}

export { PredefinedBlockType }
