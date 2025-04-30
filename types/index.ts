// User types
export interface User {
  id: string
  email: string
  name: string
  role: "tourist" | "business" | "admin"
  country?: string
  business_name?: string
  business_type?: string
  created_at: string
}

// Wallet types
export interface Wallet {
  id: string
  user_id: string
  balance: number
  currency: string
  updated_at: string
}

// Transaction types
export interface Transaction {
  id: string
  from_user_id?: string
  to_user_id?: string
  amount: number
  type: "topup" | "payment" | "withdrawal"
  status: "pending" | "completed" | "failed"
  payment_method?: "paypal" | "mpesa" | "bank"
  reference?: string
  created_at: string
}

// Business types
export interface Business {
  id: string
  user_id: string
  name: string
  type: string
  location: string
  contact_phone: string
  contact_email: string
  verified: boolean
  created_at: string
}

// Payout Request types
export interface PayoutRequest {
  id: string
  business_id: string
  amount: number
  status: "pending" | "processing" | "completed" | "failed"
  payment_method: "mpesa" | "bank"
  account_details: {
    phoneNumber?: string
    bankName?: string
    accountNumber?: string
    accountName?: string
  }
  created_at: string
  processed_at?: string
}

// Exchange Rate types
export interface ExchangeRate {
  currency: string
  rate: number
  updated_at: string
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

// PayPal types
export interface PayPalOrderResponse {
  id: string
  status: string
  links: Array<{
    href: string
    rel: string
    method: string
  }>
}

export interface PayPalCaptureResponse {
  id: string
  status: string
  purchase_units: Array<{
    reference_id: string
    shipping: any
    payments: {
      captures: Array<{
        id: string
        status: string
        amount: {
          currency_code: string
          value: string
        }
      }>
    }
  }>
  payer: {
    name: {
      given_name: string
      surname: string
    }
    email_address: string
    payer_id: string
  }
}

// M-Pesa types
export interface STKPushRequest {
  phoneNumber: string
  amount: number
  accountReference: string
  transactionDesc: string
}

export interface STKPushResponse {
  MerchantRequestID: string
  CheckoutRequestID: string
  ResponseCode: string
  ResponseDescription: string
  CustomerMessage: string
}

export interface STKPushQueryResponse {
  ResponseCode: string
  ResponseDescription: string
  MerchantRequestID: string
  CheckoutRequestID: string
  ResultCode: string
  ResultDesc: string
}
