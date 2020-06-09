const mongoose = require('mongoose'),


  passportLocalMongoose = require('passport-local-mongoose');
  const mongoosePaginate = require('mongoose-paginate');

  const Schema = mongoose.Schema;

  const productSchema = mongoose.Schema({
    name: { type: String, required: true },

    technologies: String,

    price: { type: Number },

    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      },
      pimg:{
        fileId:String,
        fileName:String
    }

  });


productSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Product",productSchema)