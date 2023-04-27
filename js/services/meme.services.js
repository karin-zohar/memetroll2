'use strict'

var gUserMemes = []
var gMeme = getBasicMemeSettings()

function getBasicMemeSettings() {
    const basicMeme = {
        selectedImgId: 't101',
        selectedLineIdx: 0,
        lines: [
            {
                text: 'ADD TEXT',
                font: 'Impact',
                fontSize: 40,
                stroke: 'black',
                fill: 'white',
                align: 'center',
                linePlacement: 'start'
            }
        ]
    }
    return basicMeme
}

function resetMemeSettings() {
    gMeme = getBasicMemeSettings()
}

function getMemeSettings() {
    return gMeme
}

function getUserMemes() {
    if (!gUserMemes.length) setUserMemes()
    return gUserMemes
}

function updateMemeSettings(setting, value) {
    gMeme[setting] = value
}

function setMemeFromSavedMemes(savedMeme) {
    gMeme = savedMeme
}

function updateLineSettings(setting, value) {
    if (!value) console.log(`missing value: ${setting}`)
    gMeme.lines[gMeme.selectedLineIdx][setting] = value
    renderMeme()
}


function getSelectedLine(setting = null) {
    if (!gMeme.lines.length) return null
    if (setting) return gMeme.lines[gMeme.selectedLineIdx][setting]
    return gMeme.lines[gMeme.selectedLineIdx]
}

function addLine(text) {
    const line = {
        text: text,
        font: 'impact',
        fontSize: 40,
        stroke: 'black',
        fill: 'white',
        align: 'center',
        linePlacement: getNextLine(),
    }
    gMeme.lines.push(line)
    const lastLineIdx = gMeme.lines.length - 1
    updateMemeSettings('selectedLineIdx', lastLineIdx)
    const coords = getCanvasCoords(getSelectedLine('linePlacement'))
    updateLineSettings('coords', coords)
}

function addRandomText() {
    const randomTexts = [
        { first: `just fix this bug before bed`, second: `...Why is the sun rising?` },
        { first: `realizing youre wrong`, second: `mid argument` },
        { first: `to meme or not to meme`, second: `that is the question` },
        { first: `you dont hate everyone`, second: `youre just hungry` },
        { first: `what i feel like`, second: `before my morning coffee` },
        { first: `i dont hate people`, second: `just idiots, so most people` },
        { first: `im a people person`, second: `from a distance` },
        { first: `im a morning person`, second: `mourning my lack of sleep` },
        { first: `me when i find`, second: `the perfect meme template` },
        { first: `you only live once`, second: `watch another episode` },
        { first: `me after`, second: `watching netflix until 4 am?` },
        { first: `when life gives you lemons`, second: `squeeze into your enemys eyes` },
        { first: `maybe if i open the fridge again`, second: `there will be new food in it` },
        { first: `say i should smile more`, second: `one more time` },
        { first: `me on my way to`, second: `make a bad decision` }
    ]
    const pickRandomIdx = getRandomInt(0, randomTexts.length)
    const pickRandom = randomTexts[pickRandomIdx]
    deleteSelectedLine()
    const lines = [pickRandom.first, pickRandom.second]
    lines.forEach(line => {
        let fontSize = (line.length > 20) ? 25 : 40
        addLine(line.toUpperCase())
        updateLineSettings('fontSize', fontSize)
    })

}
function deleteSelectedLine() {
    const selectedLine = getSelectedLine()
    const lineIdx = gMeme.lines.findIndex(line => line.id === selectedLine.id)
    gMeme.lines.splice(lineIdx, 1)
    const lastLineIdx = gMeme.lines.length - 1
    updateMemeSettings('selectedLineIdx', lastLineIdx)
}

function moveLine(axis, diff) {
    const line = getSelectedLine()
    line.coords[axis] += diff
}

function getNextLine() {
    if (!getSelectedLine || !gMeme.lines.length) return 'start'
    // if (!getSelectedLine('linePlacement')) return 'start'
    if (getSelectedLine('linePlacement') === 'start') return 'end'
    if (getSelectedLine('linePlacement') === 'end') return 'center'
    if (getSelectedLine('linePlacement') === 'center') return 'start-center'
    if (getSelectedLine('linePlacement') === 'start-center') return 'center-end'
}

function saveMeme(newFlatImg) {
    gMeme['flatImg'] = newFlatImg
    gMeme['savedMemeId'] = makeId()
    console.log('gMeme: ', gMeme)
    gUserMemes.push(gMeme)
    _saveMemeToStorage()
}


function setUserMemes() {
    gUserMemes = _loadMemeFromStorage()
    if (!gUserMemes) gUserMemes = []
}

function getSavedMemeById(savedMemeId) {
    return gUserMemes.find(meme => meme['savedMemeId'] === savedMemeId)
}

function _saveMemeToStorage() {
    saveToStorage('userMemes', gUserMemes)
}

function _loadMemeFromStorage() {
    return loadFromStorage('userMemes')
}

