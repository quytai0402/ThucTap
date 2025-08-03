import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument, OrderStatus, PaymentStatus, PaymentMethod } from '../common/schemas/order.schema';
import { Product, ProductDocument } from '../common/schemas/product.schema';
import { User, UserDocument } from '../common/schemas/user.schema';
import { GuestCustomerService } from '../guest-customer/guest-customer.service';
import { EmailService } from '../email/email.service';

export interface CreateOrderDto {
  customer?: string; // Optional for guest orders
  items: Array<{
    product: string;
    quantity: number;
  }>;
  shippingAddress: {
    name: string;
    phone: string;
    email?: string; // Added for guest orders
    address: string;
    city: string;
    district: string;
    ward: string;
  };
  paymentMethod: PaymentMethod;
  notes?: string;
  discountCode?: string;
  isGuestOrder?: boolean; // Flag to mark guest orders
}

export interface GuestInfo {
  fullName: string;
  phone: string;
  email?: string;
  address: {
    address: string;
    city: string;
    district: string;
    ward: string;
  };
}

export interface CreateGuestOrderDto {
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  guestInfo: GuestInfo;
  paymentMethod: PaymentMethod;
  notes?: string;
  discountCode?: string;
}

export interface TrackGuestOrderDto {
  phone: string;
  orderNumber: string;
}

export interface UpdateOrderDto {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  trackingNumber?: string;
  notes?: string;
}

export interface OrderFilter {
  customer?: string;
  phone?: string; // Added phone filter for admin to search by customer phone
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  paymentMethod?: PaymentMethod;
  dateFrom?: Date;
  dateTo?: Date;
  isGuestOrder?: boolean; // Added to filter guest orders
}

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    private readonly guestCustomerService: GuestCustomerService,
    private readonly emailService: EmailService,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    // Generate order number
    const orderNumber = await this.generateOrderNumber();
    
    // Calculate order totals
    const { items, subtotal, total, shippingFee } = await this.calculateOrderTotals(createOrderDto.items);
    
    // Check stock availability
    await this.validateStock(createOrderDto.items);
    
    const orderData: any = {
      orderNumber,
      items,
      subtotal,
      shippingFee,
      total,
      shippingAddress: createOrderDto.shippingAddress,
      paymentMethod: createOrderDto.paymentMethod,
      notes: createOrderDto.notes,
      status: OrderStatus.PENDING,
      paymentStatus: PaymentStatus.PENDING,
      isGuestOrder: createOrderDto.isGuestOrder || false,
    };
    
    // Add customer ID if not a guest order
    if (!createOrderDto.isGuestOrder && createOrderDto.customer) {
      orderData.customer = createOrderDto.customer;
    }

    const order = new this.orderModel(orderData);
    const savedOrder = await order.save();
    
    // Update product stock
    await this.updateProductStock(createOrderDto.items);
    
    // If this is a guest order, update or create guest customer record based on phone
    if (createOrderDto.isGuestOrder && createOrderDto.shippingAddress.phone) {
      try {
        // Extract guest customer info from shipping address
        const guestInfo = {
          phone: createOrderDto.shippingAddress.phone,
          fullName: createOrderDto.shippingAddress.name,
          email: createOrderDto.shippingAddress.email,
          address: {
            address: createOrderDto.shippingAddress.address,
            city: createOrderDto.shippingAddress.city,
            district: createOrderDto.shippingAddress.district,
            ward: createOrderDto.shippingAddress.ward,
          }
        };
        
        // Create or update guest customer record
        await this.guestCustomerService.createOrUpdate(guestInfo, savedOrder);
        
        console.log(`Guest customer info processed for phone: ${guestInfo.phone}`);
      } catch (error) {
        console.error('Error processing guest customer:', error);
        // Don't fail the order creation if guest customer processing fails
      }
    }
    
    // Send order confirmation email
    try {
      // Check if we have email address
      let hasEmail = false;
      
      if (createOrderDto.isGuestOrder && createOrderDto.shippingAddress.email) {
        hasEmail = true;
      } else if (!createOrderDto.isGuestOrder) {
        // For registered users, populate customer data to get email
        const orderWithCustomer = await this.orderModel.findById(savedOrder._id).populate('customer').exec();
        if (orderWithCustomer && orderWithCustomer.customer && (orderWithCustomer.customer as any).email) {
          hasEmail = true;
          // Update savedOrder to include customer data for email service
          savedOrder.customer = orderWithCustomer.customer;
        }
      }
      
      if (hasEmail) {
        await this.emailService.sendOrderConfirmation(savedOrder);
        console.log(`Order confirmation email sent for order: ${savedOrder.orderNumber}`);
      }
    } catch (error) {
      console.error('Error sending order confirmation email:', error);
      // Don't fail the order creation if email sending fails
    }
    
    return this.findOne(savedOrder._id.toString());
  }

  async findAll(
    page = 1,
    limit = 10,
    filter: OrderFilter = {},
    sortBy = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc',
  ): Promise<{
    orders: Order[];
    total: number;
    totalPages: number;
    currentPage: number;
  }> {
    const query: any = {};

    // Apply filters
    if (filter.customer) query.customer = filter.customer;
    if (filter.status) query.status = filter.status;
    if (filter.paymentStatus) query.paymentStatus = filter.paymentStatus;
    if (filter.paymentMethod) query.paymentMethod = filter.paymentMethod;
    
    // Phone number filter (for both registered and guest customers)
    if (filter.phone) {
      query['shippingAddress.phone'] = filter.phone;
    }
    
    // Filter by guest order status
    if (filter.isGuestOrder !== undefined) {
      query.isGuestOrder = filter.isGuestOrder;
    }
    
    if (filter.dateFrom || filter.dateTo) {
      query.createdAt = {};
      if (filter.dateFrom) query.createdAt.$gte = filter.dateFrom;
      if (filter.dateTo) query.createdAt.$lte = filter.dateTo;
    }

    const skip = (page - 1) * limit;
    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const [orders, total] = await Promise.all([
      this.orderModel
        .find(query)
        .populate('customer', 'fullName email phone')
        .populate('items.product', 'name images price slug')
        .skip(skip)
        .limit(limit)
        .sort(sort),
      this.orderModel.countDocuments(query),
    ]);

    return {
      orders,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    };
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderModel
      .findById(id)
      .populate('customer', 'fullName email phone address')
      .populate('items.product', 'name images price specifications slug');
      
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    
    return order;
  }

  async findByOrderNumber(orderNumber: string): Promise<Order> {
    const order = await this.orderModel
      .findOne({ orderNumber })
      .populate('customer', 'fullName email phone')
      .populate('items.product', 'name images price');
      
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    
    return order;
  }

  async findByCustomer(
    customerId: string,
    page = 1,
    limit = 10,
  ): Promise<{
    orders: Order[];
    total: number;
    totalPages: number;
    currentPage: number;
  }> {
    const query = { customer: customerId };
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      this.orderModel
        .find(query)
        .populate('items.product', 'name images price')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      this.orderModel.countDocuments(query),
    ]);

    return {
      orders,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    };
  }

  async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    const updateData: any = { status };
    
    // Get order before update
    const currentOrder = await this.findOne(id);
    if (!currentOrder) {
      throw new NotFoundException('Order not found');
    }
    
    if (status === OrderStatus.DELIVERED) {
      updateData.deliveredAt = new Date();
      
      // If this is a guest order and delivered successfully, update guest customer stats
      if (currentOrder.isGuestOrder && currentOrder.shippingAddress?.phone) {
        try {
          await this.guestCustomerService.updateOrderSuccess(
            id, 
            currentOrder.shippingAddress.phone,
            currentOrder.total
          );
          console.log(`Updated guest customer stats for phone: ${currentOrder.shippingAddress.phone}`);
        } catch (error) {
          console.error('Error updating guest customer success stats:', error);
          // Don't fail the order status update if guest customer processing fails
        }
      }
      
    } else if (status === OrderStatus.CANCELLED) {
      updateData.cancelledAt = new Date();
      // Restore product stock
      await this.restoreProductStock(currentOrder.items);
    }

    const order = await this.orderModel.findByIdAndUpdate(id, updateData, { new: true });
    
    // Send order status update email
    try {
      const updatedOrderWithDetails = await this.orderModel.findById(id).populate('customer').exec();
      
      // Check if we have email to send notification
      let hasEmail = false;
      
      if (updatedOrderWithDetails.isGuestOrder && updatedOrderWithDetails.shippingAddress?.email) {
        hasEmail = true;
      } else if (!updatedOrderWithDetails.isGuestOrder && updatedOrderWithDetails.customer && (updatedOrderWithDetails.customer as any).email) {
        hasEmail = true;
      }
      
      if (hasEmail) {
        await this.emailService.sendOrderStatusUpdate(updatedOrderWithDetails, currentOrder.status);
        console.log(`Order status update email sent for order: ${updatedOrderWithDetails.orderNumber}, status: ${status}`);
      }
    } catch (error) {
      console.error('Error sending order status update email:', error);
      // Don't fail the order status update if email sending fails
    }
    
    return this.findOne(id);
  }

  async updatePaymentStatus(id: string, paymentStatus: PaymentStatus, transactionId?: string): Promise<Order> {
    const updateData: any = { paymentStatus };
    if (transactionId) {
      updateData.transactionId = transactionId;
    }

    const order = await this.orderModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
    
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    
    return this.findOne(id);
  }

  async addTrackingNumber(id: string, trackingNumber: string): Promise<Order> {
    const order = await this.orderModel.findByIdAndUpdate(
      id,
      { trackingNumber, status: OrderStatus.SHIPPED },
      { new: true }
    );
    
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    
    return this.findOne(id);
  }

  async getOrderStats(dateFrom?: Date, dateTo?: Date) {
    const matchStage: any = {};
    
    if (dateFrom || dateTo) {
      matchStage.createdAt = {};
      if (dateFrom) matchStage.createdAt.$gte = dateFrom;
      if (dateTo) matchStage.createdAt.$lte = dateTo;
    }

    const stats = await this.orderModel.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          // Only count revenue from delivered orders (successfully completed)
          totalRevenue: { 
            $sum: { 
              $cond: [
                { $eq: ['$status', OrderStatus.DELIVERED] }, 
                '$total', 
                0 
              ] 
            } 
          },
          averageOrderValue: { $avg: '$total' },
          pendingOrders: {
            $sum: { $cond: [{ $eq: ['$status', OrderStatus.PENDING] }, 1, 0] }
          },
          confirmedOrders: {
            $sum: { $cond: [{ $eq: ['$status', OrderStatus.CONFIRMED] }, 1, 0] }
          },
          shippedOrders: {
            $sum: { $cond: [{ $eq: ['$status', OrderStatus.SHIPPED] }, 1, 0] }
          },
          deliveredOrders: {
            $sum: { $cond: [{ $eq: ['$status', OrderStatus.DELIVERED] }, 1, 0] }
          },
          cancelledOrders: {
            $sum: { $cond: [{ $eq: ['$status', OrderStatus.CANCELLED] }, 1, 0] }
          },
        }
      }
    ]);

    return stats[0] || {
      totalOrders: 0,
      totalRevenue: 0,
      averageOrderValue: 0,
      pendingOrders: 0,
      confirmedOrders: 0,
      shippedOrders: 0,
      deliveredOrders: 0,
      cancelledOrders: 0,
    };
  }

  private async generateOrderNumber(): Promise<string> {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    const todayPrefix = `LP${year}${month}${day}`;
    
    const lastOrder = await this.orderModel
      .findOne({ orderNumber: new RegExp(`^${todayPrefix}`) })
      .sort({ orderNumber: -1 });
    
    let sequence = 1;
    if (lastOrder) {
      const lastSequence = parseInt(lastOrder.orderNumber.slice(-4));
      sequence = lastSequence + 1;
    }
    
    return `${todayPrefix}${sequence.toString().padStart(4, '0')}`;
  }

  private async calculateOrderTotals(items: Array<{ product: string; quantity: number }>) {
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      // Validate ObjectId format
      if (!item.product || !item.product.match(/^[0-9a-fA-F]{24}$/)) {
        throw new BadRequestException(`Invalid product ID format: ${item.product}`);
      }

      const product = await this.productModel.findById(item.product);
      if (!product) {
        throw new NotFoundException(`Product ${item.product} not found`);
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.images?.[0] || '',
        specifications: product.specifications,
      });
    }

    // Calculate shipping fee (basic logic)
    const shippingFee = subtotal >= 500000 ? 0 : 30000;
    const total = subtotal + shippingFee;

    return { items: orderItems, subtotal, total, shippingFee };
  }

  private async validateStock(items: Array<{ product: string; quantity: number }>) {
    for (const item of items) {
      const product = await this.productModel.findById(item.product);
      if (!product) {
        throw new NotFoundException(`Product ${item.product} not found`);
      }
      
      if (product.stock < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for product ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`
        );
      }
    }
  }

  private async updateProductStock(items: Array<{ product: string; quantity: number }>) {
    for (const item of items) {
      await this.productModel.findByIdAndUpdate(
        item.product,
        { $inc: { stock: -item.quantity, sold: item.quantity } }
      );
    }
  }

  private async restoreProductStock(items: Array<{ product: any; quantity: number }>) {
    for (const item of items) {
      // Safely get product ID - handle both populated and non-populated cases
      const productId = item.product?._id || item.product;
      
      if (productId) {
        try {
          await this.productModel.findByIdAndUpdate(
            productId,
            { $inc: { stock: item.quantity, sold: -item.quantity } }
          );
        } catch (error) {
          console.error(`Error restoring stock for product ${productId}:`, error);
        }
      } else {
        console.warn('Product ID not found in order item:', item);
      }
    }
  }

  async getCustomerStats(customerId: string): Promise<any> {
    const orders = await this.orderModel.find({ customer: customerId });
    
    const stats = {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      confirmed: orders.filter(o => o.status === 'confirmed').length,
      processing: orders.filter(o => o.status === 'processing').length,
      shipped: orders.filter(o => o.status === 'shipped').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
      totalSpent: orders
        .filter(o => o.status !== 'cancelled')
        .reduce((sum, o) => sum + (o as any).totalAmount, 0),
      averageOrder: 0
    };

    stats.averageOrder = stats.total > 0 ? stats.totalSpent / stats.total : 0;
    
    return stats;
  }

  async getRecentOrders(customerId: string, limit: number = 3): Promise<Order[]> {
    return this.orderModel
      .find({ customer: customerId })
      .populate('items.product')
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }

  async findGuestOrdersByPhone(phone: string, orderNumber?: string): Promise<Order[]> {
    const query: any = {
      isGuestOrder: true,
      'shippingAddress.phone': phone
    };
    
    // Add order number to query if provided
    if (orderNumber) {
      query.orderNumber = orderNumber;
    }
    
    const orders = await this.orderModel
      .find(query)
      .populate('items.product')
      .sort({ createdAt: -1 })
      .exec();
      
    return orders;
  }

  async findOrdersByUserId(userId: string, page: number = 1, limit: number = 10): Promise<any> {
    const skip = (page - 1) * limit;
    
    // Get orders for registered user
    const query = {
      isGuestOrder: false,
      customer: userId
    };
    
    const [orders, total] = await Promise.all([
      this.orderModel
        .find(query)
        .populate('items.product')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.orderModel.countDocuments(query)
    ]);
    
    return {
      orders,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    };
  }

  async getOrderTracking(orderId: string, customerId: string): Promise<any> {
    const order = await this.orderModel
      .findOne({ _id: orderId, customer: customerId })
      .populate('items.product')
      .exec();

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Create tracking timeline
    const timeline = [];
    
    if (order.status === 'pending' || ['confirmed', 'processing', 'shipped', 'delivered'].includes(order.status)) {
      timeline.push({
        status: 'pending',
        title: 'Đơn hàng đã được tạo',
        description: 'Đơn hàng của bạn đã được tạo và đang chờ xác nhận',
        date: (order as any).createdAt,
        completed: true
      });
    }

    if (['confirmed', 'processing', 'shipped', 'delivered'].includes(order.status)) {
      timeline.push({
        status: 'confirmed',
        title: 'Đơn hàng đã được xác nhận',
        description: 'Đơn hàng đã được xác nhận và chuẩn bị xử lý',
        date: (order as any).updatedAt,
        completed: true
      });
    }

    if (['processing', 'shipped', 'delivered'].includes(order.status)) {
      timeline.push({
        status: 'processing',
        title: 'Đang chuẩn bị hàng',
        description: 'Đơn hàng đang được chuẩn bị và đóng gói',
        date: (order as any).updatedAt,
        completed: true
      });
    }

    if (['shipped', 'delivered'].includes(order.status)) {
      timeline.push({
        status: 'shipped',
        title: 'Đã giao cho đơn vị vận chuyển',
        description: `Đơn hàng đã được giao cho đơn vị vận chuyển${order.trackingNumber ? ` - Mã vận đơn: ${order.trackingNumber}` : ''}`,
        date: (order as any).updatedAt,
        completed: true
      });
    }

    if (order.status === 'delivered') {
      timeline.push({
        status: 'delivered',
        title: 'Đã giao hàng thành công',
        description: 'Đơn hàng đã được giao thành công',
        date: (order as any).updatedAt,
        completed: true
      });
    }

    if (order.status === 'cancelled') {
      timeline.push({
        status: 'cancelled',
        title: 'Đơn hàng đã bị hủy',
        description: 'Đơn hàng đã bị hủy',
        date: (order as any).updatedAt,
        completed: true
      });
    }

    return {
      order,
      timeline
    };
  }
}
