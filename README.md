# Permission Checker

/!\ We haven't tested this package yet.

## checklist

```ts
import { checkList } from "permission-checker";

console.log(checkList(["permission1", "permission2.subPermission1"], ["requiredPermission1"]))
// permission1 != requiredPermission1 && permission2.subPermission1 != requiredPermission1, checkList = false
console.log(checkList(["*"], ["requiredPermission1"]))
// * catch all, always true
console.log(checkList(["permission1"], ["*"]))
// if in the first array there isn't * this is always false

console.log(checkList(["permission1"], ["permission1.subPermission1"]))
// permission1 includes subPermission1, this is true
```

## checksingle

is the same of checklist but without an array.
```ts
import { checkSingle } from "permission-checker";
console.log(checkSingle("*", "permission1")) // true
```
