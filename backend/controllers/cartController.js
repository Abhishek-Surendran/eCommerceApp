import Cart from '../models/cartModel.js';
import Product from '../models/productModel.js';


const calculateTotalAmount = (cart) => {
  return cart.cartItems.reduce((total, item) => {
    return total + item.qty * item.product.price; 
  }, 0);
};


export const addToCart = async (req, res) => {
  const { productId, qty } = req.body;
  const user = req.user;

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

    
    cart.totalAmount = calculateTotalAmount(cart);

    const updatedCart = await cart.save();
    res.json(updatedCart);
  } catch (error) {
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
  const user = req.user;
  const productId = req.params.id;

  try {
    let cart = await Cart.findOne({ user: user._id });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const updatedCartItems = cart.cartItems.filter((item) => item.product.toString() !== productId);

    if (updatedCartItems.length === cart.cartItems.length) {
      return res.status(404).json({ message: 'Product not found in cart' });
    }

    cart.cartItems = updatedCartItems;

    
    cart.totalAmount = calculateTotalAmount(cart);

    const updatedCart = await cart.save();
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: 'Failed to remove item from cart', error });
  }
};
