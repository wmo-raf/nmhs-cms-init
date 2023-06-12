window.onscroll = function () { fixNav() };

var navbar = document.getElementById("sticky_nav");
var sticky = navbar.offsetTop;

function fixNav() {
    if (window.pageYOffset >= sticky) {
        navbar.classList.add("sticky")
    } else {
        navbar.classList.remove("sticky");
    }
}

// $('ul li').each(function (i) {
//     var t = $(this);

//     t.css({
//         'animation': 'slideInUp',
//         'animation-duration': `${i * 0.4}s`
//     })
//     // setTimeout(function () { t.addClass('animation'); }, (i + 1) * 50);
// });