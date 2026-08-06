import { chromium } from 'playwright'
import path from 'node:path'

const OUT = path.resolve('public/projects')
const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })

await page.goto('http://127.0.0.1:3000/', { waitUntil: 'domcontentloaded' })
await page.getByPlaceholder(/nickname/i).fill('Jintong')
await page.getByRole('button', { name: /create game/i }).click()
await page.waitForURL(/\/g\//, { timeout: 20000 })
await page.waitForTimeout(1200)

// Open sit modal
await page.locator('text=SIT').first().click({ force: true })
await page.waitForTimeout(400)

// Fill and join via modal
const modal = page.locator('.pn-modal-backdrop, [class*="modal"]').first()
await page.getByRole('button', { name: /^join$/i }).click({ force: true })
await page.waitForTimeout(1000)

// Guest sits too
const guest = await browser.newPage({ viewport: { width: 1280, height: 800 } })
await guest.goto(page.url(), { waitUntil: 'domcontentloaded' })
await guest.waitForTimeout(1000)
await guest.locator('text=SIT').first().click({ force: true })
await guest.waitForTimeout(300)
const nick = guest.getByPlaceholder(/nickname/i)
if (await nick.isVisible().catch(() => false)) await nick.fill('Alex')
await guest.getByRole('button', { name: /^join$/i }).click({ force: true })
await guest.waitForTimeout(1000)

// Host starts - force through any backdrop
await page.getByRole('button', { name: /start game/i }).click({ force: true })
await page.waitForTimeout(2500)

// If still modal, join again then start
if (await page.locator('.pn-modal-backdrop').isVisible().catch(() => false)) {
  await page.getByRole('button', { name: /^join$/i }).click({ force: true }).catch(() => {})
  await page.waitForTimeout(600)
  await page.getByRole('button', { name: /start game/i }).click({ force: true }).catch(() => {})
  await page.waitForTimeout(2000)
}

// Dismiss leftover modal by clicking outside / escape
await page.keyboard.press('Escape')
await page.waitForTimeout(300)
await page.evaluate(() => {
  document.querySelectorAll('.pn-modal-backdrop').forEach((el) => el.remove())
})
await page.waitForTimeout(500)

await page.screenshot({ path: path.join(OUT, 'pokerwhen-preview.png'), type: 'png' })
const text = await page.locator('body').innerText()
console.log('has Start Game', /Start Game/i.test(text))
console.log('has Sit modal', /Sit at seat/i.test(text))
console.log('snippet', text.slice(0, 400).replace(/\s+/g, ' '))
await guest.close()
await page.close()
await browser.close()
console.log('done')
