const jwt = require("jsonwebtoken");
const validator = require("validatorjs");
const bcrypt = require("bcrypt");

module.exports = {
  login: async function (req, res) {
    try {
      const { email, password } = req.body;

      const validation = new validate(
        {
          email,
          password,
        },
        {
          email: "required|email",
          password: "required",
        }
      );

      if (validation.fails()) {
        console.log(validation.errors);
        return res.status(400).json({
          status: 400,
          message: `Field is required : ${validation.errors.all()}`,
        });
      }

      const admin = await Admin.findOne({ email: email });

      if (!admin) {
        return res
          .status(400)
          .json({ status: 400, message: "Email is not awailable" });
      }

      const result = await bcrypt.compare(admin.password, password);
      if (!result) {
        return res
          .status(400)
          .json({ status: 400, message: "Password is incorret" });
      }
      const token = jwt.sign(
        {
          id: admin.id,
          role: "admin",
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "1h" }
      );

      return res.status(200).json({
        status: 200,
        message: "Welcome Admin",
        data: {
          result,
          token,
        },
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: `Server error in login admin : ${error.message}` });
    }
  },

};
