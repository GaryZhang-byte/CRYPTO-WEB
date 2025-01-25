export interface PriceAlert {
  id: string;
  coinCode: string;
  targetPrice: number;
  isAbove: boolean;
  createdAt: Date;
  soundType: 'police' | 'alarm' | 'bell' | 'siren';
}

class AlertService {
  private alerts: PriceAlert[] = [];
  private sounds: Record<string, HTMLAudioElement> = {};
  private activeSound: HTMLAudioElement | null = null;
  private lastTriggerTime: Record<string, number> = {}; // 防止重复触发

  constructor() {
    if (typeof window !== 'undefined') {
      // 初始化声音
      this.initializeSounds();
      this.loadAlerts();
      // 请求通知权限
      this.requestNotificationPermission();
    }
  }

  private async requestNotificationPermission() {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        await Notification.requestPermission();
      }
    }
  }

  private initializeSounds() {
    const soundTypes = ['police', 'alarm', 'bell', 'siren'];
    soundTypes.forEach(type => {
      const audio = new Audio(`/sounds/${type}.mp3`);
      audio.loop = true; // 循环播放
      this.sounds[type] = audio;
    });
  }

  private loadAlerts() {
    const savedAlerts = localStorage.getItem('priceAlerts');
    if (savedAlerts) {
      this.alerts = JSON.parse(savedAlerts).map((alert: PriceAlert) => ({
        ...alert,
        createdAt: new Date(alert.createdAt)
      }));
    }
  }

  private saveAlerts() {
    localStorage.setItem('priceAlerts', JSON.stringify(this.alerts));
  }

  addAlert(alert: Omit<PriceAlert, 'id' | 'createdAt'>) {
    const newAlert = {
      ...alert,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
    };
    this.alerts.push(newAlert);
    this.saveAlerts();
    return newAlert;
  }

  removeAlert(id: string) {
    this.alerts = this.alerts.filter(alert => alert.id !== id);
    this.saveAlerts();
  }

  getAlerts(): PriceAlert[] {
    return this.alerts;
  }

  checkPrice(coinCode: string, currentPrice: number) {
    this.alerts.forEach(alert => {
      if (alert.coinCode === coinCode) {
        const now = Date.now();
        const lastTrigger = this.lastTriggerTime[alert.id] || 0;
        
        // 防止在30秒内重复触发
        if (now - lastTrigger < 30000) return;

        const isTriggered = alert.isAbove ? 
          currentPrice >= alert.targetPrice : 
          currentPrice <= alert.targetPrice;

        if (isTriggered) {
          this.lastTriggerTime[alert.id] = now;
          this.triggerAlert(alert, currentPrice);
        }
      }
    });
  }

  private triggerAlert(alert: PriceAlert, currentPrice: number) {
    // 播放选择的声音
    this.playSound(alert.soundType);

    // 显示通知
    this.showNotification(alert, currentPrice);

    // 显示页面内警报
    this.showAlertBanner(alert, currentPrice);
  }

  private playSound(soundType: string) {
    // 停止当前播放的声音
    this.stopSound();

    // 播放新的声音
    if (this.sounds[soundType]) {
      this.activeSound = this.sounds[soundType];
      this.activeSound.play().catch(console.error);
    }
  }

  stopSound() {
    if (this.activeSound) {
      this.activeSound.pause();
      this.activeSound.currentTime = 0;
      this.activeSound = null;
    }
  }

  private showNotification(alert: PriceAlert, currentPrice: number) {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        const notification = new Notification(`Price Alert: ${alert.coinCode}`, {
          body: `${alert.coinCode} has ${alert.isAbove ? 'risen above' : 'fallen below'} $${alert.targetPrice}!\nCurrent price: $${currentPrice.toFixed(2)}`,
          icon: '/crypto-icon.png',
          requireInteraction: true
        });

        notification.onclick = () => {
          this.stopSound();
          notification.close();
        };
      }
    }
  }

  private showAlertBanner(alert: PriceAlert, currentPrice: number) {
    const banner = document.createElement('div');
    banner.className = 'fixed top-4 right-4 bg-red-600 text-white p-4 rounded-lg shadow-lg z-50 flex flex-col gap-2';
    banner.innerHTML = `
      <div>
        <strong>${alert.coinCode} Alert Triggered!</strong>
        <p>Target: $${alert.targetPrice}</p>
        <p>Current: $${currentPrice.toFixed(2)}</p>
      </div>
      <button class="bg-white text-red-600 px-4 py-2 rounded" onclick="this.parentElement.remove(); window.alertService.stopSound();">
        Stop Alert
      </button>
    `;

    document.body.appendChild(banner);
  }
}

export const alertService = new AlertService();

// 为了让 stopSound 在全局可用
if (typeof window !== 'undefined') {
  (window as any).alertService = alertService;
} 