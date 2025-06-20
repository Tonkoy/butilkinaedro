const mongoose = require('mongoose');


const categorySchema = new mongoose.Schema(
  {
    parentCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category"
    },
    name: {
      type: String,
      required: true,
      unique: true
    },
    description: {
      type: String
    },
    imageUrl: {
      type: String
    },
    slug: {
      type: String,
      unique: true
    },
    key: {
      type: String,
      unique: true
    },
    status: {
      type: Boolean,
      default: false
    },
    seoTitle: {
      required: true,
      type: String,
    },
    seoDescription: {
      required: true,
      type: String,
    },
    seoKeywords: {
      required: true,
      type: String,
    },
    ogImageUrl: {
      required: true,
      type: String
    },
  },
  {
    timestamps: true
  }
);

let Category = mongoose.models.Category || mongoose.model("Category", categorySchema);
export default Category;
