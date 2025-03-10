var WRAPPER_SELECTOR = ".slider__wrapper"
  , ITEMS_SELECTOR = ".slider__items"
  , ITEM_SELECTOR = ".slider__item"
  , ITEM_CLASS_ACTIVE = "slider__item_active"
  , CONTROL_SELECTOR = ".slider__control"
  , CONTROL_CLASS_SHOW = "slider__control_show"
  , INDICATOR_WRAPPER_ELEMENT = "ol"
  , INDICATOR_WRAPPER_CLASS = "slider__indicators"
  , INDICATOR_ITEM_ELEMENT = "li"
  , INDICATOR_ITEM_CLASS = "slider__indicator"
  , INDICATOR_ITEM_CLASS_ACTIVE = "slider__indicator_active"
  , SWIPE_THRESHOLD = 20
  , TRANSITION_NONE = "transition-none";
function SimpleAdaptiveSlider(t, i) {
    for (var e in this._$root = document.querySelector(t),
    this._$wrapper = this._$root.querySelector(WRAPPER_SELECTOR),
    this._$items = this._$root.querySelector(ITEMS_SELECTOR),
    this._$itemList = this._$root.querySelectorAll(ITEM_SELECTOR),
    this._currentIndex = 0,
    this._minOrder = 0,
    this._maxOrder = 0,
    this._$itemWithMinOrder = null,
    this._$itemWithMaxOrder = null,
    this._minTranslate = 0,
    this._maxTranslate = 0,
    this._direction = "next",
    this._balancingItemsFlag = !1,
    this._transform = 0,
    this._hasSwipeState = !1,
    this._swipeStartPosX = 0,
    this._intervalId = null,
    this._config = {
        loop: !0,
        autoplay: !1,
        interval: 5e3,
        swipe: !0
    },
    i)
        this._config.hasOwnProperty(e) && (this._config[e] = i[e]);
    for (var s = 0, n = this._$itemList.length; s < n; s++)
        this._$itemList[s].dataset.order = s,
        this._$itemList[s].dataset.index = s,
        this._$itemList[s].dataset.translate = 0;
    if (this._config.loop) {
        var r = this._$itemList.length - 1
          , a = 100 * -this._$itemList.length;
        this._$itemList[r].dataset.order = -1,
        this._$itemList[r].dataset.translate = 100 * -this._$itemList.length;
        var o = "translateX(".concat(a, "%)");
        this._$itemList[r].style.transform = o
    }
    this._addIndicators(),
    this._refreshExtremeValues(),
    this._setActiveClass(),
    this._addEventListener(),
    this._autoplay()
}
SimpleAdaptiveSlider.prototype._setActiveClass = function() {
    var t, i, e, s;
    for (t = 0,
    i = this._$itemList.length; t < i; t++)
        e = this._$itemList[t],
        s = parseInt(e.dataset.index),
        this._currentIndex === s ? e.classList.add(ITEM_CLASS_ACTIVE) : e.classList.remove(ITEM_CLASS_ACTIVE);
    var n = this._$root.querySelectorAll("." + INDICATOR_ITEM_CLASS);
    if (n.length)
        for (t = 0,
        i = n.length; t < i; t++)
            e = n[t],
            s = parseInt(e.dataset.slideTo),
            this._currentIndex === s ? e.classList.add(INDICATOR_ITEM_CLASS_ACTIVE) : e.classList.remove(INDICATOR_ITEM_CLASS_ACTIVE);
    var r = this._$root.querySelectorAll(CONTROL_SELECTOR);
    if (r.length)
        if (this._config.loop)
            for (t = 0,
            i = r.length; t < i; t++)
                r[t].classList.add(CONTROL_CLASS_SHOW);
        else
            0 === this._currentIndex ? (r[0].classList.remove(CONTROL_CLASS_SHOW),
            r[1].classList.add(CONTROL_CLASS_SHOW)) : this._currentIndex === this._$itemList.length - 1 ? (r[0].classList.add(CONTROL_CLASS_SHOW),
            r[1].classList.remove(CONTROL_CLASS_SHOW)) : (r[0].classList.add(CONTROL_CLASS_SHOW),
            r[1].classList.add(CONTROL_CLASS_SHOW))
}
,
SimpleAdaptiveSlider.prototype._move = function() {
    if ("none" === this._direction)
        return this._$items.classList.remove(TRANSITION_NONE),
        void (this._$items.style.transform = "translateX(".concat(this._transform, "%)"));
    if (!this._config.loop) {
        if (this._currentIndex + 1 >= this._$itemList.length && "next" === this._direction)
            return void this._autoplay("stop");
        if (this._currentIndex <= 0 && "prev" === this._direction)
            return
    }
    var t = "next" === this._direction ? -100 : 100
      , i = this._transform + t;
    "next" === this._direction ? ++this._currentIndex > this._$itemList.length - 1 && (this._currentIndex -= this._$itemList.length) : --this._currentIndex < 0 && (this._currentIndex += this._$itemList.length),
    this._transform = i,
    this._$items.style.transform = "translateX(".concat(i, "%)"),
    this._setActiveClass()
}
,
SimpleAdaptiveSlider.prototype._moveTo = function(t) {
    var i = this._currentIndex;
    this._direction = t > i ? "next" : "prev";
    for (var e = 0; e < Math.abs(t - i); e++)
        this._move()
}
,
SimpleAdaptiveSlider.prototype._autoplay = function(t) {
    if (this._config.autoplay)
        return "stop" === t ? (clearInterval(this._intervalId),
        void (this._intervalId = null)) : void (null === this._intervalId && (this._intervalId = setInterval(function() {
            this._direction = "next",
            this._move()
        }
        .bind(this), this._config.interval)))
}
,
SimpleAdaptiveSlider.prototype._addIndicators = function() {
    if (!this._$root.querySelector("." + INDICATOR_WRAPPER_CLASS)) {
        var t = document.createElement(INDICATOR_WRAPPER_ELEMENT);
        t.className = INDICATOR_WRAPPER_CLASS;
        for (var i = 0, e = this._$itemList.length; i < e; i++) {
            var s = document.createElement(INDICATOR_ITEM_ELEMENT);
            s.className = INDICATOR_ITEM_CLASS,
            s.dataset.slideTo = i,
            t.appendChild(s)
        }
        this._$root.appendChild(t)
    }
}
,
SimpleAdaptiveSlider.prototype._refreshExtremeValues = function() {
    var t = this._$itemList;
    this._minOrder = parseInt(t[0].dataset.order),
    this._maxOrder = this._minOrder,
    this._$itemWithMinOrder = t[0],
    this._$itemWithMaxOrder = this._$itemWithMinOrder,
    this._minTranslate = parseInt(t[0].dataset.translate),
    this._maxTranslate = this._minTranslate;
    for (var i = 0, e = t.length; i < e; i++) {
        var s = t[i]
          , n = parseInt(s.dataset.order);
        n < this._minOrder ? (this._minOrder = n,
        this._$itemWithMinOrder = s,
        this._minTranslate = parseInt(s.dataset.translate)) : n > this._maxOrder && (this._maxOrder = n,
        this._$itemWithMaxOrder = s,
        this._minTranslate = parseInt(s.dataset.translate))
    }
}
,
SimpleAdaptiveSlider.prototype._balancingItems = function() {
    if (this._balancingItemsFlag) {
        var t, i = this._$wrapper.getBoundingClientRect(), e = i.width / 2, s = this._$itemList.length;
        if ("next" === this._direction) {
            var n = i.left
              , r = this._$itemWithMinOrder;
            t = this._minTranslate,
            r.getBoundingClientRect().right < n - e && (r.dataset.order = this._minOrder + s,
            t += 100 * s,
            r.dataset.translate = t,
            r.style.transform = "translateX(".concat(t, "%)"),
            this._refreshExtremeValues())
        } else if ("prev" === this._direction) {
            var a = i.right
              , o = this._$itemWithMaxOrder;
            t = this._maxTranslate,
            o.getBoundingClientRect().left > a + e && (o.dataset.order = this._maxOrder - s,
            t -= 100 * s,
            o.dataset.translate = t,
            o.style.transform = "translateX(".concat(t, "%)"),
            this._refreshExtremeValues())
        }
        requestAnimationFrame(this._balancingItems.bind(this))
    }
}
,
SimpleAdaptiveSlider.prototype._addEventListener = function() {
    var t = this._$items;
    function i(t) {
        this._autoplay("stop");
        var i = 0 === t.type.search("touch") ? t.touches[0] : t;
        this._swipeStartPosX = i.clientX,
        this._swipeStartPosY = i.clientY,
        this._hasSwipeState = !0,
        this._hasSwiping = !1
    }
    function e(t) {
        if (this._hasSwipeState) {
            var i = 0 === t.type.search("touch") ? t.touches[0] : t
              , e = this._swipeStartPosX - i.clientX
              , s = this._swipeStartPosY - i.clientY;
            if (!this._hasSwiping) {
                if (Math.abs(s) > Math.abs(e))
                    return void (this._hasSwipeState = !1);
                this._hasSwiping = !0
            }
            t.preventDefault(),
            this._config.loop || (this._currentIndex + 1 >= this._$itemList.length && e >= 0 && (e /= 4),
            this._currentIndex <= 0 && e <= 0 && (e /= 4));
            var n = e / this._$wrapper.getBoundingClientRect().width * 100
              , r = this._transform - n;
            this._$items.classList.add(TRANSITION_NONE),
            this._$items.style.transform = "translateX(".concat(r, "%)")
        }
    }
    function s(t) {
        if (this._hasSwipeState) {
            var i = 0 === t.type.search("touch") ? t.changedTouches[0] : t
              , e = this._swipeStartPosX - i.clientX;
            this._config.loop || (this._currentIndex + 1 >= this._$itemList.length && e >= 0 && (e /= 4),
            this._currentIndex <= 0 && e <= 0 && (e /= 4));
            var s = e / this._$wrapper.getBoundingClientRect().width * 100;
            this._$items.classList.remove(TRANSITION_NONE),
            s > SWIPE_THRESHOLD ? (this._direction = "next",
            this._move()) : s < -SWIPE_THRESHOLD ? (this._direction = "prev",
            this._move()) : (this._direction = "none",
            this._move()),
            this._hasSwipeState = !1,
            this._config.loop && this._autoplay()
        }
    }
    if (this._$root.addEventListener("click", function(t) {
        var i = t.target;
        if (this._autoplay("stop"),
        i.classList.contains("slider__control"))
            t.preventDefault(),
            this._direction = i.dataset.slide,
            this._move();
        else if (i.dataset.slideTo) {
            t.preventDefault();
            var e = parseInt(i.dataset.slideTo);
            this._moveTo(e)
        }
        this._config.loop && this._autoplay()
    }
    .bind(this)),
    this._config.loop && (t.addEventListener("transitionstart", function() {
        this._balancingItemsFlag = !0,
        window.requestAnimationFrame(this._balancingItems.bind(this))
    }
    .bind(this)),
    t.addEventListener("transitionend", function() {
        this._balancingItemsFlag = !1
    }
    .bind(this))),
    this._config.autoplay && (this._$root.addEventListener("mouseenter", function() {
        this._autoplay("stop")
    }
    .bind(this)),
    this._$root.addEventListener("mouseleave", function() {
        this._config.loop && this._autoplay()
    }
    .bind(this))),
    this._config.swipe) {
        var n = !1;
        try {
            var r = Object.defineProperty({}, "passive", {
                get: function() {
                    n = !0
                }
            });
            window.addEventListener("testPassiveListener", null, r)
        } catch (t) {}
        this._$root.addEventListener("touchstart", i.bind(this), !!n && {
            passive: !1
        }),
        this._$root.addEventListener("touchmove", e.bind(this), !!n && {
            passive: !1
        }),
        this._$root.addEventListener("mousedown", i.bind(this)),
        this._$root.addEventListener("mousemove", e.bind(this)),
        document.addEventListener("touchend", s.bind(this)),
        document.addEventListener("mouseup", s.bind(this))
    }
    this._$root.addEventListener("dragstart", function(t) {
        t.preventDefault()
    }
    .bind(this)),
    document.addEventListener("visibilitychange", function() {
        "hidden" === document.visibilityState ? this._autoplay("stop") : "visible" === document.visibilityState && this._config.loop && this._autoplay()
    }
    .bind(this))
}
,
SimpleAdaptiveSlider.prototype.next = function() {
    this._direction = "next",
    this._move()
}
,
SimpleAdaptiveSlider.prototype.prev = function() {
    this._direction = "prev",
    this._move()
}
,
SimpleAdaptiveSlider.prototype.autoplay = function(t) {
    this._autoplay("stop")
}
;