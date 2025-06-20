const mongoose = require('mongoose');

const attributeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  values: [{
    label: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
    unit: { // for attributes that have a measurement unit, like density
      type: String,
      required: false, // this can be optional if not all attributes need a unit
    }
  }],
}, {
  timestamps: true
});

const Dataset = mongoose.models.Attribute || mongoose.model('Attribute', attributeSchema);

module.exports = {
  Dataset,
  attributeSchema,
};
