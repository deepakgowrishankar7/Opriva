import SockJS from 'sockjs-client';
import * as StompPkg from 'stompjs';

const Stomp: any = (StompPkg as any).default || StompPkg;

class WebSocketService {
  private client: any = null;
  private connected: boolean = false;
  private subscriptions: Map<string, any> = new Map();

  connect(onConnected?: () => void, onError?: (err: any) => void) {
    if (this.connected && this.client) {
      if (onConnected) onConnected();
      return;
    }

    try {
      const socket = new SockJS('/ws');
      const overFn = Stomp.over || (Stomp as any).Stomp?.over;
      if (!overFn) {
        console.warn('STOMP over function not found, skipping real-time socket');
        return;
      }
      this.client = overFn(socket);
      this.client.debug = () => {}; // quiet in production

      this.client.connect(
        {},
        () => {
          this.connected = true;
          if (onConnected) onConnected();
        },
        (error: any) => {
          this.connected = false;
          if (onError) onError(error);
        }
      );
    } catch (e) {
      if (onError) onError(e);
    }
  }

  subscribeHospitalQueue(hospitalId: string, callback: (message: any) => void) {
    if (!this.client || !this.connected) return;
    const dest = `/topic/hospitals/${hospitalId}/queue`;
    if (this.subscriptions.has(dest)) return;

    const sub = this.client.subscribe(dest, (msg: any) => {
      try {
        const body = JSON.parse(msg.body);
        callback(body);
      } catch {
        callback(msg.body);
      }
    });
    this.subscriptions.set(dest, sub);
  }

  subscribePatientNotifications(userId: string, callback: (message: any) => void) {
    if (!this.client || !this.connected) return;
    const dest = `/topic/patients/${userId}/notifications`;
    if (this.subscriptions.has(dest)) return;

    const sub = this.client.subscribe(dest, (msg: any) => {
      try {
        const body = JSON.parse(msg.body);
        callback(body);
      } catch {
        callback(msg.body);
      }
    });
    this.subscriptions.set(dest, sub);
  }

  disconnect() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscriptions.clear();
    if (this.client && this.connected) {
      this.client.disconnect(() => {
        this.connected = false;
      });
    }
  }
}

export const webSocketService = new WebSocketService();
