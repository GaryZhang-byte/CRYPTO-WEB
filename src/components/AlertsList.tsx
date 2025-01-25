import React, { useEffect } from 'react';
import { PriceAlert } from '../services/alertService';
import { cryptoApi } from '../services/cryptoApi';

interface AlertsListProps {
  alerts: PriceAlert[];
  currentPrices: Record<string, number>;
  onDelete: (id: string) => void;
  onEdit: (alert: PriceAlert) => void;
}

export function AlertsList({ alerts, currentPrices, onDelete, onEdit }: AlertsListProps) {
  useEffect(() => {
    // 只在浏览器端运行
    if (typeof window !== 'undefined') {
      // 请求通知权限
      if ('Notification' in window) {
        Notification.requestPermission();
      }
    }
  }, []);

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-cyber-blue mb-4">Active Price Alerts</h2>
      <div className="space-y-4">
        {alerts.map(alert => {
          const currentPrice = currentPrices[alert.coinCode];
          return (
            <div key={alert.id} className="cyber-container rounded-lg p-4 hover:shadow-cyber transition-shadow duration-300">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-white font-medium">{alert.coinCode}</h3>
                  <p className="text-sm text-gray-400">
                    Target: ${alert.targetPrice.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })} ({alert.isAbove ? 'Above' : 'Below'})
                  </p>
                  <p className="text-sm text-gray-400">
                    Current: ${currentPrice?.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    }) ?? 'Loading...'}
                  </p>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => onEdit(alert)}
                    className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(alert.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 