function saveOptions(e) {
    e.preventDefault();
    browser.storage.local.set({
        options:{
            sep: document.querySelector("#sep").value,
            left: document.querySelector("#left").value,
            right: document.querySelector("#right").value,
            max: document.querySelector("#max").value,
            tabs: document.querySelector("#tabs").value,
            cycle: document.getElementById("cycle").checked,
            count: document.getElementById("count").checked,
        }
    });
}

function restoreOptions() {

    function setCurrentChoice(result) {
        document.querySelector("#sep").value = result.options["sep"] || " ║ ";
        document.querySelector("#left").value = result.options["left"] || "»»";
        document.querySelector("#right").value = result.options["right"] || "««";
        document.querySelector("#max").value = result.options["max"] || 174;
        document.querySelector("#tabs").value = result.options["tabs"] || 6;
        document.getElementById("cycle").checked = result.options["cycle"] || false;
        document.getElementById("count").checked = result.options["count"] || false;
    }


    let getting = browser.storage.local.get("options");
    getting.then(setCurrentChoice, onError);
}

function onError(error) {
    console.log(`Error: ${error}`);
}

function restoreDefaults(){
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
    restoreOptions();
}

function onCreated(tab){
    browser.tabs.onRemoved.addListener(
    (tabId) => {
        if(tabId == tab.id){
            restoreOptions();
        };
    });
}

function openPage(){
    var creating = browser.tabs.create({
        url: "page/index.html"
    });
    creating.then(onCreated, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
document.getElementById("restore").addEventListener("click", restoreDefaults);
document.getElementById("findsize").addEventListener("click", openPage);
