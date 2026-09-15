const mongoose = require('mongoose');

async function updateAdmin() {
  await mongoose.connect('mongodb://localhost:27017/loan_management');
  const db = mongoose.connection;
  const result = await db.collection('users').updateOne(
    { email: 'admin@creditsea.com' },
    { $set: { role: 'ADMIN' } }
  );
  console.log('Update result:', result);
  await mongoose.disconnect();
}

updateAdmin();
