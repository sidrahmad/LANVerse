/**
 * Local Environment Detection and Adaptation Service
 * Handles device capabilities, network conditions, and local optimizations
 */

export interface LocalEnvironment {
  networkType: 'wifi' | 'ethernet' | 'mobile' | 'unknown';
  bandwidth: {
    download: number; // Mbps
    upload: number;   // Mbps
    latency: number;  // ms
  };
  deviceCapabilities: {
    audio: boolean;
    video: boolean;
    fileSystem: boolean;
    notifications: boolean;
    fullscreen: boolean;
  };
  browserSupport: {
    webrtc: boolean;
    mediaDevices: boolean;
    fileApi: boolean;
    workers: boolean;
  };
  localNetwork: {
    ipAddress: string;
    subnet: string;
    gateway: string;
  };
}

export class LocalEnvironmentService {
  private environment: LocalEnvironment | null = null;
  private networkMonitor?: number;
  private onEnvironmentChange?: (env: LocalEnvironment) => void;

  constructor() {
    this.detectEnvironment();
    this.startNetworkMonitoring();
  }

  /**
   * Detect and analyze local environment
   */
  async detectEnvironment(): Promise<LocalEnvironment> {
    const environment: LocalEnvironment = {
      networkType: await this.detectNetworkType(),
      bandwidth: await this.measureBandwidth(),
      deviceCapabilities: this.detectDeviceCapabilities(),
      browserSupport: this.detectBrowserSupport(),
      localNetwork: await this.detectLocalNetwork()
    };

    this.environment = environment;
    return environment;
  }

  /**
   * Detect network connection type
   */
  private async detectNetworkType(): Promise<LocalEnvironment['networkType']> {
    // Use Network Information API if available
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      if (connection) {
        switch (connection.type) {
          case 'wifi':
            return 'wifi';
          case 'ethernet':
            return 'ethernet';
          case 'cellular':
            return 'mobile';
          default:
            return 'unknown';
        }
      }
    }

    // Fallback: estimate based on connection speed
    const bandwidth = await this.measureBandwidth();
    if (bandwidth.download > 50) return 'ethernet';
    if (bandwidth.download > 10) return 'wifi';
    return 'mobile';
  }

  /**
   * Measure network bandwidth and latency
   */
  private async measureBandwidth(): Promise<LocalEnvironment['bandwidth']> {
    try {
      // Measure latency with multiple pings
      const latencyTests = await Promise.all([
        this.measureLatency('https://www.google.com/favicon.ico'),
        this.measureLatency('https://www.cloudflare.com/favicon.ico'),
        this.measureLatency('https://www.github.com/favicon.ico')
      ]);
      
      const avgLatency = latencyTests.reduce((sum, lat) => sum + lat, 0) / latencyTests.length;

      // Estimate bandwidth (simplified - real implementation would download test files)
      const connection = (navigator as any).connection;
      let estimatedDownload = 10; // Default 10 Mbps
      let estimatedUpload = 5;    // Default 5 Mbps

      if (connection && connection.downlink) {
        estimatedDownload = connection.downlink;
        estimatedUpload = connection.downlink * 0.5; // Estimate upload as 50% of download
      }

      return {
        download: estimatedDownload,
        upload: estimatedUpload,
        latency: avgLatency
      };
    } catch (error) {
      console.warn('Bandwidth measurement failed:', error);
      return { download: 10, upload: 5, latency: 50 };
    }
  }

  /**
   * Measure latency to a specific endpoint
   */
  private async measureLatency(url: string): Promise<number> {
    const start = performance.now();
    try {
      await fetch(url, { mode: 'no-cors', cache: 'no-cache' });
      return performance.now() - start;
    } catch {
      return 100; // Default latency if measurement fails
    }
  }

  /**
   * Detect device capabilities
   */
  private detectDeviceCapabilities(): LocalEnvironment['deviceCapabilities'] {
    return {
      audio: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
      video: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
      fileSystem: !!(window.File && window.FileReader && window.FileList && window.Blob),
      notifications: 'Notification' in window,
      fullscreen: !!(document.documentElement.requestFullscreen || 
                    (document.documentElement as any).webkitRequestFullscreen ||
                    (document.documentElement as any).mozRequestFullScreen)
    };
  }

  /**
   * Detect browser support for required features
   */
  private detectBrowserSupport(): LocalEnvironment['browserSupport'] {
    return {
      webrtc: !!(window.RTCPeerConnection || (window as any).webkitRTCPeerConnection),
      mediaDevices: !!(navigator.mediaDevices),
      fileApi: !!(window.File && window.FileReader),
      workers: !!(window.Worker)
    };
  }

  /**
   * Detect local network information
   */
  private async detectLocalNetwork(): Promise<LocalEnvironment['localNetwork']> {
    try {
      // Use WebRTC to get local IP
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
      });
      
      return new Promise((resolve) => {
        pc.createDataChannel('test');
        pc.createOffer().then(offer => pc.setLocalDescription(offer));
        
        pc.onicecandidate = (event) => {
          if (event.candidate) {
            const candidate = event.candidate.candidate;
            const ipMatch = candidate.match(/(\d+\.\d+\.\d+\.\d+)/);
            if (ipMatch) {
              const ip = ipMatch[1];
              const subnet = this.calculateSubnet(ip);
              const gateway = this.calculateGateway(ip);
              
              pc.close();
              resolve({
                ipAddress: ip,
                subnet: subnet,
                gateway: gateway
              });
            }
          }
        };
        
        // Timeout fallback
        setTimeout(() => {
          pc.close();
          resolve({
            ipAddress: '192.168.1.100',
            subnet: '192.168.1.0/24',
            gateway: '192.168.1.1'
          });
        }, 5000);
      });
    } catch (error) {
      console.warn('Local network detection failed:', error);
      return {
        ipAddress: '192.168.1.100',
        subnet: '192.168.1.0/24',
        gateway: '192.168.1.1'
      };
    }
  }

  /**
   * Calculate subnet from IP address
   */
  private calculateSubnet(ip: string): string {
    const parts = ip.split('.');
    if (parts[0] === '192' && parts[1] === '168') {
      return `192.168.${parts[2]}.0/24`;
    } else if (parts[0] === '10') {
      return '10.0.0.0/8';
    } else if (parts[0] === '172') {
      return `172.${parts[1]}.0.0/16`;
    }
    return `${parts[0]}.${parts[1]}.${parts[2]}.0/24`;
  }

  /**
   * Calculate gateway from IP address
   */
  private calculateGateway(ip: string): string {
    const parts = ip.split('.');
    return `${parts[0]}.${parts[1]}.${parts[2]}.1`;
  }

  /**
   * Start monitoring network conditions
   */
  private startNetworkMonitoring() {
    this.networkMonitor = window.setInterval(async () => {
      if (this.environment) {
        const newBandwidth = await this.measureBandwidth();
        const oldBandwidth = this.environment.bandwidth;
        
        // Check for significant changes
        const downloadChange = Math.abs(newBandwidth.download - oldBandwidth.download) / oldBandwidth.download;
        const latencyChange = Math.abs(newBandwidth.latency - oldBandwidth.latency) / oldBandwidth.latency;
        
        if (downloadChange > 0.2 || latencyChange > 0.3) {
          this.environment.bandwidth = newBandwidth;
          this.onEnvironmentChange?.(this.environment);
        }
      }
    }, 30000); // Check every 30 seconds
  }

  /**
   * Get optimal settings based on environment
   */
  getOptimalSettings(): {
    audioQuality: 'low' | 'medium' | 'high';
    videoEnabled: boolean;
    chunkSize: number;
    maxConnections: number;
    compressionLevel: number;
  } {
    if (!this.environment) {
      return {
        audioQuality: 'medium',
        videoEnabled: false,
        chunkSize: 32 * 1024,
        maxConnections: 4,
        compressionLevel: 5
      };
    }

    const { bandwidth, deviceCapabilities } = this.environment;
    
    return {
      audioQuality: bandwidth.download > 5 ? 'high' : bandwidth.download > 2 ? 'medium' : 'low',
      videoEnabled: deviceCapabilities.video && bandwidth.download > 10,
      chunkSize: bandwidth.download > 20 ? 128 * 1024 : bandwidth.download > 5 ? 64 * 1024 : 32 * 1024,
      maxConnections: bandwidth.download > 50 ? 12 : bandwidth.download > 20 ? 8 : 4,
      compressionLevel: bandwidth.download < 5 ? 9 : bandwidth.download < 20 ? 7 : 5
    };
  }

  /**
   * Check if feature is supported in current environment
   */
  isFeatureSupported(feature: keyof LocalEnvironment['deviceCapabilities'] | keyof LocalEnvironment['browserSupport']): boolean {
    if (!this.environment) return false;
    
    return this.environment.deviceCapabilities[feature as keyof LocalEnvironment['deviceCapabilities']] ||
           this.environment.browserSupport[feature as keyof LocalEnvironment['browserSupport']] ||
           false;
  }

  /**
   * Register callback for environment changes
   */
  onEnvironmentChanged(callback: (env: LocalEnvironment) => void) {
    this.onEnvironmentChange = callback;
  }

  /**
   * Get current environment
   */
  getCurrentEnvironment(): LocalEnvironment | null {
    return this.environment;
  }

  /**
   * Cleanup monitoring
   */
  cleanup() {
    if (this.networkMonitor) {
      clearInterval(this.networkMonitor);
    }
  }
}