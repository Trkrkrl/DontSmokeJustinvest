interface BookPost {
    slug: string;
    title: string;
    author:string;
    summary: string;
    coverImage: string;
    category: string;         // örn: 'kişisel gelişim'
    tags?: string[];
}
const bookPosts: BookPost[] = [
    {
        "slug":"zengin-baba-yoksul-baba",
        "title": "Zengin Baba Yoksul Baba",
        "author":"Robert T. Kiyosaki",
        "summary": "“Zengin Baba Yoksul Baba, finansal geleceklerinin kontrolünü eline almak isteyenler için bir başlangıç noktasıdır.”- USA Today",
        "coverImage":"https://productimages.hepsiburada.net/s/507/424-600/110000561838722.jpg/format:webp",
        "category":"",
        "tags": ["kişisel gelişim", "sadelik"]
    }
]
export default bookPosts;