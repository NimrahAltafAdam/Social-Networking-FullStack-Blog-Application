const express = require("express");
const {
  createCategoryCtrl,
  fetchCategoriesCtrl,
  fetchCategoryCtrl,
  updateCategoryCtrl,
  delteCategoryCtrl
}
   = require("../../controllers/category/categoryCtrl");
const authMiddleware = require("../../middlewares/auth/authMiddleware");

const categoryRoute = express.Router();

categoryRoute.post("/", authMiddleware,createCategoryCtrl);
categoryRoute.get("/",fetchCategoriesCtrl);
categoryRoute.get("/:id",fetchCategoryCtrl);
categoryRoute.put("/:id", authMiddleware, updateCategoryCtrl);
categoryRoute.delete("/:id", authMiddleware, delteCategoryCtrl);

module.exports = categoryRoute;