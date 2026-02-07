const { ADMIN_ROLE,VIEWER_ROLE,MANAGER_ROLE } = require("./userRoles")
const permissions = {
    [ADMIN_ROLE]: [
        'user:create',
        'user:update',
        'user:delete',
        'user:view',
        'group:create',
        'group:update',
        'group:delete',
        'group:view'
        


    ]

    ,
    [VIEWER_ROLE]: [
        'user:view',
        'group:view',
        



    ]
    ,
    [MANAGER_ROLE]: [
        'user:view',
        'group:view',
        'group:update',
        'group:create',
        
       




    ]
}
module.exports = permissions;
module.exports
