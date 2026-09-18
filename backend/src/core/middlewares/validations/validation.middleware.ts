/**
 * @file validation.middleware.ts
 * @description Middleware declaratif de validation des flux entrants (corps, parametres, requetes).
 * Concu sans instructions conditionnelles directes selon le standard fonctionnel pur.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { Request, Response, NextFunction } from "express";
import { errorResponse } from "../../utils/responses/response.util";
import { isValidEmail } from "../../utils/helpers/helpers.util";

/**
 * @typedef ValidatableValue
 * @description Type union representant toute valeur inspectable lors d'une validation.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export type ValidatableValue =
  | string
  | number
  | boolean
  | object
  | null
  | undefined;

/**
 * @typedef ValidationFieldType
 * @description Types primitifs et formats speciaux pris en charge par le validateur.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export type ValidationFieldType =
  | "string"
  | "number"
  | "boolean"
  | "email"
  | "date"
  | "array";

/**
 * @typedef ValidatablePrimitive
 * @description Valeurs scalaires autorisees pour les enumerations.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export type ValidatablePrimitive = string | number | boolean;

/**
 * @interface ValidationErrorItem
 * @description Structure descriptive d'une non-conformite sur un champ specifique.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @property field Nom du champ concerne.
 * @property message Explication de l'anomalie constatee.
 */
export interface ValidationErrorItem {
  readonly field: string;
  readonly message: string;
}

/**
 * @interface ValidationRule
 * @description Regles de validation applicables a une propriete.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @property required Indique si le champ est strictement obligatoire.
 * @property type Type de donnees attendu.
 * @property minLength Longueur textuelle minimale.
 * @property maxLength Longueur textuelle maximale.
 * @property min Valeur numerique minimale.
 * @property max Valeur numerique maximale.
 * @property pattern Expression reguliere a respecter.
 * @property enum Liste des valeurs autorisees.
 * @property custom Fonction personnalisee de validation.
 * @property message Message d'erreur personnalise.
 */
export interface ValidationRule {
  readonly required?: boolean;
  readonly type?: ValidationFieldType;
  readonly minLength?: number;
  readonly maxLength?: number;
  readonly min?: number;
  readonly max?: number;
  readonly pattern?: RegExp;
  readonly enum?: ValidatablePrimitive[];
  readonly custom?: (value: ValidatableValue) => boolean;
  readonly message?: string;
}

/**
 * @interface ValidationSchema
 * @description Dictionnaire de regles associant chaque champ a ses contraintes de validation.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export interface ValidationSchema {
  readonly [field: string]: ValidationRule;
}

/**
 * @description Verifie la conformite d'une valeur textuelle ou primitive vis-a-vis des contraintes declarees.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param field Nom du champ evalue.
 * @param value Valeur inspectee.
 * @param rule Ensemble des regles applicables.
 * @returns Liste des erreurs identifiees pour ce champ.
 */
const validateField = (
  field: string,
  value: ValidatableValue,
  rule: ValidationRule,
): ValidationErrorItem[] => {
  const isPresent = value !== undefined && value !== null && value !== "";
  const isRequiredViolated = Boolean(rule.required) && !isPresent;

  const typeCheckers: Record<ValidationFieldType, () => boolean> = {
    string: () => typeof value === "string",
    number: () => typeof value === "number" && !Number.isNaN(value),
    boolean: () => typeof value === "boolean",
    email: () => typeof value === "string" && isValidEmail(value),
    date: () => typeof value === "string" && !Number.isNaN(Date.parse(value)),
    array: () => Array.isArray(value),
  };

  const isTypeViolated =
    isPresent &&
    Boolean(rule.type) &&
    Boolean(typeCheckers[rule.type as ValidationFieldType]) &&
    !typeCheckers[rule.type as ValidationFieldType]();

  const isMinLengthViolated =
    isPresent &&
    typeof value === "string" &&
    typeof rule.minLength === "number" &&
    value.length < rule.minLength;

  const isMaxLengthViolated =
    isPresent &&
    typeof value === "string" &&
    typeof rule.maxLength === "number" &&
    value.length > rule.maxLength;

  const isMinViolated =
    isPresent &&
    typeof value === "number" &&
    typeof rule.min === "number" &&
    value < rule.min;

  const isMaxViolated =
    isPresent &&
    typeof value === "number" &&
    typeof rule.max === "number" &&
    value > rule.max;

  const isPatternViolated =
    isPresent &&
    typeof value === "string" &&
    Boolean(rule.pattern) &&
    !(rule.pattern as RegExp).test(value);

  const isEnumViolated =
    isPresent &&
    Array.isArray(rule.enum) &&
    !rule.enum.includes(value as ValidatablePrimitive);

  const isCustomViolated =
    isPresent &&
    Boolean(rule.custom) &&
    !(rule.custom as (v: ValidatableValue) => boolean)(value);

  const errorChecks = [
    {
      violated: isRequiredViolated,
      message: rule.message || `Le champ ${field} est obligatoire`,
    },
    {
      violated: isTypeViolated,
      message:
        rule.message || `Le champ ${field} doit etre de type ${rule.type}`,
    },
    {
      violated: isMinLengthViolated,
      message:
        rule.message ||
        `Le champ ${field} doit comporter au moins ${rule.minLength} caracteres`,
    },
    {
      violated: isMaxLengthViolated,
      message:
        rule.message ||
        `Le champ ${field} ne doit pas depasser ${rule.maxLength} caracteres`,
    },
    {
      violated: isMinViolated,
      message:
        rule.message ||
        `Le champ ${field} doit etre superieur ou egal a ${rule.min}`,
    },
    {
      violated: isMaxViolated,
      message:
        rule.message ||
        `Le champ ${field} doit etre inferieur ou egal a ${rule.max}`,
    },
    {
      violated: isPatternViolated,
      message:
        rule.message || `Le champ ${field} ne respecte pas le format attendu`,
    },
    {
      violated: isEnumViolated,
      message:
        rule.message ||
        `Le champ ${field} doit etre l'une des valeurs suivantes: ${(rule.enum || []).map(String).join(", ")}`,
    },
    {
      violated: isCustomViolated,
      message: rule.message || `Le champ ${field} est invalide`,
    },
  ];

  return errorChecks
    .filter(
      (check: { violated: boolean; message: string }): boolean =>
        check.violated,
    )
    .map(
      (check: { violated: boolean; message: string }): ValidationErrorItem => ({
        field,
        message: check.message,
      }),
    );
};

/**
 * @description Factory creant un middleware Express validant le corps de requete selon un schema donne.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param schema Schema de validation conforme a {@link ValidationSchema}.
 * @returns Middleware Express.
 */
export const validationMiddleware = (schema: ValidationSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const data = req.body as Record<string, ValidatableValue>;

    const errors: ValidationErrorItem[] = Object.entries(schema).flatMap(
      ([field, rule]: [string, ValidationRule]): ValidationErrorItem[] => {
        const value = data ? data[field] : undefined;
        return validateField(field, value, rule);
      },
    );

    const hasErrors = errors.length > 0;

    const actionMap: Record<string, () => void> = {
      true: () => {
        const errorMessages = errors.map(
          (e: ValidationErrorItem): string => `${e.field}: ${e.message}`,
        );
        errorResponse(
          res,
          "Erreur de validation des donnees",
          400,
          errorMessages,
        );
      },
      false: next,
    };

    actionMap[String(hasErrors)]();
  };
};

export default validationMiddleware;
