const validator = require("validatorjs");
const path = require("path");

module.exports = {
  create: async function (req, res) {
    try {
      const { email, className, school, password } = req.body;
      const profilePic = req.file ? req.file.path : null;

      const validation = new validator(
        { email, className, school, password },
        {
          email: "required|email",
          className: "required",
          school: "required",
          password: "required",
        }
      );

      if (validation.fails()) {
        return res
          .status(400)
          .json({ status: 400, message: "Field is required" });
      }

      req.file("profilePic").upload(
        {
          dirname: path.resolve(sails.config.addPath, "/Uploads/profiles"),
          maxBytes: 5000000,
          allowedFileTypes: ["image/jpeg", "image/jpg", "image/png"],
        },
        async (err, uploadFiles) => {
          if (err) {
            return res.status(400).json({
              status: 400,
              message: "File upload error: " + err.message,
            });
          }

          if (uploadFiles.length > 0) {
            profilePic = path.resolve(sails.config.addPath, uploadFiles[0].fd);
          }

          try {
            const student = await Student.create({
              email,
              className,
              school,
              profilePic,
              password,
            }).fetch();

            return res
              .status(201)
              .json({ status: 201, message: "Student created", data: student });
          } catch (error) {
            return res
              .status(500)
              .json({ status: 500, message: error.message || "Server error" });
          }
        }
      );
    } catch (error) {
      return res
        .status(500)
        .json({ status: 500, message: error.message || "Server error" });
    }
  },

};
