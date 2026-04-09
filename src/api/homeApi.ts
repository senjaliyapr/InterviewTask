import apiClient from './apiClient';

export type Offer = {
  _id: string;
  title: string;
  description: string;
  discount: number;
  image: string;
  status: string;
};

export type StoreLocation = {
  address: string;
  lat: number;
  long: number;
};

export type Store = {
  _id: string;
  name: string;
  category: string;
  location: StoreLocation;
  image: string;
};

export type StatisticRow = {
  _id: string;
  store_id: string;
  period: string;
  percentage: number;
};

export type StatisticsResponse = {
  data: StatisticRow[];
  total: number;
  skip: number;
  limit: number;
};

export type NotificationApiRow = {
  _id: string;
  preference: string;
  notificationTypeId: string;
  displayText: string;
  description: string;
  enabled: boolean;
  pushEnabled: boolean;
  emailEnabled: boolean;
  smsEnabled: boolean;
  defaultEnabled: boolean;
};

export const fetchOffers = async (): Promise<Offer[]> => {
  const { data } = await apiClient.get<{ data: Offer[] }>('/offers');
  return data.data ?? [];
};

export const fetchStores = async (): Promise<Store[]> => {
  const { data } = await apiClient.get<{ data: Store[] }>('/stores');
  return data.data ?? [];
};

export type StatPeriod = 'daily' | 'weekly' | 'monthly';

export const fetchStatistics = async (
  period: StatPeriod,
): Promise<StatisticsResponse> => {
  const { data } = await apiClient.get<StatisticsResponse>('/statistics', {
    params: { period, filter: true },
  });
  return data;
};

export const fetchStoreById = async (id: string): Promise<Store> => {
  const { data } = await apiClient.get<{ data: Store }>(`/stores/${id}`);
  return data.data;
};

export const fetchNotifications = async (): Promise<NotificationApiRow[]> => {
  const { data } = await apiClient.get<{ data: NotificationApiRow[] }>('/notifications');
  return data.data ?? [];
};
