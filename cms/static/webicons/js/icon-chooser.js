function createIconChooser(id) {
    var chooserElement = $('#' + id + '-chooser');
    var previewImage = chooserElement.find('.preview-image img');
    var input = $('#' + id);
    var editLink = chooserElement.find('.edit-link');

    $('.action-choose', chooserElement).on('click', function () {
        ModalWorkflow({
            url: window.chooserUrls.iconChooser,
            onload: ICON_CHOOSER_MODAL_ONLOAD_HANDLERS,
            responses: {
                iconChosen: function (iconData) {
                    input.val(iconData.id);
                    previewImage.attr({
                        src: iconData.preview.url,
                        width: 150,
                        height: 150,
                        alt: iconData.title,
                        title: iconData.title
                    });
                    chooserElement.removeClass('blank');
                    previewImage.css({
                        'height': '150px',
                        'width': '150px',
                        'object-fit': 'contain'
                    }).addClass('show-transparency');
                    editLink.attr('href', iconData.edit_link);
                }
            }
        });
    });

    $('.action-clear', chooserElement).on('click', function () {
        input.val('');
        chooserElement.addClass('blank');
    });
}
