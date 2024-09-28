import { FormState } from '@/types'

export function validateForm(formState: FormState): {
  isValid: boolean
  errorMessage: string
} {
  const { email, password, inputValue } = formState

  if (!validateEmail(email)) {
    return { isValid: false, errorMessage: 'Invalid email format.' }
  }

  if (password.length < 6) {
    return {
      isValid: false,
      errorMessage: 'Password must be at least 6 characters.'
    }
  }

  if (!isValidPageName(inputValue)) {
    return {
      isValid: false,
      errorMessage:
        "Name can't have symbols and must be between 1 and 20 characters."
    }
  }

  return { isValid: true, errorMessage: '' }
}

export function validateEmail(email: string): boolean {
  return /\S+@\S+\.\S+/.test(email)
}

export function isValidPageName(pageName: string): boolean {
  return /^[a-z0-9-]{1,20}$/.test(pageName)
}
