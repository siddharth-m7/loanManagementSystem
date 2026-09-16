import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/loan_management';

const fixLoans = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const result = await mongoose.connection.collection('loans').updateMany(
      { salarySlipUrl: { $exists: false } },
      { $set: { salarySlipUrl: '/uploads/dummy_salary_slip.pdf' } }
    );

    console.log(`Updated ${result.modifiedCount} loans with dummy salary slip.`);
    
    // Also fix test-e2e.js data if there's any null or empty strings
    const result2 = await mongoose.connection.collection('loans').updateMany(
      { salarySlipUrl: null },
      { $set: { salarySlipUrl: '/uploads/dummy_salary_slip.pdf' } }
    );
    console.log(`Updated ${result2.modifiedCount} loans with null salary slip.`);

    process.exit(0);
  } catch (error) {
    console.error('Error fixing loans:', error);
    process.exit(1);
  }
};

fixLoans();
