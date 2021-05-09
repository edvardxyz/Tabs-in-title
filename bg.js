browser.tabs.onActivated.addListener(listTabs);
//browser.tabs.onRemoved.addListener(listTabs);               // dont include removed tab
//browser.tabs.onMoved.addListener(listTabs);
//browser.tabs.onUpdated.addListener(listTabs);
//browser.tabs.onDetached.addListener(listTabs);
//browser.tabs.onAttached.addListener(listTabs);

//var tempTitle;
//var tabId = null;
//
//           if(tab.active){
//               tempTitle = tab.title;
//               tabId = tab.id;
//          }
//          if(tabId !== tab.id){
//              changeTitelTemp(tabId, tempTitle);
//          }


function listTabs(){
    getCurrentWindowTabs().then((tabs) => {
        let tabsList = '';

        for (let tab of tabs){
            tabsList += tab.title;
        }
        changeTitleWindow(tabs[0].windowId, tabsList);
    });
}

function getCurrentWindowTabs(){
    return browser.tabs.query({currentWindow: true});
}

function changeTitleWindow(id, title){
    browser.windows.update(id, {titlePreface: title});
}







//function changeTitelTemp(id ,title){
//    console.log(`document.title = '${title}';`);
//    browser.tabs.executeScript(id, {code: `document.title = '${title}';`});
//}
//
//function changeTitel(title){
//    console.log(`document.title = '${title}';`);
//    browser.tabs.executeScript({code: `document.title = '${title}';`});
//}
