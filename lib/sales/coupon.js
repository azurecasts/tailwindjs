const shortid = require("shortid");
const _ = require("underscore")._;

class Coupon{
  constructor({
    code=shortid.generate().toUpperCase(),
    status="active",
    type="percent",
    amount=0,
    restrictions=[],
    usageLimit=5,
    usageCount=0,
    expiresAt=new Date() + 30,
    createdAt=new Date()
  }){
    this.code = code;
    this.status=status;
    this.type=type;
    this.amount=amount;
    this.restrictions=restrictions;
    this.usageLimit=usageLimit;
    this.usageCount=usageCount;
    this.expiresAt=expiresAt;
    this.createdAt=createdAt;
  }
  isExpired(){
    return this.expiresAt < new Date()
  }
  isUsedUp(){
    return (this.usageLimit > 0 && this.usageCount >= this.usageLimit);
  }
  isActive(){
    return this.status === "active";
  }
  applicableItems(order){
    return this.restrictions.length === 0 ? order.items : order.items.filter(item => this.restrictions.includes(item.product.sku))
  }
  canBeUsed(order){
    //date check
    if(this.isExpired()) return {success: false, message: "Coupon is expired"}

    //usage limit check
    if(this.isUsedUp()) return {success: false, message: "This coupon can no longer be used"}

    //status check
    if(!this.isActive()) return {success: false, message: "Coupon isn't active"}

    //check product restrictions
    if(!this.applicableItems(order).length > 0) return {success: false, message: `Missing required items: ${this.restrictions.join(", ")}`}

    //if we're here, all's well
    return {success: true, message: "Coupon is valid"}
  }

}

module.exports = Coupon;
