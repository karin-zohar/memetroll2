'use strict'
let gElCanvas
let gCtx
const TOUCH_EVS = ['touchstart', 'touchmove', 'touchend']

function initCanvas() {
    gElCanvas = document.querySelector('canvas')
    gCtx = gElCanvas.getContext('2d')
    resizeCanvas()
    setFirstLineCoords()
    renderMeme()
}

function setFirstLineCoords() {
    updateLineSettings('coords', getCanvasCoords('start'))
}

function renderMeme() {
    const meme = getMemeSettings()
    const template = getTemplateById(meme.selectedImgId)
    //draw image
    const elImg = new Image()
    elImg.src = template.imgUrl
    elImg.onload = () => {
        gCtx.drawImage(elImg, 0, 0, gElCanvas.width, gElCanvas.height)
        //draw text
        gMeme.lines.forEach(line => {
            if (!line['coords']) setFirstLineCoords(getCanvasCoords('start'))
            const { x, y } = line['coords']
            drawText(line.text, x, y)
        })
    }
}

function resizeCanvas() {
    const elContainer = document.querySelector('.canvas-container')
    gElCanvas.width = elContainer.offsetWidth
    gElCanvas.height = elContainer.offsetHeight
}

function getCanvasCoords(linePlacement) {
    const canvasWidth = gElCanvas.width
    const canvasHeight = gElCanvas.height
    let coordX = canvasWidth / 2
    let coordY
    switch (linePlacement) {
        case 'start':
            coordY = canvasHeight / 6
            break;
        case 'start-center':
            coordY = canvasHeight / 3
            break;
        case 'center':
            coordY = canvasHeight / 2
            break;
        case 'center-end':
            coordY = canvasHeight / 1.5
            break;
        case 'end':
            coordY = canvasHeight / 1.2
            break;
    }
    return { x: coordX, y: coordY }
}


function drawText(text, x, y) {
    const lineSettings = getSelectedLine()
    // console.log('lineSettings: ', lineSettings)
    const { font, fontSize, stroke, fill, align, linePlacement } = lineSettings
    if (!font) font = 'Impact'
    gCtx.lineWidth = 2
    gCtx.strokeStyle = stroke
    gCtx.fillStyle = fill
    gCtx.font = `${fontSize}px ${font}`
    gCtx.textAlign = align
    gCtx.textBaseline = 'middle'
    gCtx.lineCap = ''

    gCtx.fillText(text, x, y)
    gCtx.strokeText(text, x, y)
}

function clearCanvas() {
    gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
}

function onChangeFontSize(diff) {
    updateLineSettings('fontSize', getSelectedLine('fontSize') + diff)
}

function onAddText(text) {
    const meme = getMemeSettings()
    if (!meme.lines.length) onAddLine()
    text = text.toUpperCase()
    updateLineSettings('text', text)
    renderMeme()
}

function onAddLine() {
    addLine('ADD TEXT')
    renderMeme()
    const elTextInput = document.querySelector('.add-text-input')
    elTextInput.focus()
    elTextInput.value = ''
    elTextInput.placeholder = 'Add text'

}

function onDeleteLine() {
    deleteSelectedLine()
    renderMeme()
}

function onPicker(setting, color) {
    updateLineSettings(setting, color)
    renderMeme()
}

function onMoveLineVertically(diff) {
    moveLine('y', diff)
    renderMeme()
}

function onSaveMeme() {
    console.log('saving meme')
    const newFlatImg = createImgFromCanvas(gElCanvas)
    saveMeme(newFlatImg)
    renderMyMemesGallery()
    alert('Saved successfully to my memes!')
}


function downloadImg(elLink) {
    const imgContent = createImgFromCanvas(gElCanvas)
    elLink.href = imgContent
}


function EnableSharing() {

    document.querySelector('.share-btn').addEventListener('click', async () => {
        const imgContent = gElCanvas.toDataURL('image/jpeg')
        const blob = await (await fetch(imgContent)).blob();
        const shareData = {
            title: 'myMeme',
            text: 'Shared via Memetroll',
            files: [
                new File([blob], 'myMeme.jpeg', { type: 'image/jpeg' })
            ]
        }
        try {
            await navigator.share(shareData)
            alert('shared successfully!')
        } catch (err) {
            alert(`error: ${err}`)
        }
    })
}

