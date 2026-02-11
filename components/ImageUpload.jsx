"use client";

import { useState, useRef } from "react";
import { FaUpload, FaImage, FaTrash, FaSpinner } from "react-icons/fa";

export default function ImageUpload({ 
  value, 
  onChange, 
  label = "Upload Image",
  folder = "trekking-adventure",
  className = "",
  multiple = false,
  maxImages = 1
}) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(multiple ? [] : value || "");
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    
    if (multiple) {
      if (files.length + preview.length > maxImages) {
        alert(`Maximum ${maxImages} images allowed`);
        return;
      }
    } else if (files.length > 1) {
      alert("Only one image allowed");
      return;
    }

    setUploading(true);

    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', folder);
        formData.append('upload_preset', 'trekking_preset'); // Create this in Cloudinary dashboard

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/ddizjvtbx/image/upload`,
          {
            method: 'POST',
            body: formData,
          }
        );

        const data = await response.json();
        
        if (data.secure_url) {
          return data.secure_url;
        } else {
          throw new Error(data.error?.message || 'Upload failed');
        }
      });

      const uploadedUrls = await Promise.all(uploadPromises);

      if (multiple) {
        const newPreview = [...preview, ...uploadedUrls];
        setPreview(newPreview);
        onChange(newPreview);
      } else {
        const newPreview = uploadedUrls[0];
        setPreview(newPreview);
        onChange(newPreview);
      }

    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image: ' + error.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = (index) => {
    if (multiple) {
      const newPreview = preview.filter((_, i) => i !== index);
      setPreview(newPreview);
      onChange(newPreview);
    } else {
      setPreview("");
      onChange("");
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Upload button */}
      <button
        type="button"
        onClick={openFileDialog}
        disabled={uploading || (multiple && preview.length >= maxImages)}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
      >
        {uploading ? (
          <>
            <FaSpinner className="animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <FaUpload />
            {multiple ? `Upload Images (${preview.length}/${maxImages})` : "Upload Image"}
          </>
        )}
      </button>

      {/* Preview */}
      <div className="space-y-2">
        {multiple ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {preview.map((url, index) => (
              <div key={index} className="relative group">
                <img
                  src={url}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg border"
                />
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                >
                  <FaTrash size={12} />
                </button>
              </div>
            ))}
          </div>
        ) : preview ? (
          <div className="relative group">
            <img
              src={preview}
              alt="Upload preview"
              className="w-full h-48 object-cover rounded-lg border"
            />
            <button
              type="button"
              onClick={() => handleRemove(0)}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
            >
              <FaTrash size={12} />
            </button>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <FaImage className="mx-auto text-4xl text-gray-400 mb-2" />
            <p className="text-gray-500">No image uploaded</p>
          </div>
        )}
      </div>

      {/* Hidden input for form submission */}
      <input
        type="hidden"
        name={label.toLowerCase().replace(/\s+/g, '_')}
        value={multiple ? preview.join(',') : preview}
        onChange={() => {}}
      />
    </div>
  );
}
