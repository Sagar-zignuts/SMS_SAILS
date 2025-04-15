module.exports.policies = {

  //Policies for authcontrollers , and true means they don't use any policies 
  'AuthController': {
    'AdminLogin': true,
    'StudentLogin': true,
    'StudentRegister': true
  },

  //policies on studentcontrollers
  'StudentController': {
    'create': 'isAdmin',
    'getById': 'RestrictedTo',
    'getAll': 'RestrictedTo',
    'update': 'isAdmin',
    'delete': 'isAdmin',
  },

    //policies on perentcontrollers
  'ParentController': {
    'create': 'isAdmin',
    'getById': 'RestrictedTo',
    'getAll': 'RestrictedTo',
    'update': 'isAdmin',
    'delete': 'isAdmin',
  },
};
