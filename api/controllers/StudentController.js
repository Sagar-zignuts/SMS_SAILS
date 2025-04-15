const { validator, redisClient, DEFAULT_TTL, path,v4 } = sails.config.constant;


module.exports = {

  //create student
  create: async function (req, res) {
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
            console.error('Upload error:', err);
            return res.status(400).json({
              status: 400,
              message: 'File upload error: ' + err.message,
            });
          }

          if (uploadedFiles && uploadedFiles.length > 0) {
            profilePic = path.relative(
              sails.config.appPath,
              uploadedFiles[0].fd
            );
          }

          const { email, className, school, password } = req.body;

      
          const validation = new validator(
            { email, className, school, password },
            {
              email: 'required|email',
              className: 'required',
              school: 'required',
              password: 'required|min:7',
            }
          );

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
              id: v4(),
              email,
              className,
              school,
              profilePic,
              password,
            }).fetch();

            await redisClient.setEx(
              `student:${student.id}`,
              DEFAULT_TTL,
              JSON.stringify(student)
            );

            try {
              await sails.helpers.sendMail(email)
              console.log('Welcome email sent successfully.');
            } catch (error) {
              console.error('Error while sending welcome email:', error);
            }

            return res.status(200).json({
              status: 200,
              message: 'Student created',
              data: student,
            });
          } catch (error) {
            console.error(error);
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
      const studentId = req.params.id;
      const redisKey = `student:${studentId}`;
      const cachedStudent = await redisClient.get(redisKey);

      if (cachedStudent) {
        return res.status(200).json({
          status: 200,
          message: 'Data fetch',
          data: JSON.parse(cachedStudent),
        });
      }

      const student = await Student.findOne({ id: studentId });
      if (!student) {
        return res
          .status(400)
          .json({ status: 400, message: 'student not found' });
      }

      await redisClient.setEx(redisKey, DEFAULT_TTL, JSON.stringify(student));
      return res
        .status(200)
        .json({ status: 200, message: 'Data fetched', data: student });
    } catch (error) {
      return res
        .status(500)
        .json({ status: 500, message: error.message || 'Server error' });
    }
  },

  getAll: async function (req, res) {
    try {
      const { email } = req.query;
      const criteria = {};

      if (email) {
        criteria.email = { contains: email };
      }

      const students = await Student.find(criteria);

      if (students.length === 0) {
        return res.status(400).json({
          status: 400,
          message: 'No students found with the given email',
        });
      }

      return res.status(200).json({
        status: 200,
        message: 'Students retrieved successfully',
        data: students,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ status: 500, message: error.message || 'Server error' });
    }
  },

  update: async function (req, res) {
    try {
      const { className, school } = req.body;
      let profilePic;
      const { studentId } = req.query;

      if (!studentId) {
        return res
          .status(400)
          .json({ status: 400, message: 'Query parameter is required' });
      }

      const validation = new validator(
        { className, school },
        {
          className: 'required',
          school: 'required',
        }
      );

      if (validation.fails()) {
        return res.status(400).json({
          status: 400,
          message: `Error in validation : ${validation.errors.all()}`,
        });
      }

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

          if (uploadedFiles.length > 0) {
            profilePic = path.relative(
              sails.config.appPath,
              uploadedFiles[0].fd
            );
          }

          try {
            if (req.user.role === 'student' && req.user.id !== studentId) {
              return res.status(403).json({
                status: 403,
                message: 'You can only update your own profile',
              });
            }

            const student = await Student.findOne(studentId);
            if (!student) {
              return res
                .status(404)
                .json({ status: 404, message: 'Student not found' });
            }

            const updates = { className, school };
            if (profilePic) updates.profilePic = profilePic;

            await Student.updateOne(studentId).set(updates);

            const updatedStudent = await Student.findOne(studentId);

            await redisClient.setEx(
              `student:${studentId}`,
              DEFAULT_TTL,
              JSON.stringify(updatedStudent)
            );

            return res.json({
              status: 200,
              message: 'Student updated',
              data: updatedStudent,
            });
          } catch (error) {
            return res
              .status(500)
              .json({ status: 500, message: error.message || 'Server error' });
          }
        }
      );
    } catch (error) {
      return res
        .status(500)
        .json({ status: 500, message: error.message || 'Server error' });
    }
  },

  delete: async function (req, res) {
    try {
      const { studentId } = req.query;

      if (!studentId) {
        return res
          .status(400)
          .json({ status: 400, message: 'Query parameter is required' });
      }

      const student = await Student.findOne({ id: studentId });
      if (!student) {
        return res
          .status(400)
          .json({ status: 400, message: 'Student not found' });
      }

      const deletedStudent = await Student.destroy({ id: studentId });

      await redisClient.del(`student:${studentId}`);

      return res.json({
        status: 200,
        message: 'Student deleted',
        deletedStudent,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ status: 500, message: error.message || 'Server error' });
    }
  },
};
