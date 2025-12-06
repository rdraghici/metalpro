import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Upload, X, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProductImageUploadProps {
  productId: string;
  productSku: string;
  images: string[];
  primaryImage: string | null;
  onImagesChange: (images: string[], primaryImage: string | null) => void;
  disabled?: boolean;
}

export default function ProductImageUpload({
  productId,
  productSku,
  images,
  primaryImage,
  onImagesChange,
  disabled = false,
}: ProductImageUploadProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0 || disabled) return;

    const file = files[0];

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload an image file (JPEG, PNG, WebP)',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Image must be less than 5MB',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`http://localhost:3001/api/backoffice/products/${productId}/images`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('backoffice_token')}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const result = await response.json();

      if (result.success) {
        // Fetch updated product to get the new images
        const productResponse = await fetch(`http://localhost:3001/api/backoffice/products/${productId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('backoffice_token')}`,
          },
        });

        if (productResponse.ok) {
          const productData = await productResponse.json();
          const updatedImages = productData.imageUrls || [];
          const updatedPrimaryImage = productData.imageUrl || null;

          onImagesChange(updatedImages, updatedPrimaryImage);

          toast({
            title: 'Success',
            description: 'Image uploaded successfully',
          });
        }
      }
    } catch (error: any) {
      toast({
        title: 'Upload failed',
        description: error.message || 'Failed to upload image',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeleteImage = async (imageUrl: string) => {
    if (disabled) return;

    try {
      const filename = imageUrl.split('/').pop();
      if (!filename) throw new Error('Invalid image URL');

      const response = await fetch(
        `http://localhost:3001/api/backoffice/products/${productId}/images/${filename}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('backoffice_token')}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete image');
      }

      const result = await response.json();

      if (result.success) {
        // Update local state
        const updatedImages = images.filter(img => img !== imageUrl);
        let updatedPrimaryImage = primaryImage;

        // If deleted image was primary, set new primary
        if (primaryImage === imageUrl) {
          updatedPrimaryImage = updatedImages[0] || null;
        }

        onImagesChange(updatedImages, updatedPrimaryImage);

        toast({
          title: 'Success',
          description: 'Image deleted successfully',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Delete failed',
        description: error.message || 'Failed to delete image',
        variant: 'destructive',
      });
    }
  };

  const handleSetPrimary = async (imageUrl: string) => {
    if (disabled) return;

    try {
      const response = await fetch(
        `http://localhost:3001/api/backoffice/products/${productId}/images/primary`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('backoffice_token')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ imageUrl }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to set primary image');
      }

      const result = await response.json();

      if (result.success) {
        onImagesChange(images, imageUrl);

        toast({
          title: 'Success',
          description: 'Primary image updated',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Update failed',
        description: error.message || 'Failed to set primary image',
        variant: 'destructive',
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (!disabled) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Product Images</Label>
        <p className="text-sm text-gray-500 mt-1">
          Upload product images. First image will be used as the primary image.
        </p>
      </div>

      {/* Upload area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragOver
            ? 'border-primary bg-primary/5'
            : 'border-gray-300'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-primary'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFileSelect(e.target.files)}
          disabled={disabled || isUploading}
        />
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          {isUploading ? 'Uploading...' : 'Drop image here or click to browse'}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          JPEG, PNG, or WebP - Max 5MB
        </p>
      </div>

      {/* Image gallery */}
      {images && images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((imageUrl, index) => (
            <Card key={imageUrl} className="relative group">
              <CardContent className="p-2">
                <div className="relative aspect-square">
                  <img
                    src={imageUrl}
                    alt={`Product ${index + 1}`}
                    className="w-full h-full object-cover rounded"
                  />

                  {/* Primary badge */}
                  {primaryImage === imageUrl && (
                    <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                      <Star className="h-3 w-3 fill-current" />
                      Primary
                    </div>
                  )}

                  {/* Action buttons */}
                  {!disabled && (
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {primaryImage !== imageUrl && (
                        <Button
                          type="button"
                          size="sm"
                          variant="secondary"
                          className="h-8 w-8 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSetPrimary(imageUrl);
                          }}
                          title="Set as primary"
                        >
                          <Star className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        className="h-8 w-8 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteImage(imageUrl);
                        }}
                        title="Delete image"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {images && images.length === 0 && (
        <p className="text-sm text-gray-500 text-center py-4">
          No images uploaded yet
        </p>
      )}
    </div>
  );
}
