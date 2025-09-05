const express = require("express");
const router = express.Router();
const {
  postBlog,
  getAllBlogs,
  getOneBlog,
  deleteBlog,
  getBlogAsAdmin,
  updatePublishStatus,
  getAllCategories,
  getFeaturedBlogs,
  updateBlog,
  updateFeaturedStatus,
} = require("../Controllers/blogController");
const { verifyAdmin } = require("../MIddlewares/verifyAdmin");

router.post("/post-blog", verifyAdmin, postBlog);
router.get("/blogs", getAllBlogs);
router.get("/all-blogs", verifyAdmin, getBlogAsAdmin);
router.get("/categories", getAllCategories);
router.get("/blog/:id", getOneBlog);
router.get("/featured", getFeaturedBlogs);
router.put("/update/:id", verifyAdmin, updateBlog);
router.patch("/update-status/:id", verifyAdmin, updatePublishStatus);
router.patch("/featured-status/:id", verifyAdmin, updateFeaturedStatus);
router.delete("/delete/:id", verifyAdmin, deleteBlog);

module.exports = router;
