import React, { useState, useRef } from 'react';
import { Mic, Square, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface VoiceRecorderProps {
  onAudioReady: (audio: { data: string; mimeType: string }) => void;
  disabled?: boolean;
}

export function VoiceRecorder({ onAudioReady, disabled }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64data = reader.result as string;
          const [mimeInfo, data] = base64data.split(',');
          const mimeType = mimeInfo.split(':')[1].split(';')[0];
          onAudioReady({ data, mimeType });
        };
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <AnimatePresence mode="wait">
        {!isRecording ? (
          <motion.button
            key="start"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={startRecording}
            disabled={disabled}
            className="p-3 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Start Recording"
            aria-label="Start voice recording"
          >
            <Mic className="w-5 h-5" aria-hidden="true" />
          </motion.button>
        ) : (
          <motion.button
            key="stop"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={stopRecording}
            className="p-3 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors relative"
            title="Stop Recording"
            aria-label="Stop voice recording"
          >
            <Square className="w-5 h-5" aria-hidden="true" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full animate-ping" aria-hidden="true" />
          </motion.button>
        )}
      </AnimatePresence>
      {isRecording && (
        <span 
          className="text-sm font-medium text-red-600 animate-pulse"
          role="status"
          aria-live="polite"
        >
          Recording...
        </span>
      )}
    </div>
  );
}
