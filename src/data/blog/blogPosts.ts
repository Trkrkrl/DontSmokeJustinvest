// src/data/blogPosts.ts

interface BlogPost {
    slug: string;
    title: string;
    summary: string;
  }
  
  const blogPosts: BlogPost[] = [
    {
      slug: 'girisimcilik-nedir',
      title: 'Girişimcilik Nedir?',
      summary: 'Girişimcilik denince aklımıza ne gelmeli? Girişimci kime denir? Girişimci olmak için neler gereklidir?',
    },
    {
      slug: 'fon-nedir-turleri',
      title: 'Fon türleri Nelerdir?',
      summary: 'Fon nedir? Yatırım dünyasında mevcut olan fon türleri nelerdir? Türkiye`de Hangi tür fonlar mevcut? ',
    },
    {
      slug: 'kripto-guvenli-mi',
      title: 'Kripto Güvenli Mi?',
      summary: 'Kripto para nedir? Türleri Nelerdir? Kripto para yatırımı güvenli midir? Nelere Dikkat Etmeli'
    },
    {
      slug: 'kitle-fonlama-turkiye',
      title: 'Türkiye`de Kitle Fonlama',
      summary: 'Kitle Fonlama nedir? Nasıl Kitle fonlama yatırımı yapılır  ? Riskleri Nelerdir. Türkiye`de kitle fonlama şirketleri hangileridir? Kitle Fonlama Güvenli midir?',
    },
    {
      slug: 'kitle-fonlama-nedir',
      title: 'Kitle Fonlama Nedir?',
      summary: 'Kitle Fonlama nedir? Nasıl Kitle fonlama yatırımı yapılır  ? Riskleri Nelerdir. Türkiye`de kitle fonlama şirketleri hangileridir? Kitle Fonlama Güvenli midir?',
    },
    {
      slug: 'yatirim-takip-uygulamalari',
      title: 'Yatırım Takip Uygulamaları',
      summary: 'Yatırımlarımızı nasıl takip edebiliriz. Yatırım takip uygulamaları nelerdir? Yatırım takip uygulamaları ücretli midir?',
    },
    {
      slug: 'kendine-yatirim-nedir',
      title: 'Kendine Yatırım Ne Demek?',
      summary: 'Kendine yatırım yapmak ne demek? Amaçları nelerdir? Nasıl yapılır?',
    }
  ];
  
  export default blogPosts;
  