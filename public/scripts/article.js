"use strict";
const preList = document.querySelectorAll('pre');
for (let pre of preList) {
    const controller = document.createElement('span');
    controller.classList.add('controller');
    const copyButton = document.createElement('button');
    copyButton.classList.add('copy');
    const copyIcon = document.createElement('img');
    copyIcon.classList.add('copy-icon');
    copyIcon.src = '/static-icons/copy-solid.svg';
    copyIcon.alt = 'copy icon';
    copyButton.append(copyIcon, ' Copy');
    controller.append(copyButton);
    pre.append(controller);
    copyButton.addEventListener('click', async () => {
        const codeString = pre.childNodes[0].textContent || '';
        await navigator.clipboard.writeText(codeString);
        //console.log( codeString );
    });
}
