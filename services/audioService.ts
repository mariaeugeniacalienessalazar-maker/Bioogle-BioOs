
/**
 * BIOSONIC ENGINE v1.0
 * Generates real-time synthetic UI sounds using Web Audio API.
 * No external files required. Pure mathematical sound generation.
 */

class AudioService {
    private ctx: AudioContext | null = null;
    private enabled: boolean = true;
    private initialized: boolean = false;
  
    constructor() {
      // Initialize on first user interaction usually, but we prep here
    }
  
    private init() {
      if (!this.initialized) {
        try {
          this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
          this.initialized = true;
        } catch (e) {
          console.error("BioSonic Audio Error: API not supported");
        }
      }
      if (this.ctx?.state === 'suspended') {
        this.ctx.resume();
      }
    }
  
    public setEnabled(on: boolean) {
      this.enabled = on;
    }
  
    private createOscillator(freq: number, type: OscillatorType, duration: number, startTime: number = 0, vol: number = 0.1) {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + startTime);
      
      // Envelope
      gain.gain.setValueAtTime(vol, this.ctx.currentTime + startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + startTime + duration);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(this.ctx.currentTime + startTime);
      osc.stop(this.ctx.currentTime + startTime + duration);
    }
  
    // --- UI SOUNDS ---
  
    public playClick() {
      // Short, high-tech blip
      this.createOscillator(1200, 'sine', 0.05, 0, 0.05);
    }
  
    public playHover() {
      // Very subtle high frequency ping
      this.createOscillator(2000, 'sine', 0.03, 0, 0.01);
    }
  
    public playSuccess() {
      // Ascending major triad (futuristic chime)
      const now = 0;
      this.createOscillator(523.25, 'sine', 0.4, now, 0.1);     // C5
      this.createOscillator(659.25, 'sine', 0.4, now + 0.1, 0.1); // E5
      this.createOscillator(783.99, 'sine', 0.6, now + 0.2, 0.1); // G5
      this.createOscillator(1046.50, 'sine', 0.8, now + 0.3, 0.05); // C6
    }
  
    public playError() {
      // Low buzz
      this.createOscillator(150, 'sawtooth', 0.3, 0, 0.1);
      this.createOscillator(140, 'sawtooth', 0.3, 0.1, 0.1);
    }
  
    public playTyping() {
      // Mechanical soft click
      this.createOscillator(800, 'triangle', 0.03, 0, 0.02);
    }
  
    public playScan() {
      // Sci-fi scanner hum
      if (!this.enabled || !this.ctx) return;
      this.init();
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      
      osc.type = 'square';
      osc.frequency.setValueAtTime(100, this.ctx!.currentTime);
      osc.frequency.linearRampToValueAtTime(800, this.ctx!.currentTime + 1.5);
      
      gain.gain.setValueAtTime(0.05, this.ctx!.currentTime);
      gain.gain.linearRampToValueAtTime(0, this.ctx!.currentTime + 1.5);
      
      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start();
      osc.stop(this.ctx!.currentTime + 1.5);
    }
  }
  
  export const bioAudio = new AudioService();
