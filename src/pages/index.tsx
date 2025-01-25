import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { cryptoApi } from '../services/cryptoApi';
import { alertService } from '../services/alertService';
import { AlertsList } from '../components/AlertsList';

interface Coin {
  code: string;
  name: string;
  rate: number;
}

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCoin, setSelectedCoin] = useState<string | null>(null);
  const [alertPrice, setAlertPrice] = useState('');
  const [selectedSound, setSelectedSound] = useState<'police' | 'alarm' | 'bell' | 'siren'>('alarm');
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const updatePrices = async () => {
      try {
        const data = await cryptoApi.getCoins();
        setCoins(prevCoins => {
          return prevCoins.map(prevCoin => {
            const newCoin = data.find(c => c.code === prevCoin.code);
            return newCoin ? { ...prevCoin, rate: newCoin.rate } : prevCoin;
          });
        });

        // 检查价格提醒
        data.forEach(coin => {
          alertService.checkPrice(coin.code, coin.rate);
        });
      } catch (err) {
        console.error('Error updating prices:', err);
      }
    };

    const interval = setInterval(updatePrices, 100);
    return () => clearInterval(interval);
  }, []);

  // 初始加载
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const data = await cryptoApi.getCoins();
        setCoins(data);
      } catch (err) {
        console.error('Error fetching initial data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  if (!mounted) {
    return null; // 或者返回一个加载指示器
  }

  return (
    <Layout>
      <div className="space-y-8 cyber-grid min-h-screen p-4">
        {/* 标题和署名 */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-cyber-blue">Crypto Price Alert</h1>
          <span className="text-gray-400 italic">a gary zhang production</span>
        </div>

        {/* 搜索部分 */}
        <section className="cyber-container rounded-lg p-6">
          <div className="space-y-4">
            <label htmlFor="search" className="block text-xl font-medium text-cyber-blue">
              Search Cryptocurrency
            </label>
            <input
              type="text"
              id="search"
              className="mt-1 block w-full bg-cyber-dark border-cyber-blue border-opacity-30 text-white focus:border-cyber-blue focus:ring-cyber-blue rounded-md p-2"
              placeholder="Enter coin name or symbol..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {/* 搜索结果 */}
            {searchTerm && (
              <div className="mt-2 bg-gray-700 rounded-md max-h-60 overflow-y-auto">
                {coins
                  .filter(coin => 
                    coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    coin.code.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map(coin => (
                    <button
                      key={coin.code}
                      className="w-full text-left px-4 py-2 hover:bg-gray-600 text-white"
                      onClick={() => setSelectedCoin(coin.code)}
                    >
                      {coin.name} ({coin.code})
                    </button>
                  ))}
              </div>
            )}

            {/* 价格提醒设置 */}
            {selectedCoin && (
              <div className="mt-4 space-y-4">
                <h3 className="text-lg font-medium text-white">
                  Set Price Alert for {selectedCoin}
                </h3>
                <div>
                  <label htmlFor="alertPrice" className="block text-sm font-medium text-gray-300">
                    Alert Price (USD)
                  </label>
                  <input
                    type="number"
                    id="alertPrice"
                    className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
                    placeholder="Enter price..."
                    value={alertPrice}
                    onChange={(e) => setAlertPrice(e.target.value)}
                  />
                </div>
                
                {/* 添加声音选择 */}
                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Alert Sound
                  </label>
                  <select
                    value={selectedSound}
                    onChange={(e) => setSelectedSound(e.target.value as any)}
                    className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
                  >
                    <option value="police">Police Siren</option>
                    <option value="alarm">Alarm</option>
                    <option value="bell">Bell</option>
                    <option value="siren">Siren</option>
                  </select>
                  
                  {/* 测试声音按钮 */}
                  <button
                    className="mt-2 bg-gray-600 text-white px-3 py-1 rounded-md text-sm"
                    onClick={() => {
                      alertService.stopSound();
                      const sound = new Audio(`/sounds/${selectedSound}.mp3`);
                      sound.play();
                      setTimeout(() => sound.pause(), 2000);
                    }}
                  >
                    Test Sound
                  </button>
                </div>

                <button
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                  onClick={() => {
                    if (selectedCoin && alertPrice) {
                      alertService.addAlert({
                        coinCode: selectedCoin,
                        targetPrice: parseFloat(alertPrice),
                        isAbove: parseFloat(alertPrice) > (coins.find(c => c.code === selectedCoin)?.rate || 0),
                        soundType: selectedSound
                      });
                      setAlertPrice('');
                      setSelectedCoin(null);
                    }
                  }}
                >
                  Set Alert
                </button>
              </div>
            )}
          </div>
        </section>

        {/* 价格显示部分 */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coins.slice(0, 6).map(coin => (
            <div key={coin.code} className="cyber-container rounded-lg p-6 hover:shadow-cyber transition-shadow duration-300">
              <h3 className="text-xl font-bold text-cyber-blue">{coin.name} ({coin.code})</h3>
              <p className="text-3xl mt-2">
                <span key={coin.rate} className="text-green-400 price-update">
                  ${coin.rate.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </span>
              </p>
            </div>
          ))}
        </section>

        {/* 提醒列表 */}
        <AlertsList
          alerts={alertService.getAlerts()}
          currentPrices={Object.fromEntries(coins.map(coin => [coin.code, coin.rate]))}
          onDelete={id => alertService.removeAlert(id)}
          onEdit={alert => {
            setSelectedCoin(alert.coinCode);
            setAlertPrice(alert.targetPrice.toString());
          }}
        />
      </div>
    </Layout>
  );
}
