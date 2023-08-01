import db from "../database/models/index.js";
const Category = db.Category;

// A seller should be able to Create/Add a category
export async function addCategory(req, res) {
  try {
    // receive body & Validate user input
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Invalid Input😥" });
    }
    // verify the category is not sold by the seller
    const categoryExists = await Category.findOne({
      where: { name },
    });
    if (categoryExists) {
      return res.status(409).json({
        message: "Category already exists😥",
        category: name,
      });
    }
    // save category
    const category = await Category.create({
      name,
    });
    // send response
    return res.status(200).json({
      message: "Category added to collection.",
      id: category.id,
    });
  } catch (error) {
    // Handle database errors
    console.error(error);
    return res.status(500).json({ message: "Failed to save category" });
  }
}

// A seller should be able to Update a category
export async function updateCategory(req, res) {
  try {
    // receive body & Validate user input
    const { id } = req.params;
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Invalid Input😥" });
    }
    // verify the category is not sold by the seller
    const categoryExists = await Category.findOne({
      where: { id: id },
    });
    if (!categoryExists) {
      return res.status(409).json({
        message: "Category does not exist😥",
        category: name,
      });
    }
    // save category
    categoryExists.name = name;
    const category = await categoryExists.save();
    // send response
    return res.status(200).json({
      message: "Category updated.",
      data: category,
    });
  } catch (error) {
    // Handle database errors
    console.error(error);
    return res.status(500).json({ message: "Failed to update category" });
  }
}

// A seller should be able to Delete a category
export async function deleteCategory(req, res) {
  try {
    // receive body & Validate user input
    const { id } = req.params;
    // verify the category is not sold by the seller
    const categoryExists = await Category.findOne({
      where: { id: id },
    });
    if (!categoryExists) {
      return res.status(409).json({
        message: "Category does not exist😥",
        data: { categoryExists },
      });
    }
    // save category
    const category = await Category.destroy({
      where: { id: id },
    });
    // send response
    return res.status(200).json({
      message: "Category deleted.",
      data: { category },
    });
  } catch (error) {
    // Handle database errors
    console.error(error);
    return res.status(500).json({ message: "Failed to delete category" });
  }
}

// A seller should be able to View all categories
export async function viewAllCategories(req, res) {
  try {
    const categoryExists = await Category.findAll({
      include: [],
    });

    console.log(categoryExists);

    if (!categoryExists) {
      return res.status(409).json({
        message: "Category does not exist😥",
        data: { categoryExists },
      });
    }
    // send response
    return res.status(200).json({
      message: "Category retreived successfully.",
      data: { categoryExists },
    });
  } catch (error) {
    // Handle database errors
    console.error(error);
    return res.status(500).json({ message: "Failed to get category" });
  }
}

export default {
  addCategory,
  updateCategory,
  deleteCategory,
  viewAllCategories,
};
