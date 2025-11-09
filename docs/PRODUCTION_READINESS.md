# Production Readiness Guide
# MetalPro B2B E-Commerce Platform

**Document Version:** 1.0
**Last Updated:** 2025-01-09
**Status:** Planned - To be implemented after Phases 2-5, 7-9

---

## Executive Summary

This document outlines the complete production infrastructure implementation for MetalPro. The current application uses localStorage and mock APIs for prototyping. This phase will replace all mock implementations with production-ready backend infrastructure including PostgreSQL database, AWS cloud services, email delivery, and secure authentication.

## Implementation Strategy

### Chosen Infrastructure Decisions

Based on business requirements and scalability needs, the following decisions have been made:

**Infrastructure Hosting:**
- ✅ **Cloud (AWS)** - Full AWS stack for scalability and reliability
  - **S3** for file storage (BOM uploads, RFQ attachments)
  - **RDS PostgreSQL** for relational database
  - **ElastiCache Redis** for caching and session management
  - **Route 53** for DNS management
  - **CloudFront** for CDN (static assets)
  - **EC2/ECS** for application hosting

**Implementation Approach:**
- ✅ **Option B: Phased Rollout** - Incremental migration strategy
  - **Phase 6C.1:** Backend API + Database + Authentication (Weeks 1-2)
  - **Phase 6C.2:** File Upload & S3 Integration (Week 3)
  - **Phase 6C.3:** Email Service Integration (Week 4)
  - **Phase 6C.4:** Security Hardening & Deployment (Weeks 5-6)

**Email Service:**
- ✅ **SendGrid** - Recommended for reliability and deliverability
  - RFQ confirmation emails
  - Operator notifications
  - Email verification
  - Password reset
  - Quote delivery

### Implementation Timeline

**Total Duration:** 4-6 weeks
**Priority:** CRITICAL - Required before production launch
**Scheduled After:** Phases 2-5, 7-9 (Frontend completion)

---

## Phase 6C.1: Backend API Setup
**Duration:** Weeks 1-2

### Tech Stack

| Component | Technology | Version |
|-----------|------------|---------|
| Runtime | Node.js | 20 LTS |
| Framework | Express.js with TypeScript | 4.x |
| ORM | Prisma | 5.x |
| Database | PostgreSQL | 15+ |
| Cache | Redis | 7+ |
| Validation | Zod | Shared with frontend |

### File Structure

```
backend/
├── src/
│   ├── routes/
│   │   ├── auth.routes.ts        # Authentication endpoints
│   │   ├── users.routes.ts       # User management
│   │   ├── products.routes.ts    # Product catalog API
│   │   ├── cart.routes.ts        # Cart operations
│   │   ├── rfq.routes.ts         # RFQ submission & tracking
│   │   ├── projects.routes.ts    # Saved BOM projects
│   │   ├── addresses.routes.ts   # Saved addresses
│   │   └── upload.routes.ts      # File uploads (BOM, attachments)
│   ├── controllers/
│   ├── services/
│   ├── middleware/
│   │   ├── auth.middleware.ts    # JWT validation
│   │   ├── rateLimit.middleware.ts
│   │   └── validation.middleware.ts
│   ├── utils/
│   ├── config/
│   └── index.ts
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── tests/
├── Dockerfile
└── docker-compose.yml
```

### API Endpoints

#### Authentication
```typescript
POST   /api/auth/signup           # Create account
POST   /api/auth/login            # Login with email/password
POST   /api/auth/logout           # Invalidate session
POST   /api/auth/refresh          # Refresh JWT token
POST   /api/auth/reset-password   # Request password reset
POST   /api/auth/verify-email     # Email verification
```

#### Users & Profiles
```typescript
GET    /api/users/me              # Get current user profile
PATCH  /api/users/me              # Update profile
PATCH  /api/users/me/password     # Change password
PATCH  /api/users/me/company      # Update company info
```

#### Products (Public - No Auth Required)
```typescript
GET    /api/products              # List products with filters
GET    /api/products/:id          # Get product details
GET    /api/categories            # List categories
```

#### Cart (Guest + Authenticated)
```typescript
GET    /api/cart                  # Get cart (session-based for guests)
POST   /api/cart/items            # Add item to cart
PATCH  /api/cart/items/:id        # Update cart item
DELETE /api/cart/items/:id        # Remove cart item
DELETE /api/cart                  # Clear cart
```

#### RFQ (Guest + Authenticated)
```typescript
POST   /api/rfq                   # Submit RFQ
GET    /api/rfq/:id               # Get RFQ details
GET    /api/rfq                   # List user's RFQs (auth required)
```

#### Projects (Authenticated Only)
```typescript
GET    /api/projects              # List saved BOM projects
POST   /api/projects              # Create project
GET    /api/projects/:id          # Get project details
PATCH  /api/projects/:id          # Update project
DELETE /api/projects/:id          # Delete project
```

#### Addresses (Authenticated Only)
```typescript
GET    /api/addresses             # List saved addresses
POST   /api/addresses             # Create address
PATCH  /api/addresses/:id         # Update address
DELETE /api/addresses/:id         # Delete address
```

#### File Uploads
```typescript
POST   /api/upload/bom            # Upload BOM file
POST   /api/upload/attachment     # Upload RFQ attachment
```

---

## Phase 6C.2: Database Schema & Migration

### Prisma Schema

**File:** `backend/prisma/schema.prisma`

```prisma
// Users & Authentication
model User {
  id            String    @id @default(uuid())
  email         String    @unique
  passwordHash  String
  name          String
  phone         String?
  role          UserRole  @default(BUSINESS)
  emailVerified Boolean   @default(false)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  company       Company?
  addresses     Address[]
  projects      Project[]
  rfqs          RFQ[]
  sessions      Session[]

  @@index([email])
}

enum UserRole {
  INDIVIDUAL
  BUSINESS
}

model Company {
  id          String   @id @default(uuid())
  userId      String   @unique
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  legalName   String
  cui         String?
  address     String?
  city        String?
  county      String?
  postalCode  String?
  country     String   @default("Romania")

  isVerified  Boolean  @default(false)
  verifiedAt  DateTime?

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([cui])
}

model Session {
  id           String   @id @default(uuid())
  userId       String
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  token        String   @unique
  refreshToken String?  @unique
  expiresAt    DateTime
  ipAddress    String?
  userAgent    String?

  createdAt    DateTime @default(now())

  @@index([token])
  @@index([userId])
}

// Products & Catalog
model Category {
  id          String    @id @default(uuid())
  slug        String    @unique
  name        String
  nameEn      String?
  description String?
  icon        String?
  sortOrder   Int       @default(0)

  products    Product[]

  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model Product {
  id           String   @id @default(uuid())
  categoryId   String
  category     Category @relation(fields: [categoryId], references: [id])

  sku          String   @unique
  title        String
  grade        String?
  standard     String?
  dimensions   String?
  availability String   @default("in_stock")

  baseUnit     String   // kg, m, pcs
  pricePerUnit Float    // Gross estimate price

  weight       Float?   // kg per unit
  lengthM      Float?   // meters (for profiles, pipes)

  metadata     Json?    // Flexible for future specs

  isActive     Boolean  @default(true)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  @@index([categoryId])
  @@index([sku])
  @@index([availability])
}

// Cart (Session-based for guests, DB for authenticated)
model Cart {
  id        String     @id @default(uuid())
  userId    String?    // Null for guest carts
  sessionId String?    // For guest identification

  items     CartItem[]

  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
  expiresAt DateTime   // Auto-cleanup old carts

  @@index([userId])
  @@index([sessionId])
}

model CartItem {
  id        String   @id @default(uuid())
  cartId    String
  cart      Cart     @relation(fields: [cartId], references: [id], onDelete: Cascade)

  productId String
  quantity  Float
  unit      String

  specs     Json?    // lengthM, finish, etc.

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([cartId])
}

// RFQs (Request for Quote)
model RFQ {
  id              String      @id @default(uuid())
  userId          String?     // Null for guest RFQs
  user            User?       @relation(fields: [userId], references: [id])

  referenceNumber String      @unique // RFQ-2025-00042
  status          RFQStatus   @default(SUBMITTED)

  // Company Info (snapshot at submission time)
  companyName     String
  cui             String?
  contactPerson   String
  email           String
  phone           String

  // Addresses
  billingAddress  Json
  deliveryAddress Json

  // Preferences
  incoterm        String?
  deliveryDate    DateTime?
  notes           String?

  // Attachments
  attachments     Attachment[]

  // Cart snapshot (preserved at submission)
  cartSnapshot    Json
  items           RFQItem[]

  // Pricing (filled by operator)
  estimatedTotal  Float?      // Gross estimate from frontend
  finalQuoteAmount Float?     // Final quote from operator
  finalQuotePdfUrl String?
  quotedAt        DateTime?

  // Timestamps
  submittedAt     DateTime    @default(now())
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt

  @@index([userId])
  @@index([status])
  @@index([referenceNumber])
}

enum RFQStatus {
  SUBMITTED
  ACKNOWLEDGED
  IN_PROGRESS
  QUOTED
  COMPLETED
  CANCELLED
}

model RFQItem {
  id          String  @id @default(uuid())
  rfqId       String
  rfq         RFQ     @relation(fields: [rfqId], references: [id], onDelete: Cascade)

  productId   String?
  productSku  String
  productName String

  quantity    Float
  unit        String
  specs       Json?

  grossPrice  Float   // Estimate from frontend
  finalPrice  Float?  // Final price from operator

  createdAt   DateTime @default(now())

  @@index([rfqId])
}

// Saved BOM Projects
model Project {
  id          String   @id @default(uuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  name        String
  description String?
  fileName    String

  bomData     Json     // BOMUploadResult structure

  lastUsedAt  DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([userId])
}

// Saved Addresses
model Address {
  id          String   @id @default(uuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  type        AddressType
  isDefault   Boolean  @default(false)

  street      String
  city        String
  county      String
  postalCode  String
  country     String   @default("Romania")

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([userId, type])
}

enum AddressType {
  BILLING
  DELIVERY
}

// File Attachments
model Attachment {
  id          String   @id @default(uuid())
  rfqId       String
  rfq         RFQ      @relation(fields: [rfqId], references: [id], onDelete: Cascade)

  fileName    String
  fileSize    Int
  mimeType    String
  storageUrl  String   // S3 URL or local path

  uploadedAt  DateTime @default(now())

  @@index([rfqId])
}
```

### Migration Plan

1. **Initialize Database:**
   ```bash
   npx prisma migrate dev --name init
   ```

2. **Seed Product Catalog:**
   ```bash
   npx prisma db seed
   ```
   - Import product data from `src/data/products.ts`
   - Create categories hierarchy
   - Set up initial product catalog

3. **Data Migration (Optional):**
   - Create migration script for any existing localStorage data
   - Import test users if needed

---

## Phase 6C.3: Production Authentication System

**Replace:** `src/lib/api/auth.ts` (currently localStorage mock)

### Backend Authentication Service

**File:** `backend/src/services/auth.service.ts`

```typescript
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/database';

const SALT_ROUNDS = 12;
const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = '24h';
const REFRESH_TOKEN_EXPIRES_IN = '7d';

export class AuthService {
  async signup(data: SignupData): Promise<AuthResponse> {
    // Validate email uniqueness
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() }
    });

    if (existingUser) {
      throw new Error('Un cont cu acest email există deja.');
    }

    // Validate CUI if provided
    if (data.company?.cui) {
      const cuiValidation = validateCUI(data.company.cui);
      if (!cuiValidation.valid) {
        throw new Error(cuiValidation.message || 'CUI invalid');
      }
    }

    // Hash password
    const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);

    // Create user with company (if business account)
    const user = await prisma.user.create({
      data: {
        email: data.email.toLowerCase(),
        passwordHash,
        name: data.name,
        phone: data.phone,
        role: data.role,
        company: data.company ? {
          create: {
            legalName: data.company.name,
            cui: data.company.cui,
            address: data.company.address,
            city: data.company.city,
            county: data.company.county,
            postalCode: data.company.postalCode,
          }
        } : undefined,
      },
      include: { company: true }
    });

    // Generate JWT tokens
    const { accessToken, refreshToken } = this.generateTokens(user.id);

    // Save session
    await prisma.session.create({
      data: {
        userId: user.id,
        token: accessToken,
        refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      }
    });

    // Send verification email (async, don't block)
    this.sendVerificationEmail(user.email, user.id).catch(console.error);

    return {
      user: this.sanitizeUser(user),
      tokens: { accessToken, refreshToken }
    };
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { company: true }
    });

    if (!user) {
      throw new Error('Email sau parolă incorectă.');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      throw new Error('Email sau parolă incorectă.');
    }

    // Generate tokens
    const { accessToken, refreshToken } = this.generateTokens(user.id);

    // Create session
    await prisma.session.create({
      data: {
        userId: user.id,
        token: accessToken,
        refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      }
    });

    return {
      user: this.sanitizeUser(user),
      tokens: { accessToken, refreshToken }
    };
  }

  async logout(token: string): Promise<void> {
    await prisma.session.delete({
      where: { token }
    });
  }

  async refreshToken(oldRefreshToken: string): Promise<AuthResponse> {
    const session = await prisma.session.findUnique({
      where: { refreshToken: oldRefreshToken },
      include: { user: { include: { company: true } } }
    });

    if (!session || session.expiresAt < new Date()) {
      throw new Error('Invalid or expired refresh token');
    }

    // Generate new tokens
    const { accessToken, refreshToken } = this.generateTokens(session.userId);

    // Update session
    await prisma.session.update({
      where: { id: session.id },
      data: {
        token: accessToken,
        refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      }
    });

    return {
      user: this.sanitizeUser(session.user),
      tokens: { accessToken, refreshToken }
    };
  }

  private generateTokens(userId: string) {
    const accessToken = jwt.sign({ userId }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN
    });

    const refreshToken = jwt.sign({ userId, type: 'refresh' }, JWT_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRES_IN
    });

    return { accessToken, refreshToken };
  }

  private sanitizeUser(user: any) {
    const { passwordHash, ...sanitized } = user;
    return sanitized;
  }

  private async sendVerificationEmail(email: string, userId: string) {
    // Implemented in Email Service (Phase 6C.5)
    console.log(`Verification email sent to ${email}`);
  }
}
```

### Frontend Migration

**Update:** `src/context/AuthContext.tsx` to use real API instead of localStorage:

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  withCredentials: true
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const token = localStorage.getItem('accessToken');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchCurrentUser();
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const { data } = await api.get('/users/me');
      setUser(data);
    } catch (error) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      delete api.defaults.headers.common['Authorization'];
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: SignupData) => {
    const { data } = await api.post('/auth/signup', userData);
    localStorage.setItem('accessToken', data.tokens.accessToken);
    localStorage.setItem('refreshToken', data.tokens.refreshToken);
    api.defaults.headers.common['Authorization'] = `Bearer ${data.tokens.accessToken}`;
    setUser(data.user);
  };

  const login = async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('accessToken', data.tokens.accessToken);
    localStorage.setItem('refreshToken', data.tokens.refreshToken);
    api.defaults.headers.common['Authorization'] = `Bearer ${data.tokens.accessToken}`;
    setUser(data.user);
  };

  const logout = async () => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      await api.post('/auth/logout', { token });
    }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  // ... rest of context
}
```

---

## Phase 6C.4: File Upload & Storage (AWS S3 Integration)

**Replace:** Mock BOM upload with real cloud storage

### Backend Upload Service

**File:** `backend/src/services/upload.service.ts`

```typescript
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  }
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME!;

export class UploadService {
  async uploadBOM(file: Express.Multer.File, userId?: string): Promise<string> {
    const fileKey = `bom-uploads/${userId || 'guest'}/${uuidv4()}-${file.originalname}`;

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileKey,
      Body: file.buffer,
      ContentType: file.mimetype,
      Metadata: {
        uploadedBy: userId || 'guest',
        originalName: file.originalname
      }
    });

    await s3Client.send(command);

    return `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
  }

  async uploadAttachment(file: Express.Multer.File, rfqId: string): Promise<string> {
    const fileKey = `rfq-attachments/${rfqId}/${uuidv4()}-${file.originalname}`;

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileKey,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await s3Client.send(command);

    return `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
  }

  async getSignedDownloadUrl(fileKey: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileKey,
    });

    return await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // 1 hour
  }
}
```

### AWS S3 Setup

1. **Create S3 Bucket:**
   ```bash
   aws s3 mb s3://metalpro-uploads --region eu-central-1
   ```

2. **Configure CORS:**
   ```json
   {
     "CORSRules": [
       {
         "AllowedOrigins": ["https://metalpro.ro"],
         "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
         "AllowedHeaders": ["*"],
         "MaxAgeSeconds": 3000
       }
     ]
   }
   ```

3. **Set Bucket Policy (Private):**
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Principal": {
           "AWS": "arn:aws:iam::ACCOUNT_ID:role/metalpro-backend-role"
         },
         "Action": [
           "s3:PutObject",
           "s3:GetObject",
           "s3:DeleteObject"
         ],
         "Resource": "arn:aws:s3:::metalpro-uploads/*"
       }
     ]
   }
   ```

---

## Phase 6C.5: Email Service Integration (SendGrid)

**Replace:** `console.log` with real email sending

### Backend Email Service

**File:** `backend/src/services/email.service.ts`

```typescript
import sgMail from '@sendgrid/mail';
import { RFQ, User } from '@prisma/client';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@metalpro.ro';
const OPERATOR_EMAIL = process.env.OPERATOR_EMAIL || 'sales@metalpro.ro';

export class EmailService {
  async sendRFQConfirmation(rfq: RFQ, user?: User): Promise<void> {
    const msg = {
      to: rfq.email,
      from: FROM_EMAIL,
      subject: `Confirmare RFQ ${rfq.referenceNumber} - MetalPro`,
      html: `
        <h1>Cerere Ofertă Primită</h1>
        <p>Bună ${rfq.contactPerson},</p>
        <p>Am primit cererea ta de ofertă cu referința <strong>${rfq.referenceNumber}</strong>.</p>
        <p>Echipa noastră de vânzări va analiza solicitarea și va reveni cu o ofertă detaliată în cel mai scurt timp.</p>

        <h2>Detalii Comandă:</h2>
        <ul>
          <li>Companie: ${rfq.companyName}</li>
          <li>Total estimat: ${rfq.estimatedTotal ? `${rfq.estimatedTotal.toFixed(2)} RON` : 'Se calculează'}</li>
          <li>Data dorită livrare: ${rfq.deliveryDate || 'Nu a fost specificată'}</li>
        </ul>

        <p>Poți urmări statusul comenzii în contul tău: <a href="${process.env.FRONTEND_URL}/account/orders">Vezi Istoric Comenzi</a></p>

        <p>Cu stimă,<br/>Echipa MetalPro</p>
      `
    };

    await sgMail.send(msg);
  }

  async notifyOperatorNewRFQ(rfq: RFQ): Promise<void> {
    const msg = {
      to: OPERATOR_EMAIL,
      from: FROM_EMAIL,
      subject: `[NOU] RFQ ${rfq.referenceNumber} de la ${rfq.companyName}`,
      html: `
        <h1>RFQ Nou Primit</h1>
        <p><strong>Referință:</strong> ${rfq.referenceNumber}</p>
        <p><strong>Companie:</strong> ${rfq.companyName} (CUI: ${rfq.cui || 'N/A'})</p>
        <p><strong>Contact:</strong> ${rfq.contactPerson} - ${rfq.email} - ${rfq.phone}</p>
        <p><strong>Total estimat:</strong> ${rfq.estimatedTotal?.toFixed(2)} RON</p>

        <p><a href="${process.env.BACKOFFICE_URL}/rfq/${rfq.id}">Vezi Detalii RFQ →</a></p>
      `
    };

    await sgMail.send(msg);
  }

  async sendQuoteReady(rfq: RFQ, pdfUrl: string): Promise<void> {
    const msg = {
      to: rfq.email,
      from: FROM_EMAIL,
      subject: `Ofertă Pregătită - ${rfq.referenceNumber}`,
      html: `
        <h1>Oferta Ta Este Gata!</h1>
        <p>Bună ${rfq.contactPerson},</p>
        <p>Am pregătit oferta pentru cererea ta cu referința <strong>${rfq.referenceNumber}</strong>.</p>
        <p><strong>Valoare totală:</strong> ${rfq.finalQuoteAmount?.toFixed(2)} RON (inclusiv TVA)</p>

        <p>Descarcă oferta detaliată: <a href="${pdfUrl}">Descarcă PDF</a></p>

        <p>Pentru detalii sau modificări, te rugăm să ne contactezi telefonic sau să răspunzi acestui email.</p>

        <p>Cu stimă,<br/>Echipa MetalPro</p>
      `,
      attachments: [
        {
          filename: `Oferta-${rfq.referenceNumber}.pdf`,
          path: pdfUrl,
        }
      ]
    };

    await sgMail.send(msg);
  }

  async sendVerificationEmail(email: string, userId: string): Promise<void> {
    const verificationToken = jwt.sign({ userId, type: 'email_verification' }, JWT_SECRET, {
      expiresIn: '24h'
    });

    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

    const msg = {
      to: email,
      from: FROM_EMAIL,
      subject: 'Verifică adresa de email - MetalPro',
      html: `
        <h1>Bine ai venit la MetalPro!</h1>
        <p>Te rugăm să verifici adresa de email făcând clic pe butonul de mai jos:</p>
        <p><a href="${verificationUrl}" style="background-color: #0066cc; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Verifică Email</a></p>
        <p>Linkul este valabil 24 de ore.</p>
        <p>Dacă nu ai creat un cont pe MetalPro, te rugăm să ignori acest email.</p>
      `
    };

    await sgMail.send(msg);
  }

  async sendPasswordResetEmail(email: string, resetToken: string): Promise<void> {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    const msg = {
      to: email,
      from: FROM_EMAIL,
      subject: 'Resetare Parolă - MetalPro',
      html: `
        <h1>Resetare Parolă</h1>
        <p>Am primit o solicitare de resetare a parolei pentru contul tău.</p>
        <p>Dacă tu ai făcut această solicitare, fă clic pe butonul de mai jos pentru a seta o parolă nouă:</p>
        <p><a href="${resetUrl}" style="background-color: #0066cc; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Resetează Parola</a></p>
        <p>Linkul este valabil 1 oră.</p>
        <p>Dacă nu ai solicitat resetarea parolei, te rugăm să ignori acest email. Parola ta va rămâne neschimbată.</p>
      `
    };

    await sgMail.send(msg);
  }
}
```

### SendGrid Setup

1. **Create SendGrid Account:** https://signup.sendgrid.com/
2. **Verify Sender Identity:** Add and verify `noreply@metalpro.ro`
3. **Generate API Key:** Settings → API Keys → Create API Key
4. **Add to Environment:**
   ```bash
   SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   FROM_EMAIL=noreply@metalpro.ro
   OPERATOR_EMAIL=sales@metalpro.ro
   ```

---

## Phase 6C.6: Security Hardening

### Authentication Middleware

**File:** `backend/src/middleware/auth.middleware.ts`

```typescript
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';

export interface AuthRequest extends Request {
  user?: User;
  session?: Session;
}

export async function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };

    // Verify session exists and is not expired
    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: { include: { company: true } } }
    });

    if (!session || session.expiresAt < new Date()) {
      return res.status(401).json({ error: 'Session expired' });
    }

    req.user = session.user;
    req.session = session;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// Optional authentication - doesn't fail if no token
export async function optionalAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };

      const session = await prisma.session.findUnique({
        where: { token },
        include: { user: { include: { company: true } } }
      });

      if (session && session.expiresAt >= new Date()) {
        req.user = session.user;
        req.session = session;
      }
    }
  } catch (error) {
    // Ignore auth errors for optional auth
  }
  next();
}
```

### Rate Limiting

**File:** `backend/src/middleware/rateLimit.middleware.ts`

```typescript
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { createClient } from 'redis';

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});
redisClient.connect();

// General API rate limiting
export const apiLimiter = rateLimit({
  store: new RedisStore({
    client: redisClient,
    prefix: 'rl:api:',
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per 15 minutes
  message: 'Prea multe cereri. Te rugăm să încerci mai târziu.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict rate limiting for authentication endpoints
export const authLimiter = rateLimit({
  store: new RedisStore({
    client: redisClient,
    prefix: 'rl:auth:',
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per 15 minutes
  message: 'Prea multe încercări de autentificare. Te rugăm să încerci mai târziu.',
  skipSuccessfulRequests: true, // Don't count successful logins
});

// RFQ submission rate limiting (prevent spam)
export const rfqLimiter = rateLimit({
  store: new RedisStore({
    client: redisClient,
    prefix: 'rl:rfq:',
  }),
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 RFQs per hour per IP
  message: 'Prea multe cereri de ofertă. Te rugăm să încerci mai târziu.',
});
```

### CORS Configuration

**File:** `backend/src/config/cors.ts`

```typescript
import cors from 'cors';

export const corsOptions: cors.CorsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      process.env.FRONTEND_URL || 'http://localhost:8080',
      'https://metalpro.ro',
      'https://www.metalpro.ro',
      'https://staging.metalpro.ro',
    ];

    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow cookies
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400, // 24 hours
};
```

### Input Validation & Sanitization

**File:** `backend/src/middleware/validation.middleware.ts`

```typescript
import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';
import xss from 'xss';

// Sanitize all string inputs to prevent XSS
export function sanitizeInput(obj: any): any {
  if (typeof obj === 'string') {
    return xss(obj.trim());
  }
  if (Array.isArray(obj)) {
    return obj.map(sanitizeInput);
  }
  if (typeof obj === 'object' && obj !== null) {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [key, sanitizeInput(value)])
    );
  }
  return obj;
}

export function validateBody(schema: z.ZodSchema) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Sanitize input first
      req.body = sanitizeInput(req.body);

      // Then validate with Zod
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation error',
          details: error.errors
        });
      }
      next(error);
    }
  };
}
```

### Security Headers

**File:** `backend/src/index.ts`

```typescript
import helmet from 'helmet';
import express from 'express';

const app = express();

// Security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    }
  },
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true
  }
}));

// Prevent parameter pollution
import hpp from 'hpp';
app.use(hpp());

// SQL injection prevention (handled by Prisma ORM)
// XSS prevention (sanitizeInput middleware)
// CSRF protection (SameSite cookies + CSRF tokens for state-changing operations)
```

---

## Phase 6C.7: Production Deployment

### Docker Configuration

**Backend Dockerfile:**

```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install production dependencies only
COPY package*.json ./
RUN npm ci --only=production

# Copy built files and Prisma schema
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Expose port
EXPOSE 3000

# Run migrations and start server
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]
```

**Frontend Dockerfile:**

```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Build for production
RUN npm run build

# Production stage with nginx
FROM nginx:alpine

# Copy built files
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose (Full Stack)

**File:** `docker-compose.yml`

```yaml
version: '3.8'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: metalpro
      POSTGRES_USER: metalpro_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U metalpro_user"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Redis Cache
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Backend API
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://metalpro_user:${DB_PASSWORD}@postgres:5432/metalpro
      REDIS_URL: redis://redis:6379
      JWT_SECRET: ${JWT_SECRET}
      SENDGRID_API_KEY: ${SENDGRID_API_KEY}
      AWS_REGION: ${AWS_REGION}
      AWS_ACCESS_KEY_ID: ${AWS_ACCESS_KEY_ID}
      AWS_SECRET_ACCESS_KEY: ${AWS_SECRET_ACCESS_KEY}
      S3_BUCKET_NAME: ${S3_BUCKET_NAME}
    ports:
      - "3000:3000"
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    restart: unless-stopped

  # Frontend (nginx)
  frontend:
    build:
      context: .
      dockerfile: Dockerfile
    environment:
      VITE_API_URL: https://api.metalpro.ro
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./ssl:/etc/nginx/ssl:ro  # SSL certificates
    depends_on:
      - backend
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
```

### Environment Variables (Production)

**File:** `.env.production`

```bash
# Database
DATABASE_URL=postgresql://metalpro_user:STRONG_PASSWORD@postgres:5432/metalpro

# Redis
REDIS_URL=redis://redis:6379

# JWT
JWT_SECRET=GENERATE_STRONG_RANDOM_SECRET_HERE_AT_LEAST_32_CHARS

# Email (SendGrid)
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
FROM_EMAIL=noreply@metalpro.ro
OPERATOR_EMAIL=sales@metalpro.ro

# AWS S3
AWS_REGION=eu-central-1
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
S3_BUCKET_NAME=metalpro-uploads

# URLs
FRONTEND_URL=https://metalpro.ro
BACKOFFICE_URL=https://admin.metalpro.ro
API_URL=https://api.metalpro.ro

# Monitoring
SENTRY_DSN=https://...@sentry.io/...

# Node
NODE_ENV=production
PORT=3000
```

**Security Note:** Use AWS Secrets Manager or HashiCorp Vault for production secrets.

---

## Phase 6C.8: Monitoring & Logging

### Error Tracking (Sentry)

**Backend:** `backend/src/config/sentry.ts`

```typescript
import * as Sentry from '@sentry/node';
import { ProfilingIntegration } from '@sentry/profiling-node';

export function initSentry() {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
    tracesSampleRate: 1.0,
    profilesSampleRate: 1.0,
    integrations: [
      new ProfilingIntegration(),
    ],
  });
}

export function sentryErrorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  Sentry.captureException(err, {
    user: req.user ? { id: req.user.id, email: req.user.email } : undefined,
    tags: {
      path: req.path,
      method: req.method,
    },
  });

  if (process.env.NODE_ENV === 'production') {
    res.status(500).json({ error: 'Internal server error' });
  } else {
    res.status(500).json({ error: err.message, stack: err.stack });
  }
}
```

**Frontend:** `src/main.tsx`

```typescript
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  integrations: [
    new Sentry.BrowserTracing(),
    new Sentry.Replay(),
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
```

### Application Logging

**File:** `backend/src/config/logger.ts`

```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'metalpro-backend' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

// Console logging in development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

export default logger;
```

### Health Check Endpoints

**File:** `backend/src/routes/health.routes.ts`

```typescript
import { Router } from 'express';
import { prisma } from '../config/database';
import { createClient } from 'redis';

const router = Router();

router.get('/health', async (req, res) => {
  const health = {
    uptime: process.uptime(),
    timestamp: Date.now(),
    status: 'ok',
    checks: {
      database: 'unknown',
      redis: 'unknown',
    }
  };

  try {
    await prisma.$queryRaw`SELECT 1`;
    health.checks.database = 'ok';
  } catch (error) {
    health.checks.database = 'error';
    health.status = 'degraded';
  }

  try {
    const redis = createClient({ url: process.env.REDIS_URL });
    await redis.connect();
    await redis.ping();
    await redis.quit();
    health.checks.redis = 'ok';
  } catch (error) {
    health.checks.redis = 'error';
    health.status = 'degraded';
  }

  const statusCode = health.status === 'ok' ? 200 : 503;
  res.status(statusCode).json(health);
});

router.get('/health/ready', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({ status: 'ready' });
  } catch (error) {
    res.status(503).json({ status: 'not ready' });
  }
});

router.get('/health/live', (req, res) => {
  res.status(200).json({ status: 'alive' });
});

export default router;
```

---

## Phase 6C.9: Performance Optimization

### Database Indexing

Indexes are defined in Prisma schema for frequently queried columns:

```prisma
model User {
  @@index([email])
}

model RFQ {
  @@index([userId])
  @@index([status])
  @@index([referenceNumber])
}

model Product {
  @@index([categoryId])
  @@index([sku])
  @@index([availability])
}
```

### Caching Strategy

```typescript
// Cache product catalog in Redis (1 hour TTL)
async function getProducts(): Promise<Product[]> {
  const cacheKey = 'products:all';

  // Try cache first
  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  // Fallback to database
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: { category: true }
  });

  // Cache for 1 hour
  await redis.setex(cacheKey, 3600, JSON.stringify(products));

  return products;
}
```

### API Response Compression

```typescript
import compression from 'compression';

app.use(compression({
  level: 6,
  threshold: 1024,
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  }
}));
```

---

## Acceptance Criteria

### Backend Infrastructure
- [ ] PostgreSQL database running with all migrations applied
- [ ] Redis cache configured and operational
- [ ] S3 bucket created and accessible for file uploads
- [ ] Email service (SendGrid) configured and sending emails
- [ ] All environment variables properly set and secured
- [ ] Docker containers building and running successfully

### Authentication
- [ ] User signup creates account in database (not localStorage)
- [ ] Passwords are hashed with bcrypt (min 12 rounds)
- [ ] JWT tokens generated with expiration (24h access, 7d refresh)
- [ ] Login validates credentials against database
- [ ] Session stored in database with expiration
- [ ] Logout invalidates session in database
- [ ] Email verification emails sent
- [ ] Password reset flow functional

### Data Persistence
- [ ] Products loaded from database (not mock data)
- [ ] Cart persists in database for authenticated users
- [ ] Cart stored in Redis for guest users
- [ ] RFQs saved to database with all details
- [ ] Saved BOM projects stored in database
- [ ] Saved addresses stored in database
- [ ] Order history retrieved from database

### File Uploads
- [ ] BOM files uploaded to S3
- [ ] RFQ attachments uploaded to S3
- [ ] File size limits enforced (50MB max)
- [ ] Malicious file types rejected
- [ ] Uploaded files accessible via signed URLs

### Email Notifications
- [ ] RFQ confirmation email sent to customer
- [ ] RFQ notification email sent to operators
- [ ] Email verification sent on signup
- [ ] Password reset email functional
- [ ] Emails have proper formatting and branding

### Security
- [ ] All passwords hashed (never stored plaintext)
- [ ] JWT secret is strong random string (32+ chars)
- [ ] CORS properly configured (only allowed origins)
- [ ] Rate limiting active on all endpoints
- [ ] Input validation prevents SQL injection
- [ ] XSS protection via input sanitization
- [ ] HTTPS enforced in production
- [ ] Security headers (HSTS, CSP) configured
- [ ] Session tokens expire after inactivity

### Performance
- [ ] Product catalog cached in Redis (1h TTL)
- [ ] Database queries use proper indexes
- [ ] API responses gzipped
- [ ] Static assets served with long cache headers
- [ ] Database connection pooling configured
- [ ] Page load time < 3s on 3G connection
- [ ] API response time < 500ms for p95

### Monitoring
- [ ] Sentry error tracking active
- [ ] Application logs written to files
- [ ] Health check endpoints responding
- [ ] Uptime monitoring configured
- [ ] Error rate alerts configured
- [ ] Performance metrics tracked

### Deployment
- [ ] Docker images build successfully
- [ ] docker-compose starts all services
- [ ] Database migrations run automatically on deploy
- [ ] Zero-downtime deployment possible
- [ ] Rollback procedure documented and tested
- [ ] CI/CD pipeline runs tests before deploy
- [ ] Production environment variables secured

### Testing
- [ ] Unit tests cover critical business logic (>80% coverage)
- [ ] Integration tests cover API endpoints
- [ ] E2E tests cover critical user flows
- [ ] Load tests pass with 200 concurrent users
- [ ] All tests pass in CI pipeline

---

## AWS Infrastructure Checklist

### AWS Services Setup

- [ ] **VPC Configuration**
  - [ ] Create VPC with public and private subnets
  - [ ] Configure security groups for EC2, RDS, ElastiCache
  - [ ] Set up NAT Gateway for private subnets

- [ ] **RDS PostgreSQL**
  - [ ] Create RDS PostgreSQL 15 instance
  - [ ] Configure automated backups (retention: 7 days)
  - [ ] Enable Multi-AZ for high availability
  - [ ] Create database parameter group
  - [ ] Set up read replicas (optional, for scaling)

- [ ] **ElastiCache Redis**
  - [ ] Create Redis cluster (single node for dev, cluster for prod)
  - [ ] Configure Redis parameter group
  - [ ] Enable automatic backups

- [ ] **S3 Buckets**
  - [ ] Create `metalpro-uploads` bucket (private)
  - [ ] Configure CORS policy
  - [ ] Set up lifecycle policies for old files
  - [ ] Enable versioning (optional)
  - [ ] Configure CloudFront distribution for static assets

- [ ] **IAM Roles & Policies**
  - [ ] Create EC2 instance role with S3 access
  - [ ] Create deployment user with limited permissions
  - [ ] Set up AWS Secrets Manager for sensitive data

- [ ] **Route 53**
  - [ ] Register/transfer domain `metalpro.ro`
  - [ ] Create hosted zone
  - [ ] Configure DNS records (A, CNAME for www, api subdomain)

- [ ] **CloudFront (CDN)**
  - [ ] Create distribution for S3 static assets
  - [ ] Configure cache behaviors
  - [ ] Set up SSL certificate via ACM

- [ ] **Application Load Balancer**
  - [ ] Create ALB for EC2 instances
  - [ ] Configure target groups
  - [ ] Set up health checks
  - [ ] Enable HTTPS with SSL certificate

- [ ] **EC2 / ECS**
  - [ ] Choose deployment method (EC2 vs ECS Fargate)
  - [ ] Create EC2 instance or ECS cluster
  - [ ] Configure auto-scaling groups
  - [ ] Install Docker and deploy application

- [ ] **CloudWatch**
  - [ ] Set up log groups for application logs
  - [ ] Configure alarms (CPU, memory, error rates)
  - [ ] Create dashboards for monitoring

---

## Migration Checklist

### Pre-Migration
- [ ] Backup all current localStorage data
- [ ] Document current mock data structures
- [ ] Test backend locally with docker-compose
- [ ] Run all backend integration tests
- [ ] Perform load testing on backend

### Migration Steps
- [ ] Deploy backend to production AWS
- [ ] Seed database with product catalog
- [ ] Migrate existing users (if any from localStorage)
- [ ] Update frontend environment variables (VITE_API_URL)
- [ ] Deploy updated frontend with backend integration
- [ ] Test critical user flows in staging
- [ ] Perform smoke tests in production

### Post-Migration
- [ ] Verify all emails are sending correctly
- [ ] Monitor error rates in Sentry
- [ ] Check database performance
- [ ] Validate S3 file uploads
- [ ] Review security headers
- [ ] Test rate limiting
- [ ] Verify CORS configuration
- [ ] Check health endpoints

---

## Rollback Plan

### If Backend Migration Fails

1. **Immediate Actions:**
   - Revert frontend to use localStorage mocks
   - Update `VITE_API_URL` to point to mock endpoints
   - Redeploy frontend with localStorage implementation

2. **Investigation:**
   - Review Sentry error logs
   - Check CloudWatch logs for backend errors
   - Verify database connectivity
   - Test Redis connection
   - Check S3 bucket permissions

3. **Fix & Retry:**
   - Address root cause
   - Test fix in staging environment
   - Perform smoke tests
   - Retry production deployment

---

## Timeline & Dependencies

### Dependencies Before Starting Phase 6C

**Required Phases (Must Complete First):**
1. ✅ Phase 1: Landing Page - **COMPLETED**
2. ✅ Phase 6A/6B: User Accounts (Mock) - **COMPLETED**
3. Phase 2: Product Catalog & Discovery
4. Phase 3: Product Detail Page
5. Phase 4: Estimate Cart & RFQ Flow
6. Phase 5: BOM Upload & Auto-Mapping
7. Phase 7: Search Optimization
8. Phase 8: Analytics & SEO
9. Phase 9: Internationalization

**Why This Order?**
- Frontend prototyping faster with mocks
- Complete UX validation before backend complexity
- Know exact backend requirements after frontend done
- Single migration event (replace all mocks at once)
- Less refactoring needed

### Estimated Timeline

| Sub-Phase | Duration | Tasks |
|-----------|----------|-------|
| 6C.1: Backend API + Database | 2 weeks | Setup Node.js backend, Prisma, PostgreSQL, basic API endpoints |
| 6C.2: Authentication | 1 week | JWT auth, bcrypt, session management, email verification |
| 6C.3: File Upload (S3) | 1 week | AWS S3 integration, file upload endpoints, signed URLs |
| 6C.4: Email Service (SendGrid) | 1 week | SendGrid integration, email templates, notifications |
| 6C.5: Security & Deployment | 1 week | Rate limiting, CORS, Docker, CI/CD, production deploy |
| 6C.6: Testing & Validation | 1 week | Integration tests, E2E tests, load testing, bug fixes |

**Total: 4-6 weeks**

---

## Support & Resources

### AWS Documentation
- [RDS PostgreSQL Setup](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_PostgreSQL.html)
- [ElastiCache Redis Guide](https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/WhatIs.html)
- [S3 Bucket Configuration](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html)
- [CloudFront CDN Setup](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html)

### Backend Technologies
- [Prisma ORM Documentation](https://www.prisma.io/docs)
- [Express.js Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)
- [Node.js Security Checklist](https://cheatsheetseries.owasp.org/cheatsheets/Nodejs_Security_Cheat_Sheet.html)

### Email & Notifications
- [SendGrid Quick Start](https://docs.sendgrid.com/for-developers/sending-email/quickstart-nodejs)
- [Email Template Best Practices](https://sendgrid.com/resource/email-template-best-practices/)

### Monitoring & Logging
- [Sentry Node.js Integration](https://docs.sentry.io/platforms/node/)
- [Winston Logger Guide](https://github.com/winstonjs/winston)
- [CloudWatch Logs](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/WhatIsCloudWatchLogs.html)

---

## Conclusion

This production readiness document outlines the complete transformation of MetalPro from a localStorage-based prototype to a production-ready B2B e-commerce platform. The phased rollout approach ensures:

- **Stability:** Each component tested independently before integration
- **Security:** Enterprise-grade authentication, encryption, and data protection
- **Scalability:** AWS cloud infrastructure supports business growth
- **Reliability:** Monitoring, logging, and automated deployment pipelines
- **Maintainability:** Clean architecture, comprehensive documentation

**Next Steps:**
1. Complete frontend phases (2-5, 7-9)
2. Review and approve this production readiness plan
3. Begin Phase 6C.1: Backend API Setup
4. Iterate through phased rollout
5. Launch production-ready platform

---

**Document Maintained By:** Development Team
**Last Review:** 2025-01-09
**Next Review:** Before Phase 6C Implementation
