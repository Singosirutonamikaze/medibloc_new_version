/**
 * Valider une adresse email
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valider un numéro de téléphone français
 */
export function validatePhoneNumber(phone: string): boolean {
  const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
  return phoneRegex.test(phone);
}

/**
 * Valider un mot de passe
 * - Au moins 8 caractères
 * - Au moins une lettre majuscule
 * - Au moins une lettre minuscule
 * - Au moins un chiffre
 */
export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Le mot de passe doit contenir au moins 8 caractères');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une lettre majuscule');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une lettre minuscule');
  }

  if (!/\d/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins un chiffre');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Valider une date de naissance (pas dans le futur, âge > 0)
 */
export function validateBirthDate(date: string | Date): boolean {
  const birthDate = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();

  return birthDate <= today && birthDate.getFullYear() >= 1900;
}
