const slugify = require("slugify");
const Blog = require("../Models/BlogModel");
const { uploadImages } = require("../Helper/ImageUploader");

// CREATE BLOG
const postBlog = async (req, res) => {
  const { role } = req.user;
  const {
    title,
    categories = [],
    shortDescription = "",
    content,
    isPublished = false,
    isFeatured = false,
  } = req.body;

  if (role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "You must be an admin to post a blog.",
    });
  }

  if (!title || !content) {
    return res.status(400).json({
      success: false,
      message: "Title and content are required.",
    });
  }

  try {
    const slug = slugify(title, { lower: true, strict: true });
    const existing = await Blog.findOne({ slug });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "A blog with this title already exists.",
      });
    }

    if (!req.files?.heroImage) {
      return res.status(400).json({
        success: false,
        message: "Hero image is required.",
      });
    }

    const uploadedImage = await uploadImages(req.files.heroImage); // always returns an array
    const newBlog = new Blog({
      title,
      slug,
      categories: Array.isArray(categories) ? categories : [categories],
      shortDescription: shortDescription.slice(0, 300),
      content,
      heroImage: uploadedImage, // pick the first if single image
      isPublished,
      isFeatured,
    });

    await newBlog.save();

    return res.status(201).json({
      success: true,
      message: "Blog post created successfully.",
      blog: newBlog,
    });
  } catch (error) {
    console.error("Error posting blog:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ isPublished: true }).sort({
      createdAt: -1,
    });
    res.status(200).json({ success: true, blogs });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const categories = await Blog.distinct("categories");
    res.status(200).json({ success: true, categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getBlogAsAdmin = async (req, res) => {
  const { role } = req.user;

  if (role != "admin")
    return res
      .status(400)
      .json({ success: true, message: "You must be an Admin" });

  try {
    const blogs = await Blog.find({}).sort({
      createdAt: -1,
    });
    res.status(200).json({ success: true, blogs });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getOneBlog = async (req, res) => {
  const { id } = req.params;

  try {
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: `Blog with ID ${id} not found.`,
      });
    }

    res.status(200).json({ success: true, blog });
  } catch (error) {
    console.error("Error fetching blog by ID:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const deleteBlog = async (req, res) => {
  const { id } = req.params;
  const { role } = req.user;

  if (role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Only admins are authorized to delete blog posts.",
    });
  }

  try {
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: `Blog with ID ${id} not found.`,
      });
    }

    await Blog.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Blog deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting blog:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error while deleting blog.",
    });
  }
};

// PATCH: Update publish status (Admin only)
const updatePublishStatus = async (req, res) => {
  const { role } = req.user;
  const { id } = req.params;
  const { isPublished } = req.body;

  if (role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Only admins can update publish status.",
    });
  }

  try {
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found.",
      });
    }

    blog.isPublished = isPublished;
    await blog.save();

    return res.status(200).json({
      success: true,
      message: `Blog marked as ${isPublished ? "Published" : "Draft"}.`,
      blog,
    });
  } catch (error) {
    console.error("Error updating publish status:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while updating publish status.",
    });
  }
};

const getFeaturedBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ isPublished: true, isFeatured: true }).sort(
      { createdAt: -1 }
    );
    res.status(200).json({ success: true, blogs });
  } catch (error) {
    console.error("Error fetching featured blogs:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const updateFeaturedStatus = async (req, res) => {
  const { role } = req.user;
  const { id } = req.params;
  const { isFeatured } = req.body;

  if (role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Only admins can update featured status.",
    });
  }
  try {
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found.",
      });
    }

    blog.isFeatured = isFeatured;
    await blog.save();

    return res.status(200).json({
      success: true,
      message: `Blog marked as featured blog.`,
      blog,
    });
  } catch (error) {
    console.error("Error updating publish status:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while updating publish status.",
    });
  }
};

const updateBlog = async (req, res) => {
  const { role } = req.user;
  const { id } = req.params;
  const { title, categories, shortDescription, content, isFeatured } = req.body;

  if (role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Only admins can update blogs.",
    });
  }

  try {
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found.",
      });
    }

    if (title) {
      blog.title = title;
      blog.slug = slugify(title, { lower: true, strict: true });
    }
    if (categories)
      blog.categories = Array.isArray(categories) ? categories : [categories];
    if (shortDescription)
      blog.shortDescription = shortDescription.slice(0, 300);
    if (content) blog.content = content;
    if (typeof isFeatured === "boolean") blog.isFeatured = isFeatured;

    await blog.save();

    res.status(200).json({
      success: true,
      message: "Blog updated successfully.",
      blog,
    });
  } catch (error) {
    console.error("Error updating blog:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  postBlog,
  getAllBlogs,
  getOneBlog,
  deleteBlog,
  getBlogAsAdmin,
  getFeaturedBlogs,
  updateFeaturedStatus,
  updatePublishStatus,
  getAllCategories,
  updateBlog,
};
