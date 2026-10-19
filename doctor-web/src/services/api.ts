const API_BASE_URL = '/api/v1';

export const getAuthToken = (): string | null => {
  return localStorage.getItem('opriva_token');
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem('opriva_token', token);
};

export const removeAuthToken = (): void => {
  localStorage.removeItem('opriva_token');
};

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMsg = 'An unexpected error occurred';
    try {
      const errData = await response.json();
      errorMsg = errData.message || errData.error || errorMsg;
    } catch {
      errorMsg = response.statusText || errorMsg;
    }
    throw new Error(errorMsg);
  }

  return response.json();
}

// Auth APIs
export const authApi = {
  login: (identifier: string, password: string) =>
    apiRequest<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ identifier, password }),
    }),
  register: (data: any) =>
    apiRequest<any>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getMe: () => apiRequest<any>('/auth/me'),
  updateLanguage: (language: string) =>
    apiRequest<any>('/auth/language', {
      method: 'PUT',
      body: JSON.stringify({ language }),
    }),
};

// Hospital APIs
export const hospitalApi = {
  getHospitals: (params?: { keyword?: string; city?: string; lat?: number; lon?: number }) => {
    const query = new URLSearchParams();
    if (params?.keyword) query.append('keyword', params.keyword);
    if (params?.city) query.append('city', params.city);
    if (params?.lat) query.append('lat', params.lat.toString());
    if (params?.lon) query.append('lon', params.lon.toString());
    return apiRequest<any[]>(`/hospitals?${query.toString()}`);
  },
  getHospitalById: (id: string, lat?: number, lon?: number) => {
    const query = new URLSearchParams();
    if (lat) query.append('lat', lat.toString());
    if (lon) query.append('lon', lon.toString());
    return apiRequest<any>(`/hospitals/${id}?${query.toString()}`);
  },
};

// Booking & Payment APIs
export const bookingApi = {
  createReservation: (data: {
    hospitalId: string;
    opRegistrationTypeId: string;
    dependentId?: string;
    sessionDate: string;
    slotTime: string;
  }) =>
    apiRequest<any>('/reservations', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  createPaymentOrder: (reservationId: string) =>
    apiRequest<any>('/payments/create-order', {
      method: 'POST',
      body: JSON.stringify({ reservationId }),
    }),
  verifyPayment: (data: {
    reservationId: string;
    providerOrderId: string;
    providerPaymentId: string;
    providerSignature?: string;
  }) =>
    apiRequest<any>('/payments/verify', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getMyRegistrations: () => apiRequest<any[]>('/registrations/my'),
  getReceipt: (registrationId: string) =>
    apiRequest<any>(`/registrations/${registrationId}/receipt`),
};

// Queue APIs
export const queueApi = {
  getLiveQueue: (registrationId: string) =>
    apiRequest<any>(`/queue/live/${registrationId}`),
  getReceptionistOverview: (hospitalId: string, date?: string) => {
    const query = date ? `?date=${date}` : '';
    return apiRequest<any>(`/receptionist/queue/${hospitalId}${query}`);
  },
  callNextToken: (hospitalId: string) =>
    apiRequest<any>(`/receptionist/call-next/${hospitalId}`, { method: 'POST' }),
  updateTokenState: (tokenId: string, targetState: string, reason?: string) =>
    apiRequest<any>(`/receptionist/tokens/${tokenId}/state`, {
      method: 'POST',
      body: JSON.stringify({ targetState, reason }),
    }),
  registerWalkIn: (data: {
    patientName: string;
    patientPhone: string;
    hospitalId: string;
    opRegistrationTypeId: string;
    paymentMethod?: string;
  }) =>
    apiRequest<any>('/receptionist/walk-in', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// Medical Records & Dependents APIs
export const recordsApi = {
  uploadDocument: async (formData: FormData) => {
    const token = getAuthToken();
    const res = await fetch('/api/v1/documents/upload', {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Upload failed' }));
      throw new Error(err.message || 'Upload failed');
    }
    return res.json();
  },
  getDocuments: (params?: { patientId?: string; dependentId?: string }) => {
    const q = new URLSearchParams();
    if (params?.patientId) q.append('patientId', params.patientId);
    if (params?.dependentId) q.append('dependentId', params.dependentId);
    return apiRequest<any[]>(`/documents?${q.toString()}`);
  },
  shareDocument: (documentId: string, hospitalId: string) =>
    apiRequest<any>('/documents/share', {
      method: 'POST',
      body: JSON.stringify({ documentId, hospitalId }),
    }),
  getDependents: () => apiRequest<any[]>('/dependents'),
  createDependent: (data: {
    fullName: string;
    relationship: string;
    dateOfBirth?: string;
    gender?: string;
    bloodGroup?: string;
  }) =>
    apiRequest<any>('/dependents', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getVisitTimeline: (params?: { patientId?: string; dependentId?: string }) => {
    const q = new URLSearchParams();
    if (params?.patientId) q.append('patientId', params.patientId);
    if (params?.dependentId) q.append('dependentId', params.dependentId);
    return apiRequest<any[]>(`/clinical/visits?${q.toString()}`);
  },
  createPrescription: (data: any) =>
    apiRequest<any>('/clinical/prescriptions', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getNotifications: () => apiRequest<any[]>('/notifications'),
  markNotificationRead: (id: string) =>
    apiRequest<any>(`/notifications/${id}/read`, { method: 'PATCH' }),
};
