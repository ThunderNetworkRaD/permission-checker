/**
 * Checks if a single permission matches a required permission.
 * Supports wildcard (*) and hierarchical permissions (e.g., 'user.read' matches 'user.read.write')
 * 
 * @param perm - The permission to check (e.g., 'user.read' or '*')
 * @param reqPerm - The required permission to check against (e.g., 'user.read')
 * @returns {boolean} True if the permission is granted, false otherwise
 */
function checkSingle(perm: string, reqPerm: string): boolean {
    // If the permission is a wildcard, it matches everything
    if (perm === '*') {
        return true;
    }

    const permParts = perm.split('.');
    const reqParts = reqPerm.split('.');

    // If the permission has more parts than required, it can't be a match
    // unless the last part is a wildcard
    if (permParts.length > reqParts.length && permParts[permParts.length - 1] !== '*') {
        return false;
    }

    // Check each part of the permission
    for (let i = 0; i < Math.min(permParts.length, reqParts.length); i++) {
        // If the current part is a wildcard, the rest is considered a match
        if (permParts[i] === '*') {
            return true;
        }
        
        // If parts don't match, the permission is not granted
        if (permParts[i] !== reqParts[i]) {
            return false;
        }
    }

    // If we've checked all parts and they match, the permission is granted
    return true;
}

/**
 * Checks if all required permissions are satisfied by the provided permissions.
 * 
 * @param permissions - Array of permissions that the user has
 * @param requiredPermissions - Array of permissions that are required
 * @returns {boolean} True if all required permissions are satisfied, false otherwise
 */
function checkList(permissions: string[], requiredPermissions: string[]): boolean {
    // If no permissions are required, return true
    if (!requiredPermissions.length) {
        return true;
    }

    // If no permissions are provided, but some are required, return false
    if (!permissions.length) {
        return false;
    }

    // Check each required permission
    for (const reqPerm of requiredPermissions) {
        let hasPermission = false;
        
        // Check if any of the user's permissions satisfy the requirement
        for (const perm of permissions) {
            // For checkList, we need to check both directions to ensure proper matching
            if (checkSingle(perm, reqPerm) || checkSingle(reqPerm, perm)) {
                hasPermission = true;
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

export default {
    checkList,
    checkSingle
};

// Also export as named exports for better tree-shaking
export { checkList, checkSingle };
