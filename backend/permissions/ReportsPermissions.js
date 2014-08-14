'use strict';



exports.userCanDelete = function( report ,user ){
    return !!user.isAdmin || report.data.inviter.equals(user._id);
};



exports.getPermissions = function( report, user ){
    return {
        'canDelete' : exports.userCanDelete(report,user)
    };
};