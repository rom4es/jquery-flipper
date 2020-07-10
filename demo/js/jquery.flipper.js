;(function ($) {

    'use strict';
    if ( !$ ) {
        console.log( 'jQuery не подключен' );
        return;
    }

    var Flipper = function( elem, options ){
        this.elem = elem;
        this.$elem = $(elem);
        this.options = options || {};
        this.init();
    };

    Flipper.prototype = {
        defaults: {
            countCardsInRow: 3,
            delayFlip: 2000,
            animateSpeed: 1000,
            animateType: "animFlip",
            random: true,
        },
        init: function() {
            this.initConfig();
            this.config.timer = null;
            this.config.stopped = false;
            this.createCards();
            this.initEvents();
            this.start();
            
            return this;
        },
        initEvents: function() {
            $(window).on("resize", $.proxy(this.resize, this));
        },
        initConfig: function () {
            this.config = $.extend({}, this.defaults, this.options);
            this.config.countCardsInRow = this.config.countCardsInRow || 3;
            this.config.delayFlip = this.config.delayFlip || 2000;
            this.config.animateSpeed = this.config.animateSpeed || 1000;
            this.config.cardWidth = this.$elem.width() / this.config.countCardsInRow;
            this.config.countCards = this.$elem.children().length;
        },
        resize: function () {
            this.config.cardWidth = this.$elem.width() / this.config.countCardsInRow;
            var self = this;
            this.$elem.children().each(function (i, element) {
                $(this).css({
                    "width": self.config.cardWidth,
                });
            });
        },
        getOption: function () {
            var option = arguments[0];
            return ( typeof option == "string" ) ? this.config[option] : undefined;
        },
        setOption: function () {
            if ( typeof arguments[0] == "string"){
                var option = arguments[0];
                var value = arguments[1];
                this.options[option] = value;
                this.initConfig();
                this.resize();
            }
        },
        createCards: function () {
            var self = this;
            this.$elem.children().each(function (i, element) {
                $(this).addClass("flip-card-inner").css({
                    "-webkit-transition-duration": self.config.animateSpeed+"ms",
                    "-moz-transform-duration": self.config.animateSpeed+"ms",
                    "-ms-transform-duration": self.config.animateSpeed+"ms",
                    "-o-transform-duration": self.config.animateSpeed+"ms",
                    "transform-duration": self.config.animateSpeed+"ms"
                });
                $(this).children().eq(0).addClass("flip-card-front");
                $(this).children().eq(1).addClass("flip-card-back");
                $(this).wrap("<div class='flip-card "+self.config.animateType+"'></div>");
                $(this).parent().css({
                    "width": self.config.cardWidth,
                });
            });
            this.$elem.addClass("flipper-plugin flipper-initialized");
        },
        working: function() {

            var self = this;
            this.workingTimerClear();

            if(!this.config.stopped){
                var prevCard = -1;
                this.config.timer = setInterval(function() {
                    var nextCard = getNextCard(self.config.countCards, prevCard, self.config.random);
                    self.$elem.find(".flip-card").eq(nextCard).toggleClass("flipped");
                    prevCard = nextCard;
                }, this.config.delayFlip);
            }

            function getNextCard(countCards, prevCard, random) {
                if(countCards <= 1){
                    return 0;
                }
                prevCard = prevCard || 0;
                random = random || false;
                var next;
                if(random){
                    do{
                        next = Math.floor(Math.random() * countCards);
                    }while(next == prevCard);
                }else{
                    next = (prevCard+1 >= countCards) ? 0 : prevCard+1;
                }
                return next;
            }

        },
        workingTimerClear: function() {
            if (this.config.timer) {
                clearInterval(this.config.timer);
            }
        },
        start: function () {
            this.config.stopped = false;
            this.working();
        },
        stop: function () {
            this.config.stopped = true;
            this.workingTimerClear();
        },
        destroy: function () {
            this.workingTimerClear();
            var self = this;
            this.$elem.children().each(function (i, element) {
                var $sourceElem = $(this).children();
                $sourceElem.removeClass("flip-card-inner").css({
                    "-webkit-transition-duration": "",
                    "-moz-transform-duration": "",
                    "-ms-transform-duration": "",
                    "-o-transform-duration": "",
                    "transform-duration": "",
                });
                $sourceElem.children().eq(0).removeClass("flip-card-front");
                $sourceElem.children().eq(1).removeClass("flip-card-back");
                $sourceElem.unwrap();
            });
            this.$elem.removeClass("flipper-plugin flipper-initialized");
        }

    };

    Flipper.defaults = Flipper.prototype.defaults;

    $.fn.flipper = function() {
        // return this.each(function() {
        //     new Flipper(this, options).init();
        // });
        var _ = this,
            opt = arguments[0],
            args = Array.prototype.slice.call(arguments, 1),
            l = _.length,
            i,
            ret;
        for (i = 0; i < l; i++) {
            if (typeof opt == 'object' || typeof opt == 'undefined')
                _[i].flipper = new Flipper(_[i], opt);
            else
                ret = _[i].flipper[opt].apply(_[i].flipper, args);
            if (typeof ret != 'undefined') return ret;
        }
        return _;
    };

})(jQuery);