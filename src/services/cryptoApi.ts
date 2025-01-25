interface Coin {
  code: string;
  name: string;
  symbol: string;
  rate: number;
  volume: number;
  cap: number;
  delta: {
    hour: number;
    day: number;
    week: number;
    month: number;
    quarter: number;
    year: number;
  };
}

const API_KEY = 'c0ab7af8-c74d-45cc-bdf9-0945c4c6cac6';
const BASE_URL = 'https://api.livecoinwatch.com';

export const cryptoApi = {
  async getCoins(): Promise<Coin[]> {
    try {
      const response = await fetch(`${BASE_URL}/coins/list`, {
        method: 'POST',
        headers: {
          'x-api-key': API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currency: 'USD',
          sort: 'rank',
          order: 'ascending',
          offset: 0,
          limit: 50,
          meta: true,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch coins');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching coins:', error);
      throw error;
    }
  },

  async getCoin(code: string): Promise<Coin> {
    try {
      const response = await fetch(`${BASE_URL}/coins/single`, {
        method: 'POST',
        headers: {
          'x-api-key': API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currency: 'USD',
          code,
          meta: true,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch coin');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching coin:', error);
      throw error;
    }
  },

  async getOverview(): Promise<any> {
    try {
      const response = await fetch(`${BASE_URL}/overview`, {
        method: 'POST',
        headers: {
          'x-api-key': API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currency: 'USD',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch overview');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching overview:', error);
      throw error;
    }
  },

  async getFiatRates(): Promise<any> {
    try {
      const response = await fetch(`${BASE_URL}/fiats/all`, {
        method: 'GET',
        headers: {
          'x-api-key': API_KEY,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch fiat rates');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching fiat rates:', error);
      throw error;
    }
  }
}; 