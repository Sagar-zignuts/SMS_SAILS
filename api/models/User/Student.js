const {v4 : uuidV4} = require('uuid')

module.exports = {
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
    
    primaryKey : 'id',

    beforeCreate : async function(values , proceed){
        values.id = uuidV4()
        return proceed()
    }
}