# CryptoTrace API Documentation

## Overview
This document outlines all the API endpoints required for the CryptoTrace law enforcement cryptocurrency investigation platform.

## Authentication APIs

### POST /api/auth/login
**Purpose**: Authenticate officers and receive JWT token
```json
Request Body:
{
  "email": "test@test.com",
  "password": "password"
}

Response:
{
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "email": "test@test.com",
    "name": "Officer Test User",
    "department": "Metro PD - Cyber Crimes",
    "badgeNumber": "0001",
    "role": "officer"
  }
}
```

### POST /api/auth/signup
**Purpose**: Register new officers (public signup enabled)
```json
Request Body:
{
  "email": "new.officer@pd.gov",
  "password": "securepassword",
  "name": "Det. John Smith",
  "department": "Metro PD - Cyber Crimes",
  "badgeNumber": "1234",
  "signupToken": "" // Optional for public signup
}

Response:
{
  "token": "jwt_token_here",
  "user": { /* user object */ }
}
```

### GET /api/auth/me
**Purpose**: Get current authenticated user details
**Headers**: `Authorization: Bearer jwt_token`
```json
Response:
{
  "id": 1,
  "email": "test@test.com",
  "name": "Officer Test User",
  "department": "Metro PD - Cyber Crimes",
  "badgeNumber": "0001",
  "role": "officer"
}
```

## Trace Investigation APIs

### GET /api/traces
**Purpose**: Get traces for current user (or all traces if admin)
**Headers**: `Authorization: Bearer jwt_token`
```json
Response: [
  {
    "id": 1,
    "caseNumber": "2024-001",
    "userId": 1,
    "cryptoType": "Bitcoin (BTC)",
    "walletAddress": "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
    "victimName": "John Doe",
    "incidentDate": "2024-01-15T00:00:00.000Z",
    "description": "Cryptocurrency theft via phishing attack",
    "status": "processing", // "queued", "processing", "completed", "failed"
    "isPremium": false,
    "paymentIntentId": null,
    "results": null,
    "reportUrl": null,
    "estimatedCompletion": "2024-01-17T00:00:00.000Z",
    "completedAt": null,
    "createdAt": "2024-01-15T10:00:00.000Z"
  }
]
```

### POST /api/traces
**Purpose**: Create new cryptocurrency trace request
**Headers**: `Authorization: Bearer jwt_token`
```json
Request Body:
{
  "caseNumber": "2024-003",
  "cryptoType": "Bitcoin (BTC)",
  "walletAddress": "1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2",
  "victimName": "Jane Smith",
  "incidentDate": "2024-01-15T00:00:00.000Z",
  "description": "Ransomware payment address",
  "isPremium": false
}

Response (Free Trace):
{
  "trace": { /* trace object */ }
}

Response (Premium Trace):
{
  "trace": { /* trace object */ },
  "clientSecret": "pi_1234_secret_5678" // For Stripe payment
}
```

## Payment Processing APIs

### POST /api/payments/webhook
**Purpose**: Handle Stripe payment webhooks for premium traces
```json
Request Body:
{
  "paymentIntentId": "pi_1234567890",
  "status": "succeeded"
}

Response:
{
  "success": true
}
```

## Police Department Integration APIs

### POST /api/intake
**Purpose**: Webhook endpoint for police departments to submit officer and victim data
**Headers**: `Content-Type: application/json`
```json
Request Body:
{
  "officers": [
    {
      "email": "officer@pd.gov",
      "name": "Det. Sarah Johnson",
      "badgeNumber": "4421",
      "department": "Metro PD - Cyber Crimes"
    }
  ],
  "victims": [
    {
      "name": "John Doe",
      "email": "john.doe@email.com",
      "caseNumber": "2024-001",
      "incidentDate": "2024-01-15",
      "cryptoAddress": "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
      "cryptoType": "Bitcoin (BTC)",
      "description": "Cryptocurrency theft via phishing"
    }
  ],
  "apiKey": "test-api-key-123"
}

Response:
{
  "message": "Intake processed successfully",
  "departmentId": 1,
  "officersProcessed": [
    {
      "email": "officer@pd.gov",
      "status": "signup_sent"
    }
  ],
  "tracesCreated": [
    {
      "caseNumber": "2024-001",
      "traceId": 3
    }
  ],
  "signupLinks": [
    {
      "email": "officer@pd.gov",
      "link": "http://localhost:5000/signup?token=abc123"
    }
  ]
}
```

## Administrative APIs

### GET /api/admin/dashboard
**Purpose**: Get department-wide statistics and data (admin/super_admin only)
**Headers**: `Authorization: Bearer jwt_token`
```json
Response:
{
  "stats": {
    "activeTraces": 2,
    "completed": 1,
    "totalOfficers": 1,
    "monthlySpend": 995
  },
  "traces": [ /* all department traces */ ],
  "officers": [ /* all department officers */ ]
}
```

## External Service Integration Requirements

### Cryptocurrency Analysis Service (Chainalysis/Similar)
**Purpose**: Actual cryptocurrency tracing functionality
```javascript
// Mock implementation in server/routes.ts
const performCryptoTrace = async (address: string, cryptoType: string) => {
  // In production, this would call Chainalysis API
  const response = await chainalysisAPI.traceAddress({
    address,
    cryptocurrency: cryptoType,
    depth: 5,
    includeRiskScoring: true
  });
  
  return {
    address,
    cryptoType,
    totalTransactions: response.transactionCount,
    totalValue: response.totalValue,
    suspiciousAddresses: response.riskAddresses.length,
    riskScore: response.overallRisk,
    connectedAddresses: response.connectedAddresses,
    analysisTimestamp: new Date().toISOString()
  };
};
```

### Email Service (AWS SES/SendGrid)
**Purpose**: Send signup links and notifications
```javascript
// Mock implementation in server/routes.ts
const sendEmail = async (to: string, subject: string, body: string) => {
  // In production, integrate with:
  // - AWS SES
  // - SendGrid
  // - Similar email service
};
```

### Payment Processing (Stripe)
**Purpose**: Handle premium trace payments ($995)
```javascript
// Mock implementation in server/routes.ts
const mockStripe = {
  paymentIntents: {
    create: async (params) => ({ /* payment intent */ }),
    retrieve: async (id) => ({ /* payment details */ })
  }
};
```

### File Storage (AWS S3/Google Cloud Storage)
**Purpose**: Store and serve PDF reports
```javascript
// Future implementation needed for:
// - PDF report generation
// - Secure file storage
// - Report download links
```

## Environment Variables Required

```bash
# Database
DATABASE_URL=postgresql://user:pass@host:port/db

# Authentication
JWT_SECRET=your-secret-key-here

# External Services (when implementing)
CHAINALYSIS_API_KEY=your-chainalysis-key
STRIPE_SECRET_KEY=sk_live_your-stripe-key
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
MAIL_FROM=noreply@cryptotrace.gov

# Application
BASE_URL=https://your-domain.com
NODE_ENV=production
```

## Security Considerations

1. **JWT Authentication**: All protected endpoints require valid JWT token
2. **Role-based Access**: Admin endpoints check user role
3. **API Key Validation**: Police intake webhook validates department API key
4. **Input Validation**: All inputs validated with Zod schemas
5. **Password Hashing**: Bcrypt with salt rounds for password storage
6. **HTTPS Only**: All external communications over encrypted connections

## Rate Limiting (Recommended)

```javascript
// Implement rate limiting for:
// - Login attempts: 5/minute per IP
// - Signup attempts: 3/minute per IP  
// - Trace creation: 10/hour per user
// - API intake: 100/hour per API key
```

This API documentation covers all endpoints currently implemented and those needed for full production functionality.