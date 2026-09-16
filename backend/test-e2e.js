const API_URL = 'http://localhost:8000/api';

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
    const formData = new FormData();
    formData.append('amount', '100000');
    formData.append('tenure', '90');
    formData.append('pan', randomPan);
    formData.append('dob', '1990-01-01');
    formData.append('salary', '80000');
    formData.append('employmentMode', 'SALARIED');
    
    // Create a dummy PDF blob
    const dummyPdfContent = `%PDF-1.4\n1 0 obj <</Type /Catalog /Pages 2 0 R>> endobj\n2 0 obj <</Type /Pages /Kids [3 0 R] /Count 1>> endobj\n3 0 obj <</Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources <<>> /Contents 4 0 R>> endobj\n4 0 obj <</Length 0>> stream\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f \n0000000009 00000 n \n0000000056 00000 n \n0000000111 00000 n \n0000000212 00000 n \ntrailer <</Size 5 /Root 1 0 R>>\nstartxref\n253\n%%EOF`;
    const blob = new Blob([dummyPdfContent], { type: 'application/pdf' });
    formData.append('salarySlip', blob, 'dummy_salary_slip.pdf');

    const applyOptions = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${borrowerToken}`
      },
      body: formData
    };

    const applyResRaw = await fetch(`${API_URL}/loans/apply`, applyOptions);
    const applyRes = await applyResRaw.json();
    if (!applyResRaw.ok) {
      throw new Error(applyRes.error || applyRes.message || `API error: ${applyResRaw.status}`);
    }
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
