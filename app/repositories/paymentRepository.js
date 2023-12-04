// repositories/paymentRepository.js
// Simulated data storage
const paymentDataStore = [];

exports.savePayment = async (paymentData) => {
  // Save payment data to the data store
  paymentDataStore.push(paymentData);
  return { status: 'success' };
};
