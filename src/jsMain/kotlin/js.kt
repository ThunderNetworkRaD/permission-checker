// package org.thundernetwork.permissionchecker
@file:OptIn(ExperimentalJsExport::class)
@file:JsExport
import kotlin.js.ExperimentalJsExport
import kotlin.js.JsExport

/**
 * Checks if a given permission matches a required permission.
 *
 * @param  permission         the permission to check
 * @param  requiredPermission the required permission
 * @return                    true if the permission matches the required permission, false otherwise
 */
fun checkSingle(permission: String, requiredPermission: String): Boolean {
    return org.thundernetwork.permissionchecker.checkSingle(permission, requiredPermission)
}

/**
 * Checks if the given list of permissions contains all the required permissions.
 *
 * @param permission     the list of permissions to check
 * @param requiredPermission the list of required permissions
 * @return true if all the required permissions are present in the given list of permissions, false otherwise
 */
fun checkList(permission: Array<String>, requiredPermission: Array<String>): Boolean {
    return org.thundernetwork.permissionchecker.checkList(permission, requiredPermission)
}