$(document).ready(function () {
    accordion.init({speed: 300, oneOpen: false});

    const $forecastDetail = $(".forecast-detail");
    const $productTypeHeader = $(".forecast-product_type");

    $productTypeHeader.on("click", function () {

        const $this = $(this);

        const detailId = `${$this.attr('data-id')}`;

        const detailEl = $(`#${detailId}`);

        $forecastDetail.find("> .forecast-item").removeClass('active-forecast');

        detailEl.addClass('active-forecast');

        $productTypeHeader.removeClass('active');

        $this.addClass('active');
    });
});