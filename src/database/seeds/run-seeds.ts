import { config } from 'dotenv';
import dataSource from '../data-source';

// Load environment variables
config();

async function runSeeds() {
  try {
    // Initialize the data source
    await dataSource.initialize();
    console.log('Data source initialized successfully');

    // Run seeds
    console.log('Starting database seeding...');
    
    console.log('Database seeding completed successfully');
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  } finally {
    // Close the data source
    if (dataSource.isInitialized) {
      await dataSource.destroy();
      console.log('Data source closed');
    }
    process.exit(0);
  }
}

runSeeds();
