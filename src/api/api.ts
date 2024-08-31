import axios from 'axios'
import { mock } from './mock'

const api = axios.create({
    baseURL: 'https://blockhead-game-back-end.azurewebsites.net/api'
})

// mock(api)

export default api
