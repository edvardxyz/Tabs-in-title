browser.tabs.onActivated.addListener(listTabs);
//browser.tabs.onRemoved.addListener(listTabs);               // dont include removed tab
//browser.tabs.onMoved.addListener(listTabs);
//browser.tabs.onUpdated.addListener(listTabs);
//browser.tabs.onDetached.addListener(listTabs);
//browser.tabs.onAttached.addListener(listTabs);

function listTabs(){
    const TabMaxLength = 125;
    getCurrentWindowTabs().then((tabs) => {
        let tabsList = '';
        let varLength = TabMaxLength / tabs.length;
        for (let tab of tabs){
            if(tab.active){
                tabsList += "|| >>" + truncateString(tab.title, varLength) + "<< ";
                continue;
            }
            tabsList += "|| " + truncateString(tab.title, varLength);
        }
        tabsList += `||
            \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0
            \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0
            \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0
            \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0
            \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0
            \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0
            \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0`;
        changeTitleWindow(tabs[0].windowId, tabsList);
    });
}

function getCurrentWindowTabs(){
    return browser.tabs.query({currentWindow: true});
}

function truncateString(string, limit){
    if(string.length > limit){
        return string.substring(0, limit);
    }else{
        return string;
    }
}

function changeTitleWindow(id, title){
    browser.windows.update(id, {titlePreface: title});
}

