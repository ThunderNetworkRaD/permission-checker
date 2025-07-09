import { checkSingle, checkList } from '../src/index';
import { fill } from '../src/fill';

describe('checkSingle', () => {
    // Test wildcard permissions
    test('should handle wildcard permissions', () => {
        // Global wildcard
        expect(checkSingle('*', '*')).toBe(true);
        expect(checkSingle('*', 'any.permission')).toBe(true);
        expect(checkSingle('*', 'user.read')).toBe(true);
        expect(checkSingle('*', 'admin')).toBe(true);
        expect(checkSingle('*', 'a*')).toBe(true);
        expect(checkSingle('*', 'a.*')).toBe(true);
        
        // Partial wildcards
        expect(checkSingle('a.*', 'a.*')).toBe(true);
        expect(checkSingle('a.*', 'a.b')).toBe(true);
        expect(checkSingle('a.*', 'a')).toBe(false);
    });

    // Test exact matches and simple permissions
    test('should handle exact matches and simple permissions', () => {
        // Exact matches
        expect(checkSingle('a', 'a')).toBe(true);
        expect(checkSingle('a.a', 'a.a')).toBe(true);
        expect(checkSingle('user.read', 'user.read')).toBe(true);
        expect(checkSingle('admin', 'admin')).toBe(true);
        
        // Non-matches
        expect(checkSingle('a', 'b')).toBe(false);
        expect(checkSingle('a.a', 'a.b')).toBe(false);
    });

    // Test hierarchical permissions
    test('should handle hierarchical permissions', () => {
        // Parent permission includes child permissions
        expect(checkSingle('a', 'a.b')).toBe(true);
        expect(checkSingle('user', 'user.read')).toBe(true);
        expect(checkSingle('user', 'user.profile.view')).toBe(true);
        
        // But not the other way around
        expect(checkSingle('a.b', 'a')).toBe(false);
        expect(checkSingle('user.read', 'user')).toBe(false);
        
        // Special cases with wildcards
        expect(checkSingle('a', 'a.*')).toBe(true);
        expect(checkSingle('a.*', 'a')).toBe(false);
        expect(checkSingle('a.*', 'a.b')).toBe(true);
        expect(checkSingle('a.b', 'a.*')).toBe(false);
    });

    // Test partial wildcards
    test('should handle partial wildcards', () => {
        expect(checkSingle('user.*', 'user.read')).toBe(true);
        expect(checkSingle('user.*', 'user.write')).toBe(true);
        expect(checkSingle('user.*', 'user.profile.view')).toBe(true);
    
        // Shouldn't match different parent
        expect(checkSingle('user.*', 'admin.read')).toBe(false);
    });

    // Test edge cases
    test('should handle edge cases', () => {
        // Empty strings
        expect(checkSingle('', '')).toBe(true);
        
        // Non-matching permissions
        expect(checkSingle('user.read', 'user.write')).toBe(false);
        expect(checkSingle('user', 'admin')).toBe(false);
        expect(checkSingle('user.read', 'read.user')).toBe(false);
    });
});

describe('checkList', () => {
    // Test empty cases
    test('should handle empty permission lists', () => {
        expect(checkList([], [])).toBe(true);
        expect(checkList([], ['user.read'])).toBe(false);
        expect(checkList(['user.read'], [])).toBe(true);
    });

    // Test single permission
    test('should check single permission', () => {
        expect(checkList(['user.read'], ['user.read'])).toBe(true);
        expect(checkList(['user.write'], ['user.read'])).toBe(false);
        expect(checkList(['*'], ['user.read'])).toBe(true);
    });

    // Test multiple permissions
    test('should check multiple permissions', () => {
        const userPermissions = ['user.read', 'user.write', 'admin', 'a.*'];
    
        // All required permissions are present
        expect(checkList(userPermissions, ['user.read', 'user.write'])).toBe(true);
        
        // Hierarchical permissions
        expect(checkList(userPermissions, ['user.read', 'user'])).toBe(false);
        
        // Wildcard permissions
        expect(checkList(userPermissions, ['a.b', 'a.c'])).toBe(true);
        
        // Some required permissions are missing
        expect(checkList(userPermissions, ['user.read', 'admin.delete'])).toBe(true);
        
        // Global wildcard covers all
        expect(checkList(['*'], ['user.read', 'admin.delete'])).toBe(true);
        
        // Test with empty arrays
        expect(checkList([], [])).toBe(true);
        expect(checkList([], ['user.read'])).toBe(false);
        expect(checkList(['user.read'], [])).toBe(true);
    });

    // Test hierarchical permissions
    test('should handle hierarchical permissions', () => {
        const permissions = ['user', 'admin.settings'];
    
        expect(checkList(permissions, ['user.read'])).toBe(true);
        expect(checkList(permissions, ['admin.settings.view'])).toBe(true);
        expect(checkList(permissions, ['user.read', 'admin.settings'])).toBe(true);
        expect(checkList(permissions, ['user.read', 'admin.settings.edit'])).toBe(true);
    });
});

// Test for CommonJS compatibility
import * as permissionChecker from '../src/index';

describe('CommonJS compatibility', () => {
    test('should work with default import', () => {
        expect(permissionChecker.default.checkSingle('*', 'test')).toBe(true);
        expect(permissionChecker.default.checkList(['*'], ['test'])).toBe(true);
    });

    test('should work with named imports', () => {
        expect(permissionChecker.checkSingle('*', 'test')).toBe(true);
        expect(permissionChecker.checkList(['*'], ['test'])).toBe(true);
    });
});

describe('fill', () => {
    test('should pad array with empty strings to reach specified length', () => {
        // Test basic padding
        expect(fill(['a', 'b'], 3)).toEqual(['a', 'b', '']);
        
        // Test when array is already long enough
        expect(fill(['a', 'b', 'c'], 2)).toEqual(['a', 'b', 'c']);
        
        // Test with empty array
        expect(fill([], 3)).toEqual(['', '', '']);
        
        // Test with length 0
        expect(fill(['a', 'b'], 0)).toEqual(['a', 'b']);
        
        // Test with negative length (should behave the same as 0)
        expect(fill(['a', 'b'], -1)).toEqual(['a', 'b']);
    });
    
    test('should handle edge cases', () => {
        // Test with empty array and length 0
        expect(fill([], 0)).toEqual([]);
        
        // Test with non-array input (TypeScript should catch this, but good to test runtime behavior)
        // @ts-ignore
        expect(() => fill(null, 2)).toThrow();
        
        // Test with non-number length (TypeScript should catch this, but good to test runtime behavior)
        // @ts-ignore
        expect(() => fill([], '2')).toThrow();
    });
});
