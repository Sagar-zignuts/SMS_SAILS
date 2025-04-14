const validator = require("validatorjs");
const path = require("path");
const { log } = require("console");

module.exports = {
  create: async function (req, res) {
    try {
      console.log('Initial req.body:', req.body); // Debug initial body
      console.log('Initial route params:', Object.keys(req.params).length > 0 ? req.params : 'No route params'); // Debug route params
      console.log('Initial all params:', req.allParams()); // Debug all params
      console.log('Initial req.files:', req.file); // Debug file input

      let profilePic = null;

      // Handle file upload with Skipper
      req.file('profilePic').upload(
        {
          dirname: path.resolve(sails.config.appPath, 'Uploads/profiles'),
          maxBytes: 5000000,
          allowedFileTypes: ['image/jpeg', 'image/jpg', 'image/png'],
        },
        async (err, uploadedFiles) => {
          if (err) {
            console.error('Upload error:', err);
            return res.status(400).json({
              status: 400,
              message: 'File upload error: ' + err.message,
            });
          }

          if (uploadedFiles && uploadedFiles.length > 0) {
            profilePic = path.relative(sails.config.appPath, uploadedFiles[0].fd);
          }

          console.log('Post-upload req.body:', req.body); // Debug body after upload
          console.log('Post-upload all params:', req.allParams()); // Debug all params

          // Fallback to check raw multipart data
          const form = req._fileparser.form;
          form.on('field', (name, value) => {
            console.log(`Raw multipart field: ${name} = ${value}`);
            if (!req.body[name]) req.body[name] = value; // Populate missing fields
          });

          form.on('end', () => {
            console.log('Multipart form parsing completed');
          });

          const { email, className, school, password } = req.body;

          const validation = new validator({ email, className, school, password }, {
            email: 'required|email',
            className: 'required',
            school: 'required',
            password: 'required|min:7',
          });

          if (validation.fails()) {
            console.log('Validation errors:', validation.errors.all());
            return res.status(400).json({
              status: 400,
              message: 'Validation failed',
              errors: validation.errors.all(),
            });
          }

          const existingStudent = await Student.findOne({ email });
          if (existingStudent) {
            return res.status(400).json({
              status: 400,
              message: 'Student with this email already exists',
            });
          }

          try {
            const student = await Student.create({
              id : 'placeholder',
              email,
              className,
              school,
              profilePic,
              password,
            }).fetch();

            return res.status(201).json({
              status: 201,
              message: 'Student created',
              data: student,
            });
          } catch (error) {
            console.error('Database error:', error);
            return res.status(500).json({
              status: 500,
              message: error.message || 'Server error',
            });
          }
        }
      );
    } catch (error) {
      console.error('Outer error:', error);
      return res.status(500).json({
        status: 500,
        message: error.message || 'Server error',
      });
    }
  },

  getById: async function (req, res) {
    try {
      const { student_id } = req.query;

      const student = await Student.findOne({ id: student_id });

      if (!student) {
        return res
          .status(400)
          .json({ status: 400, message: "student not found" });
      }

      return res
        .status(200)
        .json({ status: 200, message: "Data fetched", data: student });
    } catch (error) {
      return res
        .status(500)
        .json({ status: 500, message: error.message || "Server error" });
    }
  },

  getAll: async function (req, res) {
    try {
      const students = await Student.find();

      if (students.length === 0) {
        return res.status(400).json({
          status: 400,
          message: "No students found with the given email",
        });
      }

      return res.status(200).json({
        status: 200,
        message: "Students retrieved successfully",
        data: students,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ status: 500, message: error.message || "Server error" });
    }
  },

  update: async function (req, res) {
    try {
      const { className, school } = req.body;
      let profilePic;
      const { student_id } = req.query;

      if (!student_id) {
        return res
          .status(400)
          .json({ status: 400, message: "Query parameter is required" });
      }

      const validation = new validator(
        { className, school },
        {
          className: "required",
          school: "required",
        }
      );

      if (validation.fails()) {
        return res.status(400).json({
          status: 400,
          message: `Error in validation : ${validation.errors.all()}`,
        });
      }

      req.file("profilePic").upload(
        {
          dirname: path.resolve(sails.config.appPath, "Uploads/profiles"),
          maxBytes: 5000000,
          allowedFileTypes: ["image/jpeg", "image/jpg", "image/png"],
        },
        async (err, uploadedFiles) => {
          if (err) {
            return res.status(400).json({
              status: 400,
              message: "File upload error: " + err.message,
            });
          }

          if (uploadedFiles.length > 0) {
            profilePic = path.relative(
              sails.config.appPath,
              uploadedFiles[0].fd
            );
          }

          try {
            if (req.user.role === "student" && req.user.id !== student_id) {
              return res.status(403).json({
                status: 403,
                message: "You can only update your own profile",
              });
            }

            const student = await Student.findOne(student_id);
            if (!student) {
              return res
                .status(404)
                .json({ status: 404, message: "Student not found" });
            }

            const updates = { className, school };
            if (profilePic) updates.profilePic = profilePic;

            await Student.updateOne(student_id).set(updates);

            const updatedStudent = await Student.findOne(student_id);
            return res.json({
              status: 200,
              message: "Student updated",
              data: updatedStudent,
            });
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

  delete: async function (req, res) {
    try {
      const { student_id } = req.query;
  
      if (!student_id) {
        return res
      .status(400)
      .json({ status: 400, message: "Query parameter is required" });
    }
  
      const student = await Student.find({ id: student_id });
      if (!student) {
        return res
          .status(404)
          .json({ status: 404, message: "Student not found" });
      }
  
      const deletedStudent = await Student.destroy({ id: student_id });
  
      return res.json({
        status: 200,
        message: "Student deleted",
        deletedStudent,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ status: 500, message: error.message || "Server error" });
    }
  },
};
