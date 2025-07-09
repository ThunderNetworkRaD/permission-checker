import { checkList } from "./list.js"

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
 * Evaluates a permission calculation against a set of user permissions.
 * 
 * @param permissions - Array of permission strings that the user has
 * @param calculation - The permission calculation to evaluate
 * @returns {boolean} True if the calculation evaluates to true with the given permissions, false otherwise
 * 
 * @example
 * // Returns true if user has both 'user.read' and 'user.write' permissions
 * evaluate(['user.read', 'user.write'], { $and: [['user.read'], ['user.write']] })
 */
export function evaluate(permissions: string[], calculation: Calculation): boolean {
    if ('$and' in calculation) {
        return calculation.$and.every((calc) => evaluate(permissions, calc));
    } else if ('$or' in calculation) {
        return calculation.$or.some((calc) => evaluate(permissions, calc));
    } else if ('$not' in calculation) {
        return !evaluate(permissions, calculation.$not);
    } else {
        if (calculation instanceof Array) {
            return checkList(permissions, calculation);
        } else {
            throw new Error('Invalid calculation');
        }
    }
}