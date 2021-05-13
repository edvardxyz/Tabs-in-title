// Set defaults
SEPERATOR = " ║ ";
ACTIVE_TAB_LEFT = "»»";
ACTIVE_TAB_RIGHT = "««";
BAR_MAX_CHARS = 174;
TAB_COUNT_BEFORE_RESIZE = 6;
TABS_AROUND = TAB_COUNT_BEFORE_RESIZE % 2 == 0 ? (TAB_COUNT_BEFORE_RESIZE-2)/2 : (TAB_COUNT_BEFORE_RESIZE-1)/2;
showCount = false;
cycling = false;
PADDING = `
            \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0
            \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0
            \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0
            \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0
            \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0
            \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0
            \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0`;

// Get settings if set
let getting = browser.storage.local.get("options");
getting.then(onGot, onError);

// Calculate size of tabs before resizing
EXTRA_CHARS_COUNT = SEPERATOR.length * (TAB_COUNT_BEFORE_RESIZE+1) + ACTIVE_TAB_RIGHT.length + ACTIVE_TAB_LEFT.length;
TAB_MAX_CHARS = Math.floor((BAR_MAX_CHARS - EXTRA_CHARS_COUNT) / TAB_COUNT_BEFORE_RESIZE);

//browser.tabs.onActivated.addListener(listTabs);
//browser.tabs.onAttached.addListener(listTabs);

// Listen for possible tab event
browser.tabs.onMoved.addListener(
    (tabId) => { listTabs(tabId, false);
    });
browser.tabs.onDetached.addListener(
    (tabId) => { listTabs(tabId, false);
    });
browser.tabs.onUpdated.addListener(
    (tabId) => { listTabs(tabId, false);
    });
browser.tabs.onRemoved.addListener(
    (tabId) => { listTabs(tabId, true);
    });

browser.storage.onChanged.addListener(() => {
    let get = browser.storage.local.get("options");
    get.then(onGot, onError);
});

function listTabs(tabId, isOnRemoved){
    if(cycling){
        tabCycle();
    }else{
        tabResize(tabId, isOnRemoved)
    }
}

function onGot(item){
    SEPERATOR = item.options["sep"];
    ACTIVE_TAB_LEFT = item.options["left"];
    ACTIVE_TAB_RIGHT = item.options["right"];
    BAR_MAX_CHARS = item.options["max"];
    TAB_COUNT_BEFORE_RESIZE = item.options["tabs"];
    cycling = item.options["cycle"];
    showCount  = item.options["count"];
}

// Loops trough each tab appending title to string
async function tabResize(tabId, isOnRemoved){
    await new Promise(r => setTimeout(r, 130));
    getCurrentWindowTabs().then((tabs) => {
        let tabsList = '';
        let varLength = tabs.length > TAB_COUNT_BEFORE_RESIZE ?
            (BAR_MAX_CHARS - (SEPERATOR.length * (tabs.length+1) + ACTIVE_TAB_RIGHT.length + ACTIVE_TAB_LEFT.length)) / tabs.length:
            TAB_MAX_CHARS;
        for (let tab of tabs){
            if(tab.active){
                tabsList += `${SEPERATOR}${ACTIVE_TAB_LEFT}` + truncateString(tab.title, varLength) + ACTIVE_TAB_RIGHT;
                continue;
            }
            if(isOnRemoved && tab.id == tabId){
               continue;
            }
            tabsList += SEPERATOR + truncateString(tab.title, varLength);
        }
        tabsList += `${SEPERATOR}${PADDING}`;
        changeTitleWindow(tabs[0].windowId, tabsList);
    }, onError);
}

async function tabCycle(){
    await new Promise(r => setTimeout(r, 130));
    getCurrentWindowTabActive().then((activeTabs) => {
        getCurrentWindowTabs().then((tabs) => {
            let maxIndex = tabs.length-1;
            let activeIndex = activeTabs[0].index;
            addLeft = (TABS_AROUND + activeIndex - maxIndex) > 0 ? TABS_AROUND + activeIndex - maxIndex : 0;
            addRight = (TABS_AROUND - activeIndex) > 0 ? TABS_AROUND - activeIndex : 0;
            let tabsList = '';
            let count = 0;
            let varLength = TAB_MAX_CHARS;
            for (let tab of tabs){
                count++;
                if(tab.index >= activeIndex-TABS_AROUND-addLeft && tab.index <= activeIndex+TABS_AROUND+addRight){
                    if(tab.active){
                        tabsList += `${SEPERATOR}${ACTIVE_TAB_LEFT}` + truncateString(tab.title, varLength) + ACTIVE_TAB_RIGHT;
                        continue;
                    }
                    tabsList += SEPERATOR + truncateString(tab.title, varLength);
                }
            }
            tabsList += `${SEPERATOR}${PADDING}`;
            if(showCount == true){
                tabsList = `[${count.toString()}] ${tabsList}`;
            }
            changeTitleWindow(tabs[0].windowId, tabsList);
        }, onError);
    }, onError);
}

function getCurrentWindowTabActive(){
    return browser.tabs.query({currentWindow: true, active: true});
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
