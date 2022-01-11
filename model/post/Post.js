//STEP 38
const mongoose = require("mongoose");


const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Post title is required"],
    trim: true,
  },
  category: {
    type: String,
    required:[true, "Post category is required"],
    //default: "All",
  }, 
  isLiked : {
    type: Boolean,
    default: false,
  },
  isDisLiked : {
    type: Boolean,
    default: false,
  },
  numViews : {
    type: Number,
    default: 0,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  disLikes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Pleae Author is required"],
  },
  description: {
    type: String,
    required: [true, "Post Description is required"],
  },
  image: {
    type: String,
    default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
  }
  
}, {
  toJSON : {
    virtuals: true,
  }, 
  toObject: {
    virtuals: true
  },
  timestamps: true,
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post; //move to postCtrl