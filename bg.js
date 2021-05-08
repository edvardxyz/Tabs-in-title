browser.tabs.onActivated.addListener(listTabs);
//browser.tabs.onRemoved.addListener(listTabs);               // dont include removed tab
//browser.tabs.onMoved.addListener(listTabs);
//browser.tabs.onUpdated.addListener(listTabs);
//browser.tabs.onDetached.addListener(listTabs);
//browser.tabs.onAttached.addListener(listTabs);

function listTabs(){
    getCurrentWindowTabs().then((tabs) => {
        let tabsList = '';

        for (let tab of tabs){
            tabsList += tab.title;
        }
        changeTitel(tabsList);
    });
}

function changeTitel(title){
    console.log(`document.title = '${title}';`);
    browser.tabs.executeScript({code: `document.title = '${title}';`});
}

function getCurrentWindowTabs(){
    return browser.tabs.query({currentWindow: true});
}
