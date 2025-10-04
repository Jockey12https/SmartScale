import { scaleService } from './scaleService';
import { mockProducts } from './mockData';

// Function to seed the database with initial product data
export const seedDatabase = async () => {
  try {
    console.log('Seeding database with product data...');
    
    // Add each mock product to the database
    for (const product of mockProducts) {
      await scaleService.addProduct({
        name: product.name,
        image: product.image,
        pricePerKg: product.pricePerKg,
        category: product.category,
        confidence: product.confidence
      });
    }
    
    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

// Function to initialize scale data
export const initializeScaleData = async () => {
  try {
    await scaleService.updateScaleData({
      weight: 0,
      item: "",
      price: 0,
      timestamp: Date.now().toString()
    });
    console.log('Scale data initialized');
  } catch (error) {
    console.error('Error initializing scale data:', error);
  }
};
