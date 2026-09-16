import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import User, { Role, EmploymentMode } from '../src/models/User.js';
import Loan, { LoanStatus } from '../src/models/Loan.js';
import Payment from '../src/models/Payment.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/loan_management';

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    console.log('Dropping existing database...');
    await mongoose.connection.dropDatabase();

    const saltRounds = 10;
    const defaultPassword = 'password123';
    const passwordHash = await bcrypt.hash(defaultPassword, saltRounds);

    // 1. Seed Executives
    const execs = [
      { name: 'Admin User', email: 'admin@creditsea.com', role: Role.ADMIN },
      { name: 'Sales Executive', email: 'sales@creditsea.com', role: Role.SALES },
      { name: 'Sanction Executive', email: 'sanction@creditsea.com', role: Role.SANCTION },
      { name: 'Disbursement Executive', email: 'disbursement@creditsea.com', role: Role.DISBURSEMENT },
      { name: 'Collection Executive', email: 'collection@creditsea.com', role: Role.COLLECTION },
    ];
    let adminId: mongoose.Types.ObjectId | null = null;
    for (const exec of execs) {
      const u = await User.create({ ...exec, passwordHash });
      if (exec.role === Role.ADMIN) adminId = u._id as mongoose.Types.ObjectId;
      console.log(`Seeded ${exec.role} successfully.`);
    }

    // 2. Seed 10 Borrowers
    const borrowers = [
      // Signed up but not applied (no loan)
      { name: 'Amit Sharma', email: 'amit@creditsea.com', pan: 'DEMOS1234S', dob: new Date('1990-05-15'), salary: 60000, employmentMode: EmploymentMode.SALARIED },
      { name: 'Priya Patel', email: 'priya@creditsea.com', pan: 'DEMOP1234P', dob: new Date('1992-08-20'), salary: 85000, employmentMode: EmploymentMode.SALARIED },
      
      // Applied but pending
      { name: 'Rahul Verma', email: 'rahul@creditsea.com', pan: 'DEMOV1234V', dob: new Date('1988-11-10'), salary: 45000, employmentMode: EmploymentMode.SALARIED },
      { name: 'Sneha Reddy', email: 'sneha@creditsea.com', pan: 'DEMOR1234R', dob: new Date('1995-03-25'), salary: 120000, employmentMode: EmploymentMode.SELF_EMPLOYED },
      
      // Sanctioned but not disbursed (APPROVED)
      { name: 'Karan Singh', email: 'karan@creditsea.com', pan: 'DEMOS1235S', dob: new Date('1985-07-30'), salary: 70000, employmentMode: EmploymentMode.SALARIED },
      { name: 'Anjali Gupta', email: 'anjali@creditsea.com', pan: 'DEMOG1234G', dob: new Date('1993-12-05'), salary: 55000, employmentMode: EmploymentMode.SALARIED },
      
      // Disbursed (CLOSED)
      { name: 'Vikram Das', email: 'vikram@creditsea.com', pan: 'DEMOD1234D', dob: new Date('1989-02-14'), salary: 90000, employmentMode: EmploymentMode.SALARIED },
      { name: 'Pooja Nair', email: 'pooja@creditsea.com', pan: 'DEMON1234N', dob: new Date('1994-09-18'), salary: 65000, employmentMode: EmploymentMode.SALARIED },
      
      // Disbursed (ACTIVE - DISBURSED)
      { name: 'Rohan Kapoor', email: 'rohan@creditsea.com', pan: 'DEMOK1234K', dob: new Date('1991-04-22'), salary: 110000, employmentMode: EmploymentMode.SELF_EMPLOYED },
      { name: 'Neha Joshi', email: 'neha@creditsea.com', pan: 'DEMOJ1234J', dob: new Date('1996-10-08'), salary: 40000, employmentMode: EmploymentMode.SALARIED },
    ];

    const createdBorrowers = [];
    for (const b of borrowers) {
      const u = await User.create({ ...b, role: Role.BORROWER, passwordHash });
      createdBorrowers.push(u);
    }
    console.log('Seeded 10 borrowers successfully.');

    const calculateRepayment = (amount: number, tenure: number) => {
      return amount + (amount * 12 * tenure) / (365 * 100);
    };

    // 3. Seed Loans and Payments
    const salarySlipUrl = '/uploads/demosalaryslip.pdf';
    
    // Pending Loans
    await Loan.create({ borrowerId: createdBorrowers[2]!._id, amount: 100000, tenure: 180, interestRate: 12, totalRepayment: calculateRepayment(100000, 180), salarySlipUrl, status: LoanStatus.PENDING });
    await Loan.create({ borrowerId: createdBorrowers[3]!._id, amount: 200000, tenure: 365, interestRate: 12, totalRepayment: calculateRepayment(200000, 365), salarySlipUrl, status: LoanStatus.PENDING });
    
    // Approved Loans (Sanctioned)
    await Loan.create({ borrowerId: createdBorrowers[4]!._id, amount: 150000, tenure: 90, interestRate: 12, totalRepayment: calculateRepayment(150000, 90), salarySlipUrl, status: LoanStatus.APPROVED });
    await Loan.create({ borrowerId: createdBorrowers[5]!._id, amount: 80000, tenure: 120, interestRate: 12, totalRepayment: calculateRepayment(80000, 120), salarySlipUrl, status: LoanStatus.APPROVED });
    
    // Closed Loans (Disbursed -> Paid -> Closed)
    const loan7 = await Loan.create({ borrowerId: createdBorrowers[6]!._id, amount: 250000, tenure: 365, interestRate: 12, totalRepayment: calculateRepayment(250000, 365), salarySlipUrl, status: LoanStatus.CLOSED });
    const loan8 = await Loan.create({ borrowerId: createdBorrowers[7]!._id, amount: 90000, tenure: 180, interestRate: 12, totalRepayment: calculateRepayment(90000, 180), salarySlipUrl, status: LoanStatus.CLOSED });
    
    await Payment.create({ loanId: loan7._id, utrNumber: 'UTR777777777', amount: loan7.totalRepayment, paymentDate: new Date(), recordedBy: adminId! });
    await Payment.create({ loanId: loan8._id, utrNumber: 'UTR888888888', amount: loan8.totalRepayment, paymentDate: new Date(), recordedBy: adminId! });

    // Active Loans (Disbursed)
    const loan9 = await Loan.create({ borrowerId: createdBorrowers[8]!._id, amount: 300000, tenure: 365, interestRate: 12, totalRepayment: calculateRepayment(300000, 365), salarySlipUrl, status: LoanStatus.DISBURSED });
    const loan10 = await Loan.create({ borrowerId: createdBorrowers[9]!._id, amount: 120000, tenure: 180, interestRate: 12, totalRepayment: calculateRepayment(120000, 180), salarySlipUrl, status: LoanStatus.DISBURSED });
    
    // Add partial payment for active loans
    await Payment.create({ loanId: loan9._id, utrNumber: 'UTR999999999', amount: 50000, paymentDate: new Date(), recordedBy: adminId! });
    await Payment.create({ loanId: loan10._id, utrNumber: 'UTR10101010', amount: 20000, paymentDate: new Date(), recordedBy: adminId! });

    console.log('Seeded loans and payments successfully.');
    console.log('Database seeding completed.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
