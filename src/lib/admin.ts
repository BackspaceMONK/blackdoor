// Admin credentials (hardcoded for demo)
export const ADMIN_USERNAME = 'admin';
export const ADMIN_PASSWORD = 'BackspaceMonkey';

export const validateAdmin = (username: string, password: string): boolean => {
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
};

// Order management
export interface Order {
  id: string;
  username: string;
  items: any[];
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: string;
  paymentProof?: string;
}

export const getOrders = (): Order[] => {
  if (typeof window === 'undefined') return [];
  const orders = localStorage.getItem('orders');
  return orders ? JSON.parse(orders) : [];
};

export const saveOrder = (order: Order) => {
  const orders = getOrders();
  orders.push(order);
  localStorage.setItem('orders', JSON.stringify(orders));
};

export const updateOrderStatus = (orderId: string, status: Order['status']) => {
  const orders = getOrders();
  const orderIndex = orders.findIndex(o => o.id === orderId);
  if (orderIndex !== -1) {
    orders[orderIndex].status = status;
    localStorage.setItem('orders', JSON.stringify(orders));
  }
};

export const deleteOrder = (orderId: string) => {
  const orders = getOrders().filter(o => o.id !== orderId);
  localStorage.setItem('orders', JSON.stringify(orders));
};

// Settings management
export interface Settings {
  cookieTiers: Array<{ min: number; max: number; price: number }>;
  cardFee: number;
  cardLoadPercentage: number;
  btcWallet: string;
  telegramUrl: string;
}

export const getSettings = (): Settings => {
  if (typeof window === 'undefined') {
    return {
      cookieTiers: [],
      cardFee: 20,
      cardLoadPercentage: 10,
      btcWallet: '',
      telegramUrl: '',
    };
  }
  
  const settings = localStorage.getItem('adminSettings');
  return settings ? JSON.parse(settings) : {
    cookieTiers: [
      { min: 100, max: 400, price: 50 },
      { min: 401, max: 700, price: 100 },
      { min: 701, max: 1000, price: 200 },
      { min: 1001, max: 2000, price: 400 },
      { min: 2001, max: 4000, price: 600 },
      { min: 4001, max: 7000, price: 800 },
      { min: 7001, max: 10000, price: 1000 },
    ],
    cardFee: 20,
    cardLoadPercentage: 10,
    btcWallet: 'bc1qawl5lrjn0way4unxw89keyhgryyss9tkc2rya9',
    telegramUrl: 'https://t.me/backspacemonkey1',
  };
};

export const saveSettings = (settings: Settings) => {
  localStorage.setItem('adminSettings', JSON.stringify(settings));
};
