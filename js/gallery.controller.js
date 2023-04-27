'use strict'

function onInit() {
    console.log('hello main')
    renderTemplates()
    renderMyMemesGallery()
    renderKeywords()
    initCanvas()
    EnableSharing()
    setUserMemes()
    switchPage('page-gallery')
}



function renderTemplates() {
    const templates = getTemplates()
    const elGalleryContainer = document.querySelector('.gallery-container')
    const strHTML = templates.map(template => `
    <img onclick="onOpenImg('${template.id}')" class="gallery-img" src="${template.imgUrl}" alt="${template.title}">
    `)
    elGalleryContainer.innerHTML = strHTML.join('')
}

function renderMyMemesGallery() {
    const savedMemes = getUserMemes()
    console.log('savedMemes: ', savedMemes)
    const elMyMemesGalleryContainer = document.querySelector('.my-memes-gallery-container')
    const strHTML = savedMemes.map(meme => `
    <img onclick="onOpenSavedMeme('${meme.savedMemeId}')" class="gallery-img" src="${meme.flatImg}" alt="new saved meme">
    `)
    elMyMemesGalleryContainer.innerHTML = strHTML.join('')
}

function renderKeywords() {
    const keywords = getKeywords()
    keywords.forEach(keywordObj => {
        const { keyword, numOfSearches } = keywordObj
        const elKeywordBtn = document.querySelector(`.${keyword}`)
        let size = (numOfSearches >= 6) ? 'x-large' : (numOfSearches > 3) ? 'large' : 'medium'
        elKeywordBtn.style.fontSize = size
    })

}

function onOpenImg(templateId) {
    const template = getTemplateById(templateId)
    switchPage('page-editor')
    updateMemeSettings('selectedImgId', template.id)
    renderMeme()
}

function onOpenSavedMeme(savedMemeId) {
    const savedMeme = getSavedMemeById(savedMemeId)
    switchPage('page-editor')
    setMemeFromSavedMemes(savedMeme)
    renderMeme()
}

function onFilter(value) {
    setCurrKeyword(value)
    renderTemplates()
    renderKeywords()
}

function switchPage(toPage) {
    const targetPage = document.querySelector(`.${toPage}`)
    const pages = [...document.querySelectorAll('.page')]
    pages.forEach(page => page.hidden = true)
    targetPage.hidden = false
}

function onImgInput(ev) {
    loadImageFromInput(ev, onUploadImg)
}

function loadImageFromInput(ev, onImageReady) {
    const reader = new FileReader()
    // After we read the file
    reader.onload = function (event) {
        let img = new Image() // Create a new html img element
        img.src = event.target.result // Set the img src to the img file we read
        img.onload = onImageReady.bind(null, img)
    }
    reader.readAsDataURL(ev.target.files[0]) // Read the file we picked
}

function onUploadImg(img) {
    createTemplateFromUpload(img, onOpenImg)
}

function onFeelingLucky() {
    const randomTemplateId = getRandomTemplateId()
    onOpenImg(randomTemplateId)
    addRandomText()  
}