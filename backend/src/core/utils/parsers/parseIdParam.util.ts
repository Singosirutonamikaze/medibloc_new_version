/**
 * @file parseIdParam.util.ts
 * @description Extraction et conversion deterministe des identifiants numeriques issus des parametres d'URL Express.
 * Assure la conformite du typage sans assertions arbitraires ni structures conditionnelles complexes.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

/**
 * @description Convertit une valeur brute de {@code req.params} en nombre entier valide.
 * Rejette de facon deterministe les valeurs indefines ou sous forme de tableaux multiples.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param value Parametre brut recu depuis l'URL de requete Express.
 * @returns Identifiant numerique entier, ou {@code NaN} en cas d'incompatibilite de type.
 */
export const parseIdParam = (value: string | string[] | undefined): number => {
  return typeof value === "string" ? Number.parseInt(value, 10) : Number.NaN;
};

export default parseIdParam;
