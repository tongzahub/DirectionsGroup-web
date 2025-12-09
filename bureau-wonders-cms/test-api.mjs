import axios from 'axios';

const API_URL = 'http://localhost:1337/api';
const TOKEN = '44d7d02e56c1f0c5915de077a4a553864b5bbab3318078a46527ce41f7fb6f92c2b369745e26e4deb570a9c25df01e6372437c3ea6ce5ebb537169f5760b9a84fa2615317f73ee58dbbf2c72ea1c14bdfe426e798813c3954ddcc8fedeabe184625cdc1cc20a481f9cf8ad4b3f2f5a613d201bfacdfb78178f6e51a88b91890f';

async function test() {
  try {
    const response = await axios.get(`${API_URL}/pages`, {
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
      },
    });
    
    console.log('Pages found:', response.data.data.length);
    response.data.data.forEach(page => {
      console.log(`- ${page.title} (${page.slug})`);
    });
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

test();
