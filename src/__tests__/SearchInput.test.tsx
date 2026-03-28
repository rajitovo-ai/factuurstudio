import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SearchInput from '../components/ui/SearchInput'

describe('SearchInput', () => {
  it('renders with placeholder', () => {
    const mockOnSearch = jest.fn()
    render(<SearchInput placeholder="Test placeholder" onSearch={mockOnSearch} />)
    
    const input = screen.getByPlaceholderText('Test placeholder')
    expect(input).toBeInTheDocument()
  })

  it('calls onSearch when typing (with debounce)', async () => {
    const mockOnSearch = jest.fn()
    const user = userEvent.setup()
    
    render(<SearchInput placeholder="Search..." onSearch={mockOnSearch} />)
    
    const input = screen.getByPlaceholderText('Search...')
    await user.type(input, 'test query')
    
    // Wait for debounce (300ms)
    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith('test query')
    }, { timeout: 400 })
  })

  it('renders search icon', () => {
    const mockOnSearch = jest.fn()
    render(<SearchInput onSearch={mockOnSearch} />)
    
    // Check for SVG icon
    const svg = document.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })

  it('has correct input type', () => {
    const mockOnSearch = jest.fn()
    render(<SearchInput onSearch={mockOnSearch} />)
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('type', 'text')
  })
})
