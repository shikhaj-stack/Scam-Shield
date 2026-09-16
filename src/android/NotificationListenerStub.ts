/**
 * Android Notification Integration Architecture for ScamShield
 * 
 * In Android, a background NotificationListenerService intercepts incoming status bar notifications.
 * This file provides the modular contract and simulated adapter so ScamShield PWA works independently
 * while being 100% ready to receive incoming notifications from native Android wrappers (Capacitor/Cordova/React Native/Native Kotlin).
 */

import { AnalysisResult } from '../types';
import { analyzeMessageLocally } from '../engine/riskEngine';

export interface NotificationSource {
  id: string;
  packageName: string;       // e.g., 'com.whatsapp', 'com.google.android.apps.messaging'
  appName: string;           // e.g., 'WhatsApp', 'Messages'
  title: string;             // Notification sender / channel name
  text: string;              // Notification body content
  timestamp: number;
  subText?: string;
  isOngoing?: boolean;
}

export interface AndroidIntegrationStatus {
  serviceEnabled: boolean;
  permissionGranted: boolean;
  monitoredPackages: string[];
  batteryOptimizationIgnored: boolean;
}

export const MONITORED_APPS = [
  { packageName: 'com.google.android.apps.messaging', name: 'Google Messages (SMS)', icon: '💬' },
  { packageName: 'com.whatsapp', name: 'WhatsApp', icon: '🟢' },
  { packageName: 'org.telegram.messenger', name: 'Telegram', icon: '✈️' },
  { packageName: 'com.phonepe.app', name: 'PhonePe', icon: '🟣' },
  { packageName: 'net.one97.paytm', name: 'Paytm', icon: '🔵' },
  { packageName: 'com.google.android.apps.nbu.paisa.user', name: 'Google Pay', icon: '⚪' }
];

/**
 * Modular pipeline:
 * NotificationSource -> ScamDetector -> RiskResult -> High Risk Parental Warning
 */
export class AndroidNotificationAdapter {
  private listeners: ((result: AnalysisResult, source: NotificationSource) => void)[] = [];
  private status: AndroidIntegrationStatus = {
    serviceEnabled: true,
    permissionGranted: false, // Explicit user consent required
    monitoredPackages: ['com.google.android.apps.messaging', 'com.whatsapp'],
    batteryOptimizationIgnored: false
  };

  /**
   * Process an incoming notification through ScamShield's risk engine
   */
  public handleIncomingNotification(notification: NotificationSource): AnalysisResult {
    const fullText = `${notification.title}: ${notification.text}`;
    const result = analyzeMessageLocally(fullText, 'message');

    // Notify registered UI / alert listeners
    this.listeners.forEach(cb => cb(result, notification));
    return result;
  }

  public registerListener(callback: (result: AnalysisResult, source: NotificationSource) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  public getStatus(): AndroidIntegrationStatus {
    return this.status;
  }

  public setPermissionGranted(granted: boolean) {
    this.status.permissionGranted = granted;
  }
}

export const androidNotificationAdapter = new AndroidNotificationAdapter();
