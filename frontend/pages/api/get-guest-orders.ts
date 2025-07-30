import { NextApiRequest, NextApiResponse } from 'next';
import api from '../../src/utils/api';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { phone } = req.query;

  if (!phone) {
    return res.status(400).json({ message: 'Phone number is required' });
  }

  try {
    // Call backend API to get guest orders
    const response = await api.get(`/guest-orders/phone/${phone}`);
    
    return res.status(200).json(response.data);
  } catch (error: any) {
    console.error('Error fetching guest orders:', error);
    
    return res.status(error.response?.status || 500).json({
      message: error.response?.data?.message || 'Có lỗi xảy ra khi tìm đơn hàng',
      error: error.message
    });
  }
}
