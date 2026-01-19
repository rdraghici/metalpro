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
import { useTranslation } from '@/hooks/useTranslation';
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
  const { t } = useTranslation();
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
      return t('rfq.file_too_large').replace('{{name}}', file.name);
    }

    // Check file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return t('rfq.file_type_not_allowed').replace('{{name}}', file.name);
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
            {t('rfq.attachments_title')}
          </CardTitle>
          <CardDescription>
            {t('rfq.attachments_description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* File Upload Area */}
          <div className="space-y-2">
            <Label>{t('rfq.files_optional')}</Label>
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm font-medium mb-1">
                {t('rfq.upload_click')}
              </p>
              <p className="text-xs text-muted-foreground mb-3">
                {t('rfq.upload_formats')}
              </p>
              <Button type="button" variant="outline" size="sm">
                {t('rfq.select_files')}
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
                <strong>{t('rfq.upload_errors')}:</strong>
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
              <Label>{t('rfq.uploaded_files')} ({attachments.length})</Label>
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
                  {t('rfq.files_will_be_attached')}
                </AlertDescription>
              </Alert>
            </div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">{t('rfq.additional_notes')}</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t('rfq.notes_placeholder')}
              rows={5}
              maxLength={2000}
            />
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span>{t('rfq.notes_hint')}</span>
              <span>{notes.length} / 2000 {t('rfq.characters')}</span>
            </div>
          </div>

          {/* Helpful Tips */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong className="block mb-1">{t('rfq.useful_documents')}</strong>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>{t('rfq.doc_bom')}</li>
                <li>{t('rfq.doc_drawings')}</li>
                <li>{t('rfq.doc_specs')}</li>
                <li>{t('rfq.doc_certificates')}</li>
                <li>{t('rfq.doc_references')}</li>
              </ul>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          {t('rfq.back')}
        </Button>
        <Button type="submit">{t('rfq.continue_to_review')}</Button>
      </div>
    </form>
  );
};

export default AttachmentsStep;
