browser.runtime.onMessage.addListener(changeTitle);

function changeTitle(request){
    document.title = request.title;
    console.log(request.title);
}
