package org.thundernetwork.permissionchecker

import kotlin.js.ExperimentalJsExport
import kotlin.js.JsExport

@OptIn(ExperimentalJsExport::class)
@JsExport
fun checkSingle(permission: String, requiredPermission: String): Boolean {
    var answer = false
    if (permission === "*") answer = true
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

@OptIn(ExperimentalJsExport::class)
@JsExport
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