import axiosInstance from 'src/utils/axios';

export async function sendContactForm(data) {
  const res = await axiosInstance.post('/api/contact', data);
  return res.data;
}
