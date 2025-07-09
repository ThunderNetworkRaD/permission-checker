// Test the package in Node.js environment (CommonJS)
const { checkSingle, checkList } = require('../dist/cjs/index.cjs');

console.log('=== Testing in Node.js (CommonJS) ===');

// Test checkSingle
console.log('checkSingle tests:');
console.log('1. Wildcard permission:', checkSingle('*', 'any.permission') === true ? '✅ Passed' : '❌ Failed');
console.log('2. Exact match:', checkSingle('user.read', 'user.read') === true ? '✅ Passed' : '❌ Failed');
console.log('3. Hierarchical permission:', checkSingle('user', 'user.read') === true ? '✅ Passed' : '❌ Failed');
console.log('4. Non-matching permission:', checkSingle('user.read', 'user.write') === false ? '✅ Passed' : '❌ Failed');

// Test checkList
console.log('\ncheckList tests:');
console.log('1. All permissions present:', 
  checkList(['user.read', 'user.write'], ['user.read', 'user.write']) === true ? '✅ Passed' : '❌ Failed');
console.log('2. Some permissions missing:', 
  checkList(['user.read'], ['user.read', 'admin.delete']) === false ? '✅ Passed' : '❌ Failed');
console.log('3. Wildcard covers all:', 
  checkList(['*'], ['user.read', 'admin.delete']) === true ? '✅ Passed' : '❌ Failed');

console.log('\n=== Node.js (CommonJS) tests completed ===');
