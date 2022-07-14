chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id:"MYDLEXTDownload",
        title: "下载"
    })

})
chrome.contextMenus.onClicked.addListener(function (info, tab) {
    switch (info.menuItemId) {
        case "MYDLEXTDownload":
            fetch(tab.url, {
                method: 'HEAD',
                headers: { 'Cache-Control': 'no-cache' }
            }).then(res => {
                if (res.ok)//head success
                    res.text().then(function (result) {
                        chrome.cookies.getAll({ "url": tab.url }, function (cookies) {
                            var ret = "";
                            for (let cookie of cookies)
                                if (cookie.name == "csrftoken" || cookie.name == "sessionid" || cookie.name == "cf_clearance")//nhentai
                                    ret += cookie.name + "=" + cookie.value + ";";
                            fetch('http://127.0.0.1:4000/?' + 'url=' + encodeURIComponent(tab.url) + "&" + "cookie=" + encodeURIComponent(ret), {
                                method: 'GET',
                                headers: { 'Cache-Control': 'no-cache' }
                            }).then(res => res.text()).then(function (result) {
                                console.log("Download Registered " + result);
                            });
                        })
                    });
                else//can't head ,eg. telegra.ph
                    chrome.cookies.getAll({ "url": tab.url }, function (cookies) {
                        var ret = "";
                        for (let cookie of cookies)
                            if (cookie.name == "csrftoken" || cookie.name == "sessionid")
                                ret += cookie.name + "=" + cookie.value + ";";
                        fetch('http://127.0.0.1:4000/?' + 'url=' + encodeURIComponent(tab.url) + "&" + "cookie=" + encodeURIComponent(ret),{
                            method: 'GET',
                            headers: { 'Cache-Control': 'no-cache' }
                        }).done(function (result) {
                            console.log("Download Registered " + result);
                        });
                    });
            });
            break;
    }
});
