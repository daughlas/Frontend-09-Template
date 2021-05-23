const DOMs = Array.prototype.slice.call(document.querySelector('#container').children).filter(e => e.getAttribute('data-tag').match(/css/)).map(el => ({
    name:el.children[1].children[0].innerText,
    href: el.children[1].children[0].href
}))

console.log(JSON.stringify(DOMs))
