chrome.contextMenus.create({
    title: "下载视频",
    onclick: function (info, tab) {
        $.ajax({
            url: 'http://127.0.0.1:4000',
            type: 'GET',
            data: tab.url,
            cache: false
        });
    }
});
