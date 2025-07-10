import {checkList, checkListOptions } from "./list.js"

/**
 * Represents a logical AND operation between multiple permission calculations.
 * All calculations in the array must evaluate to true for the AND to be true.
 */
export type And = {
    $and: Calculation[]
}
/**
 * Represents a logical OR operation between multiple permission calculations.
 * At least one calculation in the array must evaluate to true for the OR to be true.
 */
export type Or = {
    $or: Calculation[]
}
/**
 * Represents a logical NOT operation on a permission calculation.
 * Inverts the result of the contained calculation.
 */
export type Not = {
    $not: Calculation
}
/**
 * Represents an array of permission strings.
 * Each string is a dot-separated permission path (e.g., ['user.read', 'admin.write']).
 */
export type Permission = string[]

/**
 * Represents a permission calculation that can be:
 * - An AND operation
 * - An OR operation
 * - A NOT operation
 * - A direct permission check (array of permission strings)
 */
export type Calculation = And | Or | Not | Permission

/**
 * Options for customizing the behavior of evaluate function.
 * Extends checkListOptions to include replacements and other evaluation-specific options.
 */
export interface evaluateOptions extends checkListOptions {
    // Currently no additional options beyond those in checkListOptions
    // This interface exists for future extensibility and type safety
}

/**
 * Evaluates a complex permission calculation against a set of user permissions.
 * Supports logical operations like AND, OR, and NOT on permission checks.
 * 
 * @param permissions - Array of permission strings that the user has
 * @param calculation - The permission calculation to evaluate
 * @param options - Optional configuration for the permission checks
 * @returns {boolean} True if the calculation evaluates to true with the given permissions, false otherwise
 * 
 * @example
 * // Basic AND operation
 * evaluate(
 *   ['user.read', 'user.write'],
 *   { $and: [['user.read'], ['user.write']] }
 * ); // true
 * 
 * // Complex expression with AND, OR, and NOT
 * evaluate(
 *   ['user.read', 'profile.view'],
 *   {
 *     $and: [
 *       { $or: [['user.read'], ['user.write']] },
 *       { $not: ['admin.access'] }
 *     ]
 *   }
 * ); // true
 * 
 * // With replacements
 * evaluate(
 *   ['user.123.profile', 'document.456.read'],
 *   { $and: [['user.{userId}.profile'], ['document.{docId}.read']] },
 *   {
 *     replaces: [
 *       { key: '{userId}', value: '123', where: WhereToReplace.Both },
 *       { key: '{docId}', value: '456', where: WhereToReplace.Both }
 *     ]
 *   }
 * ); // true
 */
export function evaluate(permissions: string[], calculation: Calculation, options?: evaluateOptions): boolean {
    if ('$and' in calculation) {
        return calculation.$and.every((calc) => evaluate(permissions, calc));
    } else if ('$or' in calculation) {
        return calculation.$or.some((calc) => evaluate(permissions, calc));
    } else if ('$not' in calculation) {
        return !evaluate(permissions, calculation.$not);
    } else {
        if (calculation instanceof Array) {
            return checkList(permissions, calculation, options);
        } else {
            throw new Error('Invalid calculation');
        }
    }
}