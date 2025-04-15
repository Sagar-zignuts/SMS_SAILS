//Parent model
module.exports = {
  tableName: 'parents',
  migrate: 'alter',
  primaryKey: 'id',

  attributes: {
    id: {
      type: 'string',
      required: true,
      unique: true
    },
    email: {
      type: 'string',
      isEmail: true,
      unique: true,
      required: true
    },
    name: {
      type: 'string',
      required: true
    },
    relation: {
      type: 'string',
      isIn: ['Father', 'Mother', 'Guardian', 'other'],
      required: true
    },
    studentId: {
      model: 'student',
      required: true
    },
    createdAt: {
      type: 'ref',
      columnType: 'timestamp',
      autoCreatedAt: true
    },
    updatedAt: {
      type: 'ref',
      columnType: 'timestamp',
      autoUpdatedAt: true
    }
  },
};
