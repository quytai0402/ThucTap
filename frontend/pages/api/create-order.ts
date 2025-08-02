import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

// Helper function to parse cookies from request
function parseCookies(req: NextApiRequest) {
  const cookies: { [key: string]: string } = {};
  if (req.headers.cookie) {
    req.headers.cookie.split(';').forEach(cookie => {
      const [name, value] = cookie.trim().split('=');
      cookies[name] = decodeURIComponent(value);
    });
  }
  return cookies;
}

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
    
    const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    
    // Check if this is a guest order or authenticated order
    let response;
    if (orderData.isGuestOrder) {
      // Transform data for guest order endpoint
      const guestOrderData = {
        items: orderData.items.map((item: any) => ({
          productId: item.product,
          quantity: item.quantity
        })),
        guestInfo: {
          fullName: orderData.shippingAddress.fullName,
          phone: orderData.shippingAddress.phone,
          email: orderData.shippingAddress.email,
          address: {
            address: orderData.shippingAddress.address,
            city: orderData.shippingAddress.provinceName || orderData.shippingAddress.city,
            district: orderData.shippingAddress.districtName || orderData.shippingAddress.district,
            ward: orderData.shippingAddress.wardName || orderData.shippingAddress.ward
          }
        },
        paymentMethod: orderData.paymentMethod,
        notes: orderData.note,
        discountCode: orderData.discountCode
      };
      
      // Use guest order endpoint (no auth required)
      response = await axios.post(`${baseURL}/orders/guest`, guestOrderData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } else {
      // For authenticated users, we need to get the auth token from cookies
      const cookies = parseCookies(req);
      const token = cookies.token;
      
      if (!token) {
        return res.status(401).json({ message: 'Authentication required' });
      }
      
      // Transform data for authenticated order endpoint
      const transformedOrderData = {
        items: orderData.items.map((item: any) => ({
          product: item.product,
          quantity: item.quantity
        })),
        shippingAddress: {
          name: orderData.shippingAddress.fullName,
          phone: orderData.shippingAddress.phone,
          email: orderData.shippingAddress.email,
          address: orderData.shippingAddress.address,
          city: orderData.shippingAddress.provinceName || orderData.shippingAddress.city || '',
          district: orderData.shippingAddress.districtName || orderData.shippingAddress.district || '',
          ward: orderData.shippingAddress.wardName || orderData.shippingAddress.ward || ''
        },
        paymentMethod: orderData.paymentMethod,
        notes: orderData.note,
        isGuestOrder: orderData.isGuestOrder || false
      };
      
      // Use authenticated order endpoint with token
      response = await axios.post(`${baseURL}/orders`, transformedOrderData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
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
