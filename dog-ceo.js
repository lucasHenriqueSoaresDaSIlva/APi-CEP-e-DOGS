// dog-ceo.js — busca imagens da Dog CEO API
const apiBase = 'https://dog.ceo/api'

const $ = id => document.getElementById(id)

async function fetchJson(url){
  const res = await fetch(url)
  if(!res.ok) throw new Error('HTTP ' + res.status)
  return res.json()
}

async function listBreeds(){
  const data = await fetchJson(`${apiBase}/breeds/list/all`)
  return data.message || {}
}

function makeCard(src, label){
  const div = document.createElement('div')
  div.className = 'card'
  const img = document.createElement('img')
  img.src = src
  img.alt = label || 'Cachorro'
  const meta = document.createElement('div')
  meta.className = 'meta'
  meta.textContent = label || ''
  div.appendChild(img)
  div.appendChild(meta)
  return div
}

async function loadBreedsIntoSelect(){
  const breeds = await listBreeds()
  const select = $('breedSelect')
  select.innerHTML = ''
  const frag = document.createDocumentFragment()
  const empty = document.createElement('option')
  empty.value = ''
  empty.textContent = '-- selecione uma raça --'
  frag.appendChild(empty)

  Object.keys(breeds).forEach(b => {
    const subs = breeds[b]
    if(subs && subs.length){
      subs.forEach(sub => {
        const opt = document.createElement('option')
        opt.value = `${b}/${sub}`
        opt.textContent = `${b} / ${sub}`
        frag.appendChild(opt)
      })
    } else {
      const opt = document.createElement('option')
      opt.value = b
      opt.textContent = b
      frag.appendChild(opt)
    }
  })

  select.appendChild(frag)
}

async function showRandom(){
  const data = await fetchJson(`${apiBase}/breeds/image/random`)
  const result = $('result')
  result.innerHTML = ''
  result.appendChild(makeCard(data.message, 'Aleatória'))
}

async function showByBreed(){
  const select = $('breedSelect')
  const val = select.value
  if(!val) return alert('Escolha uma raça')
  // api aceita format like /breed/hound/afghan/images/random
  const path = val.includes('/') ? val.replace('/', '/') : val
  const data = await fetchJson(`${apiBase}/breed/${path}/images/random`)
  const result = $('result')
  result.innerHTML = ''
  result.appendChild(makeCard(data.message, val))
}

async function loadGallery(){
  const count = Math.min(12, Math.max(1, parseInt($('galleryCount').value || '6', 10)))
  const data = await fetchJson(`${apiBase}/breeds/image/random/${count}`)
  const result = $('result')
  result.innerHTML = ''
  data.message.forEach((src, i) => {
    result.appendChild(makeCard(src, `Imagem ${i+1}`))
  })
}

function bind(){
  $('randomBtn').addEventListener('click', showRandom)
  $('byBreedBtn').addEventListener('click', showByBreed)
  $('galleryBtn').addEventListener('click', loadGallery)
}

window.addEventListener('load', async () => {
  try {
    await loadBreedsIntoSelect()
    bind()
  } catch (e) {
    console.error(e)
    const r = $('result')
    r.innerHTML = '<div class="card"><div class="meta">Erro carregando raças</div></div>'
  }
})