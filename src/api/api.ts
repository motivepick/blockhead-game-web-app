import axios from 'axios'
import { mock } from './mock'

const api = axios.create({
    baseURL: 'http://localhost:3001/api'
})

mock(api)

export default api
