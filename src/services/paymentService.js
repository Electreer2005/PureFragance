// src/services/paymentService.js
import api from './api';

export const createPaymentPreference = async (orderData) => {
  const { data } = await api.post('/payments/create-preference', orderData);
  return data;
};