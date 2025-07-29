import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { orderId } = req.query;

  if (!orderId) {
    return res.status(400).json({ message: 'Order ID is required' });
  }

  try {
    // Call backend API để check payment status
    const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '');
    const response = await fetch(`${backendUrl}/api/orders/check-payment/${orderId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to check payment status');
    }

    const data = await response.json();
    
    return res.status(200).json(data);
    
  } catch (error) {
    console.error('Error checking payment status:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Failed to check payment status',
      isPaid: false
    });
  }
}
