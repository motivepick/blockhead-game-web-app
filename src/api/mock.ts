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

const field3 = [
    '...',
    'БАЛ',
    '...'
]

const field7 = [
    '.......',
    '.......',
    '.......',
    'БАЛДААА',
    '.......',
    '.......',
    '.......'
]

export const mock = (api: AxiosInstance) => new MockAdapter(api, { delayResponse: 200 })
    .onGet('/field/3')
    .reply(200, field3)
    .onGet('/field/5')
    .reply(200, field)
    .onGet('/field/7')
    .reply(200, field7)
    .onPost('/move-requests')
    .reply(200, serverResponse)
