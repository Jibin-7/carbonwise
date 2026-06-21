const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://carbonwise-api-2uvl.onrender.com'
  : 'http://localhost:5000';

export default API_BASE_URL;