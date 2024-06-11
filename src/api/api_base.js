import axios from 'axios'

export const api = axios.create({
  baseURL: 'https://tickethub-back.onrender.com/'
});