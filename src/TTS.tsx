import { useState } from 'react';
import { Volume2, VolumeX, Loader2 } from 'lucide-react';
import { cn } from './lib/utils';

export function useTTS() {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ko-KR';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } else {
      console.error('TTS is not supported in this browser.');
    }
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return { speak, stop, isSpeaking };
}

interface TTSButtonProps {
  text: string;
  className?: string;
}

export function TTSButton({ text, className }: TTSButtonProps) {
  const { speak, stop, isSpeaking } = useTTS();

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        isSpeaking ? stop() : speak(text);
      }}
      className={cn(
        "p-2 rounded-full transition-all duration-200",
        isSpeaking ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600 hover:bg-gray-200",
        className
      )}
      title={isSpeaking ? "중지" : "음성으로 듣기"}
    >
      {isSpeaking ? <VolumeX size={18} /> : <Volume2 size={18} />}
    </button>
  );
}
