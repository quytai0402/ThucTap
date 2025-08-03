import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AddressApiService {
  private readonly baseUrl = 'https://provinces.open-api.vn/api';

  async getProvinces() {
    try {
      const response = await axios.get(`${this.baseUrl}/p/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching provinces:', error);
      throw error;
    }
  }

  async getDistricts(provinceCode: string) {
    try {
      const response = await axios.get(`${this.baseUrl}/p/${provinceCode}?depth=2`);
      return response.data.districts;
    } catch (error) {
      console.error('Error fetching districts:', error);
      throw error;
    }
  }

  async getWards(districtCode: string) {
    try {
      const response = await axios.get(`${this.baseUrl}/d/${districtCode}?depth=2`);
      return response.data.wards;
    } catch (error) {
      console.error('Error fetching wards:', error);
      throw error;
    }
  }
}
