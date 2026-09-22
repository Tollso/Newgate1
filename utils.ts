export const playBeep = (type: 'success' | 'error' = 'success') => {
    try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        if (type === 'success') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
            osc.frequency.setValueAtTime(1760, ctx.currentTime + 0.08); // A6
            
            gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
            gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.15);
            
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.15);
        } else {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(250, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.25);
            
            gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
            gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.25);
            
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.25);
        }
    } catch (e) {
        console.error('Audio play failed', e);
    }
};
