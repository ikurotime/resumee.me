// Create this new file to centralize types
export interface FormState {
  inputValue: string
  showNextStep: boolean
  showPassword: boolean
  email: string
  password: string
  errorMessage: string
  isAvailable: boolean
}

export interface User {
  id: string
  email: string
  name?: string
  profile_picture?: string
}

export interface Website {
  id: string
  user_id: string
  page_name: string
  page_slug: string
  blocks: Block[]
  page_content: string
}

export interface Block {
  i: string
  x: number
  y: number
  w: number
  h: number
  type: string
  content?: string
  title?: string
  url?: string
  imageUrl?: string
  isResizable: boolean
}
