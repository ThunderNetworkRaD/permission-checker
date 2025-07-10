/**
 * Enum that specifies where to apply a replacement in permission strings.
 * Used in Replace interface to determine which permission string(s) to modify.
 */
export enum WhereToReplace {
    /** Apply replacement only to the required permission string */
    RequiredPermission,
    /** Apply replacement only to the user's permission string */
    Permission,
    /** Apply replacement to both permission strings */
    Both
}

/**
 * Defines a replacement rule for permission strings.
 * Useful for handling dynamic or parameterized permissions.
 * 
 * @example
 * // Replace {userId} with '123' in both permission strings
 * { key: '{userId}', value: '123', where: WhereToReplace.Both }
 */
export interface Replace {
    /** The string pattern to search for in permission strings */
    key: string,
    /** The string to replace the key with */
    value: string,
    /** 
     * Specifies which permission string(s) to apply the replacement to.
     * @default WhereToReplace.RequiredPermission
     */
    where?: WhereToReplace
}
