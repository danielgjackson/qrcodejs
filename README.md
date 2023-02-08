# QR Code JS

Javascript QR Code generator.

* [Demo site](https://danielgjackson.github.io/qrcodejs)

* Install (assuming `npm`):

    ```bash
    npm i -S https://github.com/danielgjackson/qrcodejs
    ```

* Quick test:

    ```javascript
    (async() => {
        const { default: QrCode } = await import('qrcodejs');
        console.log(QrCode.render('medium', QrCode.generate('Hello, World!')));
    })();
    ```

* Example usage (assuming in a `.mjs` ECMAScript module):

    ```javascript
    import QrCode from 'qrcodejs';

    const data = 'Hello, World!';
    const matrix = QrCode.generate(data);
    const text = QrCode.render('medium', matrix);
    console.log(text);
    ```

* Example usage in a web page:

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
