import axios from 'axios'
import { mock } from './mock'

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE
})

mock(api)

export default api