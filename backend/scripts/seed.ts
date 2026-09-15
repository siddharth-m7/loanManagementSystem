import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import User, { Role } from '../src/models/User.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/loan_management';

const seedRoles = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const saltRounds = 10;
    const defaultPassword = 'password123';
    const passwordHash = await bcrypt.hash(defaultPassword, saltRounds);

    const rolesToSeed = [
      { name: 'Admin User', email: 'admin@creditsea.com', role: Role.ADMIN },
      { name: 'Sales Executive', email: 'sales@creditsea.com', role: Role.SALES },
      { name: 'Sanction Executive', email: 'sanction@creditsea.com', role: Role.SANCTION },
      { name: 'Disbursement Executive', email: 'disbursement@creditsea.com', role: Role.DISBURSEMENT },
      { name: 'Collection Executive', email: 'collection@creditsea.com', role: Role.COLLECTION }
    ];

    for (const roleData of rolesToSeed) {
      const existingUser = await User.findOne({ email: roleData.email });
      if (!existingUser) {
        await User.create({
          ...roleData,
          passwordHash,
        });
        console.log(`Seeded ${roleData.role} successfully.`);
      } else {
        console.log(`${roleData.role} already exists.`);
      }
    }

    console.log('Database seeding completed.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedRoles();
