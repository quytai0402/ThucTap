import { NextApiRequest, NextApiResponse } from 'next';
import api from '../../src/utils/api';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { orderId } = req.query;
    
    if (!orderId) {
      return res.status(400).json({ message: 'Order ID is required' });
    }
    
    // Call the backend API to get the guest order
    const response = await api.get(`/guest-orders/${orderId}`);
    
    return res.status(200).json(response.data);
  } catch (error: any) {
    console.error('Error fetching guest order:', error);
    
    return res.status(error.response?.status || 500).json({
      message: error.response?.data?.message || 'Có lỗi xảy ra khi lấy thông tin đơn hàng',
    });
  }
}
