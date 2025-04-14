const {v4 : uuidV4} = require('uuid')
const bcrypt = require('bcrypt')

module.exports = {

    migrate : 'alter',
    tableName : 'students',
    attributes : {
        id : {
            type : 'string',
            unique : true,
            columnType : 'uuid',
            required : true
        },
        email : {
            type : 'string',
            required : true,
            isEmail : true,
            unique : true
        },
        className : {
            type : 'string',
            required : true,
        },
        school : {
            type : 'string',
            required : true
        },
        profilePic : {
            type : 'string',
            required : true,
        },
        password : {
            type : 'string',
            required : true,
        },
        createdAt: {
            type: 'number',
            autoCreatedAt: true
        },
        updatedAt: {
            type: 'number',
            autoUpdatedAt: true
        },
    },
    
    
    primaryKey : 'id',

    beforeCreate : async function(values , proceed){
        values.id = uuidV4()
        values.password = await bcrypt.hash(values.password , 10)
        return proceed()
    }
}