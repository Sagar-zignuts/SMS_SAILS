module.exports.policies = {
  'AuthController': {
    'AdminLogin': true,
    'StudentLogin': true,
    'StudentRegister': true
  },

  'StudentController': {
    'create': ['verifyToken', 'isAdmin'],
    'getById': ['verifyToken', 'RestrictedTo'],
    'getAll': ['verifyToken', 'RestrictedTo'],
    'update': ['verifyToken', 'isAdmin'],
    'delete': ['verifyToken', 'isAdmin'],
  },

  'ParentController': {
    'create': ['verifyToken', 'isAdmin'],
    'getById': ['verifyToken', 'RestrictedTo'],
    'getAll': ['verifyToken', 'RestrictedTo'],
    'update': ['verifyToken', 'isAdmin'],
    'delete': ['verifyToken', 'isAdmin'],
  },
};
