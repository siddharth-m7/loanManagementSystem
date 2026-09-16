import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import User, { Role, EmploymentMode } from '../src/models/User.js';
import Loan, { LoanStatus } from '../src/models/Loan.js';

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
      { name: 'Collection Executive', email: 'collection@creditsea.com', role: Role.COLLECTION },
      { name: 'Demo Borrower', email: 'borrower@creditsea.com', role: Role.BORROWER, pan: 'DEMOB1234X', dob: new Date('1990-01-01'), salary: 60000, employmentMode: EmploymentMode.SALARIED }
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

    // Seed a pending loan for Demo Borrower
    const demoBorrower = await User.findOne({ email: 'borrower@creditsea.com' });
    if (demoBorrower) {
      const existingLoan = await Loan.findOne({ borrowerId: demoBorrower._id });
      if (!existingLoan) {
        await Loan.create({
          borrowerId: demoBorrower._id,
          amount: 150000,
          tenure: 180,
          interestRate: 12,
          totalRepayment: 158876.71, // Rough calculation for simple interest
          status: LoanStatus.PENDING
        });
        console.log('Seeded pending loan for Demo Borrower successfully.');
      } else {
        console.log('Demo Borrower already has a loan.');
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
