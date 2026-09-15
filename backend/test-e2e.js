const API_URL = 'http://localhost:7000/api';

async function request(endpoint, method = 'GET', body = null, token = null) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const options = { method, headers };
  if (body) {
    options.body = JSON.stringify(body);
  }
  
  const res = await fetch(`${API_URL}${endpoint}`, options);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || data.message || `API error: ${res.status}`);
  }
  return data;
}

async function runE2E() {
  console.log('--- Starting E2E Test ---');
  
  try {
    // 1. Create a Borrower
    const borrowerEmail = `borrower${Date.now()}@example.com`;
    console.log(`\n[1] Registering Borrower: ${borrowerEmail}`);
    await request('/auth/register', 'POST', {
      name: 'John E2E',
      email: borrowerEmail,
      password: 'password123'
    });
    
    console.log(`[1] Logging in Borrower...`);
    const loginRes = await request('/auth/login', 'POST', {
      email: borrowerEmail,
      password: 'password123'
    });
    const borrowerToken = loginRes.token;
    console.log('Borrower Token received.');

    // 2. Borrower applies for loan
    console.log('\n[2] Borrower applying for loan...');
    const randomPan = `ABCDE${Math.floor(Math.random() * 9000 + 1000)}F`;
    const applyRes = await request('/loans/apply', 'POST', {
      amount: 100000,
      tenure: 90,
      pan: randomPan,
      dob: '1990-01-01',
      salary: 80000,
      employmentMode: 'SALARIED'
    }, borrowerToken);
    console.log('Loan applied successfully.');
    const loanId = applyRes.loan._id;
    console.log(`Loan ID: ${loanId}`);

    // 3. Sanction Review
    console.log(`\n[3] Logging in Sanction Exec...`);
    const sanctionRes = await request('/auth/login', 'POST', {
      email: 'sanction@creditsea.com', 
      password: 'password123'
    });
    console.log(`[3] Sanctioning loan...`);
    await request(`/dashboard/sanction/loans/${loanId}/review`, 'PATCH', {
      status: 'APPROVED'
    }, sanctionRes.token);
    console.log('Loan APPROVED.');

    // 4. Disburse Loan
    console.log(`\n[4] Logging in Disbursement Exec...`);
    const disburseRes = await request('/auth/login', 'POST', {
      email: 'disbursement@creditsea.com', 
      password: 'password123'
    });
    console.log(`[4] Disbursing loan...`);
    await request(`/dashboard/disbursement/loans/${loanId}/disburse`, 'PATCH', {}, disburseRes.token);
    console.log('Loan DISBURSED.');

    // 5. Collection Payment
    console.log(`\n[5] Logging in Collection Exec...`);
    const collectionRes = await request('/auth/login', 'POST', {
      email: 'collection@creditsea.com', 
      password: 'password123'
    });
    console.log(`[5] Adding payment...`);
    await request(`/dashboard/collection/loans/${loanId}/payment`, 'POST', {
      amount: 10000,
      utrNumber: `UTR${Date.now()}`,
      paymentDate: new Date().toISOString()
    }, collectionRes.token);
    console.log('Payment Added.');

    // 6. Verify Borrower Dashboard
    console.log(`\n[6] Verifying Borrower Dashboard...`);
    const myLoans = await request('/loans/my-loans', 'GET', null, borrowerToken);
    const testLoan = myLoans.loans.find(l => l._id === loanId);
    console.log(`Borrower loan status: ${testLoan.status}`);
    console.log(`Borrower amount paid: ${testLoan.amountPaid}`);
    
    console.log('\n✅ E2E Test Completed Successfully!');
  } catch (err) {
    console.error('\n❌ E2E Test Failed:', err.message);
  }
}

runE2E();
