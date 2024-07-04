// package org.thundernetwork.permissionchecker
@file:OptIn(ExperimentalJsExport::class)
@file:JsExport
import kotlin.js.ExperimentalJsExport
import kotlin.js.JsExport


fun checkSingle(permission: String, requiredPermission: String): Boolean {
    return org.thundernetwork.permissionchecker.checkSingle(permission, requiredPermission)
}

fun checkList(permission: Array<String>, requiredPermission: Array<String>): Boolean {
    return org.thundernetwork.permissionchecker.checkList(permission, requiredPermission)
}