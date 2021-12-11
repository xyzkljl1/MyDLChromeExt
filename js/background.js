chrome.contextMenus.create({
    title: "下载",
    onclick: function (info, tab) {
    $.ajax({
        //url: 'https://www.dlsite.com/maniax/download/=/product_id/RJ258916.html',
        url:tab.url,
        //url:'https://download.dlsite.com/get/=/type/work/domain/doujin/dir/RJ299000/file/RJ298231.part1.exe/_/20200903152647',
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
    }
})
