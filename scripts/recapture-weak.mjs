import { chromium } from 'playwright'
import path from 'node:path'

const OUT = path.resolve('public/projects')
const browser = await chromium.launch({ headless: true })

// PokerWhen: join seat, start game, screenshot table in play
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  await page.goto('http://127.0.0.1:3000/', { waitUntil: 'domcontentloaded' })
  await page.getByPlaceholder(/nickname/i).fill('Jintong')
  await page.getByRole('button', { name: /create game/i }).click()
  await page.waitForURL(/\/g\//, { timeout: 20000 })
  await page.waitForTimeout(1200)

  // Sit at seat 1 via modal or seat button
  const sit = page.getByText(/^SIT$/i).first()
  if (await sit.isVisible().catch(() => false)) await sit.click()
  await page.waitForTimeout(400)
  const join = page.getByRole('button', { name: /^join$/i })
  if (await join.isVisible().catch(() => false)) await join.click()
  await page.waitForTimeout(800)

  // Bring a second player so start works better
  const guest = await browser.newPage({ viewport: { width: 1200, height: 800 } })
  const roomUrl = page.url()
  await guest.goto(roomUrl, { waitUntil: 'domcontentloaded' })
  await guest.waitForTimeout(1000)
  const guestSit = guest.getByText(/^SIT$/i).first()
  if (await guestSit.isVisible().catch(() => false)) await guestSit.click()
  await guest.waitForTimeout(300)
  await guest.getByPlaceholder(/nickname/i).fill('Alex').catch(() => {})
  const guestJoin = guest.getByRole('button', { name: /^join$/i })
  if (await guestJoin.isVisible().catch(() => false)) await guestJoin.click()
  await guest.waitForTimeout(800)

  const start = page.getByRole('button', { name: /start game/i })
  if (await start.isVisible().catch(() => false)) {
    await start.click()
    await page.waitForTimeout(2000)
  }

  // Close any leftover modals
  await page.keyboard.press('Escape').catch(() => {})
  await page.waitForTimeout(500)
  await page.screenshot({ path: path.join(OUT, 'pokerwhen-preview.png'), type: 'png' })
  console.log('pokerwhen ok', page.url())
  await guest.close()
  await page.close()
}

// Buzzit: prefer clue buzzing overlay (more "in action" than board alone)
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  await page.goto('http://127.0.0.1:3461/?ui=1', { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(1000)
  const select = page.locator('select.ui-gallery-select, .ui-gallery-select, select').first()
  if (await select.count()) {
    const options = await select.locator('option').allTextContents()
    console.log('buzzit options', options)
    const buzzing = options.find((o) => /buzzing/i.test(o))
    const board = options.find((o) => /^Board \(desktop\)/i.test(o) || o === 'Board (desktop)')
    if (buzzing) await select.selectOption({ label: buzzing })
    else if (board) await select.selectOption({ label: board })
  }
  await page.waitForTimeout(600)
  await page.evaluate(() => {
    const nav = document.querySelector('.ui-gallery-nav')
    if (nav) nav.remove()
  })
  await page.screenshot({ path: path.join(OUT, 'buzzit-preview.png'), type: 'png' })
  console.log('buzzit ok')
  await page.close()
}

// Shadow: draw + start arena with two players
{
  const host = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  await host.goto('http://127.0.0.1:3471/', { waitUntil: 'domcontentloaded' })
  await host.waitForTimeout(600)
  await host.getByRole('button', { name: /create game/i }).click()
  await host.waitForTimeout(1000)
  const code = await host.evaluate(() => {
    const m = document.body.innerText.match(/\b[A-HJ-NP-Z]{4,6}\b/)
    return m?.[0] || null
  })
  console.log('shadow code', code)

  const guest = await browser.newPage({ viewport: { width: 1000, height: 800 } })
  await guest.goto('http://127.0.0.1:3471/', { waitUntil: 'domcontentloaded' })
  if (code) {
    const input = guest.locator('input').first()
    if (await input.count()) {
      await input.fill(code)
      await guest.getByRole('button', { name: /^join$/i }).click().catch(() => {})
      await guest.waitForTimeout(800)
    }
  }

  async function drawAndSubmit(p, name) {
    await p.waitForTimeout(500)
    // name field if any
    const nameInput = p.locator('input[type="text"], input:not([type])').first()
    if (await nameInput.isVisible().catch(() => false)) {
      await nameInput.fill(name).catch(() => {})
    }
    const canvas = p.locator('canvas').first()
    await canvas.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {})
    const box = await canvas.boundingBox()
    if (!box) {
      console.log('no canvas for', name)
      return
    }
    const cx = box.x + box.width * 0.5
    const cy = box.y + box.height * 0.5
    const r = Math.min(box.width, box.height) * 0.2
    // spiky-ish closed shape
    await p.mouse.move(cx + r, cy)
    await p.mouse.down()
    for (let i = 1; i <= 40; i++) {
      const a = (i / 40) * Math.PI * 2
      const spike = i % 5 === 0 ? 1.35 : 1
      await p.mouse.move(cx + Math.cos(a) * r * spike, cy + Math.sin(a) * r * spike)
    }
    await p.mouse.up()
    await p.waitForTimeout(300)
    for (const label of [/submit/i, /done/i, /ready/i, /confirm/i, /finish/i]) {
      const btn = p.getByRole('button', { name: label })
      if (await btn.first().isVisible().catch(() => false)) {
        await btn.first().click()
        break
      }
    }
    await p.waitForTimeout(400)
  }

  await drawAndSubmit(host, 'Spike')
  await drawAndSubmit(guest, 'Blob')

  for (const label of [/start/i, /begin/i, /battle/i, /fight/i, /go/i]) {
    const btn = host.getByRole('button', { name: label })
    if (await btn.first().isVisible().catch(() => false)) {
      await btn.first().click()
      await host.waitForTimeout(2000)
      break
    }
  }
  // wait for arena canvas activity
  await host.waitForTimeout(1500)
  await host.screenshot({ path: path.join(OUT, 'shadow-preview.png'), type: 'png' })
  console.log('shadow ok')
  await guest.close()
  await host.close()
}

// Singchinese: inject richer lyric UI + playing state
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  await page.goto('http://127.0.0.1:3470/', { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(600)
  await page.evaluate(async () => {
    document.body.click()
    const data = await fetch('data/jasmine-flower.json').then((r) => r.json())
    const list = document.getElementById('lyricsList')
    if (list) {
      list.innerHTML = ''
      ;(data.lines || []).forEach((line, i) => {
        const li = document.createElement('li')
        li.className = 'lyric-line' + (i === 1 ? ' active current' : '')
        const zh = line.zh || line.text || ''
        const en = line.en || line.translation || ''
        li.innerHTML = `<span class="zh">${zh}</span>${en ? `<span class="en">${en}</span>` : ''}`
        // also plain text fallback
        if (!zh) li.textContent = JSON.stringify(line)
        list.appendChild(li)
      })
    }
    const selected = document.getElementById('lyricsSelectedLabel')
    if (selected) selected.textContent = `${data.title} / ${data.titleEn || ''} · ${data.artist || ''}`
    const selectedRow = document.getElementById('lyricsSelectedRow')
    if (selectedRow) selectedRow.hidden = false
    const search = document.getElementById('lyricsLessonSearch')
    if (search) search.value = data.title || '茉莉花'
    // hide spotify config banners if any
    document.querySelectorAll('.banner, .notice, .alert').forEach((el) => {
      if (/spotify|translation|configure/i.test(el.textContent || '')) el.style.display = 'none'
    })
  })
  // Inspect structure of jasmine lines
  const sample = await page.evaluate(async () => {
    const data = await fetch('data/jasmine-flower.json').then((r) => r.json())
    return data.lines?.[0]
  })
  console.log('jasmine line sample', sample)
  await page.waitForTimeout(400)
  await page.screenshot({ path: path.join(OUT, 'singchinese-preview.png'), type: 'png' })
  console.log('singchinese ok')
  await page.close()
}

await browser.close()
console.log('done')
