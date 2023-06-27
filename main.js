//TODO: We can seperate product to a different file maybe json/enum/js to add more entries.
const products = [
  {
    code: "ult_small",
    name: "Unlimited 1GB",
    price: 24.90,
  },
  {
    code: "ult_medium",
    name: "Unlimited 2GB",
    price: 29.90,
  },
  {
    code: "ult_large",
    name: "Unlimited 5GB",
    price: 44.90,
  },
  {
    code: "1gb",
    name: "1 GB Data-pack",
    price: 9.90,
  },
  {
    code: "1gb_free",
    name: "1 GB Data-pack",
    price: 0,
  },
];
  
//TODO:  We can seperate pricingrule to a different file maybe json/enum/js to add more entries.
const pricingRules = {
  "ult_small": {
    discountQuantity: 3,
    discountPrice: 2 * products.find((product) => product.code === "ult_small").price,
  },
  "ult_medium": {
    bundleProduct: "1gb_free",
  },
  "ult_large": {
    bulkQuantity: 3,
    bulkPrice: 39.90,
  },
};

class ShoppingCart {
    constructor(pricingRules) {
      this.items = [];
      this.pricingRules = pricingRules;
      this.promoCode = "";
      this.total = 0;
    }
  
    // Add a product to the cart
    add(code, promoCode) {
      const product = products.find((product) => product.code === code);
      if (product) {
        this.items.push(product);
      } else {
        console.log("Product not found.");
      }

      if (promoCode)
        this.promoCode = promoCode;
    }
  
    // Calculate the total price of items in the cart
    computeTotal() {
      const itemCounts = this.countItems();
      let total = 0;

      for (const [code, count] of Object.entries(itemCounts)) {
        const product = products.find((product) => product.code === code);
        const pricingRule = this.pricingRules[code];

        if (pricingRule) {
          if (code === "ult_small" && count >= pricingRule.discountQuantity) {
            const discountedCount = Math.floor(count / pricingRule.discountQuantity);
            const regularCount = count - discountedCount * pricingRule.discountQuantity;
            total += (discountedCount * pricingRule.discountPrice) + (regularCount * product.price);

          } else if (code === "ult_medium" && pricingRule.bundleProduct) {
            total += count * product.price;
            
            for (let x = 0; x < count; x++) {
                this.add("1gb_free");
            }
            
          } else if (code === "ult_large" && count > pricingRule.bulkQuantity) {
            total += pricingRule.bulkPrice * count;

          } else {
            total += count * product.price;
          }

        } else {
          total += count * product.price;
        }
      }
  
      // Apply promo code discount, not sure if you can have more than one coupon
      total = this.promoCode === "I<3AMAYSIM" ? total *= 0.9 : total;

      this.total = total.toFixed(2);
    }
  
    // Count the number of each type of item in the cart
    countItems() {
      const itemCounts = {};
      for (const item of this.items) {
        if (itemCounts[item.code]) {
          itemCounts[item.code]++;
        } else {
          itemCounts[item.code] = 1;
        }
      }
      return itemCounts;
    }

    showCart() {
      var itemCounts = this.countItems();
      console.log("Cart Items: " + JSON.stringify(itemCounts));
      console.log("Cart Total: " + this.total);
    }
}

const cart = new ShoppingCart(pricingRules);

// Scenario 1
// console.log("Scenario 1");
// cart.add("ult_small");
// cart.add("ult_small");
// cart.add("ult_small");
// cart.add("ult_large");
// cart.computeTotal();
// cart.showCart();

// Scenario 2
// console.log("Scenario 2");
// cart.add("ult_small");
// cart.add("ult_small");
// cart.add("ult_large");
// cart.add("ult_large");
// cart.add("ult_large");
// cart.add("ult_large");
// cart.computeTotal();
// cart.showCart();

// Scenario 3
// console.log("Scenario 3");
// cart.add("ult_small");
// cart.add("ult_medium");
// cart.add("ult_medium");
// cart.computeTotal();
// cart.showCart();

// Scenario 4
console.log("Scenario 4");
cart.add("ult_small");
cart.add("1gb", "I<3AMAYSIM");
cart.computeTotal();
cart.showCart();