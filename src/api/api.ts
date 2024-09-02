import axios from 'axios'

const api = axios.create({
    baseURL: 'https://blockhead-game-back-end.azurewebsites.net/api'
})

export default api
