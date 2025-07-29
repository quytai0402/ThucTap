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
}
