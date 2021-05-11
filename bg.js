// Set defaults
SEPERATOR = " ║ ";
ACTIVE_TAB_LEFT = "»»";
ACTIVE_TAB_RIGHT = "««";
BAR_MAX_CHARS = 174;
TAB_COUNT_BEFORE_RESIZE = 6;

PADDING = `
            \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0
            \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0
            \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0
            \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0
            \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0
            \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0
            \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0`;

// Get saved options
let getting = browser.storage.local.get("options");
getting.then(onGot, onError);

// Calculate size of tabs before resizing
EXTRA_CHARS_COUNT = SEPERATOR.length * (TAB_COUNT_BEFORE_RESIZE-1) + SEPERATOR.length * 2 + ACTIVE_TAB_RIGHT.length + ACTIVE_TAB_LEFT.length;
TAB_MAX_CHARS = Math.floor((BAR_MAX_CHARS - EXTRA_CHARS_COUNT) / 6);

//browser.tabs.onActivated.addListener(listTabs); // dont think needed
browser.tabs.onDetached.addListener(listTabs); // new window gets updated
//browser.tabs.onAttached.addListener(listTabs); // new window get updated

// Listen for every possible tab event
browser.tabs.onMoved.addListener(listTabs); // works as expected
browser.tabs.onUpdated.addListener(listTabs);
browser.tabs.onRemoved.addListener(
    (tabId) => { listTabsRemoved(tabId);
    });

browser.storage.onChanged.addListener(() => {
    let getting = browser.storage.local.get("options");
    getting.then(onGot, onError);
});

function onGot(item){
    if(item.options["sep"]){
        SEPERATOR = item.options["sep"];
    }
    if(item.options["left"]){
        ACTIVE_TAB_LEFT = item.options["left"];
    }
    if(item.options["right"]){
        ACTIVE_TAB_RIGHT = item.options["right"];
    }
    if(item.options["max"]){
        BAR_MAX_CHARS = item.options["max"];
    }
    if(item.options["tabs"]){
        TAB_COUNT_BEFORE_RESIZE = item.options["tabs"];
    }
}
function listTabsRemoved(tabId){
    getCurrentWindowTabs().then((tabs) => {
        let tabsList = '';
        let varLength = tabs.length > TAB_COUNT_BEFORE_RESIZE ?
            (BAR_MAX_CHARS - (SEPERATOR.length * (tabs.length-1) + SEPERATOR.length * 2 + ACTIVE_TAB_RIGHT.length + ACTIVE_TAB_LEFT.length)) / tabs.length:
            TAB_MAX_CHARS;
        for (let tab of tabs){
            if(tab.active){
                tabsList += `${SEPERATOR}${ACTIVE_TAB_LEFT}` + truncateString(tab.title, varLength) + ACTIVE_TAB_RIGHT;
                continue;
            }
            if(tab.id == tabId){
               continue;
            }
            tabsList += SEPERATOR + truncateString(tab.title, varLength);
        }
        tabsList += `${SEPERATOR}${PADDING}`;
        changeTitleWindow(tabs[0].windowId, tabsList);
    });
}

// Loops trough each tab appending title to string
async function listTabs(){
    await new Promise(r => setTimeout(r, 125));
    getCurrentWindowTabs().then((tabs) => {
        let tabsList = '';
        let varLength = tabs.length > TAB_COUNT_BEFORE_RESIZE ?
            (BAR_MAX_CHARS - (SEPERATOR.length * (tabs.length-1) + SEPERATOR.length * 2 + ACTIVE_TAB_RIGHT.length + ACTIVE_TAB_LEFT.length)) / tabs.length:
            TAB_MAX_CHARS;
        for (let tab of tabs){
            if(tab.active){
                tabsList += `${SEPERATOR}${ACTIVE_TAB_LEFT}` + truncateString(tab.title, varLength) + ACTIVE_TAB_RIGHT;
                continue;
            }
            tabsList += SEPERATOR + truncateString(tab.title, varLength);
        }
        tabsList += `${SEPERATOR}${PADDING}`;
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

function onError(error){
    console.log(`Error: ${error}`);
}
