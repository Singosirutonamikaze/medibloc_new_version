/**
 * Extrait un paramètre de route Express (req.params.xxx) en tant que nombre entier.
 *
 * Express type chaque valeur de req.params comme `string | string[] | undefined`
 * (un paramètre répété dans l'URL produit un tableau). Cette fonction rejette
 * explicitement les cas non-string avant de parser, ce qui satisfait TypeScript
 * sans recourir à une assertion de type (`as string`).
 *
 * @param value - La valeur brute issue de req.params (ex: req.params.id).
 * @returns Le nombre entier parsé, ou NaN si la valeur est absente, un tableau,
 *          ou non convertible en nombre.
 */
export function parseIdParam(value: string | string[] | undefined): number {
  if (typeof value !== "string") {
    return Number.NaN;
  }
  return Number.parseInt(value, 10);
}