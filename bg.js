padCount = 42;
PADDING = '';
for(var i = 0; i < padCount; i++){
    PADDING += "\xa0\xa0\xa0\xa0\xa0\xa0";
}
// Get settings
let getting = browser.storage.local.get("options");
getting.then(onGot, onError);
function onGot(item){
    if(Object.keys(item).length == 0){
        browser.storage.local.set({
            options:{
                sep: " ║ ",
                left: "»»",
                right:"««",
                max: 174,
                tabs: 6,
                cycle: false,
                count: false,
            }
        });
        let getting = browser.storage.local.get("options");
        getting.then(onGot, onError);
        return;
    }
    window.SEPERATOR = item.options["sep"];
    window.ACTIVE_TAB_LEFT = item.options["left"];
    window.ACTIVE_TAB_RIGHT = item.options["right"];
    window.BAR_MAX_CHARS = item.options["max"];
    window.TAB_COUNT_BEFORE_RESIZE = item.options["tabs"];
    window.cycling = item.options["cycle"];
    window.showCount  = item.options["count"];
    // Calculate new values for tabs
    window.TABS_AROUND = TAB_COUNT_BEFORE_RESIZE % 2 == 0 ? (TAB_COUNT_BEFORE_RESIZE-2)/2 : (TAB_COUNT_BEFORE_RESIZE-1)/2;
    window.EXTRA_CHARS_COUNT = SEPERATOR.length * (TAB_COUNT_BEFORE_RESIZE+1) + ACTIVE_TAB_RIGHT.length + ACTIVE_TAB_LEFT.length;
    window.TAB_MAX_CHARS = Math.floor((BAR_MAX_CHARS - EXTRA_CHARS_COUNT) / TAB_COUNT_BEFORE_RESIZE);
}
// Listen for options changes so no restart needed
browser.storage.onChanged.addListener(() => {
    let getting = browser.storage.local.get("options");
    getting.then(onGot, onError);
});
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
// Use tab mode depending on cycling var = false | true
function listTabs(tabId, isOnRemoved){
    if(cycling)
        tabCycle();
    else
        tabResize(tabId, isOnRemoved)
}
// Loops through each tab appending every tab title to string and resize when needed
async function tabResize(tabId, isOnRemoved){
    await new Promise(r => setTimeout(r, 130));
    browser.tabs.query({currentWindow: true}).then((tabs) => {
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
        browser.windows.update(tabs[0].windowId, {titlePreface: tabsList});
    }, onError);
}
// Loop through each tab and append tab title if within range of active tab index
async function tabCycle(){
    await new Promise(r => setTimeout(r, 130));
    browser.tabs.query({currentWindow: true, active: true}).then((activeTabs) => {
        browser.tabs.query({currentWindow: true}).then((tabs) => {
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
            browser.windows.update(tabs[0].windowId, {titlePreface: tabsList});
        }, onError);
    }, onError);
}
// Used to truncate tab titles
function truncateString(string, limit){
    if(string.length > limit)
        return string.substring(0, limit);
    else
        return string;
}
// Called if promise failed
function onError(error){
    console.log(`Error: ${error}`);
}
