import { AxiosInstance } from 'axios'
import MockAdapter from 'axios-mock-adapter'

const serverResponse = {
    'cell': [3, 1],
    'letter': 'X',
    'path': [
        [3, 1],
        [2, 1],
        [2, 2],
        [2, 3],
        [2, 4]
    ],
    'updatedField': [
        '.....',
        '.....',
        'БАЛДА',
        '.X...',
        '.....'
    ],
    'word': 'XАЛДА'
}

const field = [
    '.....',
    '.....',
    'БАЛДА',
    '.....',
    '.....'
]

export const mock = (api: AxiosInstance) => new MockAdapter(api, { delayResponse: 200 })
    .onGet('/field')
    .reply(200, field)
    .onPost('/move-requests')
    .reply(200, serverResponse)
