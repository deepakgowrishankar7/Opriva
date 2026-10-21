export interface HospitalBranch {
  id: string;
  name: string;
  locality: string;
  city: string;
  state: string;
  counters: string[];
  doctorRooms: string[];
  receptionistEmail: string;
  doctorEmail: string;
  doctorName: string;
  department: string;
  status: 'ACTIVE' | 'ONBOARDING' | 'PENDING_AUDIT';
  contactPhone?: string;
  bedCapacity?: number;
  dailyOpdCapacity?: number;
}

export interface HospitalNetwork {
  id: string;
  name: string;
  code: string;
  tagline: string;
  status: 'ACTIVE' | 'PILOT' | 'ONBOARDING';
  badge: string;
  website?: string;
  accreditations?: string[];
  branches: HospitalBranch[];
  createdAt?: string;
}

export const INITIAL_HOSPITAL_NETWORKS: HospitalNetwork[] = [
  {
    id: 'apollo',
    name: 'Apollo Hospitals Enterprise',
    code: 'APOLLO',
    tagline: 'Touched By A Billion Lives',
    status: 'ACTIVE',
    badge: 'Primary Partner Network',
    website: 'https://www.apollohospitals.com',
    accreditations: ['NABH', 'JCI Gold Seal', 'NABL Accredited Lab', 'ABDM M1 & M2 Certified'],
    branches: [
      {
        id: 'apollo-hyd-jubilee',
        name: 'Apollo Health City (Jubilee Hills)',
        locality: 'Road No. 72, Film Nagar',
        city: 'Hyderabad',
        state: 'Telangana',
        counters: [
          'Counter 1 • General OP Desk',
          'Counter 2 • Special Priority & Senior Care',
          'Counter 3 • Cash & Billing Desk'
        ],
        doctorRooms: [
          'Room 102 • Dr. Rajesh Sharma (General Medicine)',
          'Room 104 • Dr. Priya Nair (Pediatrics)',
          'Room 106 • Dr. Arvind Rao (Cardiology)'
        ],
        receptionistEmail: 'receptionist@apollo.opriva.com',
        doctorEmail: 'dr.sharma@apollo.opriva.com',
        doctorName: 'Dr. Rajesh Sharma, MD',
        department: 'General Medicine & OPD Diagnostics',
        status: 'ACTIVE',
        contactPhone: '+91 40 2360 7777',
        bedCapacity: 550,
        dailyOpdCapacity: 1200
      },
      {
        id: 'apollo-blr-bannerghatta',
        name: 'Apollo Hospital (Bannerghatta Road)',
        locality: 'Bannerghatta Main Road',
        city: 'Bengaluru',
        state: 'Karnataka',
        counters: [
          'Counter 1 • OPD Reception Desk',
          'Counter 2 • Priority Queue Counter'
        ],
        doctorRooms: [
          'Room 201 • Dr. Ramesh Babu (Internal Medicine)',
          'Room 203 • Dr. Suman Reddy (Orthopedics)'
        ],
        receptionistEmail: 'reception.blr@apollo.opriva.com',
        doctorEmail: 'dr.ramesh@apollo.opriva.com',
        doctorName: 'Dr. Ramesh Babu, MS',
        department: 'Internal Medicine',
        status: 'ACTIVE',
        contactPhone: '+91 80 2630 4050',
        bedCapacity: 250,
        dailyOpdCapacity: 600
      },
      {
        id: 'apollo-chn-greams',
        name: 'Apollo Main Hospital (Greams Road)',
        locality: 'Greams Lane, Thousand Lights',
        city: 'Chennai',
        state: 'Tamil Nadu',
        counters: [
          'Counter 1 • Outpatient Registration'
        ],
        doctorRooms: [
          'Room 101 • Dr. Meenakshi Sundaram (General OPD)'
        ],
        receptionistEmail: 'reception.chn@apollo.opriva.com',
        doctorEmail: 'dr.meenakshi@apollo.opriva.com',
        doctorName: 'Dr. Meenakshi Sundaram',
        department: 'General Medicine',
        status: 'ACTIVE',
        contactPhone: '+91 44 2829 0200',
        bedCapacity: 600,
        dailyOpdCapacity: 1400
      },
      {
        id: 'apollo-del-sarita-vihar',
        name: 'Indraprastha Apollo Hospitals',
        locality: 'Delhi-Mathura Road, Sarita Vihar',
        city: 'New Delhi',
        state: 'Delhi NCR',
        counters: [
          'Counter 1 • Central OPD Desk'
        ],
        doctorRooms: [
          'Room 305 • Dr. Vikram Sethi (Consultant Physician)'
        ],
        receptionistEmail: 'reception.del@apollo.opriva.com',
        doctorEmail: 'dr.sethi@apollo.opriva.com',
        doctorName: 'Dr. Vikram Sethi',
        department: 'Consultant Medicine',
        status: 'ACTIVE',
        contactPhone: '+91 11 2692 5858',
        bedCapacity: 710,
        dailyOpdCapacity: 1500
      }
    ]
  },
  {
    id: 'aiims',
    name: 'AIIMS (All India Institute of Medical Sciences)',
    code: 'AIIMS',
    tagline: 'Apex Public Healthcare & Research',
    status: 'PILOT',
    badge: 'Govt. ABDM Partner Pilot',
    website: 'https://www.aiims.edu',
    accreditations: ['Statutory Institute of National Importance', 'ABDM Pioneer'],
    branches: [
      {
        id: 'aiims-del-ansari',
        name: 'AIIMS Main OPD Center (Ansari Nagar)',
        locality: 'Sri Aurobindo Marg, Ansari Nagar East',
        city: 'New Delhi',
        state: 'Delhi NCR',
        counters: ['Counter 1 • Rajkumari Amrit Kaur OPD Desk'],
        doctorRooms: ['Chamber 12 • Senior Resident Physician'],
        receptionistEmail: 'opd.reception@aiims.edu',
        doctorEmail: 'dr.kumar@aiims.edu',
        doctorName: 'Dr. A. Kumar, MD',
        department: 'Central OPD Block',
        status: 'ONBOARDING',
        contactPhone: '+91 11 2658 8500',
        bedCapacity: 2478,
        dailyOpdCapacity: 10000
      },
      {
        id: 'aiims-rishikesh',
        name: 'AIIMS Rishikesh Outpatient Block',
        locality: 'Virbhadra Road',
        city: 'Rishikesh',
        state: 'Uttarakhand',
        counters: ['Counter 1 • General OP Desk'],
        doctorRooms: ['Room 108 • Clinical Consultant'],
        receptionistEmail: 'reception@aiimsrishikesh.edu',
        doctorEmail: 'dr.shukla@aiimsrishikesh.edu',
        doctorName: 'Dr. P. Shukla',
        department: 'Clinical OPD',
        status: 'ONBOARDING',
        contactPhone: '+91 135 246 2929',
        bedCapacity: 960,
        dailyOpdCapacity: 3000
      }
    ]
  },
  {
    id: 'manipal',
    name: 'Manipal Hospitals Network',
    code: 'MANIPAL',
    tagline: 'Life’s On — Clinical Excellence',
    status: 'PILOT',
    badge: 'Onboarding Network',
    website: 'https://www.manipalhospitals.com',
    accreditations: ['NABH Certified', 'AHA Accredited'],
    branches: [
      {
        id: 'manipal-blr-oar',
        name: 'Manipal Hospital (Old Airport Road)',
        locality: 'HAL Airport Road, Kodihalli',
        city: 'Bengaluru',
        state: 'Karnataka',
        counters: ['Counter 1 • OPD Care Desk'],
        doctorRooms: ['Room 114 • Dr. K. Shetty (General Practice)'],
        receptionistEmail: 'reception.oar@manipal.opriva.com',
        doctorEmail: 'dr.shetty@manipal.opriva.com',
        doctorName: 'Dr. K. Shetty',
        department: 'OPD Clinical Services',
        status: 'ONBOARDING',
        contactPhone: '+91 80 2502 4444',
        bedCapacity: 600,
        dailyOpdCapacity: 1100
      },
      {
        id: 'manipal-blr-whitefield',
        name: 'Manipal Hospital (Whitefield)',
        locality: 'ITPL Main Road',
        city: 'Bengaluru',
        state: 'Karnataka',
        counters: ['Counter 1 • OP Registration'],
        doctorRooms: ['Room 202 • OPD Consultant'],
        receptionistEmail: 'reception.wf@manipal.opriva.com',
        doctorEmail: 'dr.anand@manipal.opriva.com',
        doctorName: 'Dr. V. Anand',
        department: 'General OPD',
        status: 'ONBOARDING',
        contactPhone: '+91 80 2841 3333',
        bedCapacity: 280,
        dailyOpdCapacity: 450
      }
    ]
  },
  {
    id: 'fortis',
    name: 'Fortis Healthcare',
    code: 'FORTIS',
    tagline: 'Saving and Enriching Lives',
    status: 'PILOT',
    badge: 'Partner Integration',
    website: 'https://www.fortishealthcare.com',
    accreditations: ['NABH', 'JCI Accredited'],
    branches: [
      {
        id: 'fortis-ggn-fmri',
        name: 'Fortis Memorial Research Institute (FMRI)',
        locality: 'Sector 44, Opposite HUDA City Centre',
        city: 'Gurugram',
        state: 'Haryana',
        counters: ['Counter 1 • OPD Desk'],
        doctorRooms: ['Room 105 • Consultant Physician'],
        receptionistEmail: 'reception.fmri@fortis.opriva.com',
        doctorEmail: 'dr.kapoor@fortis.opriva.com',
        doctorName: 'Dr. N. Kapoor',
        department: 'Consultant OPD',
        status: 'ONBOARDING',
        contactPhone: '+91 124 492 1021',
        bedCapacity: 300,
        dailyOpdCapacity: 800
      }
    ]
  }
];

const STORAGE_KEY = 'opriva_hospital_networks_v1';

export function getHospitalNetworks(): HospitalNetwork[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_HOSPITAL_NETWORKS));
      return INITIAL_HOSPITAL_NETWORKS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_HOSPITAL_NETWORKS;
  } catch (e) {
    console.error('Failed to load hospital networks from storage', e);
    return INITIAL_HOSPITAL_NETWORKS;
  }
}

export function saveHospitalNetworks(networks: HospitalNetwork[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(networks));
    // Dispatch custom event so all active tabs/screens update in real-time
    window.dispatchEvent(new Event('opriva-hospitals-updated'));
  } catch (e) {
    console.error('Failed to save hospital networks to storage', e);
  }
}

export function addHospitalNetwork(newNetwork: Omit<HospitalNetwork, 'id'>): HospitalNetwork {
  const networks = getHospitalNetworks();
  const id = newNetwork.name.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 20) + '-' + Date.now().toString(36);
  const created: HospitalNetwork = {
    ...newNetwork,
    id,
    createdAt: new Date().toISOString()
  };
  networks.push(created);
  saveHospitalNetworks(networks);
  return created;
}

export function addHospitalBranch(hospitalId: string, branch: Omit<HospitalBranch, 'id'>): HospitalBranch | null {
  const networks = getHospitalNetworks();
  const target = networks.find(h => h.id === hospitalId);
  if (!target) return null;

  const id = hospitalId + '-' + branch.city.toLowerCase().replace(/[^a-z0-9]/g, '') + '-' + Date.now().toString(36);
  const createdBranch: HospitalBranch = {
    ...branch,
    id
  };
  target.branches.push(createdBranch);
  saveHospitalNetworks(networks);
  return createdBranch;
}

export function updateHospitalDetails(hospitalId: string, updates: Partial<Omit<HospitalNetwork, 'id' | 'branches'>>): boolean {
  const networks = getHospitalNetworks();
  const target = networks.find(h => h.id === hospitalId);
  if (!target) return false;
  Object.assign(target, updates);
  saveHospitalNetworks(networks);
  return true;
}

export function updateBranchDetails(hospitalId: string, branchId: string, updates: Partial<Omit<HospitalBranch, 'id'>>): boolean {
  const networks = getHospitalNetworks();
  const target = networks.find(h => h.id === hospitalId);
  if (!target) return false;
  const branch = target.branches.find(b => b.id === branchId);
  if (!branch) return false;
  Object.assign(branch, updates);
  saveHospitalNetworks(networks);
  return true;
}

export function deleteBranch(hospitalId: string, branchId: string): boolean {
  const networks = getHospitalNetworks();
  const target = networks.find(h => h.id === hospitalId);
  if (!target) return false;
  target.branches = target.branches.filter(b => b.id !== branchId);
  saveHospitalNetworks(networks);
  return true;
}

export function updateHospitalStatus(hospitalId: string, status: 'ACTIVE' | 'PILOT' | 'ONBOARDING'): boolean {
  const networks = getHospitalNetworks();
  const target = networks.find(h => h.id === hospitalId);
  if (!target) return false;
  target.status = status;
  saveHospitalNetworks(networks);
  return true;
}

export function updateBranchStatus(hospitalId: string, branchId: string, status: 'ACTIVE' | 'ONBOARDING' | 'PENDING_AUDIT'): boolean {
  const networks = getHospitalNetworks();
  const target = networks.find(h => h.id === hospitalId);
  if (!target) return false;
  const branch = target.branches.find(b => b.id === branchId);
  if (!branch) return false;
  branch.status = status;
  saveHospitalNetworks(networks);
  return true;
}

export function deleteHospital(hospitalId: string): boolean {
  let networks = getHospitalNetworks();
  networks = networks.filter(h => h.id !== hospitalId);
  saveHospitalNetworks(networks);
  return true;
}
