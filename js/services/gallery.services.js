'use strict'

const KEYWORDS = [
    {
        keyword: 'funny',
        numOfSearches: 6
    },
    {
        keyword: 'cute',
        numOfSearches: 1
    },
    {
        keyword: 'animals',
        numOfSearches: 2
    },
    {
        keyword: 'vip',
        numOfSearches: 4
    },
    {
        keyword: 'awkward',
        numOfSearches: 1
    }
]

let gNextId = 100
var gTemplates = [
    { 'title': 'loving-puppies', 'keywords': ['animals', 'cute'] },
    { 'title': 'sleeping-dog-and-baby', 'keywords': ['animals', 'cute'] },
    { 'title': 'sleeping-cat', 'keywords': ['animals'] },
    { 'title': 'history-channel', 'keywords': ['funny'] },
    { 'title': 'got-it-baby', 'keywords': ['funny'] },
    { 'title': 'surprise', 'keywords': ['awkward'] },
    { 'title': 'willy-wonka', 'keywords': ['awkward'] },
    { 'title': 'evil-laugh', 'keywords': ['awkward', 'funny'] },
    { 'title': 'obama-laugh', 'keywords': ['vip'] },
    { 'title': 'kissing-boxers', 'keywords': ['awkward'] },
    { 'title': 'what-would-you-do', 'keywords': ['vip'] },
    { 'title': 'leonardo-dicaprio', 'keywords': ['vip'] },
    { 'title': 'matrix', 'keywords': ['awkward'] },
    { 'title': 'one-does-not-simply', 'keywords': ['awkward'] },
    { 'title': 'star-trek', 'keywords': ['funny'] },
    { 'title': 'putin', 'keywords': ['vip'] },
    { 'title': 'toy-story', 'keywords': ['awkward'] },
    { 'title': 'trump', 'keywords': ['vip'] },
    { 'title': 'todiks-cat', 'keywords': ['animals','funny']}
]

let gCurrKeyword

_createTemplates()

function getTemplates() {
    let templates = gTemplates
    if (gCurrKeyword) templates = filterTemplates(templates, gCurrKeyword)
    return templates
}

function getTemplateById(templateId) {
   const selectedTemplate = gTemplates.find(template => template['id'] === templateId)
   return selectedTemplate
}

function getKeywords() {
    return KEYWORDS
}

function filterTemplates(templates, keyword) {
    if (keyword === 'all') return templates
    const filteredTemplates =  templates.filter(template => template.keywords.includes(keyword))
    return filteredTemplates
}

function setCurrKeyword(newKeyword) {
    const keywords = KEYWORDS.map(keywordObj => keywordObj['keyword'])
    if (keywords.includes(newKeyword)) {
        gCurrKeyword = newKeyword
        const currKeywordObj = KEYWORDS.find(keywordObj => keywordObj['keyword'] === newKeyword)
        console.log('currKeywordObj: ', currKeywordObj)
        currKeywordObj.numOfSearches++
    }
    
    else gCurrKeyword = null
    
}



function getImgUrl(title) {
    return `img/meme-imgs/${title}.jpg `
}

function getNextId() {
    return gNextId++
}

function createTemplateFromUpload(img, onOpenImg) {
    const uploadedTemplate = {
        id: makeId(),
        title: 'uploaded-by-user',
        imgUrl: img.src,
        keywords: []
    }
    gTemplates.push(uploadedTemplate)
    onOpenImg(uploadedTemplate.id)
}

function getRandomTemplateId() {
    const randomTemplate = getRandomInt(0, gTemplates.length)
    return randomTemplate.id
}

// Private functions 

function _createTemplates() {
    gTemplates.forEach((template,idx) => {
        const { title, keywords } = template
        template = _createTemplate(title, keywords)
        gTemplates.splice(idx, 1, template)
    })
}

function _createTemplate(title, keywords) {
    const template = {
        id: makeId(),
        title,
        imgUrl: getImgUrl(title),
        keywords
    }
    return template
}
