import Cart from '../models/cartModel.js';
import Product from '../models/productModel.js';


export const addToCart = async (req, res) => {
  const { productId, qty } = req.body; 
  const user = req.user;

  
  if (!qty || qty <= 0) {
    return res.status(400).json({ message: 'Quantity must be greater than 0' });
  }

  try {
    
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    
    let cart = await Cart.findOne({ user: user._id });

    if (cart) {
      
      const existingProduct = cart.cartItems.find((item) => item.product.toString() === productId);
      if (existingProduct) {
        
        existingProduct.qty += qty;
      } else {
        
        cart.cartItems.push({ product: productId, qty });
      }
    } else {
      
      cart = new Cart({
        user: user._id,
        cartItems: [{ product: productId, qty }],
      });
    }

    
    const cartItemsWithPrices = await Promise.all(
      cart.cartItems.map(async (item) => {
        const cartProduct = await Product.findById(item.product);
        if (!cartProduct) {
          throw new Error(`Product not found: ${item.product}`);
        }
        return {
          qty: item.qty,
          price: cartProduct.price,
        };
      })
    );

    
    cart.totalAmount = cartItemsWithPrices.reduce((total, item) => {
      return total + item.qty * item.price;
    }, 0);

    
    const updatedCart = await cart.save();
    res.json(updatedCart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to add to cart', error });
  }
};


export const getCart = async (req, res) => {
  const user = req.user;

  try {
    const cart = await Cart.findOne({ user: user._id }).populate('cartItems.product', 'title price image');
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve cart', error });
  }
};


export const removeFromCart = async (req, res) => {
  const { id } = req.params; // Product ID to remove
  const user = req.user;

  try {
    const cart = await Cart.findOne({ user: user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Remove the item from the cartItems array
    cart.cartItems = cart.cartItems.filter((item) => item.product.toString() !== id);

    // Recalculate total amount after removing the item
    const cartItemsWithPrices = await Promise.all(
      cart.cartItems.map(async (item) => {
        const product = await Product.findById(item.product); // Fetch the product to get the price
        return {
          qty: item.qty,
          price: product ? product.price : 0 // If product is found, get the price
        };
      })
    );

    // Calculate the total amount based on qty and product price
    cart.totalAmount = cartItemsWithPrices.reduce((total, item) => {
      return total + item.qty * item.price;
    }, 0);

    // Save the updated cart
    const updatedCart = await cart.save();
    res.json(updatedCart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to remove item from cart', error });
  }
};
