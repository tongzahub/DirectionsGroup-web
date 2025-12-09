import axios from 'axios';

const API_URL = 'http://localhost:1337/api';
const TOKEN = '44d7d02e56c1f0c5915de077a4a553864b5bbab3318078a46527ce41f7fb6f92c2b369745e26e4deb570a9c25df01e6372437c3ea6ce5ebb537169f5760b9a84fa2615317f73ee58dbbf2c72ea1c14bdfe426e798813c3954ddcc8fedeabe184625cdc1cc20a481f9cf8ad4b3f2f5a613d201bfacdfb78178f6e51a88b91890f';

const client = axios.create({
  baseURL: API_URL,
  headers: {
    'Authorization': `Bearer ${TOKEN}`,
    'Content-Type': 'application/json',
  },
});

const testPost = {
  title: 'Test Blog Post',
  slug: 'test-blog-post',
  excerpt: 'This is a test excerpt',
  content: 'This is test content',
  category: 'News',
  tags: ['test'],
  author: 'Test Author',
  publishedAt: '2025-12-09T10:00:00.000Z',
  seoTitle: 'Test SEO Title',
  metaDescription: 'Test meta description',
};

async function test() {
  try {
    console.log('Testing blog post creation...');
    const response = await client.post('/blog-posts', { data: testPost });
    console.log('✅ Success!', response.data);
  } catch (error) {
    console.log('❌ Error:', error.response?.data || error.message);
  }
}

test();
