const axios = require('axios');

const testProduct = {
  name: 'MacBook Air M2',
  description: 'MacBook Air với chip M2 mới nhất',
  price: 25000000,
  originalPrice: 27000000,
  category: 'MacBook', // Sử dụng tên category thay vì ObjectId
  brand: 'Apple',
  stock: 10,
  image: 'https://example.com/macbook-air.jpg',
  gallery: ['https://example.com/macbook-air-1.jpg', 'https://example.com/macbook-air-2.jpg'],
  isActive: true,
  isFeatured: true
};

async function createProduct() {
  try {
    console.log('🎯 Tạo sản phẩm test với category name:', testProduct.category);
    
    const response = await axios.post('http://localhost:3001/api/products', testProduct);
    console.log('✅ Tạo sản phẩm thành công:', response.data);
    
    // Kiểm tra lại danh sách sản phẩm
    const listResponse = await axios.get('http://localhost:3001/api/products');
    console.log('📝 Danh sách sản phẩm hiện tại:', JSON.stringify(listResponse.data, null, 2));
    
  } catch (error) {
    console.error('❌ Lỗi khi tạo sản phẩm:', error.response?.data || error.message);
  }
}

createProduct();
