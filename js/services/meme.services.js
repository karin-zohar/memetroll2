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
        { first: `just quickly fix this bug before bed`, second: `five hours later: Why is the sun rising?`, fontSize: 30},
        { first: `realizing you're wrong`, second: `in the middle of an argument`, fontSize: 40 },
        { first: `to meme or not to meme`, second: `that is the question`, fontSize: 40 },
        { first: `the world doesn't hate you`, second: `you're just hungry`, fontSize: 40  },
        { first: `what i feel like`, second: `before my morning coffee`, fontSize: 40  },
        { first: `i dont hate people`, second: `i just hate idiots, which is most people`, fontSize: 30  },
        { first: `sure i'm a people person`, second: `from a distance`, fontSize: 40  },
        { first: `im a morning person`, second: `mourning my lack of sleep`, fontSize: 40 },
        { first: `me when i find`, second: `the perfect meme template`, fontSize: 40 },
        { first: `you only live once`, second: `better watch another episode`, fontSize: 40 },
        { first: `after all why not?`, second: `why shouldn't i watch netflix until 4 am?`, fontSize: 30 },
        // { first: ``, second: ``, fontSize: 40 },
        // { first: ``, second: ``, fontSize: 40 },
        // { first: ``, second: ``, fontSize: 40 },
        // { first: ``, second: ``, fontSize: 40 }
    ]
    const pickRandomIdx = getRandomInt(0, randomTexts.length)
    const pickRandom = randomTexts[pickRandomIdx]
    deleteSelectedLine()
    addLine(pickRandom.first.toUpperCase())
    updateLineSettings('fontSize', pickRandom.fontSize)
    addLine(pickRandom.second.toUpperCase())
    updateLineSettings('fontSize', pickRandom.fontSize)
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

