-- V2: Seed verified Hospitals & OP Registration Types for Opriva

INSERT INTO hospitals (
    id, name, official_registration_number, provider_identifier, address, locality, city, state, postal_code,
    latitude, longitude, receptionist_phone, emergency_phone, email, google_place_id, google_rating, google_review_count,
    is_verified, verification_date, verified_by, created_at, updated_at
) VALUES 
(
    'hosp-001',
    'Apollo Health City',
    'REG-APO-TEL-2018-091',
    'PROV-APO-01',
    'Road No. 72, Opposite Bharatiya Vidya Bhavan, Film Nagar, Jubilee Hills',
    'Jubilee Hills',
    'Hyderabad',
    'Telangana',
    '500096',
    17.4156,
    78.4121,
    '+91-40-2360-7777',
    '+91-40-1066',
    'opd.jubileehills@apollohospitals.com',
    'ChIJb2u9oYCRyzsRxU1Y6f5Vb1k',
    4.4,
    8420,
    TRUE,
    '2024-01-15 10:00:00',
    'Health Dept Verified Authority',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    'hosp-002',
    'KIMS Hospitals',
    'REG-KIM-SEC-2016-144',
    'PROV-KIM-02',
    '1-8-31/1, Minister Road, Krishna Nagar Colony, Begumpet',
    'Secunderabad',
    'Hyderabad',
    'Telangana',
    '500003',
    17.4375,
    78.4851,
    '+91-40-4488-5000',
    '+91-40-4488-5100',
    'opdesk@kimshospitals.com',
    'ChIJk4yK59-RyzsR9H0m03wPcqY',
    4.3,
    5120,
    TRUE,
    '2024-02-10 11:30:00',
    'Health Dept Verified Authority',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    'hosp-003',
    'Manipal Hospital Old Airport Road',
    'REG-MAN-BLR-2015-882',
    'PROV-MAN-03',
    '98, HAL Old Airport Rd, Kodihalli',
    'HAL Old Airport Road',
    'Bengaluru',
    'Karnataka',
    '560017',
    12.9582,
    77.6493,
    '+91-80-2502-4444',
    '+91-80-2502-3333',
    'opd.blr@manipalhospitals.com',
    'ChIJbW78p3wWrjsRAK4F_HlVj4k',
    4.5,
    11890,
    TRUE,
    '2024-03-01 09:15:00',
    'Karnataka Medical Council',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    'hosp-004',
    'Government General Hospital',
    NULL, -- Official identifier not provided yet (explicitly NULL as required)
    'PROV-GGH-04',
    'Afzal Gunj, High Court Road',
    'Afzal Gunj',
    'Hyderabad',
    'Telangana',
    '500012',
    17.3753,
    78.4744,
    '+91-40-2460-0121',
    '+91-40-2460-0122',
    'contact@gghhyderabad.gov.in',
    'ChIJx0e7m1-SyzsRX0p4_rK2g_8',
    3.9,
    1640,
    TRUE,
    '2024-03-12 14:00:00',
    'State Medical Board',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Seed OP Registration Types (Normal and Special OP Cards)
INSERT INTO op_registration_types (
    id, hospital_id, type_code, display_name, fee_amount, currency, priority_level, description, is_active, created_at, updated_at
) VALUES
-- Apollo Jubilee Hills
('type-001', 'hosp-001', 'NORMAL', 'Normal OP Card', 350.00, 'INR', 1, 'Standard outpatient consultation card with general queue sequence', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('type-002', 'hosp-001', 'SPECIAL', 'Special Priority OP Card', 750.00, 'INR', 2, 'Priority expedited consultation card with dedicated queue access', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- KIMS Secunderabad
('type-003', 'hosp-002', 'NORMAL', 'Normal OP Card', 300.00, 'INR', 1, 'Standard outpatient consultation ticket', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('type-004', 'hosp-002', 'SPECIAL', 'Special Priority OP Card', 650.00, 'INR', 2, 'Fast-track priority queue OP card', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Manipal Bengaluru
('type-005', 'hosp-003', 'NORMAL', 'Normal OP Card', 400.00, 'INR', 1, 'General OP registration card', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('type-006', 'hosp-003', 'SPECIAL', 'Special Priority OP Card', 850.00, 'INR', 2, 'Executive priority OP card with priority queue assignment', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Govt General Hospital
('type-007', 'hosp-004', 'NORMAL', 'Normal OP Card', 50.00, 'INR', 1, 'Subsidized civic OP registration', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('type-008', 'hosp-004', 'SPECIAL', 'Special Priority OP Card', 150.00, 'INR', 2, 'Priority senior citizen and expedited OP queue', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
