// // ************************* 
// //  Just use to set admin details into the database and this will run before we starting the app.
// // *************************

// require('dotenv').config()

// module.exports.bootstrap = async function(done) {

//   try {
//     const adminData = {
//       id : 'placeholder',
//       email : process.env.ADMIN_EMAIL,
//       password : process.env.ADMIN_PASS
//     }
//     const admin =await Admin.create(adminData)
//     console.log('admin registerd');
//     return done()
    
//   } catch (error) {
//     console.log('error to add the admin in database', error.message);
//     return done(error)
//   }
// };
