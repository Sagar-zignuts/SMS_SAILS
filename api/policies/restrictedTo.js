// api/policies/restrictedTo.js
module.exports = async function (req, res, proceed) {
    const allowedRoles = ['admin', 'student'];
    if (!req.user || !allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ status: 403, message: 'Access denied' });
    }
    return proceed();
};