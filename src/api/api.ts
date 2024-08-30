import axios from 'axios'
import { mock } from './mock'

const api = axios.create({
    baseURL: 'http://localhost:5122/api'
})

// mock(api)

export default api
