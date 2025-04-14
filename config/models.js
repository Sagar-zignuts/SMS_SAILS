module.exports.models = {



  // migrate: 'alter',
  attributes: {
    createdAt: { type: 'number', autoCreatedAt: true, },
    updatedAt: { type: 'number', autoUpdatedAt: true, },
    id: { type: 'number', autoIncrement: true, },
    },


  dataEncryptionKeys: {
    default: 'iaRvcnK2rePAIZovbMGQcEp/Zz9EY1jpaV1M3lca4dE='
  },
  
  cascadeOnDestroy: true


};
