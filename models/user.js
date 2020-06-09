const mongoose = require('mongoose'),
  passportLocalMongoose = require('passport-local-mongoose');

  const userSchema = mongoose.Schema({
      username: { type: String, required: true },

      email: { type: String,  unique: true },

      number: { type: String, unique: true },

      typeAccess: { type: String,
                  default: 'user' },
                  

      password: {type : String},

      wishList: { items: Object, totalPrice:{type: Number, default:0}, totalQty: {type: Number, default:0} },

      loginOtp: String,

      otpExpires: Date,

      facebookId: String,

      businessType: { type: String }
      
  });


  userSchema.plugin(passportLocalMongoose,{ usernameField: 'email'});

  module.exports = mongoose.model("User",userSchema)