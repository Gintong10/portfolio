import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'

const OUT = path.resolve('public/projects')
await mkdir(OUT, { recursive: true })

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
})

async function shot(name, url, prepare) {
  console.log('capture', name, url)
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 }).catch(() =>
    page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 }),
  )
  await page.waitForTimeout(800)
  if (prepare) await prepare(page)
  await page.waitForTimeout(600)
  await page.screenshot({
    path: path.join(OUT, name),
    type: 'png',
  })
}

// Hungry Horse: practice / edit table in use (not My Drills menu)
await shot(
  'hungry-horse-preview.png',
  'http://127.0.0.1:3456/practice/de73a53b-1999-460a-b293-91140c584e58',
  async (p) => {
    // dismiss setup modal if present
    const discard = p.getByRole('button', { name: /discard|close|start building/i })
    if (await discard.first().isVisible().catch(() => false)) {
      const start = p.getByRole('button', { name: /start building/i })
      if (await start.isVisible().catch(() => false)) await start.click()
      else await discard.first().click()
    }
    await p.waitForTimeout(500)
  },
)

// PokerWhen: create via UI so we land on live table
await page.goto('http://127.0.0.1:3000/', { waitUntil: 'networkidle' })
await page.getByPlaceholder(/nickname/i).fill('Jintong')
await page.getByRole('button', { name: /create game/i }).click()
await page.waitForURL(/\/g\//, { timeout: 15000 })
await page.waitForTimeout(1500)
// try to sit / start if controls visible
for (const label of [/sit/i, /take seat/i, /deal/i, /start/i]) {
  const btn = page.getByRole('button', { name: label })
  if (await btn.first().isVisible().catch(() => false)) {
    await btn.first().click().catch(() => {})
    await page.waitForTimeout(800)
  }
}
await page.screenshot({ path: path.join(OUT, 'pokerwhen-preview.png'), type: 'png' })
console.log('capture pokerwhen-preview.png')

// Buzzit: UI gallery board + clue buzzing (hide gallery chrome)
await page.goto('http://127.0.0.1:3461/?ui=1', { waitUntil: 'networkidle' })
await page.waitForTimeout(1000)
await page.evaluate(() => {
  const nav = document.querySelector('.ui-gallery-nav')
  if (nav) nav.style.display = 'none'
})
const select = page.locator('.ui-gallery-select, select')
if (await select.count()) {
  await select.first().selectOption({ label: /Clue modal — buzzing|clue_buzzing|buzzing/i }).catch(async () => {
    await select.first().selectOption('clue_buzzing').catch(() => {})
  })
}
await page.waitForTimeout(800)
await page.evaluate(() => {
  const nav = document.querySelector('.ui-gallery-nav')
  if (nav) nav.style.display = 'none'
})
await page.screenshot({ path: path.join(OUT, 'buzzit-preview.png'), type: 'png' })
console.log('capture buzzit-preview.png')

// Also grab clean board if buzzing looked wrong — prefer board with clue overlay
// Singchinese: load jasmine flower lyrics into the list
await page.goto('http://127.0.0.1:3470/', { waitUntil: 'networkidle' })
await page.waitForTimeout(500)
await page.evaluate(async () => {
  const data = await fetch('data/jasmine-flower.json').then((r) => r.json())
  const list = document.getElementById('lyricsList')
  if (!list) return
  list.innerHTML = ''
  ;(data.lines || []).forEach((line, i) => {
    const li = document.createElement('li')
    li.className = 'lyric-line' + (i === 2 ? ' active' : '')
    const zh = line.zh || line.text || line.lrc || ''
    const en = line.en || line.translation || ''
    li.innerHTML = `<div class="lyric-zh">${zh}</div>${en ? `<div class="lyric-en">${en}</div>` : ''}`
    list.appendChild(li)
  })
  const title = document.querySelector('h1, .brand, #title')
  // fill search / selected label if present
  const selected = document.getElementById('lyricsSelectedLabel')
  if (selected) selected.textContent = `${data.title || 'Jasmine Flower'} · ${data.artist || ''}`
  const search = document.getElementById('lyricsLessonSearch')
  if (search) search.value = data.title || 'Jasmine Flower'
  // click to dismiss translation banner
  document.body.click()
})
await page.waitForTimeout(400)
await page.screenshot({ path: path.join(OUT, 'singchinese-preview.png'), type: 'png' })
console.log('capture singchinese-preview.png')

// Shadow Puppet: create game, draw a monster, try to get to arena with 2 players
const host = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await host.goto('http://127.0.0.1:3471/', { waitUntil: 'networkidle' })
await host.waitForTimeout(500)
await host.getByRole('button', { name: /create game/i }).click()
await host.waitForTimeout(800)
// extract room code from page
const code = await host.evaluate(() => {
  const text = document.body.innerText
  const m = text.match(/\b[A-Z0-9]{4,6}\b/)
  return m ? m[0] : null
})
console.log('shadow room', code)

const guest = await browser.newPage({ viewport: { width: 900, height: 700 } })
if (code) {
  await guest.goto(`http://127.0.0.1:3471/join/${code}`, { waitUntil: 'networkidle' }).catch(() =>
    guest.goto('http://127.0.0.1:3471/', { waitUntil: 'networkidle' }),
  )
  await guest.waitForTimeout(500)
  // if join form
  const joinInput = guest.getByPlaceholder(/room code/i)
  if (await joinInput.isVisible().catch(() => false)) {
    await joinInput.fill(code)
    await guest.getByRole('button', { name: /^join$/i }).click()
  }
}

async function drawBlob(p) {
  const canvas = p.locator('canvas').first()
  if (!(await canvas.count())) return false
  const box = await canvas.boundingBox()
  if (!box) return false
  const cx = box.x + box.width / 2
  const cy = box.y + box.height / 2
  const r = Math.min(box.width, box.height) * 0.22
  await p.mouse.move(cx + r, cy)
  await p.mouse.down()
  for (let i = 1; i <= 36; i++) {
    const a = (i / 36) * Math.PI * 2
    await p.mouse.move(cx + Math.cos(a) * r, cy + Math.sin(a) * r)
  }
  await p.mouse.up()
  await p.waitForTimeout(200)
  for (const label of [/submit/i, /done/i, /ready/i, /confirm/i]) {
    const btn = p.getByRole('button', { name: label })
    if (await btn.first().isVisible().catch(() => false)) {
      await btn.first().click().catch(() => {})
      break
    }
  }
  return true
}

await drawBlob(host)
await drawBlob(guest)
await host.waitForTimeout(500)
for (const label of [/start/i, /begin/i, /battle/i, /arena/i, /all ready/i]) {
  const btn = host.getByRole('button', { name: label })
  if (await btn.first().isVisible().catch(() => false)) {
    await btn.first().click().catch(() => {})
    await host.waitForTimeout(1200)
    break
  }
}
await host.screenshot({ path: path.join(OUT, 'shadow-preview.png'), type: 'png' })
console.log('capture shadow-preview.png')
await guest.close()
await host.close()

await browser.close()
console.log('done')
