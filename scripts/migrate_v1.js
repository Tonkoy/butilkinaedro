const mongoose = require('mongoose');
const slugify = require('slugify');
const Product = require('../src/mongo/models/Product');
const rawProducts = require('../src/_mock/_products_translated'); // adjust your import
const _products_prices = require('../src/_mock/_products_prices'); // adjust your import

const MONGO_URI = 'mongodb+srv://passport:ojVfgx7zbVZpa6T5@cluster0-hwpmi.mongodb.net/butilko?retryWrites=true&w=majority';

const DEFAULT_CATEGORY_ID = '682ce50a0fd1e6b73664dc0a'; // fallback category if needed
const getColorHexByCode = (code = '') => {
  const hexMap = {
    '01': '#FFFFFF',
    '132': '#F1E6E5',
    '07': '#B68C6B',
    '265': '#E58B52',
    '03': '#FFE600',
    '266': '#DC716D',
    '31': '#FF7F27',
    '60': '#E8002B',
    '262': '#C1272D',
    '57': '#841D1C',
    '78': '#EC008C',
    '48': '#F8D4DA',
    '71': '#660066',
    '268': '#B7A3A9',
    '05': '#005BAA',
    '10': '#D2E5F8',
    '12': '#00B5E2',
    '261': '#5B76A4',
    '86': '#536878',
    '55': '#00205B',
    '263': '#BDBBD7',
    '267': '#79A598',
    '126': '#A5C8D0',
    '264': '#E6EDCE',
    '114': '#D7E398',
    '83': '#63B331',
    '20': '#009344',
    '56': '#003B36',
    '15': '#A2A36C',
    '152': '#4E5B3A',
    '58': '#D1D3D4',
    '108': '#C4C4C4',
    '160': '#A7A8AA',
    '46': '#3E3E3E',
    '02': '#000000'
  };

  return hexMap[code.trim()] || '#CCCCCC'; // default fallback
};

const getPriceForProduct = (itemCode) => {
  const priceEntry = _products_prices.find((p) => p.productcode === itemCode);

  const eurPrice =
    priceEntry?.price_1_conf ??
    priceEntry?.price_1 ??
    priceEntry?.price_unit_conf ??
    priceEntry?.price_unit ??
    1.0; // fallback if no data

  const exchangeRate = 1.95583;
  const margin = 0.20;

  const bgnPrice = eurPrice * exchangeRate * (1 + margin);

  return Number(bgnPrice.toFixed(2));
};


const migrateProducts = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to DB');
    await Product.deleteMany({});
    console.log('🧹 Cleared existing products');

    const grouped = rawProducts.reduce((acc, item) => {
      const key = item.modelcode;
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});

    const result = [];

    for (const [modelCode, group] of Object.entries(grouped)) {
      const base = group[0];

      const variations = group.map((v) => ({
        name: v.itemname,
        itemCode: v.itemcode,
        size: v.sizename === 'ONE SIZE ADULT' ? 'UNI' : v.sizename,
        colorCode: getColorHexByCode(v.colorcode) || v.colorcode,
        colorNameOriginal: v.colorname,
        colorNameTranslated: v.colorname,
        stock: parseInt(v.boxunits, 10) || 0,
        price: getPriceForProduct(v.itemcode),
        moq: parseInt(v.moq, 10) || 1,
        images: [v.productimage, ...(v.detailsimages?.split(',') || [])],
        measures: v.measures,
        boxSize: v.boxsize,
        weight: parseFloat(v.weight) || 0,
      }));

      const colors = group.map((v) => ({
        name: v.colorname,
        hex: getColorHex(v.colorname),
      }));

      const product = {
        name: `${base.modelname}Y`,
        nameOriginal: base.itemname,
        description: `<p>${base.description}</p>`,
        descriptionOriginal: base.description,
        seoTitle: `${base.modelname}Y`,
        seoDescription: base.description,
        seoKeywords: `${base.modelname}, ${base.colorname}, брандирани продукти`,
        seoTags: [base.modelname],
        ogImageUrl: base.modelimage,
        slug: slugify(base.modelname, { lower: true }),
        modelCode: modelCode,
        category: DEFAULT_CATEGORY_ID,
        variations,
        colors,
        defaultImage: base.productimage,
        price: variations[0].price, // default, or calculate from MOQ
        minimumForOrder: parseInt(base.moq, 10) || 1,
        available: true,
        sourceUrl: base.productimage,
        dimensions: [base.measures],
        manufacturer: base.brand || 'stamina',
        tags: base.categories?.split(',').map((t) => t.trim()) || [],
        quantity: parseInt(base.boxunits, 10) || 0,
        active: true,
        composition: base.composition,
        sku: base.eancode,
        code: base.itemcode
      };

      result.push(product);
    }

    await Product.insertMany(result);
    console.log(`✅ Inserted ${result.length} products`);
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    mongoose.connection.close();
    console.log('🛑 Connection closed');
  }
};

const getColorHex = (name = '') => {
  const map = {
    'ЧЕРНА': '#000000',
    'БЯЛА': '#FFFFFF',
    'ПРОЗРАЧНА': '#EDEDED',
    'ЗЕЛЕНА': '#008000',
    'СИНЯ': '#0000FF',
    'КРАЛСКО СИНЯ': '#4169E1',
    'SAGE GREEN': '#78866b',
    'ЖЪЛТА': '#FFFF00',
    'ЧЕРВЕНА': '#FF0000',
    'ОРАНЖЕВА': '#FFA500',
    'СИВА': '#808080',
    'СРЕБЪРНА': '#C0C0C0',
  };
  return map[name.trim().toUpperCase()] || '#CCCCCC';
};

migrateProducts();
