import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Address, AddressDocument } from '../common/schemas/address.schema';

export interface CreateAddressDto {
  name: string;
  phone: string;
  street: string;
  ward: string;
  district: string;
  city: string;
  isDefault?: boolean;
  notes?: string;
}

@Injectable()
export class AddressesService {
  constructor(
    @InjectModel(Address.name) private addressModel: Model<AddressDocument>,
  ) {}

  async create(userId: string, createAddressDto: CreateAddressDto): Promise<Address> {
    // If this is set as default, remove default from other addresses
    if (createAddressDto.isDefault) {
      await this.addressModel.updateMany(
        { user: userId },
        { isDefault: false }
      );
    }

    const address = new this.addressModel({
      ...createAddressDto,
      user: userId,
    });

    return address.save();
  }

  async findAll(userId: string): Promise<Address[]> {
    return this.addressModel.find({ user: userId }).exec();
  }

  async findOne(userId: string, addressId: string): Promise<Address> {
    return this.addressModel.findOne({ _id: addressId, user: userId }).exec();
  }

  async update(userId: string, addressId: string, updateAddressDto: Partial<CreateAddressDto>): Promise<Address> {
    // If this is set as default, remove default from other addresses
    if (updateAddressDto.isDefault) {
      await this.addressModel.updateMany(
        { user: userId, _id: { $ne: addressId } },
        { isDefault: false }
      );
    }

    return this.addressModel.findOneAndUpdate(
      { _id: addressId, user: userId },
      updateAddressDto,
      { new: true }
    ).exec();
  }

  async remove(userId: string, addressId: string): Promise<void> {
    await this.addressModel.deleteOne({ _id: addressId, user: userId }).exec();
  }

  async getDefault(userId: string): Promise<Address | null> {
    return this.addressModel.findOne({ user: userId, isDefault: true }).exec();
  }

  async setDefault(userId: string, addressId: string): Promise<Address> {
    // Remove default from all addresses
    await this.addressModel.updateMany(
      { user: userId },
      { isDefault: false }
    );

    // Set new default
    return this.addressModel.findOneAndUpdate(
      { _id: addressId, user: userId },
      { isDefault: true },
      { new: true }
    ).exec();
  }

  // Smart address management methods
  async getAddressCount(userId: string): Promise<number> {
    return this.addressModel.countDocuments({ user: userId });
  }

  async canAddNewAddress(userId: string): Promise<boolean> {
    const count = await this.getAddressCount(userId);
    return count < 3; // Maximum 3 addresses
  }

  async createOrUpdateFromOrder(
    userId: string, 
    addressData: CreateAddressDto
  ): Promise<{ address: Address; isNew: boolean }> {
    const existingCount = await this.getAddressCount(userId);
    
    // If user has no addresses, create first one as default
    if (existingCount === 0) {
      const address = await this.create(userId, { ...addressData, isDefault: true });
      return { address, isNew: true };
    }

    // Check if this exact address already exists
    const existingAddress = await this.addressModel.findOne({
      user: userId,
      street: addressData.street,
      ward: addressData.ward,
      district: addressData.district,
      city: addressData.city,
    }).exec();

    if (existingAddress) {
      // Update existing address with new name/phone if provided
      const updatedAddress = await this.addressModel.findByIdAndUpdate(
        existingAddress._id,
        { 
          name: addressData.name,
          phone: addressData.phone,
          notes: addressData.notes 
        },
        { new: true }
      ).exec();
      return { address: updatedAddress, isNew: false };
    }

    // If user has space for new address, create it
    if (existingCount < 3) {
      const address = await this.create(userId, addressData);
      return { address, isNew: true };
    }

    // If user has 3 addresses already, they need to choose which one to replace
    throw new Error('MAX_ADDRESSES_REACHED');
  }

  async replaceAddress(
    userId: string, 
    addressIdToReplace: string, 
    newAddressData: CreateAddressDto
  ): Promise<Address> {
    const addressToReplace = await this.findOne(userId, addressIdToReplace);
    if (!addressToReplace) {
      throw new Error('Address not found');
    }

    // Keep the isDefault status of the replaced address
    const wasDefault = addressToReplace.isDefault;
    
    return this.update(userId, addressIdToReplace, {
      ...newAddressData,
      isDefault: wasDefault
    });
  }

  async getSuggestedAddressesForUser(userId: string): Promise<Address[]> {
    return this.addressModel
      .find({ user: userId })
      .sort({ isDefault: -1, updatedAt: -1 }) // Default first, then most recently updated
      .limit(3)
      .exec();
  }
}
