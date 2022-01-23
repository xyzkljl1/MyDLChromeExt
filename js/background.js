chrome.contextMenus.create({
    title: "下载",
    onclick: function (info, tab) {
    $.ajax({
        url:tab.url,
        type: 'HEAD',
        cache: false,
    }).done(function (result) {
         chrome.cookies.getAll({ "url": tab.url }, function (cookies) {
            var ret = "";
            for (let cookie of cookies)
                if(cookie.name=="csrftoken"||cookie.name=="sessionid")
                    ret += cookie.name + "=" + cookie.value + "; ";
            $.ajax({
                url: 'http://127.0.0.1:4000',
                type: 'GET',
                data: {url:tab.url,cookie:ret},
                cache: false
                }).done(function (result) {
                    console.log("Download Registered " + result);
                    });
            })
        })
       //some site such as telegra.ph cant head
      .fail(function (result) {
         chrome.cookies.getAll({ "url": tab.url }, function (cookies) {
            var ret = "";
            for (let cookie of cookies)
                if(cookie.name=="csrftoken"||cookie.name=="sessionid")
                    ret += cookie.name + "=" + cookie.value + "; ";
            $.ajax({
                url: 'http://127.0.0.1:4000',
                type: 'GET',
                data: {url:tab.url,cookie:ret},
                cache: false
                }).done(function (result) {
                    console.log("Download Registered " + result);
                    });
            })
        })
    }
})
