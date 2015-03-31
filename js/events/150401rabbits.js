window.bunnyMin = 60000;
window.bunnyExtra = 1800000;
window.bunnyMax = window.bunnyMin + window.bunnyExtra;

window.bunnyUpdates = window.bunnyMin + (Math.random() * window.bunnyExtra);
window.bunnyUpdates = window.bunnyUpdates.toFixed(0);

window.setInterval(function () {
    window.bunnyTime();
}, window.bunnyUpdates);

window.bunnyTime = function () {
    if (window.app.chatapp.room === null) return;
    
    var bunnyChance = 20 + ((window.bunnyUpdates / window.bunnyMax) * 50);
    
    var pictures = [
        "https://www.dropbox.com/s/lx5in34q3lisqfc/2014-12-07%20cup%20adorabunny.jpg?dl=1",
        "https://www.dropbox.com/s/0nt2i3t7apxfwm5/1425358584678.jpg?dl=1",
        "https://www.dropbox.com/s/3jcuml08rc41vag/a49nGqA_460sa_v1.gif?dl=1",
        "https://www.dropbox.com/s/n0h3u11tedvrn2a/You-are-a-very-naught-rabbit_o_135309.webp?dl=1",
        "https://www.dropbox.com/s/5ui8kfjp2fh7myn/bun%20and%20dog.jpg?dl=1",
        "https://www.dropbox.com/s/p995przgtvvfsej/Bunny%20diagram.jpg?dl=1",
        "https://www.dropbox.com/s/dmtn2k7s0krjlut/bunny%20too%20smart.gif?dl=1",
        "https://www.dropbox.com/s/fqhb2l9u4j604ti/cheezburger.jpg?dl=1",
        "https://www.dropbox.com/s/874yc3d2nucj3ii/cute%20bunny%20feet.jpg?dl=1",
        "https://www.dropbox.com/s/n0h3u11tedvrn2a/You-are-a-very-naught-rabbit_o_135309.webp?dl=1",
        "https://www.dropbox.com/s/21o8tvgra5r9s77/Day%2039%20on%20Ark.jpg?dl=1",
        "https://www.dropbox.com/s/20gl582qaksm353/FunnyPart-com-rabbit.jpg?dl=1",
        "https://www.dropbox.com/s/fhs0el7mf549pw0/Gimme%20carrots.jpg?dl=1",
        "https://www.dropbox.com/s/ejl5x5xkrhxcmsf/grumpy-bunny_o_2309937.jpg?dl=1",
        "https://www.dropbox.com/s/5n7u5fotdidc9b8/Happy%20yet.jpg?dl=1",
        "https://www.dropbox.com/s/dt2vgys08swjgo9/love%20machine.jpg?dl=1",
        "https://www.dropbox.com/s/3fus6c1z5z41b6m/Monster%20activate.gif?dl=1",
        "https://www.dropbox.com/s/n7np2q91ggxf9uc/murder.jpg?dl=1",
        "https://www.dropbox.com/s/n0h3u11tedvrn2a/You-are-a-very-naught-rabbit_o_135309.webp?dl=1",
        "https://www.dropbox.com/s/l2yss3sr1j8jbee/New%20Zealand%20White%20Bronson.jpg?dl=1",
        "https://www.dropbox.com/s/ia71aag8xwd5p7y/Obey%20the%20bunny.jpg?dl=1",
        "https://www.dropbox.com/s/ia71aag8xwd5p7y/Obey%20the%20bunny.jpg?dl=1",
        "https://www.dropbox.com/s/ia71aag8xwd5p7y/Obey%20the%20bunny.jpg?dl=1",
        "https://www.dropbox.com/s/2msiyzjkv2rb8y7/Owed%2020%20carrots.jpg?dl=1",
        "https://www.dropbox.com/s/52j04tvxv9gm3yd/paradise.jpg?dl=1",
        "https://www.dropbox.com/s/pr19048advmn9rn/Plant%20for%20overlords.jpg?dl=1",
        "https://www.dropbox.com/s/5fs9p6yozuh5qk7/rabbit-meme-generator-good-interpretation-73d86a.jpg?dl=1",
        "https://www.dropbox.com/s/5fs9p6yozuh5qk7/rabbit-meme-generator-good-interpretation-73d86a.jpg?dl=1",
        "https://www.dropbox.com/s/5fs9p6yozuh5qk7/rabbit-meme-generator-good-interpretation-73d86a.jpg?dl=1",
        "https://www.dropbox.com/s/v9jcopxwo8jao1z/Sign.jpg?dl=1",
        "https://www.dropbox.com/s/vbjpxvcu1gjtrg0/this%20s%20gay.jpg?dl=1",
        "https://www.dropbox.com/s/jwup9ii3fwubboq/Tantrum%20Brewing.png?dl=1",
        "https://www.dropbox.com/s/nlaxfp7fna386ix/This%2Bis%2Bthe%2Bkind%2Bof%2Bwhich%2Bmakes%2Bme%2Bsupport%2B_781acef912b3e0e32695255f3db4bc40.png?dl=1",
        "https://www.dropbox.com/s/mp93tayijllz87r/Too%20many%20rabbits%20-%20not.jpg?dl=1",
        "https://www.dropbox.com/s/wpe2iu7y9te6cq5/yep%20eh%20hoje.jpg?dl=1",
        "https://www.dropbox.com/s/no5l4jn3qgn6gps/you%20make%20me%20cry.jpg?dl=1",
        "https://www.dropbox.com/s/n0h3u11tedvrn2a/You-are-a-very-naught-rabbit_o_135309.webp?dl=1"
    ];
    
    var videos = [
        "https://www.youtube.com/watch?v=qM9YWm6T_hc",
        "https://www.youtube.com/watch?v=zHLju_nwPJc",
        "https://www.youtube.com/watch?v=hfkS0AzGbXI",
        "https://www.youtube.com/watch?v=zHLju_nwPJc",
        "https://www.youtube.com/watch?v=zHLju_nwPJc",
        "https://www.youtube.com/watch?v=zHLju_nwPJc",
        "https://www.youtube.com/watch?v=zHLju_nwPJc",
        "https://www.youtube.com/watch?v=XcxKIJTb3Hg",
        "https://www.youtube.com/watch?v=XcxKIJTb3Hg",
        "https://www.youtube.com/watch?v=eUizzmcYhws",
        "https://www.youtube.com/watch?v=8u8dwxjH6Is",
        "https://www.youtube.com/watch?v=3_J0AMPPD34"
    ];
    
    if ((Math.random() * 100) < bunnyChance) {
        var which = Math.floor(Math.random() * 10);
        
        if (which < 4) {
            which = Math.floor(Math.random() * videos.length);
            var message = new Message();
            message.module = 'youtube';
            message.msg = videos[which];
            window.app.chatapp.fixPrintAndSend(message, true);
        } else {
            which = Math.floor(Math.random() * pictures.length);
            var message = new Message();
            message.module = 'image';
            message.msg = pictures[which];
            message.setSpecial('name', "(Event) Bunny Time!");
            window.app.chatapp.fixPrintAndSend(message, true);
        }
    }
};