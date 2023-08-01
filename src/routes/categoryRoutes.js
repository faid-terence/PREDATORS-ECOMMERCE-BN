import {Router} from 'express';
import {addCategory,
    updateCategory,
    viewAllCategories,
    deleteCategory}
    from '../controller/categoryController.js';

const router = Router();

// A seller should be able to add a category
router.post('/', addCategory);

// A seller should be able to update a category
router.put('/:id', updateCategory);
// A seller should be able to View all categories
router.get('/', viewAllCategories);

// A seller should be able to delete a category by id
router.delete('/:id',deleteCategory );

export default router;
