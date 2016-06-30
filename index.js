function CanvasToImage() {
  const $support = function () {
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');

    return {
      canvas: !!ctx,
      imageData: !!ctx.getImageData,
      dataURL: !!canvas.toDataURL,
      btoa: !!window.btoa
    }
  }

  const SUPPORTED_TYPES = {
    PNG: "png",
    JPEG: "jpeg"
  }

  function prepareImgType(type) {
    type = type.toLowerCase().replace(/jpg/i, 'jpeg');
    let matchedType = type.match(/png|jpeg|bmp|gif/)[0];
    return 'image/' + matchedType;
  }

  function canvasIsSupported() {
    return ($support().canvas && $support().dataURL);
  }

  function scaleCanvas(canvas, width, height) {
    let w = canvas.width;
    let h = canvas.height;

    if (width == undefined) {
      width = w;
    }
    if (height == undefined) {
      height = h;
    }

    var retCanvas = document.createElement('canvas');
    var retCtx = retCanvas.getContext('2d');
    retCanvas.width = width;
    retCanvas.height = height;
    retCtx.drawImage(canvas, 0, 0, w, h, 0, 0, width, height);
    return retCanvas;
  }


  function makeURI(strData, type) {
    return 'data:' + type + ';base64,' + strData;
  }

  function genImage(strData) {
    var img = document.createElement('img');
    img.src = strData;
    return img;
  }

  function getDataURL(canvas, type, width, height) {
    canvas = scaleCanvas(canvas, width, height);
    return canvas.toDataURL(type);
  }

  function saveFile(strData) {
    var element = document.createElement('a');
    element.setAttribute('href', strData);
    element.setAttribute('download', "image");

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

  function convertToImage(canvas, width, height, type) {
    if (canvasIsSupported()) {
      if (typeof canvas == "string") {
        canvas = document.getElementById(canvas);
      }
      if (type == undefined) {
        type = SUPPORTED_TYPES.PNG;
      }
      type = prepareImgType(type);
      let strData = getDataURL(canvas, type, width, height);
      return genImage(strData);
    }
  }

  function saveAsImage(canvas, width, height, type) {
    if (canvasIsSupported()) {
      if (typeof canvas == "string") {
        canvas = document.getElementById(canvas);
      }
      if (type == undefined) {
        type = SUPPORTED_TYPES.PNG;
      }
      type = prepareImgType(type);
      let strData = getDataURL(canvas, type, width, height);
      return saveFile(strData);
    }
  }

  this.saveAsImage = saveAsImage;
  this.convertToImage = convertToImage;

  this.saveAsPNG = function (canvas, width, height) {
    return saveAsImage(canvas, width, height, SUPPORTED_TYPES.PNG);
  }

  this.saveAsJPEG = function (canvas, width, height) {
    return saveAsImage(canvas, width, height, SUPPORTED_TYPES.JPEG);
  }

  this.convertToPNG = function (canvas, width, height) {
    return convertToImage(canvas, width, height, SUPPORTED_TYPES.PNG);
  }

  this.convertToJPEG = function (canvas, width, height) {
    return convertToImage(canvas, width, height, SUPPORTED_TYPES.JPEG);
  }

}

module.exports = new CanvasToImage;
