$(document).ready(function() {
    var $width = $(window).width();

    var flipper1 = $(".b-card-list").flipper();

    var flipper2 = $(".b-card-list-2").flipper({
        countCardsInRow: 4,
        delayFlip: 1000,
        animateSpeed: 400,
        animateType: "animFadeIn",
        random: false,
    });

    function resize() {
        $width = $(window).width();
        if($width > 768){
            flipper1.flipper("setOption", "countCardsInRow", 3);
            flipper2.flipper("setOption", "countCardsInRow", 4);
        }else if($width > 450){
            flipper1.flipper("setOption", "countCardsInRow", 2);
            flipper2.flipper("setOption", "countCardsInRow", 2);
        }else{
            flipper1.flipper("setOption", "countCardsInRow", 1);
            flipper2.flipper("setOption", "countCardsInRow", 1);
        }
    }
    $(window).resize(resize);
    resize();
});