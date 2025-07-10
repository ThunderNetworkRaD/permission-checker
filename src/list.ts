import checkSingle, { checkSingleOptions } from "./single.js";

/**
 * Options for customizing the behavior of checkList function.
 * Extends checkSingleOptions to include replacements and other list-specific options.
 */
export interface checkListOptions extends checkSingleOptions {
    // Currently no additional options beyond those in checkSingleOptions
    // This interface exists for future extensibility and type safety
}

/**
 * Checks if all required permissions are satisfied by the provided permissions.
 * Handles both direct permissions and negated permissions (prefixed with 'not.').
 * 
 * @param permissions - Array of permission strings that the user has
 * @param requiredPermissions - Array of permissions that are required
 * @param options - Optional configuration for the permission check
 * @returns {boolean} True if all required permissions are satisfied, false otherwise
 * 
 * @example
 * // Basic usage
 * checkList(['user.read', 'user.write'], ['user.read']); // true
 * 
 * // With negated permissions
 * checkList(['user.read'], ['not.user.write']); // true (user doesn't have write)
 * 
 * // With replacements
 * checkList(
 *   ['user.123.profile'],
 *   ['user.{userId}.profile'],
 *   { replaces: [{ key: '{userId}', value: '123', where: WhereToReplace.Both }] }
 * ); // true
 * 
 * @see checkSingle For details on how individual permission comparisons work
 */
export default function checkList(permissions: string[], requiredPermissions: string[], options?: checkListOptions): boolean {
    // If no permissions are required, return true
    if (!requiredPermissions.length) {
        return true;
    }

    // If no permissions are provided, but some are required, return false
    if (!permissions.length) {
        return false;
    }

    let notPermission = permissions.filter((perm) => perm.split('.')[0] === 'not');
    permissions = permissions.filter((perm) => perm.split('.')[0] !== 'not');

    // Check each required permission
    for (const reqPerm of requiredPermissions) {
        let hasPermission = false;
        
        // Check if any of the user's permissions satisfy the requirement
        for (const perm of permissions) {
            // For checkList, we need to check both directions to ensure proper matching
            //if (checkSingle(perm, reqPerm) || checkSingle(reqPerm, perm)) {
            if (checkSingle(perm, reqPerm)) {
                let tempHasPermission = true;
                if (notPermission.length) {
                    for (const notPerm of notPermission) {
                        // Remove not from permission
                        const notPermWithoutNot = notPerm.split('.').slice(1).join('.');
                        if (checkSingle(notPermWithoutNot, reqPerm, options)) {
                            tempHasPermission = false;
                            break;
                        }
                    }
                }
                
                hasPermission = tempHasPermission;
                break;
            }
        }
        
        // If any required permission is not satisfied, return false
        if (!hasPermission) {
            return false;
        }
    }
    
    // All required permissions are satisfied
    return true;
}