'use client';

import { useState } from 'react';
import api from '@/services/api';

interface FileUploadProps {
  onUploadComplete?: (fileUrl: string) => void;
  orderId?: number;
  itemId?: number;
  buttonText?: string;
}

export default function FileUpload({ onUploadComplete, orderId, itemId, buttonText = 'Upload Image' }: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (jpg, png, gif, webp)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      let url = '/upload/screenshot';
      if (orderId) {
        url += `/${orderId}`;
        if (itemId) {
          url += `/${itemId}`;
        }
      }

      const response = await api.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (onUploadComplete) {
        onUploadComplete(response.data.fileUrl);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div>
      <label className="block">
        <span className="text-sm text-gray-600">{buttonText}</span>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </label>
      {uploading && <p className="text-sm text-blue-600 mt-1">Uploading...</p>}
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
}