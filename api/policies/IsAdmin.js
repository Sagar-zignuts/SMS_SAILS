module.exports = async function (req, res, proceed) {    
    if (!req.user || req.user.role !== "admin") {
      return res
        .status(400)
        .json({ success: false, message: "Required admin login" });
    }
    return proceed();
  }
