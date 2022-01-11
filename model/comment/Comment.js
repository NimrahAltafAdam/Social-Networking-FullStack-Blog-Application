//STEP 52
const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  post: {
    type:mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: [true, "Post is required"],
  },
  user : {
    type:Object,//here we are basically passing the user as an object instead of refering it to user model as we can easily access 
    //the user details from the token that is generated for a login user. so here we will pass it as an object 
    //so that we can retrieve the user profile picture, name for the identification of the user when he or she comments
    required: [true, "User is required"],
  },
  description : {
    type: String,
    required: [true, "Decription is required"],
  },
},
{
  timestamps: true
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment; //next create a comment ctrl