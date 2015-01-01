window.app.chatapp.onopen2 = window.app.chatapp.onopen;

window.app.chatapp.onopen = function (event) {
    var videos = [
        "http://youtu.be/WG9FWUIRlJc",
        "http://youtu.be/kSQjvQPF2uA",
        "http://youtu.be/frhvPawuE0Y",
        "http://youtu.be/PQYV6ePmr_g",
        "http://youtu.be/fxx9ywXzPSk",
        "http://youtu.be/lKHb-VqD_Bg",
        "http://youtu.be/_WAcetQUbsE",
        "http://youtu.be/-MOtz87ZYCo",
        "http://youtu.be/LXMSIvRD33k",
        "http://youtu.be/hLA6e4Q-vkM",
        "http://youtu.be/8y67cGWNJgA",
        "http://youtu.be/2JNotF6NnvU",
        "http://youtu.be/K0xg0oIAezA",
        "http://youtu.be/fciwfgzHuy0",
        "http://youtu.be/_paI88Seroc",
        "http://youtu.be/Z0RE8tTTT1Y",
        "http://youtu.be/bBaXziQbVOc",
        "http://youtu.be/X39BW-AwAvE",
        "http://youtu.be/en6byfJ1rNw",
        "http://youtu.be/g_-7x7n6ikg",
        "http://youtu.be/pOi4OIWe9gs",
        /* Natal */
        /* "http://youtu.be/nPRc6ljgmsA", */
        /* Natal */
        "http://youtu.be/wD4WsgumduU",
        "http://youtu.be/HbzOY5ZYt4Y",
        "http://youtu.be/wXyQhAWSKm0",
        "http://youtu.be/7_yXcJtV8V8",
        "http://youtu.be/hv79RkKpLAU",
        "http://youtu.be/R8b3yu3Q4_g",
        "http://youtu.be/oOov4_ztcws",
        "http://youtu.be/xMwRXCQH0wM",
        "http://youtu.be/ssAc_pMOyr8",
        "http://youtu.be/V_Jj6m8CFlU",
        "http://youtu.be/5RsCNdkIKRw",
        "http://youtu.be/7rnaYbttpGs",
        "http://youtu.be/TX1qTQTe3Hc",
        "http://youtu.be/wZBDSy-Btcw",
        "http://youtu.be/yLmwSoPQR6M",
        "http://youtu.be/PB5VkysNd_0",
        "http://youtu.be/G92-VhOS57w"
    ];
    
    if (typeof localStorage[window.app.loginapp.user.id + '2015'] === 'undefined') {
        localStorage[window.app.loginapp.user.id + '2015'] = "0";
    }
    
    var index = localStorage[window.app.loginapp.user.id + '2015'];
    if (!isNaN(index)) {
        index = parseInt(index);
        if (index < 0 || index >= videos.length) {
            index = 0;
        }
    } else {
        index = 0;
    }
    
    var id = window.app.ui.youtubeui.parseUrl(videos[index]);
    window.app.ui.youtubeui.play(id, true, false);
    
    localStorage[window.app.loginapp.user.id + '2015'] = ++index;
    
    this.onopen2 (event);
};