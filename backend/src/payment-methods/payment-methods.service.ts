import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaymentMethod, PaymentMethodDocument } from '../common/schemas/payment-method.schema';

@Injectable()
export class PaymentMethodsService {
  constructor(
    @InjectModel(PaymentMethod.name)
    private paymentMethodModel: Model<PaymentMethodDocument>,
  ) {}

  async findAll(userId: string): Promise<PaymentMethod[]> {
    return this.paymentMethodModel
      .find({ userId, isActive: true })
      .sort({ isDefault: -1, createdAt: -1 })
      .exec();
  }

  async findOne(id: string, userId: string): Promise<PaymentMethod> {
    const paymentMethod = await this.paymentMethodModel
      .findOne({ _id: id, userId, isActive: true })
      .exec();
    
    if (!paymentMethod) {
      throw new NotFoundException('Payment method not found');
    }
    
    return paymentMethod;
  }

  async create(userId: string, createPaymentMethodDto: any): Promise<PaymentMethod> {
    // If this is set as default, unset all other defaults
    if (createPaymentMethodDto.isDefault) {
      await this.paymentMethodModel.updateMany(
        { userId },
        { isDefault: false },
      ).exec();
    }

    // Mask sensitive data
    const maskedData = this.maskSensitiveData(createPaymentMethodDto);

    const createdPaymentMethod = new this.paymentMethodModel({
      ...maskedData,
      userId,
    });

    return createdPaymentMethod.save();
  }

  async update(id: string, userId: string, updatePaymentMethodDto: any): Promise<PaymentMethod> {
    const paymentMethod = await this.findOne(id, userId);

    // If this is set as default, unset all other defaults
    if (updatePaymentMethodDto.isDefault && !paymentMethod.isDefault) {
      await this.paymentMethodModel.updateMany(
        { userId, _id: { $ne: id } },
        { isDefault: false },
      ).exec();
    }

    // Mask sensitive data
    const maskedData = this.maskSensitiveData(updatePaymentMethodDto);

    return this.paymentMethodModel
      .findByIdAndUpdate(id, maskedData, { new: true })
      .exec();
  }

  async remove(id: string, userId: string): Promise<void> {
    const paymentMethod = await this.findOne(id, userId);
    
    // Soft delete
    await this.paymentMethodModel
      .findByIdAndUpdate(id, { isActive: false })
      .exec();
  }

  async setDefault(id: string, userId: string): Promise<PaymentMethod> {
    const paymentMethod = await this.findOne(id, userId);

    // Unset all other defaults
    await this.paymentMethodModel.updateMany(
      { userId, _id: { $ne: id } },
      { isDefault: false },
    ).exec();

    // Set this as default
    return this.paymentMethodModel
      .findByIdAndUpdate(id, { isDefault: true }, { new: true })
      .exec();
  }

  private maskSensitiveData(data: any) {
    const masked = { ...data };

    if (masked.cardNumber) {
      // Store only last 4 digits
      masked.cardNumber = masked.cardNumber.slice(-4);
    }

    if (masked.accountNumber) {
      // Mask account number, show only last 4 digits
      masked.accountNumber = '**** **** ' + masked.accountNumber.slice(-4);
    }

    if (masked.walletId) {
      // Mask wallet ID
      masked.walletId = '**** ' + masked.walletId.slice(-4);
    }

    return masked;
  }
}
