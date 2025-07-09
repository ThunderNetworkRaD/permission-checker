import { fill } from "./fill";

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
 * |            |           | `TRUE`   | Not recommended to use empty strings in both permissions.    |
 * | `not`      | `x`       | `ERROR`  | Do not use "not" as permission.                              |
 * | `x`        | `not`     | `FALSE`  | Always false.                                                |
 */
export function checkSingle(perm: string, reqPerm: string): boolean {
    let presenti = perm.split('.');
    let richiesti = reqPerm.split('.');

    const max = Math.max(presenti.length, richiesti.length);
    presenti = fill(presenti, max);
    richiesti = fill(richiesti, max);

    // Check each part of the permission
    for (let i = 0; i < max; i++) {
        const presente: string = presenti[i];
        const richiesto: string = richiesti[i];

        if (richiesto === 'not') {
            throw new Error('Permission cannot be "not"');
        } else if (presente === 'not') {
            return false;
        } else if (presente === richiesto) {
            continue;
        } else if (presente === '' || (presente === '*' && richiesto !== '')) {
            return true;
        } else {
            return false;
        }
    }

    return true;
}