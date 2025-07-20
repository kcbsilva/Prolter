// utils/passwordStrength.ts
export function getPasswordStrength(password: string): {
    score: number;
    label: string;
    color: string;
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = []
  
    if (password.length < 8) errors.push('At least 8 characters')
    if (!/[A-Z]/.test(password)) errors.push('At least one uppercase letter')
    if (!/[a-z]/.test(password)) errors.push('At least one lowercase letter')
    if (!/[0-9]/.test(password)) errors.push('At least one digit')
    if (!/[!@#$%^&*()_\-+=~`[\]{}|:;"'<>,.?/\\]/.test(password)) errors.push('At least one special character')
  
    const commonPasswords = ['123456', 'password', 'qwerty', 'abc123']
    if (commonPasswords.includes(password.toLowerCase())) {
      errors.push('Too common or easily guessable')
    }
  
    const score = 5 - errors.length
    return {
      score,
      label: score === 5 ? 'Strong' : score >= 3 ? 'Moderate' : 'Weak',
      color: score === 5 ? 'green' : score >= 3 ? 'yellow' : 'red',
      valid: errors.length === 0,
      errors,
    }
  }
  