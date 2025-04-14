const {v4 : uuidV4} = require('uuid')

module.exports = {
    migrate :'alter',
    tableName : 'parents',
    attributes : {
        id : {
            type : 'string',
            unique : true,
            columnType : 'uuid',
            required : true
        },
        email : {
            type : 'string',
            idEmail : true,
            unique : true,
            required : true
        },
        name : {
            type : 'string',
            required : true
        },
        relation : {
            type : 'string',
            isIn : ['Father' , 'Mother' ,'Guardian' ,'other'],
            required : true
        },
        studentId : {
            model : 'student',
            required : true
        },
        createdAt : {
            type : 'number',
            autoCreatedAt: true
        },
        updatedAt: {
            type: 'number',
            autoUpdatedAt: true
        }
    },

    primaryKey : id,

    beforeCreate : async function(values , proceed) {
        values.id = uuidV4()
        return proceed()
    }
}