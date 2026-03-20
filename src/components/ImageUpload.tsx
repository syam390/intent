import React, { useRef } from 'react';
import { Image as ImageIcon, Upload } from 'lucide-react';

interface ImageUploadProps {
  onImageReady: (image: { data: string; mimeType: string }) => void;
  disabled?: boolean;
}

export function ImageUpload({ onImageReady, disabled }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result as string;
        const [mimeInfo, data] = base64data.split(',');
        const mimeType = mimeInfo.split(':')[1].split(';')[0];
        onImageReady({ data, mimeType });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        disabled={disabled}
        aria-label="Upload image file"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={disabled}
        className="p-3 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        title="Upload Image"
        aria-label="Select image to upload"
      >
        <ImageIcon className="w-5 h-5" aria-hidden="true" />
      </button>
    </div>
  );
}
