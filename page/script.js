var slider = document.getElementById("range");
var output = document.getElementById("output");
output.innerHTML = slider.value;
title = '';

slider.oninput = function() {
    output.innerHTML = this.value;
    title = '';
    for(let i = 0; i < this.value; i++){
        title += 'X';
    }
    title += `
            \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0
            \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0
            \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0
            \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0
            \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0
            \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0`;
    changeTitleWindow();
}

function changeTitleWindow(){
    browser.windows.getCurrent().then((id) => {
        browser.windows.update(id.id, {titlePreface: title});
    });

}

function saveOption(e) {
    e.preventDefault();
    var storage = browser.storage.local.set({
        options:{
            max: slider.value,
        }
    });
    storage.then(window.close);
}

document.getElementById("setsize").addEventListener("click", saveOption);
