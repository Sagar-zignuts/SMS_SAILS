require('dotenv').config()
const { jwt } = sails.config.constant;

//Check the token and if token is ok then check if the user is admin or not
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

    //if user is admin then user can access the route
    if (!req.user || req.user.role !== 'admin') {
      return res
        .status(400)
        .json({ success: false, message: 'Required admin login' });
    }
    return proceed();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid token", error });
  }
};
