const bcrypt = require('bcrypt');

//Student model 
module.exports = {
  migrate: 'alter',
  tableName: 'students',
  attributes: {
    id: {
      type: 'string',
      unique: true,
      required: true,
    },
    email: {
      type: 'string',
      required: true,
      isEmail: true,
      unique: true,
    },
    className: {
      type: 'string',
      required: true,
    },
    school: {
      type: 'string',
      required: true,
    },
    profilePic: {
      type: 'string',
      required: true,
    },
    password: {
      type: 'string',
      required: true,
    },
    createdAt: {
      type: 'number',
      autoCreatedAt: true,
    },
    updatedAt: {
      type: 'number',
      autoUpdatedAt: true,
    },
  },

  primaryKey: 'id',

  beforeCreate: async function (values, proceed) {
    values.password = await bcrypt.hash(values.password, 10);
    return proceed();
  },
};
