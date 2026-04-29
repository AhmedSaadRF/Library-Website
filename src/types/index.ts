export type Locale = 'ar' | 'en';
export type Direction = 'rtl' | 'ltr';
export type BookType = 'regular' | 'audio';

export interface Category {
  id: string;
  name_ar: string;
  name_en: string;
}

export interface Book {
  id: string;
  title_ar: string;
  title_en: string;
  author_ar: string;
  author_en: string;
  category_ar: string;
  category_en: string;
  type: BookType;
  audioSrc?: string;
  price: number;
  coverUrl: string;
  content_ar?: string;
  content_en?: string;
}

export interface RouteStop {
  id: string;
  name_ar: string;
  name_en: string;
  lat: number;
  lng: number;
  description_ar: string;
  description_en: string;
  date_ar: string;
  date_en: string;
  time_ar: string;
  time_en: string;
  order: number;
}

export interface CartItem {
  bookId: string;
  quantity: number;
}

export interface User {
  email: string;
  name: string;
  role: 'user' | 'admin';
  registeredAt: string;
  profilePicture?: string; // base64
}

export interface StoredUser extends User {
  password: string;
}

export interface BookComment {
  id: string;
  bookId: string;
  userId: string; // email
  userName: string;
  userImage?: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Order {
  id: string;
  userEmail: string;
  items: Array<{ bookId: string; quantity: number }>;
  total: number;
  createdAt: string;
  customerName: string;
  address: string;
}

export interface TranslationDictionary {
  [key: string]: string;
}

export interface AdminSession {
  token: string;
  expiresAt: number;
}
