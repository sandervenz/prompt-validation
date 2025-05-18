import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // ganti ke URL backend kamu
});

export const fetchNextPrompt = (username) =>
  API.get(`/next-record?username=${encodeURIComponent(username)}`);

export const submitFeedback = (data) =>
  API.post(`/feedback`, data);
