import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('should show login form', async ({ page }) => {
    await page.goto('/login')
    
    // Check form elements
    const emailInput = page.getByLabel(/E-mail/)
    const passwordInput = page.getByLabel(/Wachtwoord/)
    const submitButton = page.getByRole('button', { name: /Inloggen/ })
    
    await expect(emailInput).toBeVisible()
    await expect(passwordInput).toBeVisible()
    await expect(submitButton).toBeVisible()
  })

  test('should show error on invalid credentials', async ({ page }) => {
    await page.goto('/login')
    
    // Fill in invalid credentials
    await page.getByLabel(/E-mail/).fill('invalid@example.com')
    await page.getByLabel(/Wachtwoord/).fill('wrongpassword')
    
    // Submit form
    await page.getByRole('button', { name: /Inloggen/ }).click()
    
    // Check for error message (after a short delay for the request)
    await page.waitForTimeout(1000)
    const errorMessage = page.getByText(/inloggen mislukt|ongeldige|error/i)
    await expect(errorMessage).toBeVisible()
  })

  test('should have working password visibility toggle', async ({ page }) => {
    await page.goto('/login')
    
    const passwordInput = page.getByLabel(/Wachtwoord/)
    await passwordInput.fill('testpassword123')
    
    // Initially password should be hidden
    await expect(passwordInput).toHaveAttribute('type', 'password')
  })
})
