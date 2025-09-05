const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    categories: {
      type: [String],
      required: true,
      default: [],
    },
    shortDescription: { type: String, trim: true, maxlength: 300 },
    content: { type: String, required: true },
    heroImage: {
      public_id: { type: String, required: true },
      url: { type: String, required: true },
    },
    isPublished: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
