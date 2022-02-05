//Step 54
const express = require("express");
const { 
  createCommentCtrl,
  fetchAllCommentsCtrl,
  fetchCommentCtrl,
  updateCommentCtrl,
  deleteCommentCtrl
 } = require("../../controllers/comments/commentCtrl");
const authMiddleware = require("../../middlewares/auth/authMiddleware"); 


const CommentRoutes = express.Router();


CommentRoutes.post("/",authMiddleware, createCommentCtrl); //next set the route in server.js
CommentRoutes.get("/", fetchAllCommentsCtrl); 
CommentRoutes.get("/:id",authMiddleware, fetchCommentCtrl); 
CommentRoutes.put("/:id",authMiddleware, updateCommentCtrl); 
CommentRoutes.delete("/:id",authMiddleware, deleteCommentCtrl); 

module.exports = CommentRoutes;