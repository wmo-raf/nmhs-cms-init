function triggerHtmlEvent(element, eventName) {
    let event;
    if (document.createEvent) {
        event = document.createEvent("HTMLEvents");
        event.initEvent(eventName, true, true);
        element.dispatchEvent(event);
    } else {
        event = document.createEventObject();
        event.eventType = eventName;
        element.fireEvent("on" + event.eventType, event);
    }
}

function doGoogleLanguageTranslator(default_lang, lang_prefix) {
    console.log(default_lang, )
    console.log(lang_prefix, )
    let event;

    const classic = $(".goog-te-combo");

    for (let i = 0; i < classic.length; i++) {
        event = classic[i];
    }

    if (document.getElementById("google_language_translator") != null) {
        if (classic.length !== 0) {
            if (lang_prefix !== default_lang) {
                event.value = lang_prefix;
                triggerHtmlEvent(event, "change");
            } else {

                $(".goog-te-banner-frame:first")
                    .contents()
                    .find(".goog-close-link")
                    .get(0)
                    .click();
            }
        }
    }
}

