import React, { useState, useCallback } from 'react';
import { UploadIcon } from './Icons';

interface ImageUploadProps {
  onImageSelect: (file: File | null) => void;
  imagePreviewUrl: string | null;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelect, imagePreviewUrl }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (files: FileList | null) => {
    if (files && files.length > 0) {
      onImageSelect(files[0]);
    }
  };

  const onDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);
  
  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  }, []);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">Upload Image</label>
      <div 
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
        className={`relative group flex justify-center items-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${isDragging ? 'border-indigo-500 bg-gray-700' : 'border-gray-600 bg-gray-800 hover:border-gray-500'}`}
      >
        {imagePreviewUrl ? (
          <>
            <img src={imagePreviewUrl} alt="Preview" className="h-full w-full object-contain rounded-lg" />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-white font-semibold">Change Image</span>
            </div>
          </>
        ) : (
          <div className="text-center text-gray-500">
            <UploadIcon />
            <p className="mt-2">Drag & drop an image here</p>
            <p className="text-xs">or click to select a file</p>
          </div>
        )}
        <input 
          type="file" 
          accept="image/png, image/jpeg"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
          onChange={(e) => handleFileChange(e.target.files)} 
        />
      </div>
    </div>
  );
};
