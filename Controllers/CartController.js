const Cart = require("../models/Cart");


const SaveCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { items } = req.body;

    let cart = await Cart.findOne({ UserId: userId });

    if (cart) {

      cart.items = items.map((i) => ({
        foodId: i.foodId,
        quantity: i.quantity || 1,
      }));
    } else {
      cart = new Cart({
        UserId: userId,
        items: items.map((i) => ({
          foodId: i.foodId,
          quantity: i.quantity || 1,
        })),
      });
    }

    await cart.save();
    res.json(cart);
  } catch (error) {
    console.error("Error saving cart:", error);
    res.status(500).send("Error occurred while saving cart");
  }
};


//const cart=await Cart.find({item._id})
// if (cart){
 

// }


//  Fetch cart
const FetchCart = async (req, res) => {
  try {
    const UserId = req.user.id;

    const cart = await Cart.findOne({ UserId }).populate("items.foodId");

    res.json(cart || { items: [] });
  } catch (error) {
    console.error("FetchCart error:", error);
    res.status(500).send("Error occurred while fetching cart");
  }
};

module.exports = { SaveCart, FetchCart };
