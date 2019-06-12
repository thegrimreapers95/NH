exports.isAdmin = function(req, res, next) {
    if (req.isAuthenticated()  && (res.locals.user.access == 0 || res.locals.user.access == 4))  {
        next();
    } else {
        
        res.redirect('/login');
    }
}
exports.isSystem = function(req, res, next) {
    if (req.isAuthenticated() && (res.locals.user.access == 0 || res.locals.user.access == 4))  {
        next();
    } else {
        
        res.redirect('/login');
    }
}
exports.isLock = function(req, res, next) {
    if (req.isAuthenticated()  && (req.session.employee.access  == 0))  {
        next();
    } else {
        
        res.redirect('/lock');
    }
}