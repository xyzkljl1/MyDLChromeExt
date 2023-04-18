chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id:"MYDLEXTDownload",
        title: "下载"
    })

})
function Notify(tab,msg,type){
    chrome.scripting.executeScript({
                target: {tabId: tab,allFrames: true},
                files: ["js/jquery-1.8.3.js","js/notify.js"]
            },function(){
                chrome.scripting.executeScript({
                    target: {tabId: tab,allFrames: true},
                    func: function(msg,type){$.notify(msg,type)},
                    args: [msg,type]
            });
        });
}

chrome.contextMenus.onClicked.addListener(async function (info, tab) {
    if(info.menuItemId!="MYDLEXTDownload")
        return;
    //var head_res=await Promise.race([new Promise((resolve, reject) => {setTimeout(resolve, 1000, 'head timeout,ignore');}),    //just try,continue anyway
    //                    fetch(tab.url, {method: 'HEAD',headers: { 'Cache-Control': 'no-cache' }})
    //                    ]);
    //console.log(head_res)
    try
    {
        // .to和.net内容完全一样，但是用nhentai.to获取不到cookie导致后端下载失败
        var url = tab.url.replace('nhentai.to','nhentai.net');
        var cookies=await chrome.cookies.getAll({ "url": url });
        var cookie_str = "";
        for (let cookie of cookies)
            if (cookie.name == "csrftoken" || cookie.name == "sessionid" || cookie.name == "cf_clearance")//nhentai
                cookie_str += cookie.name + "=" + cookie.value + ";";
        //send to local server
        //fetch request has user-agent header,no need to pass in path.
        var res=await fetch('http://127.0.0.1:4000/?' + 'url=' + encodeURIComponent(tab.url) + "&cookie=" + encodeURIComponent(cookie_str), {
                method: 'GET',
                headers: { 'Cache-Control': 'no-cache' }
            });
        Notify(tab.id,res.ok?'Done.':'Fail.',res.ok?'success':'error');
        console.log((res.ok?"Done ":"Fail ") + tab.url);
    }
    catch (err){Notify
        Notify(tab.id,'Fail:'+err,'error');
        console.log("Fail " + tab.url+" "+err);
    }
});
