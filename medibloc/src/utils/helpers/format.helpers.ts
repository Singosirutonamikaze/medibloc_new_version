/**
 * Formater un nom complet
 */
export function formatFullName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`;
}

/**
 * Formater un numéro de téléphone
 */
export function formatPhoneNumber(phone: string): string {
  // Supprimer tous les caractères non numériques
  const cleaned = phone.replaceAll(/\D/g, '');

  // Formater selon le format français (ex: 06 12 34 56 78)
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
  }

  return phone;
}

/**
 * Capitaliser la première lettre d'une chaîne
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Tronquer un texte
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength)}...`;
}

/**
 * Formater un prix en euros
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(price);
}

/**
 * Générer des initiales à partir d'un nom
 */
export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}
