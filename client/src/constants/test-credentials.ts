// Test credentials for development and demo purposes
// These are mock values used for form pre-population during development
export const TEST_CREDENTIALS = {
  VICTIM: {
    caseNumber: "CRY-2024-78432",
    email: "test@test.com", 
    password: "password"
  },
  ADMIN: {
    badgeNumber: "ADMIN-4987",
    email: "test@test.com",
    password: "password",
    department: "METRO-CYBER-01"
  },
  OFFICER: {
    email: "test@test.com",
    password: "password"
  }
} as const;