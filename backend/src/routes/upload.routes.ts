import { Router, Request, Response } from 'express';
import multer from 'multer';
import { uploadService } from '../services/upload.service';
import { optionalAuth, AuthRequest } from '../middleware/auth.middleware';

const router = Router();

// =====================================================
// MULTER CONFIGURATION
// =====================================================

// Use memory storage (files stored in buffer)
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max
  },
});

// =====================================================
// UPLOAD ROUTES
// =====================================================

// POST /api/upload/bom - Upload BOM file (Excel/CSV)
router.post('/bom', optionalAuth, upload.single('file'), async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Nu a fost furnizat niciun fișier',
      });
    }

    // Validate file
    const validation = uploadService.validateBOMFile(req.file);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: validation.error,
      });
    }

    // Upload file
    const userId = req.user?.id;
    const result = await uploadService.uploadBOM(req.file, userId);

    res.status(201).json({
      success: true,
      message: 'Fișier BOM încărcat cu succes',
      data: result,
    });
  } catch (error) {
    console.error('BOM upload error:', error);
    res.status(500).json({
      success: false,
      error: 'Eroare la încărcarea fișierului',
    });
  }
});

// POST /api/upload/attachment - Upload RFQ attachment
router.post('/attachment', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Nu a fost furnizat niciun fișier',
      });
    }

    const { rfqId } = req.body;
    if (!rfqId) {
      return res.status(400).json({
        success: false,
        error: 'rfqId este necesar',
      });
    }

    // Validate file
    const validation = uploadService.validateAttachment(req.file);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: validation.error,
      });
    }

    // Upload file
    const result = await uploadService.uploadAttachment(req.file, rfqId);

    res.status(201).json({
      success: true,
      message: 'Atașament încărcat cu succes',
      data: result,
    });
  } catch (error) {
    console.error('Attachment upload error:', error);
    res.status(500).json({
      success: false,
      error: 'Eroare la încărcarea atașamentului',
    });
  }
});

export default router;
