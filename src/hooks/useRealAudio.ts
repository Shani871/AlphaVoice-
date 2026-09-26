import { useState, useRef, useEffect, useCallback } from 'react';
import { AudioLevels } from '../types';

export function useRealAudio() {
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [levels, setLevels] = useState<AudioLevels>({
    bass: 0,
    mid: 0,
    treble: 0,
    overall: 0,
  });

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const startLiveAudio = useCallback(async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.8;
      source.connect(analyser);
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const update = () => {
        analyser.getByteFrequencyData(dataArray);

        // bass: indices 0-8 (~0-350Hz)
        let bassSum = 0;
        for (let i = 0; i < 8; i++) bassSum += dataArray[i];
        const bass = Math.min(1, bassSum / (8 * 255) * 1.5);

        // mid: indices 8-32 (~350-2500Hz)
        let midSum = 0;
        for (let i = 8; i < 32; i++) midSum += dataArray[i];
        const mid = Math.min(1, midSum / (24 * 255) * 1.6);

        // treble: indices 32-128 (>2500Hz)
        let trebleSum = 0;
        for (let i = 32; i < 128; i++) trebleSum += dataArray[i];
        const treble = Math.min(1, trebleSum / (96 * 255) * 2.0);

        const overall = Math.min(1, (bass * 0.4 + mid * 0.4 + treble * 0.2));

        setLevels({ bass, mid, treble, overall });
        animFrameRef.current = requestAnimationFrame(update);
      };

      update();
      setIsActive(true);
    } catch (err: unknown) {
      console.warn('Microphone access denied or error:', err);
      setError('Microphone access unavailable. Using simulated audio stream.');
      setIsActive(false);
    }
  }, []);

  const stopLiveAudio = useCallback(() => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
    }
    setIsActive(false);
    setLevels({ bass: 0, mid: 0, treble: 0, overall: 0 });
  }, []);

  useEffect(() => {
    return () => {
      stopLiveAudio();
    };
  }, [stopLiveAudio]);

  return {
    isActive,
    error,
    clearError: () => setError(null),
    levels,
    startLiveAudio,
    stopLiveAudio,
  };
}
