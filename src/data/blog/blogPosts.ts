// src/data/blogPosts.ts

interface BlogPost {
    slug: string;
    title: string;
    summary: string;
  }
  
  const blogPosts: BlogPost[] = [
    {
      slug: 'girisimcilik-nedir',
      title: 'test test',
      summary: 'test test',
    },
    {
      slug: 'fon-nedir-turleri',
      title: 'test test',
      summary: 'test test',
    },
    {
      slug: 'kripto-guvenli-mi',
      title: 'test test',
      summary: 'test test',
    },
    {
      slug: 'kitle-fonlama-turkiye',
      title: 'test test',
      summary: 'test test',
    },
    {
      slug: 'finanscepte-ve-benzerleri',
      title: 'test test',
      summary: 'test test',
    },
    {
      slug: 'kendine-yatirim-nedir',
      title: 'test test',
      summary: 'test test',
    }
  ];
  
  export default blogPosts;
  