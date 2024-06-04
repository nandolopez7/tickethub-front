import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://3.138.171.121:8000/'
});