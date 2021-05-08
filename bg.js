browser.tabs.onActivated.addListener(listTabs);
browser.tabs.onRemoved.addListener(listTabs);               // dont include removed tab
browser.tabs.onMoved.addListener(listTabs);
browser.tabs.onUpdated.addListener(listTabs);
browser.tabs.onDetached.addListener(listTabs);
browser.tabs.onAttached.addListener(listTabs);

function listTabs(){
    getCurrentWindowTabs().then((tabs) => {
        let tabsList = '';

        for (let tab of tabs){
            tabsList += tab.title;
        }
        test(tabsList);
        //sendData(tabsList);
    });
}

function test(titleT){
    console.log(`document.title = '${titleT}';`);
    browser.tabs.executeScript({code: `document.title = '${titleT}';`});
}

// maybe for loop trough tabs in listTabs and get active, dunno if faster than a new tabs.query
function getActiveTabId(){
    browser.tabs.query({active: true, currentWindow: true}).then((tabs) => {
        // console.log(tabs[0].id);
        return tabs[0].id;
    });
}

function getCurrentWindowTabs(){
    return browser.tabs.query({currentWindow: true});
}

function sendData(tabsList){
    browser.tabs.query({active: true, currentWindow: true}).then((tabs) => {
        browser.tabs.sendMessage(tabs[0].id, {title: tabsList});
    });
}
