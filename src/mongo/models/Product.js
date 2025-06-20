const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  itemCode: {
    type: String
  },
  size: {
    type: String
  },
  colorCode: {
    type: String
  },
  colorNameOriginal: {
    type: String
  },
  colorNameTranslated: {
    type: String
  },
  stock: {
    type: Number
  },
  price: {
    type: Number
  },
  moq: {
    type: Number
  },
  images: {
    type: Array
  },
  measures: {
    type: String
  },
  boxSize: {
    type: String
  },
  weight: {
    type: Number
  }

}, { _id: false });

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    description: {
      required: true,
      type: String,
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
    slug: {
      type: String,
      unique: true,
      required: true
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Category"
    },
    defaultImage: {
      type: String,
      required: true,
    },
    variations: {
      type: [variantSchema]
    },
    colors: {
      type: Array
    },
    price: {
      type: Number
    },
    minimumForOrder: {
      type: Number
    },
    available: {
      type: Boolean
    },
    sourceUrl: {
      type: String
    },
    dimensions: {
      type: Array
    },
    manufacturer: {
      type: String,
    },
    tags: {
      type: Array
    },
    quantity: {
      type: Number
    },
    active: {
      type: Boolean,
      default: false
    },
    composition: {
      type: String
    },
    seoTags: {
      type: Array
    },
    // Roly Fields
    modelCode: {
      type: String,
    },
    nameOriginal: {
      type: String
    },
    descriptionOriginal: {
      type: String
    },
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);

