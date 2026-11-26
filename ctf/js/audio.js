/**
 * CyberCTF - Web Audio Synthesizer
 * Pure Web Audio API synthesized sound effects - zero external audio assets needed!
 */
(function(window) {
  'use strict';

  let ctx = null;
  let soundEnabled = true;

  try {
    const saved = localStorage.getItem('cyberctf_sound');
    soundEnabled = saved !== null ? JSON.parse(saved) : true;
  } catch(e) {
    soundEnabled = true;
  }

  function getAudioContext() {
    if (!ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        ctx = new AudioCtx();
      }
    }
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    return ctx;
  }

  // Ensure AudioContext resumes on first click/keypress
  const initUserGesture = () => {
    getAudioContext();
    window.removeEventListener('click', initUserGesture);
    window.removeEventListener('keydown', initUserGesture);
  };
  window.addEventListener('click', initUserGesture, { once: true });
  window.addEventListener('keydown', initUserGesture, { once: true });

  const SoundEngine = {
    isEnabled: () => soundEnabled,
    
    toggle: function(forced) {
      soundEnabled = typeof forced === 'boolean' ? forced : !soundEnabled;
      try {
        localStorage.setItem('cyberctf_sound', JSON.stringify(soundEnabled));
      } catch(e) {}
      return soundEnabled;
    },

    playTone: function(freq, type = 'sine', duration = 0.1, gainVal = 0.1, delay = 0) {
      if (!soundEnabled) return;
      const c = getAudioContext();
      if (!c) return;

      setTimeout(() => {
        try {
          const osc = c.createOscillator();
          const gain = c.createGain();
          osc.type = type;
          osc.frequency.setValueAtTime(freq, c.currentTime);

          gain.gain.setValueAtTime(gainVal, c.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + duration);

          osc.connect(gain);
          gain.connect(c.destination);

          osc.start();
          osc.stop(c.currentTime + duration);
        } catch(e) {}
      }, delay * 1000);
    },

    click: function() {
      this.playTone(800, 'triangle', 0.04, 0.04);
    },

    beep: function() {
      this.playTone(1050, 'sine', 0.06, 0.08);
    },

    success: function() {
      if (!soundEnabled) return;
      // High-energy ascending cyber fanfare: C5, E5, G5, C6
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        this.playTone(freq, 'sine', 0.22, 0.15, idx * 0.08);
      });
      setTimeout(() => {
        this.playTone(1318.51, 'triangle', 0.35, 0.1, 0.32); // E6 sparkle
      }, 50);
    },

    error: function() {
      if (!soundEnabled) return;
      // Low buzz tone
      this.playTone(180, 'sawtooth', 0.15, 0.12, 0);
      this.playTone(130, 'sawtooth', 0.25, 0.14, 0.08);
    },

    levelUp: function() {
      if (!soundEnabled) return;
      // Futuristic ascending chime
      const notes = [440, 554.37, 659.25, 880, 1108.73, 1318.51];
      notes.forEach((freq, i) => {
        this.playTone(freq, 'sine', 0.28, 0.12, i * 0.06);
      });
    },

    hint: function() {
      this.playTone(600, 'sine', 0.1, 0.08, 0);
      this.playTone(900, 'sine', 0.15, 0.08, 0.08);
    }
  };

  window.SoundEngine = SoundEngine;
})(window);
