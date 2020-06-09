Cart= function(oldCart) {
    this.items = oldCart.items || {};
    this.totalPrice = oldCart.totalPrice || 0;
    this.totalQty = oldCart.totalQty || 0;
    console.log('cart rahul'+oldCart.totalQty);
  
  };

  Cart.prototype.add = function(item, item_id) {
    let storedItem = this.items[item_id];
    if (!storedItem) {
        console.log("fu")
      storedItem = this.items[item_id] = {
        item,
        price: 0,
        qty: 0
      };
    }
    //TODO replace->merchantAmount->price
    storedItem.qty = storedItem.qty + 1;
    storedItem.price = storedItem.qty * item.price;

    this.totalPrice = this.totalPrice + item.price;
    this.totalQty = this.totalQty + 1;
  };


  Cart.prototype.remove = function(item_id) {
    //TODO replace->merchantAmount->price
    this.totalPrice = this.totalPrice - this.items[item_id].price;
    this.totalQty = this.totalQty - this.items[item_id].qty;
    delete this.items[item_id];
  };


  module.exports=Cart;