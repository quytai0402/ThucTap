import { NextApiRequest, NextApiResponse } from 'next';
import api from '../../../src/utils/api';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { orderNumber } = req.body;
  
  if (!orderNumber) {
    return res.status(400).json({ message: 'Order number is required' });
  }

  try {
    // Call API to check if order exists
    const orderResponse = await api.get(`/orders/number/${orderNumber}`);
    const order = orderResponse.data;
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Return order details
    return res.status(200).json(order);
  } catch (error: any) {
    console.error('Error verifying order:', error);
    
    return res.status(error.response?.status || 500).json({
      message: error.response?.data?.message || 'Error verifying order',
      error: error.message
    });
  }
}
