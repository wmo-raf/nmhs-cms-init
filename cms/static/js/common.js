const accordion = (function () {
    const $accordion = $(".js-accordion");
    const $accordion_header = $accordion.find(".js-accordion-header");
    const $accordion_item = $(".js-accordion-item");

    // default settings
    const settings = {
        // animation speed
        speed: 400,

        // close all other accordion items if true
        oneOpen: false
    };

    return {
        // pass configurable object literal
        init: function ($settings) {
            $accordion_header.on("click", function () {
                accordion.toggle($(this));
            });

            $.extend(settings, $settings);

            // ensure only one accordion is active if oneOpen is true
            if (settings.oneOpen && $(".js-accordion-item.active").length > 1) {
                $(".js-accordion-item.active:not(:first)").removeClass("active");
            }

            // reveal the active accordion bodies
            $(".js-accordion-item.active")
                .find("> .js-accordion-body")
                .show();
        },
        toggle: function ($this) {
            if (
                settings.oneOpen &&
                $this[0] !=
                $this
                    .closest(".js-accordion")
                    .find("> .js-accordion-item.active > .js-accordion-header")[0]
            ) {
                $this
                    .closest(".js-accordion")
                    .find("> .js-accordion-item")
                    .removeClass("active")
                    .find(".js-accordion-body")
                    .slideUp();
            }
            // show/hide the clicked accordion item
            $this.closest(".js-accordion-item").toggleClass("active");
            $this
                .next()
                .stop()
                .slideToggle(settings.speed);
        }
    };
})();


function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie != '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}


const getParams = function (url) {
    const params = {};
    const parser = document.createElement('a');
    parser.href = url;
    const query = parser.search.substring(1);

    if (query) {
        const vars = query.split('&');

        for (let i = 0; i < vars.length; i++) {
            if (vars[i]) {
                const pair = vars[i].split('=');
                params[pair[0]] = decodeURIComponent(pair[1]);

            }
        }
    }
    return params
};

function markCheckboxesFromUrlParams(className, params = [], callback) {

    // take params and check appropriate checkboxes
    for (const param in params) {
        const split_param = params[param].split(',').filter(Boolean);

        const $filter = $(`.${className}.${param}`);

        $filter.each(function () {
            const $this = $(this);
            if (split_param.includes($this.val())) {
                $this.prop("checked", true)
            }
        });

        if (callback) {
            // pass params to callback
            callback(params)
        }
    }
}


function filterChangeListener(className, params = {}, callback) {

    const $filterInput = $(`.${className}`);


    $filterInput.on('click change', function (e) {

        const clicked = $(this);

        const nodeName = clicked.get(0).nodeName

        let changed = false
        let scrollToResults = true

        // If is input
        if (nodeName === 'INPUT') {
            if (e.type === 'change') {
                if (clicked.is(':checkbox')) {
                    const param = clicked.attr('name')
                    const value = clicked.val()
                    changed = true

                    if (clicked.is(':checked')) {
                        // add
                        if (params[param]) {
                            const param_values = params[param].split(',')
                            param_values.push(value)
                            params[param] = param_values.join(',')

                        } else {
                            params[param] = value
                        }
                    } else {
                        //remove
                        if (params[param]) {
                            const param_values = params[param].split(',')

                            const index = param_values.indexOf(value);

                            if (index !== -1) {
                                param_values.splice(index, 1);
                                params[param] = param_values.join(',')

                                if (!params[param]) {
                                    delete params[param]
                                }
                            }
                        }
                    }
                }
            }

        }

        // If is SELECT
        else if (nodeName === 'SELECT') {
            if (e.type === 'change') {
                const param = clicked.attr('name')
                params[param] = clicked.val()

                changed = true
                scrollToResults = false
            }
        }
        // If is button
        else if (nodeName === 'BUTTON' && clicked.attr('name') === 'view') {
            if (!clicked.hasClass('active')) {
                params['view'] = clicked.val()
            }
            changed = true
        }

        // if anything changed
        if (changed) {
            const url_params = urlParamsFromObject(params)

            if (callback) {
                callback(clicked, url_params, scrollToResults)
            }
        }
    });
}

function urlParamsFromObject(paramsObject, exclude = []) {

    return Object.keys(paramsObject).reduce(function (all, key) {
        const value = paramsObject[key]

        if (!exclude.includes(key)) {
            if (value) {
                if (all) {
                    all = all + `&${key}=${value}`
                } else {
                    all = `${key}=${value}`
                }
            }

        }
        return all
    }, '')
}


function copyToClipboard(value) {
    const $temp = $("<input>");
    $("body").append($temp);
    $temp.val(value).select();
    document.execCommand("copy");
    $temp.remove();
}


const topAlert = $('.top-alert');

function setNotificationStorage(config) {
    try {
        localStorage.setItem("notification", JSON.stringify(config))
    } catch (e) {
        console.log("Error with setting localstorage", e)
    }
}


function initializeNotification(notification_id) {


    let notificationConfig = JSON.parse(localStorage.getItem("notification"))

    if (!notificationConfig || notificationConfig.id !== notification_id) {
        notificationConfig = {"id": notification_id, "show": true}
        setNotificationStorage(notificationConfig)

    }
    if (notificationConfig.show) {
        topAlert.css({display: "flex"})
    }


}

function hideAlert(notification_id) {
    let notificationConfig = JSON.parse(localStorage.getItem("notification"))

    if (notificationConfig && notificationConfig.id === notification_id) {
        notificationConfig = {"id": notification_id, "show": false}
        setNotificationStorage(notificationConfig)
    }

    topAlert.fadeOut()
}

function ga_reg_event(action, gtag_data) {
    gtag('event', action, gtag_data);
}


function ga_reg_event_from_el(el) {
    const $this = $(el)
    let action = 'click'
    const gtag_data = {
        "event_category": "Link",
        "event_label": $this.text().trim().substring(0, 30)
    };
    if ($this.data('ga-event-category')) {
        gtag_data['event_category'] = $this.data('ga-event-category');
    }
    if ($this.data('ga-event-label')) {
        gtag_data['event_label'] = $this.data('ga-event-label');
    }
    if ($this.data('ga-value')) {
        gtag_data['value'] = $this.data('ga-value');
    }
    if ($this.data('ga-action')) {
        action = $this.data('ga-action');
    }
    ga_reg_event(action, gtag_data)
}


$(document).ready(function () {

        const $navbarMenu = $("nav.navbar .main-nav.navbar-menu");
        const $navbarBurger = $("nav.navbar .navbar-brand .main-nav.navbar-burger");
        const $navbarBurgerSpan = $("nav.navbar .navbar-brand .main-nav.navbar-burger span");

        // close navbar menu on clicking outside
        $(document).click(function (event) {
            const clickover = $(event.target);

            const isMenuActive = $navbarMenu.hasClass("is-active");

            if (isMenuActive === true && !clickover.hasClass("is-active")) {
                $navbarMenu.removeClass('is-active');
                $navbarBurger.removeClass('is-active');
                $navbarBurgerSpan.removeClass('is-active');
            }
        });

        // Check for click events on the navbar burger icon
        $navbarBurger.click(function () {
            // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
            $navbarMenu.toggleClass("is-active");
            $navbarBurger.toggleClass("is-active");
            $navbarBurgerSpan.toggleClass("is-active");
        });


        // Header search
        const inputContainer = $('#search-input')
        const trigger = $('#search-trigger')
        const inputEl = $('#input-el')

        trigger.on('click', function () {
            $(this).hide()
            inputContainer.removeClass('is-hidden')
            inputEl.focus()
        })


        inputEl.on('focusout', function () {
            const $this = $(this)

            const value = $this.val()

            if (!value) {
                trigger.show()
                inputContainer.addClass('is-hidden')
            }
        })

        inputEl.keypress(function (event) {
            if (event.keyCode === 13) {
                const value = $(this).val()
                if (value) {
                    // tract on search
                    ga_reg_event('search', {
                        "event_category": "Search",
                        "event_label": "Header Search",
                        "value": value,
                    })
                }
            }
        });
        const default_lang = "en-us"

        $(".languages a").on("click", function () {

            const lang_text = $(this).attr("data-lang")

            const lang_prefix = $(this).attr("data-lang-prefix")

            doGoogleLanguageTranslator(default_lang, lang_prefix, lang_text);

            if (typeof cr_track_clicks !== 'undefined' && cr_track_clicks) {
                // tract language change
                ga_reg_event('click', {
                    "event_category": "Header Navigation",
                    "event_label": "Change Language",
                    "value": lang_text,
                })
            }
        })

        /*** Tracking ***/
        if (typeof cr_track_clicks !== 'undefined' && cr_track_clicks) {
            $('a').not('[data-lang]').on('click', function () {
                ga_reg_event_from_el(this)
            });
        }
    }
);