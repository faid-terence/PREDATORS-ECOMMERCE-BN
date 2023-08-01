import cron from 'cron';
import db from '../database/models/index.js';
import sendEmail from '../utils/sendEmail.js';
import dotenv from 'dotenv';

dotenv.config();

const cleanUp = async () => {
  try {
    const currentDate = new Date();
    const products = await db.Product.findAll();
    
    if (!products || products.length === 0) {
      console.log('No products found');
      return;
    }
    
    for (const product of products) {
      const productExpiryDate = product.expiryDate;
      
      if (productExpiryDate < currentDate) {
        const seller = await db.User.findOne({ where: { id: product.vendor_id } });
        
        if (!seller) { 
          continue;
        }
        
        await product.destroy();
        
        const subject = 'Expired Product Alert';
        const text = `Dear sir/madam,\n\nThis is an automatic email alerting you that an existing product with the Name of ${product.name} and ID of ${product.id} has expired and has been removed from the e-commerce-predators platform.`;
        
        sendEmail.sendEmail(seller.email, subject, text);
      }
    }
    
    console.log('Expired products cleaned up successfully.');
  } catch (error) {
    console.error('Error cleaning up expired products:', error);
  }
};

const cleanUpJob = new cron.CronJob('0 0 * * * *', cleanUp);

cleanUpJob.start();
export default cleanUp;
