import { getSettings } from './admin-db';

export interface CookieTier {
  min: number;
  max: number;
  price: number;
}

// Default tiers (fallback)
export const cookieTiers: CookieTier[] = [
  { min: 100, max: 400, price: 50 },
  { min: 401, max: 700, price: 100 },
  { min: 701, max: 1000, price: 200 },
  { min: 1001, max: 2000, price: 400 },
  { min: 2001, max: 4000, price: 600 },
  { min: 4001, max: 7000, price: 800 },
  { min: 7001, max: 10000, price: 1000 },
];

export const calculateCookiePrice = async (balance: number): Promise<number> => {
  try {
    const settings = await getSettings();
    const tier = settings.cookie_tiers.find(t => balance >= t.min && balance <= t.max);
    return tier ? tier.price : 0;
  } catch (error) {
    // Fallback to default tiers
    const tier = cookieTiers.find(t => balance >= t.min && balance <= t.max);
    return tier ? tier.price : 0;
  }
};

export const calculateCardPrice = async (loadAmount: number): Promise<number> => {
  try {
    const settings = await getSettings();
    return settings.card_fee + Math.round(loadAmount * (settings.card_load_percentage / 100));
  } catch (error) {
    // Fallback to default values
    return 20 + Math.round(loadAmount * 0.10);
  }
};

export const getCookieTiers = async (): Promise<CookieTier[]> => {
  try {
    const settings = await getSettings();
    return settings.cookie_tiers;
  } catch (error) {
    return cookieTiers;
  }
};
