chrome.storage.local.get(['updated', 'UILanguage'], ({ updated, UILanguage }) => {
    // addScript('var __ = ' + JSON.stringify(UILanguage))
    addScript()

    let localUpdated = localStorage['local-updated'] || 0
    if (+updated > +localUpdated) {
        chrome.storage.local.get(['translation'], ({ translation }) => {
            localStorage['lscache-tradeitems'] = JSON.stringify(translation.items.result)
            localStorage['lscache-tradestats'] = JSON.stringify(translation.stats.result)
            localStorage['lscache-tradedata'] = JSON.stringify(translation.static.result)
        })
        localStorage.removeItem('lscache-tradeitems-cacheexpiration')
        localStorage.removeItem('lscache-tradestats-cacheexpiration')
        localStorage.removeItem('lscache-tradedata-cacheexpiration')
        localStorage['local-updated'] = +new Date()
        translation = null
    }
})

let addScript = (scriptString) => {
    var s = document.createElement('script');
    s.src = chrome.runtime.getURL('js/translate.zh_TW.js');
    s.onload = function() {
        this.remove();
    };
    (document.head || document.documentElement).appendChild(s);
}