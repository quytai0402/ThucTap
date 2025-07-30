import { NextApiRequest, NextApiResponse } from 'next';
import api from '../../../src/utils/api';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'PATCH') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { id, status } = req.body;
  
  if (!id || !status) {
    return res.status(400).json({ message: 'Order ID and status are required' });
  }

  try {
    // Call backend API to update order status
    const response = await api.patch(`/orders/${id}/status`, { status });
    
    return res.status(200).json(response.data);
  } catch (error: any) {
    console.error('Error updating order status:', error);
    
    return res.status(error.response?.status || 500).json({
      message: error.response?.data?.message || 'Error updating order status',
      error: error.message
    });
  }
}
