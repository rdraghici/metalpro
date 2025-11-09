import { useCallback, useState } from 'react';
import { Upload, FileText, AlertCircle, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

interface UploadDropzoneProps {
  onFileSelected: (file: File) => void;
  acceptedTypes?: string[];
  maxSizeMB?: number;
  disabled?: boolean;
}

const UploadDropzone: React.FC<UploadDropzoneProps> = ({
  onFileSelected,
  acceptedTypes = ['.csv', '.xlsx', '.xls'],
  maxSizeMB = 10,
  disabled = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const validateFile = useCallback(
    (file: File): string | null => {
      // Check file type
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      if (!acceptedTypes.includes(fileExtension)) {
        return `Tipul fișierului nu este acceptat. Acceptăm: ${acceptedTypes.join(', ')}`;
      }

      // Check file size
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > maxSizeMB) {
        return `Fișierul este prea mare. Mărimea maximă: ${maxSizeMB}MB`;
      }

      return null;
    },
    [acceptedTypes, maxSizeMB]
  );

  const handleFile = useCallback(
    (file: File) => {
      setError(null);

      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }

      setSelectedFile(file);
      onFileSelected(file);
    },
    [validateFile, onFileSelected]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (disabled) return;

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFile(files[0]);
      }
    },
    [disabled, handleFile]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFile(files[0]);
      }
    },
    [handleFile]
  );

  const handleClearFile = useCallback(() => {
    setSelectedFile(null);
    setError(null);
  }, []);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-4">
      <Card
        className={cn(
          'border-2 border-dashed transition-colors',
          isDragging && !disabled && 'border-primary bg-primary/5',
          disabled && 'opacity-50 cursor-not-allowed',
          !disabled && 'hover:border-primary/50 cursor-pointer'
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <CardContent className="p-8">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div
              className={cn(
                'w-16 h-16 rounded-full flex items-center justify-center transition-colors',
                isDragging ? 'bg-primary/20' : 'bg-muted'
              )}
            >
              <Upload
                className={cn('h-8 w-8', isDragging ? 'text-primary' : 'text-muted-foreground')}
              />
            </div>

            <div className="space-y-2">
              <p className="text-lg font-semibold">
                Trageți fișierul BOM aici sau faceți clic pentru a selecta
              </p>
              <p className="text-sm text-muted-foreground">
                Format acceptat: {acceptedTypes.join(', ')} • Mărime maximă: {maxSizeMB}MB
              </p>
            </div>

            <input
              type="file"
              id="bom-file-input"
              className="hidden"
              accept={acceptedTypes.join(',')}
              onChange={handleFileInput}
              disabled={disabled}
            />

            <Button asChild variant="outline" disabled={disabled}>
              <label htmlFor="bom-file-input" className="cursor-pointer">
                Selectează Fișier
              </label>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Selected File Preview */}
      {selectedFile && !error && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-900">{selectedFile.name}</p>
                  <p className="text-sm text-green-700">{formatFileSize(selectedFile.size)}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={handleClearFile}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Message */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default UploadDropzone;
