// Quick test to check localStorage
const orderHistory = localStorage.getItem('metalpro_order_history');
if (orderHistory) {
  console.log('Order history found:', JSON.parse(orderHistory));
} else {
  console.log('No order history in localStorage');
}
