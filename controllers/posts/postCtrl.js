
//STEP 39
const expressAsyncHandler = require("express-async-handler");
const Post = require("../../model/post/Post");
const validateMongodbId = require("../../utils/validateMongodbID");
const User = require("../../model/user/User");

//STEP 40
const Filter = require("bad-words");
//STEP 42
const cloudinaryUploadImg = require("../../utils/cloudinary");

//STEP 43
const fs = require("fs");





//------------------------------
//STEP 39- Create Post & set the route
//------------------------------
const createPostCtrl = expressAsyncHandler(async (req,res) => {
  console.log(req.file);
  const {_id} = req.user;
  validateMongodbId(_id);
  //STEP 40 -check for bad words
  const filter = new Filter();
  const isProfane = filter.isProfane(req.body.title, req.body.description);
  //STEP 40-BLOCK User
  if (isProfane) {
    await User.findByIdAndUpdate(_id,
      {isBlocked: true
      });
      throw new Error("Creating Failed because it containes profane words and you have been blocked");
  }//next step is to upload image for a post. for this go to middlewares and photoUpload file

  //STEP 42
  //1. Get the path to img
  const localPath = `public/images/posts/${req.file.filename}`;

  //2.Upload to cloudinary 
  const imgUploaded = await cloudinaryUploadImg(localPath); //NEXT STEP is to remove saved images-require fs

  try {
    const post = await Post.create({
      ...req.body, 
      image: imgUploaded?.url,//in order to test on postmen either comment out the image line or test the image file sepately by commentinng req.body and res.json to image upload
      user: _id,
  });
    res.json(post)
    //STEP 43-Remove the picturefrom the folder that have already been uploaded on cloudinary
    fs.unlinkSync(localPath);//apply this function for profile picture in userCtrl as well-next step fetch all posts
  } catch(error) {
    res.json(error);
  }
});

//------------------------------
//STEP 44- Fetch all Posts & set the route
//------------------------------

const fetchPostsCtrl = expressAsyncHandler(async (req,res) => {
  const hasCategory = req.query.category
  try {
    //Check if it has category
    if (hasCategory) {
      const posts = await Post.find({category: hasCategory}).populate("user").populate("comments");
      res.json(posts);
    } else {
      const allPosts = await Post.find({}).populate("user").populate("comments");
    res.json(allPosts)
    }
    
  } catch (error) {
    res.json(error)
  }
}); //After fetching and pupulating the user field next step is to virtually create a schema in the model User.js 
//so that posts created by a specific user can be fetched and displayed-MOVE TO USER.JS

//------------------------------
//STEP 46- Fetch a single post & set the route
//------------------------------

const fetchPostCtrl = expressAsyncHandler(async (req,res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const post = await Post.findById(id).populate("user").populate("disLikes").populate("likes").populate("comments");
    //STEP 47-update number of views
    await Post.findByIdAndUpdate(id, {
      $inc: {numViews: 1},
    },
    {
      new: true
    })
    res.json(post)
  } catch (error) {
    res.json(error);
  }
})

//------------------------------
//STEP 48- Update a post & set the route
//------------------------------

const updatePostCtrl = expressAsyncHandler(async (req,res) => {
  const {_id} = req.user;
  const {id} = req.params;
  validateMongodbId(id);
  try {
    const post = await Post.findByIdAndUpdate(id, {
      /*title: req.body.title,
      category: req.body.category,
      description: req.body.description,
      user: _id*/ //USE A SPREAD OPERATOR INSTEAD
      ...req.body,
      user: _id
    }, 
    {
      new:true
    });
    res.json(post)
  } catch (error) {
    res.json(error)
  }
})

//------------------------------
//STEP 49- Delete a post & set the route
//------------------------------

const deletePostCtrl = expressAsyncHandler(async (req,res) => {
  const {id} = req.params;
  validateMongodbId(id);
  try {
    const post = await Post.findByIdAndDelete(id);
    res.json(post);
  } catch (error) {
    res.json(error);
  }
});

//------------------------------
//STEP 50- Likes of a post & set the route
//------------------------------
//In this case if we look at the frontend we plan to use this function on a page with multiple posts 
//and if we use the typical method that is to retrieve the id from req.params 
//then we will face multiple errors as using an id in params means that there is a single post of that particular id on the page. 
//So this time around we will retrive the id from the body
const toggleAddLikeToPostCtrl = expressAsyncHandler(async (req,res) => {
  //1. find the post to be liked
  const {postId} = req.body;
  const post = await Post.findById(postId)
  //2. find the login user
  const loginUserId = req?.user?._id;
  //3. Find if this user has liked this post
  const isLiked = post?.isLiked;
  //4. check if this user has disLiked this post
  const alreadyDisliked = post?.disLikes?.find(
    userId => userId?.toString() === loginUserId?.toString()
  );
  //5. remove the user from disliked array if user already exists
  if(alreadyDisliked) {
    const post = await Post.findByIdAndUpdate(postId, {
      $pull: {disLikes: loginUserId},
      isDisLiked: false,
    },
    {
      new: true
    });
    res.json(post)
  }
  //6. Remove the user if the user has liked the post
  if(isLiked) {
    const post = await Post.findByIdAndUpdate(postId, {
      $pull: {likes: loginUserId},
      isLiked: false,
    }, {
      new: true
    });
    res.json(post);
  } else {
    //add to likes
    const post = await Post.findByIdAndUpdate(postId, {
      $push : {likes: loginUserId},
      isLiked: true,
    },{
      new: true
    });
    res.json(post);
  }
  
});

//------------------------------
//STEP 51- DisLikes of a post & set the route
//------------------------------

const toggleAddDisLikeToPostCtrl = expressAsyncHandler(async (req,res) => {
  //1. find the post to be dislike
  const {postId} = req.body;
  const post = await Post.findById(postId);
  //2. find the login user
  const loginUserId = req?.user?._id;
  //3. check if the user has already dislkied this post
  const isDisLiked = post?.isDisLiked;
  //4. check if the user has already liked this post
  const alreadyLiked = post?.likes?.find(
    userId => userId?.toString() === loginUserId?.toString()
  );
  //5. remove the user from the likes array if the user already exists
  if(alreadyLiked) {
    const post = await Post.findByIdAndUpdate(postId, {
      $pull: {likes: loginUserId},
      isLiked: false
    },
    {
      new: true
    });
    res.json(post);
  }
  //6. remove the user if the user has already disliked the post
  if(isDisLiked) {
    const post = await Post.findByIdAndUpdate(postId, {
      $pull: {disLikes: loginUserId},
      isDisLiked: false
    },
    {
      new: true
    });
    res.json(post);
  } else {
    //add the user to dislikes array
    const post = await Post.findByIdAndUpdate(postId, {
      $push: {disLikes: loginUserId},
      isDisLiked: true,
    },
    {
      new: true
    });
    res.json(post)
  }
}); //Next step is to populate fetch single post ctrl with likes and dislikes so that we can also see the details of the user who have liked or disliked the post


module.exports = {createPostCtrl, fetchPostsCtrl, fetchPostCtrl, updatePostCtrl, deletePostCtrl, toggleAddLikeToPostCtrl, toggleAddDisLikeToPostCtrl}; //MOVE TO postRoute

//AFTER CREATING POSTS CTRLS CREATE A MODEL FOR COMMENT.JS