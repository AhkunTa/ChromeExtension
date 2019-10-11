chrome.contextMenus.create({
    id: 'newTab1',
    title: '新建NewTab',
    contexts: ['page'],
    // onclick: function() {
    //     chrome.tabs.create({url:'chrome://newtab'})
    // }
    documentUrlPatterns: ['http://*/*', 'https://*/*', 'file:///*', 'about:blank']
});

chrome.contextMenus.onClicked.addListener(openNewTab);


function openNewTab() {
    chrome.tabs.create({ url: 'chrome://newtab' })
}

chrome.browserAction.onClicked.addListener(openNewTab);