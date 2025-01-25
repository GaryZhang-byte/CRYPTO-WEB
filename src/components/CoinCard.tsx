interface CoinCardProps {
  coin: {
    name: string;
    code: string;
    price: number;
    delta: {
      day: number;
    };
  };
  onClick?: () => void;
}

import React from 'react';

export default function CoinCard({ coin, onClick }: CoinCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-primary p-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-secondary/20 hover:border-accent/50"
    >
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-text-primary font-semibold">{coin.name}</h3>
          <p className="text-text-secondary text-sm">{coin.code}</p>
        </div>
        <div className="text-right">
          <p className="text-text-primary font-bold">
            ${coin.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className={`text-sm ${coin.delta.day >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {coin.delta.day >= 0 ? '+' : ''}{coin.delta.day.toFixed(2)}%
          </p>
        </div>
      </div>
    </div>
  );
} 