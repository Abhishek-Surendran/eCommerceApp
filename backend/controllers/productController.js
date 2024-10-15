import Product from '../models/productModel.js';
import cloudinary from '../config/cloudinary.js';


export const createProduct = async (req, res) => {
  try {
    const { title, description, price, category, brand, stock } = req.body;


    const imageUrl = req.file.path;


    const product = new Product({
      title,
      description,
      price,
      category,
      brand,
      stock,
      image: imageUrl,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: 'Product creation failed', error });
  }
};


export const getAllProducts = async (req, res) => {
  try {
    const { brand, category, minPrice, maxPrice } = req.query;


    let query = {};


    if (brand) {
      query.brand = brand;
    }


    if (category) {
      query.category = category;
    }


    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) {
        query.price.$gte = Number(minPrice);
      }
      if (maxPrice) {
        query.price.$lte = Number(maxPrice);
      }
    }


    const products = await Product.find(query);


    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve products', error: error.message });
  }
};



export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve product', error: error.message });
  }
};


export const updateProduct = async (req, res) => {
  const { title, description, price, category, brand, stock, image } = req.body;

  try {
    const product = await Product.findById(req.params.id);

    if (product) {

      if (image) {
        const uploadedImage = await cloudinary.uploader.upload(image, { folder: 'products' });
        product.image = uploadedImage.secure_url;
      }

      product.title = title || product.title;
      product.description = description || product.description;
      product.price = price || product.price;
      product.category = category || product.category;
      product.brand = brand || product.brand;
      product.stock = stock || product.stock;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Product update failed', error: error.message });
  }
};


export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {

      const imageId = product.image.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`products/${imageId}`);


      await Product.deleteOne({ _id: req.params.id });


      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Product deletion failed', error: error.message });
  }
};

