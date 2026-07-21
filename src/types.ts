export interface ProductService {
  id: string;
  title: string;
  category: 'maintenance' | 'print_publish' | 'training' | 'sales';
  type: 'physical' | 'digital' | 'service';
  description: string;
  price: number; // in ETB (Ethiopian Birr)
  imageUrl: string;
  stock: number | null; // null for services/digital, number for physical
  specifications?: string; // e.g. details for physical items
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
}

export interface Feedback {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  date: string;
  status: 'unread' | 'read' | 'replied';
  replyMessage?: string;
}

export interface Transaction {
  id: string;
  referenceNumber: string;
  paymentGateway: 'telebirr' | 'CBE Birr';
  customerName: string;
  customerPhone?: string;
  amount: number;
  purpose: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
}

export interface Booking {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  serviceId: string;
  serviceTitle: string;
  bookingDate: string;
  bookingTime: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  paymentStatus?: 'unpaid' | 'paid' | 'partial' | 'waived';
  date: string;
}

export interface CustomerRecord {
  name: string;
  contact: string;
  source: string;
  transactionsCount: number;
  spentAmount: number;
}

export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: {
    username: string;
    email: string;
    role: string;
  } | null;
}

export type ActiveTab = 'home' | 'about' | 'services' | 'news' | 'contact' | 'login' | 'admin';
export type AdminSubTab = 'products' | 'payments' | 'bookings' | 'history' | 'users' | 'share';
