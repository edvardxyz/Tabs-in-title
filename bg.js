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
                max: 175,
                tabs: 6,
                count: false,
                pad: 42,
                cycleOnTab: 12,
                padTab: false,
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
    window.showCount  = item.options["count"];
    window.CYCLE_OVER_TAB = item.options["cycleOnTab"];
    window.PAD_TAB = item.options["padTab"];
    window.PADDING = '';
    for(var i = 0; i < item.options["pad"]; i++){
        PADDING += "\xa0\xa0\xa0\xa0\xa0\xa0";
    }
    // Calculate new values for tabs
    window.cycleTabSize = Math.floor((BAR_MAX_CHARS - (SEPERATOR.length * (parseInt(CYCLE_OVER_TAB)+2) + ACTIVE_TAB_RIGHT.length + ACTIVE_TAB_LEFT.length)) / (parseInt(CYCLE_OVER_TAB)+1));
    window.EXTRA_CHARS_COUNT = SEPERATOR.length * (parseInt(TAB_COUNT_BEFORE_RESIZE)+1) + ACTIVE_TAB_RIGHT.length + ACTIVE_TAB_LEFT.length;
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
// Loops through each tab appending every tab title to string and resize when needed
async function listTabs(tabId, isOnRemoved){
    await new Promise(r => setTimeout(r, 130));
    browser.tabs.query({currentWindow: true, active: true}).then((activeTabs) => {
        browser.tabs.query({currentWindow: true}).then((tabs) => {
            var tabsList = '';
            if(tabs.length < CYCLE_OVER_TAB){
                let varLength = tabs.length > TAB_COUNT_BEFORE_RESIZE ?
                    (BAR_MAX_CHARS - (SEPERATOR.length * (tabs.length+1) + ACTIVE_TAB_RIGHT.length + ACTIVE_TAB_LEFT.length)) / tabs.length:
                    TAB_MAX_CHARS;
                for (let tab of tabs){
                    if(tab.active){
                        tabsList += `${SEPERATOR}${ACTIVE_TAB_LEFT}` + truncateString(tab.title, varLength, true) + ACTIVE_TAB_RIGHT;
                        continue;
                    }
                    if(isOnRemoved && tab.id == tabId){
                        continue;
                    }
                    tabsList += SEPERATOR + truncateString(tab.title, varLength);
                }
            }else{
                let maxIndex = tabs.length-1;
                let activeIndex = activeTabs[0].index;
                let TABS_AROUND = Math.floor(CYCLE_OVER_TAB/2);
                let addLeft = (TABS_AROUND + activeIndex - maxIndex) > 0 ? TABS_AROUND + activeIndex - maxIndex : 0;
                let addRight = (TABS_AROUND - activeIndex) > 0 ? TABS_AROUND - activeIndex : 0;
                for (let tab of tabs){
                    if(tab.index >= activeIndex-TABS_AROUND-addLeft && tab.index <= activeIndex+TABS_AROUND+addRight){
                        if(tab.active){
                            tabsList += `${SEPERATOR}${ACTIVE_TAB_LEFT}` + truncateString(tab.title, cycleTabSize, true) + ACTIVE_TAB_RIGHT;
                            continue;
                        }
                        if(isOnRemoved && tab.id == tabId){
                            continue;
                        }
                        tabsList += SEPERATOR + truncateString(tab.title, cycleTabSize);
                    }
                }
            }
            tabsList += `${SEPERATOR}${PADDING}`;
            if(showCount == true){
                tabsList = `[${tabs.length}] ${tabsList}`;
            }
            browser.windows.update(tabs[0].windowId, {titlePreface: tabsList});
        }, onError);
    }, onError);
}
// Used to truncate tab titles
function truncateString(string, limit, active){
    if(string.length > limit){
        return string.substring(0, limit);
    }
    else{
        if(PAD_TAB){
            for(let i = active ? string.length+ACTIVE_TAB_RIGHT.length+ACTIVE_TAB_LEFT.length : string.length; i < limit; i++){
                string += '\xa0';
            }
            return string;
        }else{
            return string;
        }
    }
}
// Called if promise failed
function onError(error){
    console.log(`Error: ${error}`);
}
