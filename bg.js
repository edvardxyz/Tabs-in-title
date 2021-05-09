const SEPERATOR = " ║ ";
const ACTIVE_TAB_LEFT = "»»";
const ACTIVE_TAB_RIGHT = "««";
const BAR_MAX_CHARS = 174;
const TAB_COUNT_BEFORE_RESIZE = 6;
const EXTRA_CHARS_COUNT = SEPERATOR.length * (TAB_COUNT_BEFORE_RESIZE-1) + SEPERATOR.length * 2 + ACTIVE_TAB_RIGHT.length + ACTIVE_TAB_LEFT.length;
const TAB_MAX_CHARS = Math.floor((BAR_MAX_CHARS - EXTRA_CHARS_COUNT) / 6);

const PADDING = `${SEPERATOR}
            \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0
            \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0
            \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0
            \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0
            \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0
            \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0
            \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0`;

browser.tabs.onMoved.addListener(listTabs);
browser.tabs.onUpdated.addListener(listTabs);
browser.tabs.onDetached.addListener(listTabs);
browser.tabs.onAttached.addListener(listTabs);
browser.tabs.onActivated.addListener(listTabs);

browser.tabs.onRemoved.addListener(
    (tabId) => { listTabs(tabId);
    });

async function listTabs(tabId){
    await new Promise(r => setTimeout(r, 120));// TODO: find out how to fix this sh*t
    getCurrentWindowTabs().then((tabs) => {
        //tabs = tabs.filter(tab => tab.id != tabId);
        let tabsList = '';
        let varLength = tabs.length > TAB_COUNT_BEFORE_RESIZE ?
            (BAR_MAX_CHARS - (SEPERATOR.length * (tabs.length-1) + SEPERATOR.length * 2 + ACTIVE_TAB_RIGHT.length + ACTIVE_TAB_LEFT.length)) / tabs.length:
            TAB_MAX_CHARS;
        for (let tab of tabs){
            if(tab.active){
                tabsList += `${SEPERATOR}${ACTIVE_TAB_LEFT}` + truncateString(tab.title, varLength) + ACTIVE_TAB_RIGHT;
                continue;
            }
            if(arguments.length == 1 && tab.id == tabId){
                continue;
            }
            tabsList += SEPERATOR + truncateString(tab.title, varLength);
        }
        tabsList += PADDING;
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

