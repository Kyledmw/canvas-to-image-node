# Canvas to Image Node Module

A reimplementation of the Canvas2Image client side javascript library for node.

https://github.com/hongru/canvas2image

## Code

    var CanvasToImage = require('canvas-to-image-node');
    
    CanvasToImage.saveAsImage(canvas, width, height, type);
    CanvasToImage.saveAsPNG(canvas, width, height);
    CanvasToImage.saveAsJPEG(canvas, width, height);

    CanvasToImage.convertToImage(canvas, width, height, type);
    CanvasToImage.convertToPNG(canvas, width, height);
    CanvasToImage.convertToJPEG(canvas, width, height);

## TODO

Implement: 

* BMP
* GIF

## License
MIT © [Kyle Williamson ](https://github.com/kyledmw)
