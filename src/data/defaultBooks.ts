import { Book } from '@/types';

export const defaultBooks: Book[] = [
  {
    id: 'book1',
    title_ar: 'الأمير الصغير',
    title_en: 'The Little Prince',
    author_ar: 'أنطوان دو سانت إكزوبيري',
    author_en: 'Antoine de Saint-Exupéry',
    category_ar: 'روايات',
    category_en: 'Novels',
    type: 'audio',
    price: 15,
    coverUrl: 'https://covers.openlibrary.org/b/id/10527340-L.jpg',
    audioSrc: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    content_ar: 'رواية الخيميائي هي رائعة باولو كويلو العالمية، تحكي قصة سانتياغو، الراعي الإسباني الشاب الذي يحلم بالبحث عن كنز مدفون في الأهرامات المصرية. في رحلته، يتعلم سانتياغو أهمية الاستماع إلى قلبه وفك رموز لغة الكون، وفهم أن "الأسطورة الشخصية" هي الهدف الحقيقي للحياة. (ملاحظة: تم استخدام ملخص الخيميائي كمثال للنص الطويل هنا كما في الطلب)',
    content_en: 'The Little Prince is Antoine de Saint-Exupéry\'s masterpiece. "The most beautiful things in the world cannot be seen or touched, they are felt with the heart." After his plane crashes in the Sahara desert, a pilot encounters a little prince from a tiny asteroid who tells him about his journey through the cosmos. It\'s a philosophical tale with a profound message about human nature and the importance of looking below the surface.'
  }
];
