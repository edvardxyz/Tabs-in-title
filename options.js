function saveOptions(e) {
    e.preventDefault();
    browser.storage.local.set({
        options:{
            sep: document.querySelector("#sep").value,
            left: document.querySelector("#left").value,
            right: document.querySelector("#right").value,
            max: document.querySelector("#max").value,
            tabs: document.querySelector("#tabs").value,
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
  }

  function onError(error) {
    console.log(`Error: ${error}`);
  }

  let getting = browser.storage.local.get("options");
  getting.then(setCurrentChoice, onError);
}

function restoreDefaults(){
    browser.storage.local.set({
        options:{
            sep: " ║ ",
            left: "»»",
            right:"««",
            max: 174,
            tabs: 6,
        }
    });
    restoreOptions();
}

function onCreated(tab){
    console.log(`Created new tab: ${tab.id}`)
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
    creating.then(onCreated);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
document.getElementById("restore").addEventListener("click", restoreDefaults);
document.getElementById("findsize").addEventListener("click", openPage);
