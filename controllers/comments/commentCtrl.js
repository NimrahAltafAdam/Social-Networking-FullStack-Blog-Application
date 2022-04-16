//step 53
const expressAsyncHandler = require("express-async-handler");
const { findById } = require("../../model/comment/Comment");
const Comment = require("../../model/comment/Comment");
const blockUser = require("../../utils/blockUser");
const validateMongodbId = require("../../utils/validateMongodbID");


//------------------------------
//STEP 53- Create a comment 
//------------------------------
const createCommentCtrl = expressAsyncHandler(async (req,res) => {
  //1. Get the user
  const user = req.user;
  //check if user is blocked
  blockUser(user);
  //2. Get the post id-We can get this id both by req.body or req.params but in this case req.body is the preferred method
  const {postId, description} = req.body;
  try {
    const comment = await Comment.create({
      post: postId,
      user: user,
      description: description,
    })
    res.json(comment)
  } catch (error) {
    res.json(error);
  }
});

//------------------------------
//STEP 54- Fetch all comments 
//------------------------------

const fetchAllCommentsCtrl = expressAsyncHandler(async (req,res) => {
    try {
    const comments = await Comment.find({}).sort("-created");
    res.json(comments);
  } catch (error) {
    res.json(error)
  }
});


//------------------------------
//STEP 55- Fetch single comment details
//------------------------------
const fetchCommentCtrl = expressAsyncHandler(async (req,res) => {
  const {id} = req.params;
  validateMongodbId(id);
  try {
    const comment = await Comment.findById(id);
    res.json(comment);
  } catch (error) {
    res.json(error)
  }
})


//------------------------------
//STEP 56- Update a comment 
//------------------------------

const updateCommentCtrl = expressAsyncHandler(async (req,res) => {
  const {id} = req.params;
  try {
    const comment = await Comment.findByIdAndUpdate(id, {
     // post: req.body?.postId,
      user: req.user,
      description: req.body?.description
    },
    {
      new: true,
      runValidators: true
    })
    res.json(comment);
  } catch (error) {
    res.json(error)
  }
});

//------------------------------
//STEP 57- Delete a comment 
//------------------------------

const deleteCommentCtrl = expressAsyncHandler(async (req,res) => {
  const {id} = req.params;
  validateMongodbId(id)
  try {
    const comment = await Comment.findByIdAndDelete(id);
    res.json(comment);
  } catch (error) {
    res.json(eror);
  }
})

module.exports = {createCommentCtrl, fetchAllCommentsCtrl, fetchCommentCtrl, updateCommentCtrl, deleteCommentCtrl};// next set the route in commentRoute.js

//AFTER SETTING COMMENT CTRL CREATE AN EMAILMESSAGING MODEL