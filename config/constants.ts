/**
 * Application-wide constants
 */

// Platform fees
export const PLATFORM_FEES = {
  PAYMENT_FEE_PERCENTAGE: 1, // 1% fee on payments
  WITHDRAWAL_FEE_PERCENTAGE: 0.5, // 0.5% fee on withdrawals
  MINIMUM_FEE: 10, // Minimum fee in KSH
}

// Transaction limits
export const TRANSACTION_LIMITS = {
  MIN_TOPUP_AMOUNT: 100, // Minimum top-up amount in KSH
  MAX_TOPUP_AMOUNT: 100000, // Maximum top-up amount in KSH
  MIN_PAYMENT_AMOUNT: 10, // Minimum payment amount in KSH
  MAX_PAYMENT_AMOUNT: 50000, // Maximum payment amount in KSH
  MIN_WITHDRAWAL_AMOUNT: 500, // Minimum withdrawal amount in KSH
  MAX_WITHDRAWAL_AMOUNT: 70000, // Maximum withdrawal amount in KSH
}

// Exchange rates (in a real app, these would come from an API)
export const EXCHANGE_RATES = {
  USD: 130.25,
  EUR: 142.5,
  GBP: 167.8,
  JPY: 0.88,
  AUD: 86.45,
}

// Supported currencies
export const SUPPORTED_CURRENCIES = ["USD", "EUR", "GBP", "JPY", "AUD"]

// User roles
export const USER_ROLES = {
  TOURIST: "tourist",
  BUSINESS: "business",
  ADMIN: "admin",
}

// Transaction types
export const TRANSACTION_TYPES = {
  TOPUP: "topup",
  PAYMENT: "payment",
  WITHDRAWAL: "withdrawal",
}

// Transaction statuses
export const TRANSACTION_STATUSES = {
  PENDING: "pending",
  COMPLETED: "completed",
  FAILED: "failed",
}

// Payment methods
export const PAYMENT_METHODS = {
  PAYPAL: "paypal",
  MPESA: "mpesa",
  BANK: "bank",
}

// API endpoints
export const API_ENDPOINTS = {
  TOPUP: "/api/topup",
  PAY: "/api/pay",
  WITHDRAW: "/api/withdraw",
  ADMIN_STATS: "/api/admin/stats",
  MPESA_CALLBACK: "/api/mpesa-callback",
}

// Local storage keys
export const STORAGE_KEYS = {
  USER: "kenyapay_user",
  AUTH_TOKEN: "kenyapay_auth_token",
}

// Timeouts
export const TIMEOUTS = {
  SESSION_EXPIRY: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  PAYMENT_CONFIRMATION: 60 * 1000, // 1 minute in milliseconds
}

// Routes
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  TOURIST_DASHBOARD: "/tourist/dashboard",
  BUSINESS_DASHBOARD: "/business/dashboard",
  ADMIN_DASHBOARD: "/admin",
  TOPUP: "/topup",
  PAY: "/pay",
  WITHDRAW: "/business/withdraw",
  SETTINGS: "/settings",
}
