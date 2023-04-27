'use strict'

var gUserMemes = []
var gMeme = {
    selectedImgId: 't101',
    selectedLineIdx: 0,
    lines: [{
        text: 'ADD TEXT',
        font: 'impact',
        fontSize: 40,
        stroke: 'black',
        fill: 'white',
        align: 'center',
        linePlacement: 'start',
    }
    ]
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
    gMeme.lines[gMeme.selectedLineIdx][setting] = value
    renderMeme()
}


function  getSelectedLine(setting = null) {
    if (!gMeme.lines.length) return null
    if (setting) return gMeme.lines[gMeme.selectedLineIdx][setting]
    return gMeme.lines[gMeme.selectedLineIdx]
}

function addLine(text) {
    const line =  {
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
    updateMemeSettings('selectedLineIdx',lastLineIdx)
    const coords = getCanvasCoords(getSelectedLine('linePlacement'))
    updateLineSettings('coords', coords )
    console.log('gMeme: ', gMeme)
}

function deleteSelectedLine() {
    const selectedLine = getSelectedLine()
    const lineIdx = gMeme.lines.findIndex(line => line.id === selectedLine.id)
    gMeme.lines.splice(lineIdx, 1)
    const lastLineIdx = gMeme.lines.length - 1
    updateMemeSettings('selectedLineIdx',lastLineIdx)
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
    saveToStorage('userMemes',gUserMemes)
}

function _loadMemeFromStorage() {
    return loadFromStorage('userMemes')
}

