function fill(array: string[], length: number): string[] {
    while (array.length < length) {
        array.push('');
    }
    return array;
}

/**
 * Checks if a single permission matches a required permission.
 * Supports wildcard (*) and hierarchical permissions (e.g., 'user.read' matches 'user.read.write')
 * 
 * @param perm - The permission to check (e.g., 'user.read' or '*')
 * @param reqPerm - The required permission to check against (e.g., 'user.read')
 * @returns {boolean} True if the permission is granted, false otherwise
 * 
 * With 2 values, `x` and `y`, the empty string, and `*`
 * 
 * | Permission | Required  | Result   | Description                                                  |
 * | ---------- | --------- | -------- | ------------------------------------------------------------ |
 * | `*`        | `*`       | `TRUE`   | Two equal permissions (e.g. `a.* & a.*`)                     |
 * | `x`        | `x`       | `TRUE`   | Two equal permissions (e.g. `a.b & a.b`)                     |
 * | `x`        | `y`       | `FALSE`  | Two different permissions (e.g. `a.b & a.c`)                 |
 * |            | `x`       | `TRUE`   | The empty string represents all permissions (e.g. `a & a.b`) |
 * | `x`        |           | `FALSE`  | The empty string represents all permissions (e.g. `a.b & a`) |
 * |            | `*`       | `TRUE`   | The empty string includes \* (e.g. `a & a.*`)                |
 * | `*`        |           | `FALSE`  | The empty string includes \* (e.g. `a.* & a`)                |
 * | `*`        | `x`       | `TRUE`   | \* includes all (e.g. `a.* & a.b`)                           |
 * | `x`        | `*`       | `FALSE`  | \* includes all (e.g. `a.b & a.*`)                           |
 * |            |           | `TRUE`   | Do not use empty string as permission.                       |
 */
function checkSingle(perm: string, reqPerm: string): boolean {
    let presenti = perm.split('.');
    let richiesti = reqPerm.split('.');

    const max = Math.max(presenti.length, richiesti.length);
    presenti = fill(presenti, max);
    richiesti = fill(richiesti, max);

    // Check each part of the permission
    for (let i = 0; i < max; i++) {
        const presente: string = presenti[i];
        const richiesto: string = richiesti[i];

        if (presente === richiesto) {
            continue;
        } else if (presente === '' || (presente === '*' && richiesto !== '')) {
            return true;
        } else {
            return false;
        }
    }

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
