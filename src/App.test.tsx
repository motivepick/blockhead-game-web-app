import { screen } from '@testing-library/react'
import { App } from './App'
import { renderWithProviders } from './utils/test-utils'

test('App should have correct initial render', () => {
    renderWithProviders(<App />)

    const inputs = screen.getAllByRole<HTMLLabelElement>('textbox')

    expect(inputs).toHaveLength(5 * 5)
})
