import { NextApiRequest, NextApiResponse } from 'next';
import api from '../../src/utils/api';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { orderNumber } = req.query;

  if (!orderNumber) {
    return res.status(400).json({ message: 'Order number is required' });
  }

  try {
    // Call backend API to track guest order
    const response = await api.get(`/guest-orders/track/${orderNumber}`);
    
    return res.status(200).json(response.data);
  } catch (error: any) {
    console.error('Error tracking order:', error);
    
    return res.status(error.response?.status || 500).json({
      message: error.response?.data?.message || 'Có lỗi xảy ra khi tìm đơn hàng',
      error: error.message
    });
  }
}
