-- V1: Initial Opriva Database Schema

CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(150) UNIQUE,
    phone VARCHAR(20) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    role VARCHAR(30) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    preferred_language VARCHAR(10) NOT NULL DEFAULT 'en',
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE TABLE patient_profiles (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL UNIQUE REFERENCES users(id),
    date_of_birth DATE,
    gender VARCHAR(20),
    blood_group VARCHAR(10),
    address VARCHAR(255),
    emergency_contact VARCHAR(20),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE TABLE dependents (
    id VARCHAR(36) PRIMARY KEY,
    primary_patient_id VARCHAR(36) NOT NULL REFERENCES users(id),
    full_name VARCHAR(150) NOT NULL,
    relationship VARCHAR(50) NOT NULL,
    date_of_birth DATE,
    gender VARCHAR(20),
    blood_group VARCHAR(10),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE TABLE hospitals (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    official_registration_number VARCHAR(100),
    provider_identifier VARCHAR(100),
    address VARCHAR(255) NOT NULL,
    locality VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    receptionist_phone VARCHAR(25),
    emergency_phone VARCHAR(25),
    email VARCHAR(150),
    google_place_id VARCHAR(100),
    google_rating DOUBLE PRECISION,
    google_review_count INT,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    verification_date TIMESTAMP,
    verified_by VARCHAR(150),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE TABLE op_registration_types (
    id VARCHAR(36) PRIMARY KEY,
    hospital_id VARCHAR(36) NOT NULL REFERENCES hospitals(id),
    type_code VARCHAR(20) NOT NULL, -- 'NORMAL', 'SPECIAL'
    display_name VARCHAR(100) NOT NULL,
    fee_amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    priority_level INT NOT NULL DEFAULT 1,
    description VARCHAR(255),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT uq_hospital_type UNIQUE (hospital_id, type_code)
);

CREATE TABLE slot_reservations (
    id VARCHAR(36) PRIMARY KEY,
    hospital_id VARCHAR(36) NOT NULL REFERENCES hospitals(id),
    op_registration_type_id VARCHAR(36) NOT NULL REFERENCES op_registration_types(id),
    patient_id VARCHAR(36) NOT NULL REFERENCES users(id),
    dependent_id VARCHAR(36) REFERENCES dependents(id),
    session_date DATE NOT NULL,
    slot_time VARCHAR(20) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    status VARCHAR(30) NOT NULL, -- 'RESERVED', 'EXPIRED', 'CONFIRMED'
    created_at TIMESTAMP NOT NULL
);

CREATE TABLE op_registrations (
    id VARCHAR(36) PRIMARY KEY,
    hospital_id VARCHAR(36) NOT NULL REFERENCES hospitals(id),
    op_registration_type_id VARCHAR(36) NOT NULL REFERENCES op_registration_types(id),
    patient_id VARCHAR(36) NOT NULL REFERENCES users(id),
    dependent_id VARCHAR(36) REFERENCES dependents(id),
    slot_reservation_id VARCHAR(36) REFERENCES slot_reservations(id),
    op_registration_number VARCHAR(50) NOT NULL UNIQUE,
    session_date DATE NOT NULL,
    fee_paid DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    status VARCHAR(30) NOT NULL, -- 'CONFIRMED', 'CANCELLED'
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE TABLE queue_tokens (
    id VARCHAR(36) PRIMARY KEY,
    hospital_id VARCHAR(36) NOT NULL REFERENCES hospitals(id),
    op_registration_id VARCHAR(36) NOT NULL UNIQUE REFERENCES op_registrations(id),
    op_registration_type_id VARCHAR(36) NOT NULL REFERENCES op_registration_types(id),
    token_number VARCHAR(30) NOT NULL,
    token_sequence INT NOT NULL,
    session_date DATE NOT NULL,
    queue_state VARCHAR(30) NOT NULL, -- 'WAITING', 'CALLED', 'IN_CONSULTATION', 'COMPLETED', 'NO_SHOW', 'CANCELLED'
    priority_weight INT NOT NULL DEFAULT 1,
    called_at TIMESTAMP,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE TABLE queue_state_history (
    id VARCHAR(36) PRIMARY KEY,
    queue_token_id VARCHAR(36) NOT NULL REFERENCES queue_tokens(id),
    from_state VARCHAR(30),
    to_state VARCHAR(30) NOT NULL,
    changed_by_user_id VARCHAR(36) REFERENCES users(id),
    reason VARCHAR(255),
    changed_at TIMESTAMP NOT NULL
);

CREATE TABLE payment_orders (
    id VARCHAR(36) PRIMARY KEY,
    slot_reservation_id VARCHAR(36) NOT NULL REFERENCES slot_reservations(id),
    patient_id VARCHAR(36) NOT NULL REFERENCES users(id),
    provider_order_id VARCHAR(100) NOT NULL UNIQUE,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    status VARCHAR(30) NOT NULL, -- 'PENDING', 'INITIATED', 'SUCCESSFUL', 'FAILED', 'EXPIRED', 'REFUNDED'
    idempotency_key VARCHAR(100) UNIQUE,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE TABLE payment_transactions (
    id VARCHAR(36) PRIMARY KEY,
    payment_order_id VARCHAR(36) NOT NULL REFERENCES payment_orders(id),
    provider_payment_id VARCHAR(100) NOT NULL UNIQUE,
    provider_signature VARCHAR(255),
    payment_method VARCHAR(50),
    status VARCHAR(30) NOT NULL,
    raw_response TEXT,
    created_at TIMESTAMP NOT NULL
);

CREATE TABLE digital_receipts (
    id VARCHAR(36) PRIMARY KEY,
    op_registration_id VARCHAR(36) NOT NULL UNIQUE REFERENCES op_registrations(id),
    receipt_number VARCHAR(50) NOT NULL UNIQUE,
    hospital_name VARCHAR(200) NOT NULL,
    patient_name VARCHAR(150) NOT NULL,
    registration_type_name VARCHAR(100) NOT NULL,
    fee_paid DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    payment_reference VARCHAR(100) NOT NULL,
    token_number VARCHAR(30) NOT NULL,
    issued_at TIMESTAMP NOT NULL
);

CREATE TABLE medical_documents (
    id VARCHAR(36) PRIMARY KEY,
    patient_id VARCHAR(36) NOT NULL REFERENCES users(id),
    dependent_id VARCHAR(36) REFERENCES dependents(id),
    file_name VARCHAR(255) NOT NULL,
    file_size BIGINT NOT NULL,
    content_type VARCHAR(100) NOT NULL,
    storage_key VARCHAR(500) NOT NULL,
    document_category VARCHAR(50) NOT NULL, -- 'LAB_REPORT', 'PRESCRIPTION', 'SCAN', 'DISCHARGE_SUMMARY', 'OTHER'
    document_date DATE,
    description VARCHAR(500),
    uploaded_by_user_id VARCHAR(36) NOT NULL REFERENCES users(id),
    created_at TIMESTAMP NOT NULL
);

CREATE TABLE document_sharing_grants (
    id VARCHAR(36) PRIMARY KEY,
    medical_document_id VARCHAR(36) NOT NULL REFERENCES medical_documents(id),
    hospital_id VARCHAR(36) NOT NULL REFERENCES hospitals(id),
    authorized_clinician_id VARCHAR(36) REFERENCES users(id),
    granted_at TIMESTAMP NOT NULL,
    expires_at TIMESTAMP,
    is_revoked BOOLEAN NOT NULL DEFAULT FALSE,
    revoked_at TIMESTAMP
);

CREATE TABLE visit_records (
    id VARCHAR(36) PRIMARY KEY,
    hospital_id VARCHAR(36) NOT NULL REFERENCES hospitals(id),
    patient_id VARCHAR(36) NOT NULL REFERENCES users(id),
    dependent_id VARCHAR(36) REFERENCES dependents(id),
    op_registration_id VARCHAR(36) REFERENCES op_registrations(id),
    consultation_date DATE NOT NULL,
    clinician_name VARCHAR(150) NOT NULL,
    clinician_registration_no VARCHAR(100),
    diagnosis_summary VARCHAR(500),
    clinical_notes TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'COMPLETED',
    created_at TIMESTAMP NOT NULL
);

CREATE TABLE prescriptions (
    id VARCHAR(36) PRIMARY KEY,
    visit_record_id VARCHAR(36) NOT NULL REFERENCES visit_records(id),
    hospital_id VARCHAR(36) NOT NULL REFERENCES hospitals(id),
    patient_id VARCHAR(36) NOT NULL REFERENCES users(id),
    dependent_id VARCHAR(36) REFERENCES dependents(id),
    clinician_name VARCHAR(150) NOT NULL,
    clinician_license_no VARCHAR(100),
    prescription_number VARCHAR(50) NOT NULL UNIQUE,
    instructions TEXT,
    digital_signature_hash VARCHAR(255),
    signed_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL
);

CREATE TABLE prescription_items (
    id VARCHAR(36) PRIMARY KEY,
    prescription_id VARCHAR(36) NOT NULL REFERENCES prescriptions(id),
    medicine_name VARCHAR(150) NOT NULL,
    dosage VARCHAR(100) NOT NULL,
    frequency VARCHAR(100) NOT NULL,
    duration VARCHAR(100) NOT NULL,
    special_instructions VARCHAR(255)
);

CREATE TABLE notifications (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL REFERENCES users(id),
    title VARCHAR(200) NOT NULL,
    message VARCHAR(1000) NOT NULL,
    notification_type VARCHAR(50) NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    metadata_json TEXT,
    created_at TIMESTAMP NOT NULL
);

CREATE TABLE audit_logs (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id VARCHAR(100),
    details TEXT,
    ip_address VARCHAR(50),
    created_at TIMESTAMP NOT NULL
);

-- Indexes for lightning fast lookups
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_hospitals_city ON hospitals(city);
CREATE INDEX idx_hospitals_locality ON hospitals(locality);
CREATE INDEX idx_op_reg_patient ON op_registrations(patient_id);
CREATE INDEX idx_queue_tokens_hospital_date ON queue_tokens(hospital_id, session_date);
CREATE INDEX idx_queue_tokens_state ON queue_tokens(queue_state);
CREATE INDEX idx_med_docs_patient ON medical_documents(patient_id);
CREATE INDEX idx_notif_user ON notifications(user_id, is_read);
