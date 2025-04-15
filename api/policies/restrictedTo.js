// api/policies/restrictedTo.js
require('dotenv').config();
const { jwt } = sails.config.constant;

//This policies is use to check the token and if token is ok then check the allowed users
module.exports = async function (req, res, proceed) {
  try {
    const authHeader = req.headers['authorization'];

    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res
        .status(400)
        .json({ success: false, message: 'Token is not valid' });
    }

    const decoder = await jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.user = decoder;

    //Allowed user and give access them
    const allowedRoles = ['admin', 'student'];
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ status: 403, message: 'Access denied' });
    }
    return proceed();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: 'Invalid token', error });
  }
};
