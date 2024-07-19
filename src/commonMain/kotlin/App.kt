package org.thundernetwork.permissionchecker

/**
 * Checks if a given permission matches a required permission.
 *
 * @param  permission         the permission to check
 * @param  requiredPermission the required permission
 * @return                    true if the permission matches the required permission, false otherwise
 */
fun checkSingle(permission: String, requiredPermission: String): Boolean {
    var answer = false
    if (permission == "*") answer = true
    else {
        val subRP = requiredPermission.split('.')
        val sub = permission.split('.')
        if (subRP.size < sub.size) answer = false
        else {
            var i = 0
            for (rp in subRP) {
                if (i == sub.size || rp != sub[i]) break
                else i++
            }
            if (i == subRP.size || i == sub.size) answer = true
        }
    }
    return answer
}

/**
 * Checks if the given list of permissions contains all the required permissions.
 *
 * @param permission     the list of permissions to check
 * @param requiredPermission the list of required permissions
 * @return true if all the required permissions are present in the given list of permissions, false otherwise
 */
fun checkList(permission: Array<String>, requiredPermission: Array<String>): Boolean {
    var actualLength = 0
    val requiredLength = requiredPermission.size

    for (rp in requiredPermission) {
        for (p in permission) {
            if (checkSingle(p, rp)) actualLength++
        }
    }

    return actualLength >= requiredLength
}