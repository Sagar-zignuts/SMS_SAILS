const jwt = require('jsonwebtoken');
const validator = require('validatorjs');
const bcrypt = require('bcrypt');
const path = require('path');
const {sendWelcomeMessage} = require('../../config/sendMail')

module.exports = {
  AdminLogin: async function (req, res) {
    try {
      const { email, password } = req.body;

      const validation = new validator(
        {
          email,
          password,
        },
        {
          email: 'required|email',
          password: 'required',
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
          .json({ status: 400, message: 'Email is not awailable' });
      }

      const result = await bcrypt.compare(password, admin.password);
      if (!result) {
        return res
          .status(400)
          .json({ status: 400, message: 'Password is incorret' });
      }
      const token = jwt.sign(
        {
          id: admin.id,
          role: 'admin',
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: '1h' }
      );

      return res.status(200).json({
        status: 200,
        message: 'Welcome Admin',
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
  StudentLogin: async function (req, res) {
    try {
      const { email, password } = req.body;
      
      const validation = new validator(
        { email, password },
        {
          email: 'required|email',
          password: 'required',
        }
      );

      if (validation.fails()) {
        return res
          .status(400)
          .json({ status: 400, message: 'All field required' });
      }

      const student = await Student.findOne({ email });
      if (!student) {
        return res.status(400).json({ status: 400, message: 'Wrong email' });
      }

      const result = await bcrypt.compare(
        password,
        student.password
      );
      if (!result) {
        return res
          .status(400)
          .json({ status: 400, message: 'password is wrong' });
      }

      const token = jwt.sign(
        {
          id: student.id,
          role: 'student',
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: '1h' }
      );

      return res.status(200).json({ status: 200, data: { student, token } });
    } catch (error) {
      console.log(error.message);
      
      return res.status(500).json({
        status: 500,
        message: 'Error in server side Authcontroller in user',
      });
    }
  },

  StudentRegister: async function (req, res) {
      try {
  
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
              return res.status(400).json({
                status: 400,
                message: 'File upload error: ' + err.message,
              });
            }
  
            if (uploadedFiles && uploadedFiles.length > 0) {
              profilePic = path.relative(sails.config.appPath, uploadedFiles[0].fd);
            }

  
            // Fallback to check raw multipart data
            const form = req._fileparser.form;
            form.on('field', (name, value) => {
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
              await sendWelcomeMessage(email)
  
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
};
