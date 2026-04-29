import { RouteStop } from '@/types';

export const defaultRoute: RouteStop[] = [
  {
    id: 'stop1',
    name_ar: 'أنطونيادس',
    name_en: 'Antoniadis',
    lat: 31.2001,
    lng: 29.9300,
    description_ar: 'حدائق أنطونيادس التاريخية، مكان مثالي للقراءة والاسترخاء.',
    description_en: 'Historical Antoniadis Gardens, a perfect place for reading and relaxation.',
    date_ar: '1 مايو 2026',
    date_en: 'May 1, 2026',
    time_ar: '9:00 صباحاً - 12:00 مساءً',
    time_en: '9:00 AM - 12:00 PM',
    order: 1
  },
  {
    id: 'stop2',
    name_ar: 'محطة الرمل',
    name_en: 'El Raml',
    lat: 31.2001,
    lng: 29.9187,
    description_ar: 'قلب مدينة الإسكندرية التجاري والثقافي.',
    description_en: 'The commercial and cultural heart of Alexandria.',
    date_ar: '5 مايو 2026',
    date_en: 'May 5, 2026',
    time_ar: '10:00 صباحاً - 2:00 مساءً',
    time_en: '10:00 AM - 2:00 PM',
    order: 2
  },
  {
    id: 'stop3',
    name_ar: 'مكتبة الإسكندرية',
    name_en: 'Alexandria Library',
    lat: 31.2089,
    lng: 29.9092,
    description_ar: 'منارة العلم والمعرفة، محطة أساسية لمكتبتنا المتنقلة.',
    description_en: 'The lighthouse of science and knowledge, an essential stop for our mobile library.',
    date_ar: '10 مايو 2026',
    date_en: 'May 10, 2026',
    time_ar: '11:00 صباحاً - 3:00 مساءً',
    time_en: '11:00 AM - 3:00 PM',
    order: 3
  },
  {
    id: 'stop4',
    name_ar: 'قلعة قايتباي',
    name_en: 'Qaitbay Citadel',
    lat: 31.2140,
    lng: 29.8856,
    description_ar: 'التاريخ العريق في مواجهة البحر.',
    description_en: 'Ancient history facing the sea.',
    date_ar: '15 مايو 2026',
    date_en: 'May 15, 2026',
    time_ar: '9:00 صباحاً - 1:00 مساءً',
    time_en: '9:00 AM - 1:00 PM',
    order: 4
  }
];
