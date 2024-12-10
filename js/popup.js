const $ = (selector) => document.querySelector(selector)
const classList = (arrDOM) => {
  return {
    add(className) {
      arrDOM.forEach((element) => !!element && element.classList.add(className))
      return this
    },
    remove(className) {
      arrDOM.forEach((element) => !!element && element.classList.remove(className))
      return this
    },
  }
}

const zhTwBtn = $('#zhTwBtn')
const zhCnBtn = $('#zhCnBtn')
const resetBtn = $('#resetBtn')
const statusArea = $('#status')
const clearCacheBtn = $('#clearCache')
const langText = $('#langText')
const uiZhUsBtn = $('#uiZhUsBtn')
const uiZhBtn = $('#uiZhBtn')
const uiUsBtn = $('#uiUsBtn')

const setLanguage = (language) => {
  chrome.storage.local.set({ status: 'progress', language: language })
  if (language === 'us') {
    chrome.storage.local.get(['uiLanguage'], ({ uiLanguage }) => {
      if (uiLanguage !== 'Us') {
        chrome.storage.local.set({ uiLanguage: 'Us', statusUI: 'progress' })
      }
    })
  }
}

const setUILanguage = (language) => {
  chrome.storage.local.set({ uiLanguage: language, statusUI: 'progress' })
}

var manifestData = chrome.runtime.getManifest()
$('#version').innerText = manifestData.version

zhTwBtn.addEventListener('click', () => {
  setLanguage('zh_tw')
  uiZhBtn.click()
})
// zhCnBtn.addEventListener('click', () => {
//   setLanguage('zh_cn')
//   uiZhBtn.click()
// })
resetBtn.addEventListener('click', () => {
  setLanguage('us')
  uiUsBtn.click()
})

uiZhUsBtn.addEventListener('click', () => setUILanguage('ZhUs'))
uiZhBtn.addEventListener('click', () => setUILanguage('Zh'))
uiUsBtn.addEventListener('click', () => setUILanguage('Us'))

clearCacheBtn.addEventListener('click', () => {
  chrome.storage.local.clear()
  location.reload()
})

chrome.storage.onChanged.addListener((changes) => {
  for (let key in changes) {
    if (!!~['status', 'language', 'uiLanguage', 'statusUI'].indexOf(key)) {
      checkStatus()
    }
  }
})

let checkStatus = () => {
  classList([zhTwBtn, zhCnBtn, resetBtn, uiZhUsBtn, uiZhBtn, uiUsBtn]).add('disabled')
  statusArea.classList.add('loading')

  chrome.storage.local.get(['status', 'language', 'uiLanguage', 'statusUI'], ({ status, language, uiLanguage, statusUI }) => {
    langText.innerText = language
    if (!!language === false) {
      chrome.storage.local.set({
        status: 'done',
        language: 'us',
        statusUI: 'done',
        uiLanguage: 'Us',
      })
    } else if (status === 'done' && statusUI === 'done') {
      statusArea.classList.remove('loading')
      if (language === 'us') {
        classList([zhTwBtn, zhCnBtn]).remove('disabled')
      } else if (language === 'zh_tw') {
        classList([zhCnBtn, resetBtn, uiZhUsBtn, uiZhBtn, uiUsBtn]).remove('disabled')
      } else if (language === 'zh_cn') {
        classList([zhTwBtn, resetBtn, uiZhUsBtn, uiZhBtn, uiUsBtn]).remove('disabled')
      }
      if (uiLanguage === 'ZhUs') {
        uiZhUsBtn.classList.add('disabled')
      } else if (uiLanguage === 'Zh') {
        uiZhBtn.classList.add('disabled')
      } else if (uiLanguage === 'Us') {
        uiUsBtn.classList.add('disabled')
      }
    }
  })
}

checkStatus()
