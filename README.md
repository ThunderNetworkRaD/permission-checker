# Permission Checker

[![npm version](https://img.shields.io/npm/v/permission-checker.svg)](https://www.npmjs.com/package/permission-checker)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Bundle Size](https://img.shields.io/bundlephobia/min/permission-checker)](https://bundlephobia.com/package/permission-checker)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-blue.svg)](https://www.typescriptlang.org/)

A lightweight and efficient permission checking library for JavaScript and TypeScript with zero dependencies, compatible with:

- ✅ **Node.js** (ESM & CommonJS)
- ✅ **Bun** (native ESM support)
- ✅ **Browsers** (via ESM)
- ✅ **TypeScript** and **JavaScript**
- ✅ **ES Modules** and **CommonJS**

## Features

- 🚀 **Lightweight**: Zero dependencies, minimal footprint
- 🛡 **Type Safe**: Full TypeScript support with type definitions
- 🔄 **Universal**: Works in Node.js, Bun, and browsers
- ⚡ **Fast**: Optimized for performance
- 🔍 **Simple API**: Easy to learn and use
- 🔄 **Multiple Environments**: Supports both ESM and CommonJS

## Installation

```bash
# Using npm
npm install permission-checker

# Using yarn
yarn add permission-checker

# Using pnpm
pnpm add permission-checker

# Using Bun
bun add permission-checker
```

## Quick Start

### Node.js (ES Modules)

```javascript
import { checkSingle, checkList } from 'permission-checker';

// Check a single permission
console.log(checkSingle('user.profile', 'user.profile')); // true

// Check multiple permissions
console.log(
  checkList(
    ['user.read', 'admin.dashboard'],
    ['user.read', 'admin.dashboard']
  )
); // true
```

### Node.js (CommonJS)

```javascript
const { checkSingle, checkList } = require('permission-checker');

// Check a single permission
console.log(checkSingle('user.profile', 'user.profile')); // true
```

### Browser (ES Modules)

```html
<script type="module">
  import { checkSingle, checkList } from 'https://unpkg.com/permission-checker/dist/esm/index.js';
  
  // Use the functions
  console.log(checkSingle('*', 'any.permission')); // true
  console.log(
    checkList(
      ['user.read', 'admin.*'], 
      ['user.read', 'admin.dashboard']
    )
  ); // true
</script>
```

### Bun

```javascript
import { checkSingle, checkList } from 'permission-checker';

// Works the same as Node.js ESM
console.log(checkSingle('app.feature', 'app.*')); // true
```

## API Reference

### `checkSingle(permission: string, requiredPermission: string): boolean`

Checks if a single permission matches a required permission, supporting wildcards and hierarchical permissions.

#### Parameters
- `permission`: The permission to check (e.g., `"user.profile"`)
- `requiredPermission`: The required permission to check against (e.g., `"user.*"`)

#### Returns
- `boolean`: `true` if the permission is granted, `false` otherwise

#### Examples

```typescript
import { checkSingle } from 'permission-checker';

// Exact match
checkSingle('user.profile', 'user.profile'); // true

// Wildcard matches anything
checkSingle('*', 'any.permission'); // true

// Hierarchical permissions
checkSingle('user', 'user.profile'); // true
checkSingle('user.profile', 'user'); // false

// Partial wildcards
checkSingle('user.*', 'user.profile'); // true
checkSingle('user.*', 'admin.dashboard'); // false
```

### `checkList(permissions: string[], requiredPermissions: string[]): boolean`

Checks if all required permissions are satisfied by the provided permissions.

#### Parameters
- `permissions`: Array of available permissions
- `requiredPermissions`: Array of required permissions

#### Returns
- `boolean`: `true` if all required permissions are satisfied, `false` otherwise

#### Examples

```typescript
import { checkList } from 'permission-checker';

// All permissions present
checkList(
  ['user.read', 'user.write', 'admin.dashboard'],
  ['user.read', 'admin.dashboard']
); // true

// Some permissions missing
checkList(
  ['user.read'],
  ['user.read', 'admin.dashboard']
); // false

// Wildcard covers all
checkList(
  ['*'],
  ['user.read', 'admin.dashboard']
); // true

// Hierarchical permissions
checkList(
  ['user', 'admin'],
  ['user.profile', 'admin.settings']
); // true
```

# Result table
With 2 values, `x` and `y`, the empty string, and `*`
| Permission | Required  | Result   | Description                                                  |
| ---------- | --------- | -------- | ------------------------------------------------------------ |
| `*`        | `*`       | `TRUE`   | Two equal permissions (e.g. `a.* & a.*`)                     |
| `x`        | `x`       | `TRUE`   | Two equal permissions (e.g. `a.b & a.b`)                     |
| `x`        | `y`       | `FALSE`  | Two different permissions (e.g. `a.b & a.c`)                 |
|            | `x`       | `TRUE`   | The empty string represents all permissions (e.g. `a & a.b`) |
| `x`        |           | `FALSE`  | The empty string represents all permissions (e.g. `a.b & a`) |
|            | `*`       | `TRUE`   | The empty string includes \* (e.g. `a & a.*`)                |
| `*`        |           | `FALSE`  | The empty string includes \* (e.g. `a.* & a`)                |
| `*`        | `x`       | `TRUE`   | \* includes all (e.g. `a.* & a.b`)                           |
| `x`        | `*`       | `FALSE`  | \* includes all (e.g. `a.b & a.*`)                           |
|            |           | `TRUE`   | Do not use empty string as permission.                       |

## Advanced Usage

### TypeScript Support

The package includes TypeScript type definitions out of the box:

```typescript
import type { PermissionChecker } from 'permission-checker';

// Type-safe usage with TypeScript
const hasPermission: boolean = checkSingle('user.profile', 'user.*');
```

### Permission Patterns

1. **Exact Match**: `checkSingle('user.profile', 'user.profile')`
2. **Wildcard**: `checkSingle('*', 'any.permission')`
3. **Hierarchical**: `checkSingle('user', 'user.profile')`
4. **Partial Wildcard**: `checkSingle('user.*', 'user.profile')`

## Performance

The library is optimized for performance with:
- Minimal runtime overhead
- Efficient permission checking algorithms
- No external dependencies
- Small bundle size

## Contributing

Contributions are welcome! Please see our [Contributing Guidelines](CONTRIBUTING.md) for more details.

## License

Apache-2.0 © [ThunderNetworkRaD](https://source.thundernetwork.org/ThunderNetworkRaD)

// Wildcard support
console.log(checkList(["*"], ["any.permission"])); // true

// Multiple required permissions
console.log(
  checkList(
    ["user.read", "user.write"],
    ["user.read", "user.delete"]
  )
); // false (missing user.delete)

// Sub-permission check
console.log(
  checkList(
    ["user"],
    ["user.read", "user.write"]
  )
); // true (user includes all sub-permissions)
```

## TypeScript Support

Full TypeScript type definitions are included out of the box.

## Contributing

Contributions are welcome! Please read our [contributing guidelines](CONTRIBUTING.md) to get started.

## License

Apache-2.0 © [ThunderNetworkRaD](https://source.thundernetwork.org/ThunderNetworkRaD)
