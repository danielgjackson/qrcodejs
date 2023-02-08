# QR Code JS

Javascript QR Code generator.


## Demo Site

Generate your own SVG QR Code:

* [danielgjackson.github.io/qrcodejs](https://danielgjackson.github.io/qrcodejs)


## Example usage

Install (if using `npm`):

```bash
npm i -S https://github.com/danielgjackson/qrcodejs
```

Quick test (also works from a non-module):

```javascript
(async() => {
    const { default: QrCode } = await import('qrcodejs');
    console.log(QrCode.render('medium', QrCode.generate('Hello, World!')));
})();
```

Example usage from an ECMAScript module (`.mjs` file):

```javascript
import QrCode from 'qrcodejs';

const data = 'Hello, World!';
const matrix = QrCode.generate(data);
const text = QrCode.render('medium', matrix);
console.log(text);
```


## Example web page usage

Example usage in a web page:

```html
<img>
<script type="module">
    import QrCode from 'https://danielgjackson.github.io/qrcodejs/qrcode.mjs';

    const data = 'Hello, World!';
    const matrix = QrCode.generate(data);
    const uri = QrCode.render('svg-uri', matrix);
    document.querySelector('img').src = uri;
</script>
```


## Browser without a server

If you would like to use this directly as part of a browser-based app over the `file:` protocol (which disallows modules), you can easily convert this to a non-module `.js` file:

  * Download [`qrcode.mjs`](https://raw.githubusercontent.com/danielgjackson/qrcodejs/master/qrcode.mjs) renamed as `qrcode.js`.
  * Remove the last line from the file (`export default QrCode`).
  * Ensure there is no `type="module"` attribute in your `<script src="qrcode.js"></script>` tag.
