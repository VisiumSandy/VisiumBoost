-- ═══════════════════════════════════════════════════════════
-- RIWIL — Supabase Database Schema
-- Run this in your Supabase SQL Editor to set up the DB
-- ═══════════════════════════════════════════════════════════

-- ─── Users (extends Supabase Auth) ──────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  company_name TEXT,
  plan TEXT DEFAULT 'starter',
  referral_code TEXT UNIQUE,
  referred_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Clients (businesses managed by user) ───────────────
CREATE TABLE IF NOT EXISTS clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  google_review_link TEXT,
  socials JSONB DEFAULT '[]',
  scans INTEGER DEFAULT 0,
  reviews INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Wheel Configs ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS wheel_configs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  primary_color TEXT DEFAULT '#6C5CE7',
  secondary_color TEXT DEFAULT '#00B894',
  cta_text TEXT DEFAULT 'Laissez-nous un avis et tentez votre chance !',
  logo_url TEXT,
  rewards JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Codes (anti-fraud, one-time use) ───────────────────
CREATE TABLE IF NOT EXISTS codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  code TEXT NOT NULL UNIQUE,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  used_at TIMESTAMPTZ
);

-- Index for fast code lookup
CREATE INDEX IF NOT EXISTS idx_codes_code ON codes(code);
CREATE INDEX IF NOT EXISTS idx_codes_client_used ON codes(client_id, used);

-- ─── Spins (wheel results log) ──────────────────────────
CREATE TABLE IF NOT EXISTS spins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  code_id UUID REFERENCES codes(id),
  reward_name TEXT NOT NULL,
  reward_index INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Scans (QR code scan tracking) ─────────────────────
CREATE TABLE IF NOT EXISTS scans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Affiliations ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS affiliations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  referred_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'trial', -- trial, active, cancelled
  commission_amount DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Row Level Security ─────────────────────────────────
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE wheel_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE spins ENABLE ROW LEVEL SECURITY;
ALTER TABLE scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliations ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
CREATE POLICY "Users access own profile"
  ON profiles FOR ALL
  USING (auth.uid() = id);

CREATE POLICY "Users access own clients"
  ON clients FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users access own wheel configs"
  ON wheel_configs FOR ALL
  USING (
    client_id IN (SELECT id FROM clients WHERE user_id = auth.uid())
  );

CREATE POLICY "Users access own codes"
  ON codes FOR ALL
  USING (
    client_id IN (SELECT id FROM clients WHERE user_id = auth.uid())
  );

-- Public can validate codes (for the play page)
CREATE POLICY "Public can read codes for validation"
  ON codes FOR SELECT
  USING (true);

CREATE POLICY "Public can update codes (mark used)"
  ON codes FOR UPDATE
  USING (true);

-- Public can insert spins
CREATE POLICY "Public can insert spins"
  ON spins FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can read own spins"
  ON spins FOR SELECT
  USING (
    client_id IN (SELECT id FROM clients WHERE user_id = auth.uid())
  );

-- Public can insert scans
CREATE POLICY "Public can insert scans"
  ON scans FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can read own scans"
  ON scans FOR SELECT
  USING (
    client_id IN (SELECT id FROM clients WHERE user_id = auth.uid())
  );
