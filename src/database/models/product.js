import { Model } from 'sequelize';export default (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
  
      Product.belongsTo(models.User, {
        foreignKey: 'vendor_id',
        as: 'vendor',
        onDelete: "CASCADE",
      });
      Product.belongsTo(models.Category, {
        foreignKey: 'category_id',
        as: 'category',
        onDelete: "CASCADE",
      });
      Product.hasMany(models.Review, {
        foreignKey: 'product_id',
        as: 'reviews',
        onDelete: "CASCADE",
        });
      Product.hasMany(models.wishlist, {     
        foreignKey: 'id',
        as: 'wishlist',
        onDelete: "CASCADE",
    });
  }
    static async findAndPaginateAll({page=1, limit=10, where = {}}) {
      const offset = (page - 1) * limit;
      const products = await Product.findAll({ offset, limit, where });
      return products;
    }
  }
  Product.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    category_id: DataTypes.INTEGER,
    price: DataTypes.STRING,
    picture_urls: DataTypes.ARRAY(DataTypes.STRING),
    instock: DataTypes.INTEGER,
    expiryDate: DataTypes.DATE,
    available: DataTypes.BOOLEAN,
    vendor_id: DataTypes.INTEGER,

  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};
