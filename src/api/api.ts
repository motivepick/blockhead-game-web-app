import axios from 'axios'

const api = axios.create({
    baseURL: 'https://blockhead-game-back-end-dqgbe9d4bbdcdfhz.northeurope-01.azurewebsites.net/api'
})

export default api
