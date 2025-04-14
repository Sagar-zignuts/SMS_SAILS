const bcrypt = require('bcrypt')
const {v4 : uuidV4} = require('uuid')

module.exports = {
    
    migrate : 'alter',
    tableName : 'admins',

    attributes : {
        id : {
            type : 'string',
            required : true,
            unique : true,
            columnType : 'uuid'
        },
        email : {
            type : 'strung',
            required : true,
            unique : true,
            isEmail : true
        },
        password : {
            type : 'string',
            required : true
        },
        createdAt: {
            type: 'number',
            autoCreatedAt: true
        },
        updatedAt: {
            type: 'number',
            autoUpdatedAt: true
        }
    },

    primaryKey : 'id',

    beforeCreate : async function(values , proceed){
        values.id = uuidV4();
        values.password = await bcrypt.hash(values.password , 10)
        return proceed()
    }
} 