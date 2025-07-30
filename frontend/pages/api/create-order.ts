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
    
    // Call the backend API
    const response = await api.post('/orders', orderData);
    
    return res.status(200).json(response.data);
  } catch (error: any) {
    console.error('Error creating order:', error);
    
    return res.status(error.response?.status || 500).json({
      message: error.response?.data?.message || 'Có lỗi xảy ra khi tạo đơn hàng',
    });
  }
}
