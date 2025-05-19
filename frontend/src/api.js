import axios from 'axios';


const API = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL, 
});

export const fetchNextPrompt = (username) =>
  API.get(`/next-record?username=${encodeURIComponent(username)}`);

export const submitFeedback = (data) =>
  API.post(`/feedback`, data);
