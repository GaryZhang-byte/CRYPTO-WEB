export interface Coin {
  code: string;
  name: string;
  price: number;
  delta: {
    hour: number;
    day: number;
    week: number;
  };
  volume: number;
  cap: number;
}

export interface PriceAlert {
  id: string;
  coinCode: string;
  targetPrice: number;
  condition: 'above' | 'below';
  createdAt: Date;
  isTriggered: boolean;
} 