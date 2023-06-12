$('document').ready(function () {
    // Prevent the  condensed Inline Panel validation errors from occurring by
// manually opening each panel so the plugin marks them as "modified".
    $('.condensed-inline-panel__action-edit').click();
    setTimeout(function () {
        $('.condensed-inline-panel__action-close').click();
    }, 300);
});