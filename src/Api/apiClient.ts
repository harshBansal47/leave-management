import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'https://miisco.api.smartmaheshwari.com/',
    headers: {
        'Content-Type': 'application/json',
    },
});

export default apiClient;