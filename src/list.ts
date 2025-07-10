import checkSingle from "./single.js";

/**
 * Checks if all required permissions are satisfied by the provided permissions.
 * 
 * @param permissions - Array of permissions that the user has
 * @param requiredPermissions - Array of permissions that are required
 * @returns {boolean} True if all required permissions are satisfied, false otherwise
 */
export default function checkList(permissions: string[], requiredPermissions: string[]): boolean {
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
                        if (checkSingle(notPermWithoutNot, reqPerm)) {
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