export const LookupType = {
    "lookup": true,
    "lookupvalue": true,
    "lookupid": true,
}


/**
 * IncludeType
 * include 可以包含的一些额外属性
 */
export const IncludeType = {
    DisplayName: "DisplayName", // 显示名称?
    EffectiveBasePermissions: "EffectiveBasePermissions", // 权限？
    HasUniqueRoleAssignments: "HasUniqueRoleAssignments", // 
    RoleAssignments: "RoleAssignments" // 
    // Fields.Include(Title,InternalName)
}