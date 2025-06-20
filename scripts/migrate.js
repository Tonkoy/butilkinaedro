const mongoose = require('mongoose');
const slugify = require('slugify');
const Product = require('../src/mongo/models/Product');

async function autofillAndRenameFields() {
  try {
    const products = await Product.find({});

    for (const product of products) {
      // Rename fields in the 'variations' array
      if (Array.isArray(product.variations)) {
        product.variations = product.variations.map(variant => {
          if (variant.colorNameOriginal) {
            variant.colorName = variant.colorNameOriginal;
            delete variant.colorNameOriginal;
          }
          return variant;
        });
      }

      console.log(product.defaultImage)

      // Autofill required fields with default values if missing
      product.name = product.nameOriginal || 'Default Product Name';
      product.description = product.descriptionOriginal || 'Default description for this product.';
      product.image = product.defaultImage || 'https://placeholder.com/default-image.jpg';
      product.slug = slugify(product.nameOriginal, { lower: true });
      product.key = product.modelCode || `${product.modelCode || 'unknown'}-${product.slug}`;
      product.seoTitle = product.seoTitle || product.name;
      product.seoDescription = product.descriptionOriginal;
      product.seoKeywords = product.seoKeywords || product.nameOriginal.split(' ').join(', ');
      product.ogImageUrl = product.image;

      // Hardcode category ID
      product.category = new mongoose.Types.ObjectId('6464bf92268b69664eabdd9e');

      // Validate and save the product
      try {
        await product.save();
        console.log(`Updated product: ${product.name}`);
      } catch (saveError) {
        console.error(`Error saving product ${product._id}:`, saveError.message);
      }
    }

    console.log('Fields renamed and autofilled successfully!');
  } catch (error) {
    console.error('Error renaming fields:', error);
  }
}
// Connect to MongoDB and start the renaming process
mongoose.connect('mongodb+srv://passport:ojVfgx7zbVZpa6T5@cluster0-hwpmi.mongodb.net/boilerplate-ecommerce?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to MongoDB');
    await autofillAndRenameFields();
    mongoose.disconnect();
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error);
  });
