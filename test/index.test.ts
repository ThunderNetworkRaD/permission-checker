import { checkSingle, checkList } from '../src/index';

describe('checkSingle', () => {
    // Test wildcard permissions
    test('should return true for wildcard permission', () => {
        expect(checkSingle('*', 'any.permission')).toBe(true);
        expect(checkSingle('*', 'user.read')).toBe(true);
        expect(checkSingle('*', 'admin')).toBe(true);
    });

    // Test exact matches
    test('should return true for exact matches', () => {
        expect(checkSingle('user.read', 'user.read')).toBe(true);
        expect(checkSingle('admin', 'admin')).toBe(true);
    });

    // Test hierarchical permissions
    test('should handle hierarchical permissions', () => {
        // Parent permission includes child permissions
        expect(checkSingle('user', 'user.read')).toBe(true);
        expect(checkSingle('user', 'user.profile.view')).toBe(true);
        
        // But not the other way around
        expect(checkSingle('user.read', 'user')).toBe(false);
    });

    // Test partial wildcards
    test('should handle partial wildcards', () => {
        expect(checkSingle('user.*', 'user.read')).toBe(true);
        expect(checkSingle('user.*', 'user.write')).toBe(true);
        expect(checkSingle('user.*', 'user.profile.view')).toBe(true);
    
        // Shouldn't match different parent
        expect(checkSingle('user.*', 'admin.read')).toBe(false);
    });

    // Test invalid cases
    test('should return false for non-matching permissions', () => {
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
        const userPermissions = ['user.read', 'user.write', 'admin'];
    
        // All required permissions are present
        expect(checkList(userPermissions, ['user.read', 'user.write'])).toBe(true);
    
        // Some required permissions are missing
        expect(checkList(userPermissions, ['user.read', 'admin.delete'])).toBe(true);
    
        // Wildcard covers all
        expect(checkList(['*'], ['user.read', 'admin.delete'])).toBe(true);
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
