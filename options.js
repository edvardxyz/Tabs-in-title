function saveOptions() {
    browser.storage.local.set({
        options:{
            sep: document.querySelector("#sep").value,
            left: document.querySelector("#left").value,
            right: document.querySelector("#right").value,
            max: document.querySelector("#max").value,
            tabs: document.querySelector("#tabs").value,
            count: document.getElementById("count").checked,
            pad: document.querySelector("#pad").value,
            cycleOnTab: document.querySelector("#cycleOnTab").value,
            padTab: document.getElementById("padTab").checked,
        }
    });
}

function restoreOptions() {

    function setCurrentChoice(result) {
        document.querySelector("#sep").value = result.options["sep"] || " ║ ";
        document.querySelector("#left").value = result.options["left"] || "»»";
        document.querySelector("#right").value = result.options["right"] || "««";
        document.querySelector("#max").value = result.options["max"] || 175;
        document.querySelector("#tabs").value = result.options["tabs"] || 6;
        document.getElementById("count").checked = result.options["count"] || false;
        document.querySelector("#pad").value = result.options["pad"] || 42;
        document.querySelector("#cycleOnTab").value = result.options["cycleOnTab"] || 12;
        document.getElementById("padTab").checked = result.options["padTab"] || false;
    }


    let getting = browser.storage.local.get("options");
    getting.then(setCurrentChoice, onError);
}

function onError(error) {
    console.log(`Error: ${error}`);
}

function openPage(){
    browser.tabs.create({
        url: "page/index.html"
    });
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
document.getElementById("findsize").addEventListener("click", openPage);
