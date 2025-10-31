/*
  # Emergency Incident Reporting, Medicine Verification, and Chatbot Enhancement Schema

  ## Overview
  This migration creates tables to support:
  - Emergency incident reporting with multi-modal input
  - Medicine verification and tracking
  - Enhanced chatbot with medicine reminders
  - Doctor/Hospital availability tracking

  ## New Tables

  ### emergency_incidents
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key to auth.users)
  - `incident_type` (text) - type of emergency
  - `description` (text) - text description of incident
  - `voice_description_url` (text) - URL to stored voice recording
  - `photo_url` (text) - URL to incident photo
  - `latitude` (numeric) - GPS latitude
  - `longitude` (numeric) - GPS longitude
  - `address` (text) - resolved address
  - `priority` (text) - low, medium, high, critical
  - `status` (text) - pending, assigned, in_progress, resolved
  - `assigned_doctor_id` (uuid) - assigned doctor
  - `assigned_hospital` (text) - assigned hospital name
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### medicine_reminders
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key to auth.users)
  - `medicine_name` (text)
  - `dosage` (text)
  - `frequency` (text) - once, twice, thrice daily, etc.
  - `time_slots` (jsonb) - array of reminder times
  - `start_date` (date)
  - `end_date` (date)
  - `notes` (text)
  - `is_active` (boolean)
  - `created_at` (timestamptz)

  ### medicine_verifications
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key to auth.users)
  - `medicine_name` (text)
  - `batch_number` (text)
  - `expiry_date` (date)
  - `manufacturer` (text)
  - `photo_url` (text)
  - `verification_status` (text) - safe, warning, counterfeit, expired
  - `verification_details` (jsonb)
  - `verified_at` (timestamptz)
  - `created_at` (timestamptz)

  ### trusted_medicines
  - `id` (uuid, primary key)
  - `medicine_name` (text)
  - `generic_name` (text)
  - `manufacturer` (text)
  - `valid_batch_patterns` (text[])
  - `description` (text)
  - `side_effects` (text[])
  - `created_at` (timestamptz)

  ### doctor_availability
  - `id` (uuid, primary key)
  - `doctor_id` (uuid, foreign key to auth.users)
  - `is_available` (boolean)
  - `current_location` (text)
  - `latitude` (numeric)
  - `longitude` (numeric)
  - `specialization` (text)
  - `max_emergency_capacity` (int)
  - `current_emergency_count` (int)
  - `updated_at` (timestamptz)

  ### chatbot_conversations
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key to auth.users)
  - `conversation_type` (text) - medical_query, reminder, emergency
  - `user_message` (text)
  - `bot_response` (text)
  - `voice_input` (boolean)
  - `voice_output` (boolean)
  - `context_data` (jsonb) - stores conversation context
  - `created_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Users can read/write their own data
  - Doctors can read emergency incidents assigned to them
  - Admins have full access
*/

-- Emergency Incidents Table
CREATE TABLE IF NOT EXISTS emergency_incidents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  incident_type text NOT NULL,
  description text,
  voice_description_url text,
  photo_url text,
  latitude numeric,
  longitude numeric,
  address text,
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'assigned', 'in_progress', 'resolved', 'cancelled')),
  assigned_doctor_id uuid REFERENCES auth.users(id),
  assigned_hospital text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE emergency_incidents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own emergency incidents"
  ON emergency_incidents FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create emergency incidents"
  ON emergency_incidents FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own emergency incidents"
  ON emergency_incidents FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Doctors can view assigned emergency incidents"
  ON emergency_incidents FOR SELECT
  TO authenticated
  USING (auth.uid() = assigned_doctor_id);

-- Medicine Reminders Table
CREATE TABLE IF NOT EXISTS medicine_reminders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  medicine_name text NOT NULL,
  dosage text NOT NULL,
  frequency text NOT NULL,
  time_slots jsonb DEFAULT '[]'::jsonb,
  start_date date NOT NULL,
  end_date date,
  notes text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE medicine_reminders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own medicine reminders"
  ON medicine_reminders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create medicine reminders"
  ON medicine_reminders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own medicine reminders"
  ON medicine_reminders FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own medicine reminders"
  ON medicine_reminders FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Medicine Verifications Table
CREATE TABLE IF NOT EXISTS medicine_verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  medicine_name text NOT NULL,
  batch_number text,
  expiry_date date,
  manufacturer text,
  photo_url text,
  verification_status text DEFAULT 'pending' CHECK (verification_status IN ('pending', 'safe', 'warning', 'counterfeit', 'expired')),
  verification_details jsonb DEFAULT '{}'::jsonb,
  verified_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE medicine_verifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own medicine verifications"
  ON medicine_verifications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create medicine verifications"
  ON medicine_verifications FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Trusted Medicines Database
CREATE TABLE IF NOT EXISTS trusted_medicines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  medicine_name text NOT NULL,
  generic_name text,
  manufacturer text NOT NULL,
  valid_batch_patterns text[],
  description text,
  side_effects text[],
  created_at timestamptz DEFAULT now(),
  UNIQUE(medicine_name, manufacturer)
);

ALTER TABLE trusted_medicines ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read trusted medicines"
  ON trusted_medicines FOR SELECT
  TO authenticated
  USING (true);

-- Doctor Availability Table
CREATE TABLE IF NOT EXISTS doctor_availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  is_available boolean DEFAULT false,
  current_location text,
  latitude numeric,
  longitude numeric,
  specialization text,
  max_emergency_capacity int DEFAULT 5,
  current_emergency_count int DEFAULT 0,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(doctor_id)
);

ALTER TABLE doctor_availability ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read doctor availability"
  ON doctor_availability FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Doctors can update own availability"
  ON doctor_availability FOR UPDATE
  TO authenticated
  USING (auth.uid() = doctor_id)
  WITH CHECK (auth.uid() = doctor_id);

CREATE POLICY "Doctors can insert own availability"
  ON doctor_availability FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = doctor_id);

-- Chatbot Conversations Table
CREATE TABLE IF NOT EXISTS chatbot_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  conversation_type text DEFAULT 'medical_query' CHECK (conversation_type IN ('medical_query', 'reminder', 'emergency', 'medicine_info')),
  user_message text NOT NULL,
  bot_response text,
  voice_input boolean DEFAULT false,
  voice_output boolean DEFAULT false,
  context_data jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE chatbot_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own chatbot conversations"
  ON chatbot_conversations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create chatbot conversations"
  ON chatbot_conversations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_emergency_incidents_user_id ON emergency_incidents(user_id);
CREATE INDEX IF NOT EXISTS idx_emergency_incidents_status ON emergency_incidents(status);
CREATE INDEX IF NOT EXISTS idx_emergency_incidents_priority ON emergency_incidents(priority);
CREATE INDEX IF NOT EXISTS idx_emergency_incidents_location ON emergency_incidents(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_medicine_reminders_user_id ON medicine_reminders(user_id);
CREATE INDEX IF NOT EXISTS idx_medicine_reminders_active ON medicine_reminders(is_active);
CREATE INDEX IF NOT EXISTS idx_medicine_verifications_user_id ON medicine_verifications(user_id);
CREATE INDEX IF NOT EXISTS idx_doctor_availability_doctor_id ON doctor_availability(doctor_id);
CREATE INDEX IF NOT EXISTS idx_doctor_availability_available ON doctor_availability(is_available);
CREATE INDEX IF NOT EXISTS idx_chatbot_conversations_user_id ON chatbot_conversations(user_id);

-- Insert sample trusted medicines data
INSERT INTO trusted_medicines (medicine_name, generic_name, manufacturer, valid_batch_patterns, description, side_effects) VALUES
('Paracetamol 500mg', 'Paracetamol', 'Cipla Ltd', ARRAY['PCM%', 'PAR%'], 'Pain reliever and fever reducer', ARRAY['Nausea', 'Stomach pain', 'Loss of appetite']),
('Dolo 650', 'Paracetamol', 'Micro Labs', ARRAY['DOL%', 'DL%'], 'Fever and pain relief medication', ARRAY['Nausea', 'Allergic reactions']),
('Crocin 650', 'Paracetamol', 'GSK', ARRAY['CRO%', 'CR%'], 'Fever and pain relief', ARRAY['Nausea', 'Vomiting']),
('Azithromycin 500mg', 'Azithromycin', 'Cipla Ltd', ARRAY['AZI%', 'AZ%'], 'Antibiotic for bacterial infections', ARRAY['Diarrhea', 'Nausea', 'Stomach pain']),
('Metformin 500mg', 'Metformin', 'Sun Pharma', ARRAY['MET%', 'MF%'], 'Diabetes medication', ARRAY['Diarrhea', 'Nausea', 'Stomach upset'])
ON CONFLICT (medicine_name, manufacturer) DO NOTHING;
