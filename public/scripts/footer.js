"use strict";
const footerOpenContactform = document.getElementById('footer-open-contactform');
footerOpenContactform?.addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('open-contactform'));
});
