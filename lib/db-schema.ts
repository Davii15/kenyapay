/**
 * This file contains the database schema definitions for reference.
 * These are the tables that should be created in Supabase.
 */

/**
 * Users Table
 * Stores information about all users (tourists, businesses, admins)
 *
 * CREATE TABLE users (
 *   id UUID PRIMARY KEY REFERENCES auth.users(id),
 *   email TEXT UNIQUE NOT NULL,
 *   name TEXT NOT NULL,
 *   role TEXT NOT NULL CHECK (role IN ('tourist', 'business', 'admin')),
 *   country TEXT,
 *   business_name TEXT,
 *   business_type TEXT,
 *   passport_document_url TEXT,
 *   business_license_url TEXT,
 *   verification_status TEXT NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
 *   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
 * );
 *
 * -- Create indexes
 * CREATE INDEX idx_users_email ON users(email);
 * CREATE INDEX idx_users_role ON users(role);
 * CREATE INDEX idx_users_verification_status ON users(verification_status);
 */

/**
 * Wallets Table
 * Stores wallet information for all users
 *
 * CREATE TABLE wallets (
 *   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 *   user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 *   balance DECIMAL(12, 2) NOT NULL DEFAULT 0,
 *   currency TEXT NOT NULL DEFAULT 'KSH',
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
 *   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
 *   UNIQUE(user_id)
 * );
 *
 * -- Create indexes
 * CREATE INDEX idx_wallets_user_id ON wallets(user_id);
 */

/**
 * Transactions Table
 * Records all financial transactions in the system
 *
 * CREATE TABLE transactions (
 *   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 *   from_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
 *   to_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
 *   amount DECIMAL(12, 2) NOT NULL,
 *   type TEXT NOT NULL CHECK (type IN ('topup', 'payment', 'withdrawal')),
 *   status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'failed')),
 *   payment_method TEXT CHECK (payment_method IN ('paypal', 'mpesa', 'bank')),
 *   reference TEXT,
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
 *   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
 * );
 *
 * -- Create indexes
 * CREATE INDEX idx_transactions_from_user_id ON transactions(from_user_id);
 * CREATE INDEX idx_transactions_to_user_id ON transactions(to_user_id);
 * CREATE INDEX idx_transactions_type ON transactions(type);
 * CREATE INDEX idx_transactions_status ON transactions(status);
 * CREATE INDEX idx_transactions_created_at ON transactions(created_at);
 */

/**
 * Businesses Table
 * Additional information specific to business users
 *
 * CREATE TABLE businesses (
 *   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 *   user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 *   name TEXT NOT NULL,
 *   type TEXT NOT NULL,
 *   location TEXT NOT NULL,
 *   contact_phone TEXT,
 *   contact_email TEXT,
 *   verified BOOLEAN NOT NULL DEFAULT false,
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
 *   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
 *   UNIQUE(user_id)
 * );
 *
 * -- Create indexes
 * CREATE INDEX idx_businesses_user_id ON businesses(user_id);
 * CREATE INDEX idx_businesses_verified ON businesses(verified);
 */

/**
 * Payout Requests Table
 * Records withdrawal requests from businesses
 *
 * CREATE TABLE payout_requests (
 *   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 *   business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
 *   amount DECIMAL(12, 2) NOT NULL,
 *   status TEXT NOT NULL CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
 *   payment_method TEXT NOT NULL CHECK (payment_method IN ('mpesa', 'bank')),
 *   account_details JSONB NOT NULL,
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
 *   processed_at TIMESTAMP WITH TIME ZONE,
 *   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
 * );
 *
 * -- Create indexes
 * CREATE INDEX idx_payout_requests_business_id ON payout_requests(business_id);
 * CREATE INDEX idx_payout_requests_status ON payout_requests(status);
 * CREATE INDEX idx_payout_requests_created_at ON payout_requests(created_at);
 */

/**
 * Exchange Rates Table
 * Stores current exchange rates for different currencies
 *
 * CREATE TABLE exchange_rates (
 *   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 *   currency TEXT NOT NULL UNIQUE,
 *   rate DECIMAL(12, 6) NOT NULL,
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
 *   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
 * );
 *
 * -- Create indexes
 * CREATE INDEX idx_exchange_rates_currency ON exchange_rates(currency);
 */

/**
 * Platform Revenue Table
 * Records platform revenue from fees and margins
 *
 * CREATE TABLE platform_revenue (
 *   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 *   source TEXT NOT NULL CHECK (source IN ('topup_margin', 'withdrawal_fee')),
 *   amount DECIMAL(12, 2) NOT NULL,
 *   transaction_id UUID REFERENCES transactions(id) ON DELETE SET NULL,
 *   description TEXT,
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
 * );
 *
 * -- Create indexes
 * CREATE INDEX idx_platform_revenue_source ON platform_revenue(source);
 * CREATE INDEX idx_platform_revenue_created_at ON platform_revenue(created_at);
 */

/**
 * Admin Logs Table
 * Tracks all administrative actions in the system
 *
 * CREATE TABLE admin_logs (
 *   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 *   admin_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 *   action TEXT NOT NULL,
 *   entity_type TEXT NOT NULL CHECK (entity_type IN ('user', 'business', 'transaction', 'payout', 'system')),
 *   entity_id UUID,
 *   details JSONB,
 *   ip_address TEXT,
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
 * );
 *
 * -- Create indexes
 * CREATE INDEX idx_admin_logs_admin_id ON admin_logs(admin_id);
 * CREATE INDEX idx_admin_logs_entity_type ON admin_logs(entity_type);
 * CREATE INDEX idx_admin_logs_created_at ON admin_logs(created_at);
 */

/**
 * Payments Table
 * Detailed payment information linked to transactions
 *
 * CREATE TABLE payments (
 *   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 *   transaction_id UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
 *   payment_provider TEXT NOT NULL CHECK (payment_provider IN ('paypal', 'mpesa', 'bank', 'wallet')),
 *   provider_transaction_id TEXT,
 *   amount DECIMAL(12, 2) NOT NULL,
 *   currency TEXT NOT NULL,
 *   status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
 *   payment_details JSONB,
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
 *   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
 * );
 *
 * -- Create indexes
 * CREATE INDEX idx_payments_transaction_id ON payments(transaction_id);
 * CREATE INDEX idx_payments_payment_provider ON payments(payment_provider);
 * CREATE INDEX idx_payments_status ON payments(status);
 * CREATE INDEX idx_payments_created_at ON payments(created_at);
 */

/**
 * QR Codes Table
 * Stores QR code information for businesses
 *
 * CREATE TABLE qr_codes (
 *   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 *   business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
 *   type TEXT NOT NULL CHECK (type IN ('static', 'dynamic')),
 *   amount DECIMAL(12, 2),
 *   is_fixed_amount BOOLEAN NOT NULL DEFAULT false,
 *   title TEXT,
 *   description TEXT,
 *   times_scanned INTEGER NOT NULL DEFAULT 0,
 *   active BOOLEAN NOT NULL DEFAULT true,
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
 *   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
 * );
 *
 * -- Create indexes
 * CREATE INDEX idx_qr_codes_business_id ON qr_codes(business_id);
 * CREATE INDEX idx_qr_codes_active ON qr_codes(active);
 *
 * -- Create function to increment scan count
 * CREATE OR REPLACE FUNCTION increment_qr_scan(qr_id UUID)
 * RETURNS VOID AS $$
 * BEGIN
 *   UPDATE qr_codes
 *   SET times_scanned = times_scanned + 1,
 *       updated_at = NOW()
 *   WHERE id = qr_id;
 * END;
 * $$ LANGUAGE plpgsql;
 */

/**
 * Topups Table
 * Detailed information about wallet top-ups
 *
 * CREATE TABLE topups (
 *   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 *   user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 *   transaction_id UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
 *   amount DECIMAL(12, 2) NOT NULL,
 *   source_currency TEXT NOT NULL,
 *   exchange_rate DECIMAL(12, 6) NOT NULL,
 *   ksh_amount DECIMAL(12, 2) NOT NULL,
 *   payment_provider TEXT NOT NULL CHECK (payment_provider IN ('paypal', 'mpesa', 'bank')),
 *   status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'failed')),
 *   provider_reference TEXT,
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
 *   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
 * );
 *
 * -- Create indexes
 * CREATE INDEX idx_topups_user_id ON topups(user_id);
 * CREATE INDEX idx_topups_transaction_id ON topups(transaction_id);
 * CREATE INDEX idx_topups_status ON topups(status);
 * CREATE INDEX idx_topups_created_at ON topups(created_at);
 */

/**
 * Storage Buckets
 * Create a storage bucket for user documents
 *
 * -- Enable Storage
 * CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
 *
 * -- Create bucket for user documents
 * INSERT INTO storage.buckets (id, name, public)
 * VALUES ('user_documents', 'user_documents', false);
 *
 * -- Set up access policies for the bucket
 * CREATE POLICY "User Documents Access Policy"
 * ON storage.objects FOR SELECT
 * TO authenticated
 * USING (bucket_id = 'user_documents' AND auth.uid()::text = (storage.foldername(name))[1]);
 *
 * CREATE POLICY "User Documents Insert Policy"
 * ON storage.objects FOR INSERT
 * TO authenticated
 * WITH CHECK (bucket_id = 'user_documents' AND auth.uid()::text = (storage.foldername(name))[1]);
 */

export {}
