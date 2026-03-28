import { cn } from '../lib/utils'

describe('cn utility', () => {
  it('should combine class names', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2')
  })

  it('should handle undefined values', () => {
    expect(cn('class1', undefined, 'class2')).toBe('class1 class2')
  })

  it('should handle empty strings', () => {
    expect(cn('class1', '', 'class2')).toBe('class1 class2')
  })

  it('should handle all undefined', () => {
    expect(cn(undefined, undefined)).toBe('')
  })

  it('should handle single class', () => {
    expect(cn('single')).toBe('single')
  })

  it('should handle no arguments', () => {
    expect(cn()).toBe('')
  })
})
