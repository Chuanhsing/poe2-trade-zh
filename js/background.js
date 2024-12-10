// chrome.runtime.onInstalled.addListener((details) => {
//   const currentVersion = chrome.runtime.getManifest().version
//   const previousVersion = details.previousVersion
//   const reason = details.reason

//   console.log(`Previous Version: ${previousVersion}`)
//   console.log(`Current Version: ${currentVersion}`)

//   switch (reason) {
//     case 'install':
//       console.log('New User installed the extension.')
//       break
//     case 'update':
//       console.log('User has updated their extension.')
//       //   if (currentVersion !== previousVersion) {
//       //     chrome.tabs.create({ url: 'https://baconrad.dev/' })
//       //   }
//       break
//     case 'chrome_update':
//     case 'shared_module_update':
//     default:
//       console.log('Other install events within the browser')
//       break
//   }
// })
chrome.storage.onChanged.addListener((changes) => {
  for (let key in changes) {
    let value = changes[key].newValue
    if (key === 'language') {
      changeLanguage(value)
    }
    if (key === 'uiLanguage') {
      changeUILanguage(value)
    }
  }
})

let changeLanguage = async (language) => {
  if (language === 'us') {
    getCacheData(language).then(({ items, stats, static }) => {
      chrome.storage.local.set({
        translation: { items, stats, static },
        status: 'done',
        updated: +new Date(),
      })
    })
  }
  if (language === 'zh_tw') {
    getCacheData('us').then(async ({ items, stats, static }) => {
      const translateFile = chrome.runtime.getURL('json/translate.json')
      let translate = await fetch(translateFile).then((res) => res.json())
      const clusterJewelFile = chrome.runtime.getURL('json/clusterJewel.json')
      let clusterJewel = await fetch(clusterJewelFile).then((res) => res.json())
      const passivesNotableFile = chrome.runtime.getURL('json/passivesNotable.json')
      let passivesNotable = await fetch(passivesNotableFile).then((res) => res.json())
      // items
      items.result.forEach((category) => {
        category.entries.forEach((item) => {
          let haveTranslateType = translate[item.type]
          let haveTranslate = translate[item.text]
          if (!!haveTranslate && !item.flags) {
            item.text = haveTranslate.zh_tw
          } else if (!!haveTranslateType && !item.flags) {
            item.text = haveTranslateType.zh_tw
          } else if (!!haveTranslate) {
            item.text = haveTranslate.zh_tw
          }
        })
      })
      getCacheData('zh_tw').then(({ stats: zh_stats, static: zh_static }) => {
        // stats
        let translate_stat = {}
        zh_stats.result.forEach((category) => {
          category.entries.forEach((item) => {
            translate_stat[item.id] = item.text
          })
        })
        stats.result.forEach((category) => {
          category.entries.forEach((item) => {
            let haveTranslate = translate_stat[item.id]
            if (!!haveTranslate) {
              item.text = haveTranslate + ' (' + item.text + ')'
            }
          })
        })
        // static
        let translate_static = {}
        let translate_label = {}
        Object.keys(zh_static.result).forEach((objectKey) => {
          // 3.9 hotfix
          let rowData = zh_static.result[objectKey]
          if (!!rowData.entries) {
            translate_label[objectKey] = rowData.label
            rowData = rowData.entries
          }
          rowData.forEach((item) => {
            translate_static[item.id] = item.text
          })
        })
        Object.keys(static.result).forEach((objectKey) => {
          // 3.9 hotfix
          let rowData = static.result[objectKey]
          if (!!rowData.entries) {
            rowData.label = translate_label[objectKey]
            rowData = rowData.entries
          }
          rowData.forEach((item) => {
            let haveTranslate = translate_static[item.id]
            if (!!haveTranslate) {
              item.text = haveTranslate + ' (' + item.text + ')'
            }
          })
        })
        // stats Filters 星團翻譯 (Added Small Passive Skills grant)
        cluster_jewel_us = stats.result[4].entries.find(({ id }) => id == 'enchant.stat_3948993189').option.options
        cluster_jewel_zh = zh_stats.result[4].entries.find(({ id }) => id == 'enchant.stat_3948993189').option.options
        //
        cluster_jewel_us.forEach((options) => {
          let zh_text = cluster_jewel_zh.find(({ id }) => id == options.id)
          if (zh_text) {
            options.text = zh_text.text + '\n (' + options.text + ')'
          }
        })
        // 塗油天賦翻譯
        passives_notable_us = stats.result[4].entries.find(({ id }) => id == 'enchant.stat_2954116742').option.options
        passives_notable_zh = zh_stats.result[4].entries.find(({ id }) => id == 'enchant.stat_2954116742').option.options
        //
        passives_notable_us.forEach((options) => {
          let zh_text = passives_notable_zh.find(({ id }) => id == options.id)
          if (zh_text) {
            options.text = zh_text.text + '\n (' + options.text + ')'
          }
        })
        // finish
        chrome.storage.local.set({
          translation: { items, stats, static, clusterJewel, passivesNotable },
          status: 'done',
          updated: +new Date(),
          statusUI: 'progress',
        })
        chrome.storage.local.get('uiLanguage', ({ uiLanguage }) => {
          changeUILanguage(uiLanguage)
        })
      })
    })
  }
  if (language === 'zh_cn') {
    getCacheData('us').then(async ({ items, stats, static }) => {
      const translateFile = chrome.runtime.getURL('json/translate.json')
      let translate = await fetch(translateFile).then((res) => res.json())
      const clusterJewelFile = chrome.runtime.getURL('json/clusterJewel.json')
      let clusterJewel = await fetch(clusterJewelFile).then((res) => res.json())
      const passivesNotableFile = chrome.runtime.getURL('json/passivesNotable.json')
      let passivesNotable = await fetch(passivesNotableFile).then((res) => res.json())
      // items
      items.result.forEach((category) => {
        category.entries.forEach((item) => {
          let haveTranslate = translate[item.text]
          if (!!haveTranslate) {
            item.text = haveTranslate.zh_cn
          }
        })
      })
      getCacheData('zh_cn').then(({ stats: zh_stats, static: zh_static }) => {
        // stats
        let translate_stat = {}
        zh_stats.result.forEach((category) => {
          category.entries.forEach((item) => {
            translate_stat[item.id] = item.text
          })
        })
        stats.result.forEach((category) => {
          category.entries.forEach((item) => {
            let haveTranslate = translate_stat[item.id]
            if (!!haveTranslate) {
              item.text = haveTranslate + ' (' + item.text + ')'
            }
          })
        })
        // static
        let translate_static = {}
        Object.keys(zh_static.result).forEach((objectKey) => {
          // 3.9 hotfix
          let rowData = zh_static.result[objectKey]
          if (!!rowData.entries) {
            rowData = rowData.entries
          }
          rowData.forEach((item) => {
            translate_static[item.id] = item.text
          })
        })
        Object.keys(static.result).forEach((objectKey) => {
          // 3.9 hotfix
          let rowData = zh_static.result[objectKey]
          if (!!rowData.entries) {
            rowData = rowData.entries
          }
          rowData.forEach((item) => {
            let haveTranslate = translate_static[item.id]
            if (!!haveTranslate) {
              item.text = haveTranslate + ' (' + item.text + ')'
            }
          })
        })
        // stats Filters 星團翻譯 (Added Small Passive Skills grant)
        cluster_jewel_us = stats.result[4].entries.find(({ id }) => id == 'enchant.stat_3948993189').option.options
        cluster_jewel_zh = zh_stats.result[4].entries.find(({ id }) => id == 'enchant.stat_3948993189').option.options
        //
        cluster_jewel_us.forEach((options) => {
          let zh_text = cluster_jewel_zh.find(({ id }) => id == options.id)
          if (zh_text) {
            options.text = zh_text.text + '\n (' + options.text + ')'
          }
        })
        // 塗油天賦翻譯
        passives_notable_us = stats.result[4].entries.find(({ id }) => id == 'enchant.stat_2954116742').option.options
        passives_notable_zh = zh_stats.result[4].entries.find(({ id }) => id == 'enchant.stat_2954116742').option.options
        //
        passives_notable_us.forEach((options) => {
          let zh_text = passives_notable_zh.find(({ id }) => id == options.id)
          if (zh_text) {
            options.text = zh_text.text + '\n (' + options.text + ')'
          }
        })
        // finish
        chrome.storage.local.set({
          translation: { items, stats, static, clusterJewel, passivesNotable },
          status: 'done',
          updated: +new Date(),
          statusUI: 'progress',
        })
        chrome.storage.local.get('uiLanguage', ({ uiLanguage }) => {
          changeUILanguage(uiLanguage)
        })
      })
    })
  }
}

let changeUILanguage = async (UILanguage) => {
  let UILanguageJSON = {}
  chrome.storage.local.get('language', ({ language }) => {
    if (language === 'zh_tw') {
      chrome.storage.local.get(['UILanguage_zh_tw'], async ({ UILanguage_zh_tw }) => {
        UILanguageJSON = UILanguage_zh_tw
        if (!!UILanguage_zh_tw === false) {
          let translateFile = chrome.runtime.getURL('json/translate.zh_TW.json')
          let translateText = await fetch(translateFile).then((res) => res.json())
          UILanguageJSON = translateText
          chrome.storage.local.set({ UILanguage_zh_tw: UILanguageJSON })
        }
        setUILanguage(UILanguage, UILanguageJSON)
      })
    }
    if (language === 'zh_cn') {
      chrome.storage.local.get(['UILanguage_zh_cn'], async ({ UILanguage_zh_cn }) => {
        UILanguageJSON = UILanguage_zh_cn
        if (!!UILanguage_zh_cn === false) {
          let translateFile = chrome.runtime.getURL('json/translate.zh_CN.json')
          let translateText = await fetch(translateFile).then((res) => res.json())
          UILanguageJSON = translateText
          chrome.storage.local.set({ UILanguage_zh_cn: UILanguageJSON })
        }
        setUILanguage(UILanguage, UILanguageJSON)
      })
    }
    if (language === 'us') {
      setUILanguage(UILanguage, UILanguageJSON)
    }
  })
}

let setUILanguage = (UILanguage, UILanguageJSON) => {
  if (UILanguage === 'ZhUs') {
    Object.keys(UILanguageJSON).forEach((objectKey) => {
      UILanguageJSON[objectKey] = UILanguageJSON[objectKey] + ' (' + objectKey + ')'
    })
    chrome.storage.local.set({
      UILanguage: UILanguageJSON,
      statusUI: 'done',
      updated: +new Date(),
    })
  }
  if (UILanguage === 'Zh') {
    chrome.storage.local.set({
      UILanguage: UILanguageJSON,
      statusUI: 'done',
      updated: +new Date(),
    })
  }
  if (UILanguage === 'Us') {
    chrome.storage.local.set({
      UILanguage: {},
      statusUI: 'done',
      updated: +new Date(),
    })
  }
}

let getCacheData = (language) => {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.local.get(`cache_${language}`, (storage) => {
        let cache = storage[`cache_${language}`] || {}
        let isEmptyObject = Object.keys(cache).length === 0
        if (isEmptyObject) {
          let data = fetchData[language]()
          resolve(data)
        } else {
          resolve(cache)
        }
      })
    } catch (error) {
      reject(error)
    }
  })
}

let fetchData = {
  async us() {
    let us_url = 'https://www.pathofexile.com/api/trade/data/'
    let items = await fetch(`${us_url}items`).then((res) => res.json())
    let stats = await fetch(`${us_url}stats`).then((res) => res.json())
    let static = await fetch(`${us_url}static`).then((res) => res.json())
    chrome.storage.local.set({ cache_us: { items, stats, static } })
    return { items, stats, static }
  },
  async zh_tw() {
    let us_url = 'https://pathofexile.tw/api/trade/data/'
    try {
      let stats = await fetch(`${us_url}stats`).then((res) => res.json())
      let static = await fetch(`${us_url}static`).then((res) => res.json())
      chrome.storage.local.set({ cache_zh_tw: { stats, static } })
      return { stats, static }
    } catch (error) {
      console.log(error)
    }
  },
  async zh_cn() {
    let us_url = 'https://poe.game.qq.com/api/trade/data/'
    let stats = await fetch(`${us_url}stats`).then((res) => res.json())
    let static = await fetch(`${us_url}static`).then((res) => res.json())
    chrome.storage.local.set({ cache_zh_cn: { stats, static } })
    return { stats, static }
  },
}
