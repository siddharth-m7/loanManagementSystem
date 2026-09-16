# CreditSea Loan Management System (LMS)

CreditSea LMS is a comprehensive, production-ready Loan Management System built to manage the entire lifecycle of a loan, from application by a borrower to final repayment collection. It features a robust multi-role architecture, ensuring that each step of the loan process is handled by the appropriate department, all wrapped in a premium Neo-brutalist user interface.

## 🚀 Features

- **Multi-Role Architecture**: Dedicated dashboards and permissions for Borrowers, Admin, Sales, Sanction, Disbursal, and Collection teams.
- **Business Rule Engine (BRE)**: Fail-fast automated validation for loan applications checking Age (23-50), Salary (> ₹25,000), Employment Status, and strict PAN card formatting (including surname matching).
- **Cloudinary Integration**: Fully stateless backend architecture with secure, permanent cloud storage for uploaded documents and salary slips.
- **Neo-Brutalist UI**: A stunning, responsive user interface built with Next.js and Tailwind CSS, featuring high-contrast borders, solid drop shadows, and modern micro-animations.
- **Complete Loan Lifecycle**:
  - **Borrower**: Apply for loans, upload documents, and track application status.
  - **Sales**: View leads and verify initial loan applications.
  - **Sanction**: Evaluate creditworthiness and approve/reject loans.
  - **Disbursal**: Manage the payout of approved loans to the borrower's account.
  - **Collection**: Track active loans, log repayments, and manage closed loans.
  - **Admin**: A unified control panel to oversee all departments and metrics.

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React, Tailwind CSS, TypeScript
- **Backend**: Node.js, Express, TypeScript, Multer
- **Database**: MongoDB Atlas (Mongoose)
- **Cloud Storage**: Cloudinary

## 🔑 Evaluator Credentials & Demo Seed Data

To evaluate the application, a robust `seed.ts` script is provided which automatically populates the database with executives and exactly 10 distinct demo borrowers in various states (Pending, Sanctioned, Disbursed, Closed, etc.).

*(Note: You can use the convenient "Demo Logins" quick-access buttons directly on the Login page!)*

### Staff Roles
| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@creditsea.com` | `password123` |
| **Sales** | `sales@creditsea.com` | `password123` |
| **Sanction** | `sanction@creditsea.com` | `password123` |
| **Disbursal** | `disbursement@creditsea.com` | `password123` |
| **Collection**| `collection@creditsea.com` | `password123` |

### Demo Borrowers
The seed script generates 10 borrowers to test different application states. For example:
- **New Lead (No Loan Yet)**: `amit@creditsea.com` (`password123`)
- **Pending Application**: `rahul@creditsea.com` (`password123`)
- **Active Disbursed Loan**: `neha@creditsea.com` (`password123`)

## ⚙️ Local Development Setup

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)
- Cloudinary Account

### Backend Setup
1. Navigate to the backend directory: `cd backend`
2. Install dependencies: `npm install`
3. Create a `.env` file based on `.env.example`:
   ```env
   PORT=8000
   MONGODB_URI=mongodb://localhost:27017/loan_management
   JWT_SECRET=your_jwt_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```
4. Run the database seeding script to populate demo accounts: `npm run seed`
5. Start the development server: `npm run dev`

### Frontend Setup
1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start the Next.js development server: `npm run dev`

The application will be available at `http://localhost:3000`.

## 🚢 Production Deployment

The codebase is fully prepared for a modern PaaS deployment:

1. **Database**: Provision a MongoDB Atlas cluster and obtain your connection string.
2. **Cloud Storage**: Create a Cloudinary account for storing salary slips.
3. **Backend (Render)**: Connect your repository to a Render Web Service. Set the Root Directory to `backend`, use `npm install && npm run build` as the build command, and `npm start` as the start command. Inject your MongoDB and Cloudinary Environment Variables.
4. **Frontend (Vercel)**: Connect your repository to Vercel. Set the Root Directory to `frontend`. Add `NEXT_PUBLIC_API_URL` to your environment variables pointing to your deployed Render URL (e.g., `https://your-backend.onrender.com/api`).
