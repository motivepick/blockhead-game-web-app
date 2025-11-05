import axios from 'axios'

const api = axios.create({
    baseURL: 'https://api.blockhead.yaskovdev.com/api'
})

export default api
