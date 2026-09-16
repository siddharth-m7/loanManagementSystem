# LMS

LMS is a comprehensive Loan Management System (LMS) built to manage the entire lifecycle of a loan, from application by a borrower to final repayment collection. It features a robust multi-role architecture ensuring that each step of the loan process is handled by the appropriate department.

## 🚀 Features

- **Multi-Role Authentication**: Dedicated dashboards and permissions for Borrowers, Admin, Sales, Sanction, Disbursal, and Collection teams.
- **Modern User Interface**: A premium, responsive UI built with Next.js and Tailwind CSS, featuring smooth micro-animations and intuitive workflows.
- **Loan Lifecycle Management**: 
  - **Borrower**: Apply for loans, upload PAN details, and track application status.
  - **Sales**: Verify initial loan applications and borrower details.
  - **Sanction**: Evaluate creditworthiness and approve/reject loans.
  - **Disbursal**: Manage the payout of approved loans to the borrower's account.
  - **Collection**: Track active loans, log repayments, and view detailed payment history timelines.
- **Admin Control Panel**: A unified dashboard for Administrators to oversee all departments, loans, and users.

## 🛠️ Technology Stack

- **Frontend**: Next.js (React), Tailwind CSS, TypeScript
- **Backend**: Node.js, Express, TypeScript
- **Database**: MongoDB (Mongoose)

## 🔑 Evaluator Credentials (Demo Accounts)

To evaluate the application locally, you first need to run the database seeding script (see Backend Setup below). This will automatically create the following demo accounts:

*(Note: You can also use the convenient "Demo Logins" quick-access buttons directly on the Login page!)*

| Role | Email | Password | Responsibilities |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@creditsea.com` | `password123` | Full system overview, access to all departmental data. |
| **Sales** | `sales@creditsea.com` | `password123` | Initial verification of new loan applications. |
| **Sanction** | `sanction@creditsea.com` | `password123` | Final approval or rejection of verified loans. |
| **Disbursal** | `disbursement@creditsea.com` | `password123` | Processing payouts for sanctioned loans. |
| **Collection**| `collection@creditsea.com` | `password123` | Managing loan repayments and tracking payment history. |

*You can also create a new Borrower account using the "Register" page to experience the customer-facing loan application flow.*

## ⚙️ Running Locally

### Prerequisites
- Node.js (v18+)
- Local MongoDB instance running on `localhost:27017`

### Backend Setup (and Database Seeding)
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the database seeding script! This is **crucial** as it populates your local MongoDB with the demo accounts listed above:
   ```bash
   npm run seed
   ```
4. Create a `.env` file in the `backend` directory:
   ```env
   PORT=8000
   MONGODB_URI=mongodb://localhost:27017/loan_management
   JWT_SECRET=your_jwt_secret_key
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Next.js development server:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3000`.
