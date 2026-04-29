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
    content_ar: 'رواية الأمير الصغير هي واحدة من أكثر الكتب مبيعاً في العالم. تحكي قصة طيار تحطمت طائرته في الصحراء الكبرى، حيث يلتقي بفتى صغير يزعم أنه من كوكب آخر. القصة مليئة بالحكمة والدروس حول الحياة والحب والصداقة، وتذكرنا بأن الأشياء الحقيقية لا تُرى إلا بالقلب.',
    content_en: 'The Little Prince is Antoine de Saint-Exupéry\'s masterpiece. "The most beautiful things in the world cannot be seen or touched, they are felt with the heart." After his plane crashes in the Sahara desert, a pilot encounters a little prince from a tiny asteroid who tells him about his journey through the cosmos.'
  }
];
