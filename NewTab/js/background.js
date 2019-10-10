chrome.contextMenus.create({
    id: 'newTab1',
    title: '新建NewTab',
    contexts: ['page'],
    // onclick: function() {
    //     chrome.tabs.create({url:'chrome://newtab'})
    // }
    documentUrlPatterns: ['http://*/*', 'https://*/*', 'file:///*', 'about:blank']
});

chrome.contextMenus.onClicked.addListener(onContextMenusClicked);


function onContextMenusClicked(obj) {
    chrome.tabs.create({ url: 'chrome://newtab' })
}