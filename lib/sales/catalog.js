class Product{
  constructor({
    sku,
    price=0.00,
    name,
    type="video",
    description,
    image,
    status="draft",
    createdAt=new Date()
  }){
    this.sku=sku;
    this.price=price;
    this.name=name;
    this.type=type;
    this.description=description;
    this.image=image;
    this.status=status;
    this.createdAt=createdAt;
  }
}

class PhysicalProduct extends Product{
  constructor(...args){
    super(...args);
    this.unitDescription=args.unitDescription;
    this.unitsInStock=args.unitsInStock || 0;
    this.unitsOnOrder=args.unitsOnOrder || 0;
    this.packageDimensions=args.packageDimensions;
    this.weightInPounds=args.weightInPounds || 0;
    this.reorderAmount=args.reorderAmount || 0;
    this.warehouseLocation=args.warehouseLocation;
  }
}

class DigitalProduct extends Product{
  constructor(...args){
    super(...args);
    this.digital=true;
    this.downloadUrl = args.downloadUrl;

  }
}

exports.DigitalProduct = DigitalProduct;
exports.PhysicalProduct = PhysicalProduct;
