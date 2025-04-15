module.exports.routes = {
  //Auth Route

  'POST /api/auth/admin-login': 'AuthController.AdminLogin',
  'POST /api/auth/student-login': 'AuthController.StudentLogin',
  'POST /api/auth/student-register': 'AuthController.StudentRegister',

  //Student Route

  'POST /api/student': 'StudentController.create',
  'GET /api/student/:id': 'StudentController.getByID',
  'GET /api/student': 'StudentController.getAll',
  'PUT /api/student': 'StudentController.update',
  'DELETE /api/student': 'StudentController.delete',

  //Parent Route

  'POST /api/parent': 'ParentController.create',
  'GET /api/parent/:id': 'ParentController.getByID',
  'GET /api/parent': 'ParentController.getAll',
  'PUT /api/parent': 'ParentController.update',
  'DELETE /api/parent': 'ParentController.delete',
};