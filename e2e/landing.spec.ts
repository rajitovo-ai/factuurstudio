import { test, expect } from '@playwright/test'

test.describe('Landing Page', () => {
  test('should display the landing page correctly', async ({ page }) => {
    await page.goto('/')
    
    // Check page title
    await expect(page).toHaveTitle(/FactuurStudio/)
    
    // Check main heading
    const heading = page.getByRole('heading', { name: /Factuur Studio/ })
    await expect(heading).toBeVisible()
    
    // Check navigation buttons
    const loginButton = page.getByRole('link', { name: /Inloggen/ })
    const registerButton = page.getByRole('link', { name: /Gratis starten/ })
    
    await expect(loginButton).toBeVisible()
    await expect(registerButton).toBeVisible()
  })

  test('should navigate to login page', async ({ page }) => {
    await page.goto('/')
    
    const loginButton = page.getByRole('link', { name: /Inloggen/ })
    await loginButton.click()
    
    await expect(page).toHaveURL(/.*login/)
    await expect(page.getByRole('heading', { name: /Inloggen/ })).toBeVisible()
  })

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    
    const heading = page.getByRole('heading', { name: /Factuur Studio/ })
    await expect(heading).toBeVisible()
  })
})
