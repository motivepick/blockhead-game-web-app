import { screen } from '@testing-library/react'
import { App } from '../App.tsx'
import { renderWithProviders } from '../utils/test-utils.tsx'

test('App should have correct initial render', () => {
    renderWithProviders(<App />)

    const inputs = screen.getAllByRole<HTMLLabelElement>('textbox')

    expect(inputs).toHaveLength(5 * 5)
})
