import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Paperclip,
  Upload,
  X,
  FileText,
  File,
  Image,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import type { RFQAttachment } from '@/types/rfq';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/csv',
  'image/jpeg',
  'image/png',
  'image/jpg',
];

const FILE_TYPE_LABELS: Record<string, string> = {
  'application/pdf': 'PDF',
  'application/vnd.ms-excel': 'Excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'Excel',
  'text/csv': 'CSV',
  'image/jpeg': 'Imagine',
  'image/png': 'Imagine',
  'image/jpg': 'Imagine',
};

interface AttachmentsStepProps {
  initialData?: {
    attachments: RFQAttachment[];
    notes?: string;
  };
  onNext: (data: { attachments: RFQAttachment[]; notes?: string }) => void;
  onBack: () => void;
}

const AttachmentsStep: React.FC<AttachmentsStepProps> = ({ initialData, onNext, onBack }) => {
  const [attachments, setAttachments] = useState<RFQAttachment[]>(initialData?.attachments || []);
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileType = (mimeType: string): RFQAttachment['type'] => {
    if (mimeType.includes('csv')) return 'csv';
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return 'xlsx';
    if (mimeType.includes('pdf')) return 'pdf';
    if (mimeType.includes('image')) return 'image';
    return 'other';
  };

  const getFileIcon = (type: RFQAttachment['type']) => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-5 w-5 text-red-600" />;
      case 'csv':
      case 'xlsx':
        return <File className="h-5 w-5 text-green-600" />;
      case 'image':
        return <Image className="h-5 w-5 text-blue-600" />;
      default:
        return <File className="h-5 w-5 text-gray-600" />;
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return `Fișierul "${file.name}" este prea mare (maxim 10MB)`;
    }

    // Check file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return `Tipul fișierului "${file.name}" nu este permis`;
    }

    return null;
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const newErrors: string[] = [];
    const newAttachments: RFQAttachment[] = [];

    Array.from(files).forEach((file) => {
      const error = validateFile(file);
      if (error) {
        newErrors.push(error);
        return;
      }

      const attachment: RFQAttachment = {
        id: `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        name: file.name,
        type: getFileType(file.type),
        file,
        size: file.size,
        uploadedAt: new Date().toISOString(),
      };

      newAttachments.push(attachment);
    });

    setUploadErrors(newErrors);
    setAttachments((prev) => [...prev, ...newAttachments]);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((att) => att.id !== id));
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();

    const files = event.dataTransfer.files;
    if (!files || files.length === 0) return;

    // Trigger the same validation logic
    const changeEvent = {
      target: { files },
    } as React.ChangeEvent<HTMLInputElement>;

    handleFileSelect(changeEvent);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({
      attachments,
      notes: notes.trim() || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Paperclip className="h-5 w-5" />
            Atașamente & Notițe
          </CardTitle>
          <CardDescription>
            Încărcați fișiere relevante pentru cererea dumneavoastră: liste BOM, desene tehnice,
            specificații, sau alte documente.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* File Upload Area */}
          <div className="space-y-2">
            <Label>Fișiere (opțional)</Label>
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm font-medium mb-1">
                Clic pentru a încărca sau drag & drop fișiere
              </p>
              <p className="text-xs text-muted-foreground mb-3">
                CSV, XLSX, PDF, JPG, PNG (maxim 10MB per fișier)
              </p>
              <Button type="button" variant="outline" size="sm">
                Selectează Fișiere
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".csv,.xlsx,.xls,.pdf,.jpg,.jpeg,.png"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          </div>

          {/* Upload Errors */}
          {uploadErrors.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Erori la încărcare:</strong>
                <ul className="list-disc list-inside mt-1 text-sm">
                  {uploadErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Uploaded Files List */}
          {attachments.length > 0 && (
            <div className="space-y-2">
              <Label>Fișiere încărcate ({attachments.length})</Label>
              <div className="space-y-2">
                {attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {getFileIcon(attachment.type)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{attachment.name}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Badge variant="outline" className="text-xs">
                            {FILE_TYPE_LABELS[attachment.file?.type || ''] || attachment.type.toUpperCase()}
                          </Badge>
                          {attachment.size && <span>{formatFileSize(attachment.size)}</span>}
                        </div>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveAttachment(attachment.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800 text-sm">
                  Fișierele vor fi atașate cererii dumneavoastră de ofertă.
                </AlertDescription>
              </Alert>
            </div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notițe Adiționale (opțional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Adăugați orice informații suplimentare care ar putea fi relevante pentru ofertă..."
              rows={5}
              maxLength={2000}
            />
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span>Notițe, instrucțiuni speciale, sau alte detalii</span>
              <span>{notes.length} / 2000 caractere</span>
            </div>
          </div>

          {/* Helpful Tips */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong className="block mb-1">Ce documente pot fi utile:</strong>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>Liste BOM (Bill of Materials) în format CSV sau Excel</li>
                <li>Desene tehnice sau planuri</li>
                <li>Specificații tehnice detaliate</li>
                <li>Certificate sau agremente necesare</li>
                <li>Comenzi anterioare sau referințe</li>
              </ul>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          Înapoi
        </Button>
        <Button type="submit">Continuă la Verificare</Button>
      </div>
    </form>
  );
};

export default AttachmentsStep;
