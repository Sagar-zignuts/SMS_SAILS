const {bcrypt} = sails.config.constant;
//Admin model
module.exports = {
  migrate: 'alter',
  tableName: 'admins',

  attributes: {
    id: {
      type: 'string',
      required: true,
      unique: true,
    },
    email: {
      type: 'string',
      required: true,
      unique: true,
      isEmail: true,
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

  //It will automatically convert the password in hashed code before creating
  beforeCreate: async function (values, proceed) {
    values.password = await bcrypt.hash(values.password, 10);
    return proceed();
  },
};
