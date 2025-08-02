// Test credentials for development and demo purposes
// These are mock values used for form pre-population during development
export const TEST_CREDENTIALS = {
  VICTIM: {
    caseNumber: "CRY-2024-78432",
    email: "victim@test.com", 
    password: "victim123"
  },
  ADMIN: {
    badgeNumber: "ADMIN-4987",
    email: "admin@test.com",
    password: "admin123",
    department: "METRO-CYBER-01"
  },
  OFFICER: {
    email: "officer@test.com",
    password: "officer123"
  }
} as const;