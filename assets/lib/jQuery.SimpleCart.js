/*
 * jQuery Simple Shopping Cart v0.1
 * Basis shopping cart using javascript/Jquery.
 *
 * Authour : Sirisha
 */

/* '(function(){})();' this function is used, to make all variables of the plugin Private */

(function ($, window, document, undefined) {
  /* Default Options */
  var defaults = {
    cart: [],
    addtoCartClass: ".sc-add-to-cart",
    cartProductListClass: ".cart-products-list",
    totalCartCountClass: ".total-cart-count",
    totalCartCostClass: ".total-cart-cost",
    showcartID: "#show-cart",
    itemCountClass: ".item-count",
  };

  function Item(name, price, count) {
    this.name = name;
    this.price = price;
    this.count = count;
  }
  /*Constructor function*/
  function simpleCart(domEle, options) {
    /* Merge user settings with default, recursively */
    this.options = $.extend(true, {}, defaults, options);
    //Cart array
    this.cart = [];
    //Dom Element
    this.cart_ele = $(domEle);
    //Initial init function
    this.init();
  }

  /*plugin functions */
  $.extend(simpleCart.prototype, {
    init: function () {
      this._setupCart();
      this._setEvents();
      this._loadCart();
      this._updateCartDetails();
    },
    _setupCart: function () {
      this.cart_ele.addClass("cart-grid");
      this.cart_ele.append(`<div><div class='p-3 py-2 text-white mb-2 bg-primary total-cart-count'>Pesanan 0 Produk</div><div class='spacer'></div></div>`);
      this.cart_ele.append("<div class='cart-body'><div class='cart-products-list' id='show-cart'></div></div>");
      this.cart_ele.append(
        `<div class='card-footer cart-summary-container'>
            <div class='cart-offer'></div>
                <div class='cart-total-amount d-flex align-items-center justify-content-between'>
                    <div>Total</div>
                    <div class='spacer'></div>
                    <div class='total-cart-cost fw-bold fs-5'>Rp. 0</div>
                    </div>
                    <div class='d-flex justify-content-between'>
                    <button onclick='batalin()' class='mt-3 btn btn-outline-danger'>Batalkan</button>
                    <button onclick='proses()' id='proses' class='mt-3 btn btn-success'>Proses Pesanan</button>
                    </div>
                </div>
            </div>`
      );
    },
    _addProductstoCart: function () {},
    _updateCartDetails: function () {
      var mi = this;
      $(this.options.cartProductListClass).html(mi._displayCart());
      $(this.options.totalCartCountClass).html("Jumlah Pesanan " + mi._totalCartCount() + " Item");
      $(this.options.totalCartCostClass).html(konfersiRupiah(mi._totalCartCost()));
    },
    _setCartbuttons: function () {},
    _setEvents: function () {
      var mi = this;
      $(this.options.addtoCartClass).click(function (e) {
        e.preventDefault();
        var name = $(this).attr("data-name");
        var cost = Number($(this).attr("data-price"));
        mi._addItemToCart(name, cost, 1);
        mi._updateCartDetails();
      });

      $(this.options.showcartID).on("change", this.options.itemCountClass, function (e) {
        var ci = this;
        e.preventDefault();
        var count = $(this).val();
        var name = $(this).attr("data-name");
        var cost = Number($(this).attr("data-price"));
        mi._removeItemfromCart(name, cost, count);
        mi._updateCartDetails();
      });
    },
    /* Helper Functions */
    _addItemToCart: function (name, price, count) {
      for (var i in this.cart) {
        if (this.cart[i].name === name) {
          this.cart[i].count++;
          this.cart[i].price = price * this.cart[i].count;
          this._saveCart();
          return;
        }
      }
      var item = new Item(name, price, count);
      this.cart.push(item);
      this._saveCart();
    },
    _removeItemfromCart: function (name, price, count) {
      for (var i in this.cart) {
        if (this.cart[i].name === name) {
          var singleItemCost = Number(price / this.cart[i].count);
          this.cart[i].count = count;
          this.cart[i].price = singleItemCost * count;
          if (count == 0) {
            this.cart.splice(i, 1);
          }
          break;
        }
      }
      this._saveCart();
    },
    _clearCart: function () {
      this.cart = [];
      this._saveCart();
    },
    _totalCartCount: function () {
      return this.cart.length;
    },
    _displayCart: function () {
      var cartArray = this._listCart();
      console.log(cartArray);
      var output = "";

      for (var i in cartArray) {
        output += `
        
        <div class='row border-bottom border-1 py-2 px-2 bg-light align-items-center' id='pesananlist'>
            <div class='name col-sm-4'>${cartArray[i].name}</div>
            <div class='quantityContainer  col-sm-3 text-center'>
            <input type='number' style='width:60px;' class=' text-center quantity form-control item-count' data-name='${cartArray[i].name}' data-price='${cartArray[i].price}' min='0' value="${cartArray[i].count}" name='number'>
            </div>
            <div class='quantity-am  col-sm-3'>${konfersiRupiah(cartArray[i].price)}</div>
            <div class='col-sm-2'>
            <button onclick='hapusinput(this)' data-name='${cartArray[i].name}' id='removeproduk' class='btn btn-outline-danger border-0 btn-sm'><i class='fas fa-times'></i></button>
            </div>
        </div>`;
      }
      return output;
    },
    _totalCartCost: function () {
      var totalCost = 0;
      for (var i in this.cart) {
        totalCost += this.cart[i].price;
      }
      return totalCost;
    },
    _listCart: function () {
      var cartCopy = [];
      for (var i in this.cart) {
        var item = this.cart[i];
        var itemCopy = {};
        for (var p in item) {
          itemCopy[p] = item[p];
        }
        cartCopy.push(itemCopy);
      }
      return cartCopy;
    },
    _calGST: function () {
      var GSTPercent = 18;
      var totalcost = this.totalCartCost();
      var calGST = Number((totalcost * GSTPercent) / 100);
      return calGST;
    },
    _saveCart: function () {
      localStorage.setItem("shoppingCart", JSON.stringify(this.cart));
    },
    _loadCart: function () {
      // this.cart = JSON.parse(localStorage.getItem("shoppingCart"));
      // if (this.cart === null) {
      //   this.cart = [];
      // }
      try {
        var savedCart = JSON.parse(localStorage.getItem("shoppingCart"));
        if (Array.isArray(savedCart)) {
          this.cart = savedCart;
        } else {
          throw new Error("Invalid cart data in local storage");
        }
      } catch (error) {
        console.error("Error loading cart:", error);
        this.cart = [];
      }
    },
  });

  $.fn.simpleCart = function (options) {
    return this.each(function () {
      $.data(this, "simpleCart", new simpleCart(this));
      console.log($(this, "simpleCart"));
    });
  };
})(jQuery, window, document);

function hapusinput(elemen) {
  var attrButton = $(elemen).attr("data-name");
  $('input[data-name="' + attrButton + '"]').val(0);
  $('input[data-name="' + attrButton + '"]').change();
}

function batalin() {
  $.each($("input[data-name"), function (indexInArray, valueOfElement) {
    $("input[data-name]").val(0);
    $("input[data-name]").change();
  });
}
function generateUnit() {
  var currentDate = new Date();

  var year = currentDate.getFullYear().toString().substr(2, 2);
  var month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  var day = currentDate.getDate().toString().padStart(2, "0");

  var hours = currentDate.getHours().toString().padStart(2, "0");
  var minutes = currentDate.getMinutes().toString().padStart(2, "0");
  var seconds = currentDate.getSeconds().toString().padStart(2, "0");

  var randomNum = Math.floor(100000 + Math.random() * 900000);

  var unitCode = "#" + year + month + day + hours + minutes + seconds + randomNum;

  return unitCode;
}

function proses() {
  var kodepesanan = generateUnit();
  var kamar = $("#nokamar").val();
  var anama = $("#anama").val();

  console.log(kodepesanan);

  var orderData = { ordekode: kodepesanan, nokamar: kamar, atasnama: anama, item: JSON.parse(localStorage.getItem("shoppingCart")) };
  console.log(orderData);
  $.ajax({
    type: "POST",
    url: "http://localhost/apimenu/api_post.php",
    data: { orderData: JSON.stringify(orderData) },
    success: function (response) {
      localStorage.clear();
    },
    error: function (error) {
      console.error("Error:", error);
    },
  });
}
