import { checkList } from "./list"

export type And = {
    $and: Calculation[]
}
export type Or = {
    $or: Calculation[]
}
export type Not = {
    $not: Calculation
}
export type Permission = string[]

export type Calculation = And | Or | Not | Permission

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