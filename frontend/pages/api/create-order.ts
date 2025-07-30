import { NextApiRequest, NextApiResponse } from 'next';
import api from '../../src/utils/api';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const orderData = req.body;
    
    console.log('Creating order with data:', JSON.stringify(orderData));
    
    // Check if this is a guest order or authenticated order
    let response;
    if (orderData.isGuestOrder) {
      // Use guest order endpoint
      response = await api.post('/guest-orders', orderData);
    } else {
      // Use authenticated order endpoint
      response = await api.post('/orders', orderData);
    }
    
    console.log('Order created successfully:', response.data);
    
    return res.status(200).json(response.data);
  } catch (error: any) {
    console.error('Error creating order:', error);
    console.error('Error details:', error.response?.data);
    
    return res.status(error.response?.status || 500).json({
      message: error.response?.data?.message || 'Có lỗi xảy ra khi tạo đơn hàng',
      error: error.message,
      details: error.response?.data || {}
    });
  }
}
