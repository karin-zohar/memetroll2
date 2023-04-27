'use strict'

function makeId() {
    return 't' + getNextId()
}

function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min) + min) // The maximum is exclusive and the minimum is inclusive
}

function createImgFromCanvas(canvas) {
    return canvas.toDataURL('image/jpeg') 
}

function getImgSize(img) {
    const height = img.naturalHeight
    const width = img.naturalWidth
    return {imgHeight: height, imgWidth: width}
}