import axios from 'axios';

const getToken = async () => {
  const url = "http://localhost:9000/guest-token";
  try {
    const response = await axios.get(url);
    console.log(response.data.token,"AM TOKEN")
    return response.data.token
  } catch (error) {
    console.error('Error:', error);
  }
};

export default getToken