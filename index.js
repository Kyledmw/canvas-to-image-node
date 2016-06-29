function CanvasToImage() {
    const $support = function() {
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
        JPEG: "jpeg",
        GIF: "gif",
        BMP: "bmp"
    }

    function prepareImgType(type) {
        type = type.toLowerCase().replace(/jpg/i, 'jpeg');
        let matchedType = type.match(/png|jpeg|bmp|gif/)[0];
        return 'image/' + matchedType;
    }

    function canvasIsSupported() {
        return ($support.canvas && $support.dataURL);
    }

    function saveAsImage(canvas, width, height, type) {
        if(canvasIsSupported()) {

        }
    }

    function getImageData(canvas) {
        let w = canvas.width;
        let h = canvas.height;
        return canvas.getContext('2d').getImageData(0, 0, w, h);
    }

    function scaleCanvas(canvas, width, height) {
        let w = canvas.width;
        let h = canvas.height;

        if(width == undefined) {
            width = w;
        }
        if(height == undefined) {
            height = h;
        }

        var retCanvas = document.createElement('canvas');
        var retCtx = retCanvas.getContext('2d');
        retCanvas.width = width;
        retCanvas.height = height;
        retCtx.drawImage(canvas, 0, 0, w, h, 0, 0, width, height);
        return retCanvas;
    }


	function makeURI (strData, type) {
		return 'data:' + type + ';base64,' + strData;
	}

	function genImage(strData) {
		var img = document.createElement('img');
		img.src = strData;
		return img;
	}
    
	function getDataURL (canvas, type, width, height) {
		canvas = scaleCanvas(canvas, width, height);
		return canvas.toDataURL(type);
	}

    function saveFile (strData) {
        var element = document.createElement('a');
        element.setAttribute('href', strData);
        element.setAttribute('download', "image");

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
	}

	/**
	 * create bitmap image
	 * 按照规则生成图片响应头和响应体
	 */
	function genBitmapImage(oData) {

		//
		// BITMAPFILEHEADER: http://msdn.microsoft.com/en-us/library/windows/desktop/dd183374(v=vs.85).aspx
		// BITMAPINFOHEADER: http://msdn.microsoft.com/en-us/library/dd183376.aspx
		//

		var biWidth  = oData.width;
		var biHeight	= oData.height;
		var biSizeImage = biWidth * biHeight * 3;
		var bfSize  = biSizeImage + 54; // total header size = 54 bytes

		//
		//  typedef struct tagBITMAPFILEHEADER {
		//  	WORD bfType;
		//  	DWORD bfSize;
		//  	WORD bfReserved1;
		//  	WORD bfReserved2;
		//  	DWORD bfOffBits;
		//  } BITMAPFILEHEADER;
		//
		var BITMAPFILEHEADER = [
			// WORD bfType -- The file type signature; must be "BM"
			0x42, 0x4D,
			// DWORD bfSize -- The size, in bytes, of the bitmap file
			bfSize & 0xff, bfSize >> 8 & 0xff, bfSize >> 16 & 0xff, bfSize >> 24 & 0xff,
			// WORD bfReserved1 -- Reserved; must be zero
			0, 0,
			// WORD bfReserved2 -- Reserved; must be zero
			0, 0,
			// DWORD bfOffBits -- The offset, in bytes, from the beginning of the BITMAPFILEHEADER structure to the bitmap bits.
			54, 0, 0, 0
		];

		//
		//  typedef struct tagBITMAPINFOHEADER {
		//  	DWORD biSize;
		//  	LONG  biWidth;
		//  	LONG  biHeight;
		//  	WORD  biPlanes;
		//  	WORD  biBitCount;
		//  	DWORD biCompression;
		//  	DWORD biSizeImage;
		//  	LONG  biXPelsPerMeter;
		//  	LONG  biYPelsPerMeter;
		//  	DWORD biClrUsed;
		//  	DWORD biClrImportant;
		//  } BITMAPINFOHEADER, *PBITMAPINFOHEADER;
		//
		var BITMAPINFOHEADER = [
			// DWORD biSize -- The number of bytes required by the structure
			40, 0, 0, 0,
			// LONG biWidth -- The width of the bitmap, in pixels
			biWidth & 0xff, biWidth >> 8 & 0xff, biWidth >> 16 & 0xff, biWidth >> 24 & 0xff,
			// LONG biHeight -- The height of the bitmap, in pixels
			biHeight & 0xff, biHeight >> 8  & 0xff, biHeight >> 16 & 0xff, biHeight >> 24 & 0xff,
			// WORD biPlanes -- The number of planes for the target device. This value must be set to 1
			1, 0,
			// WORD biBitCount -- The number of bits-per-pixel, 24 bits-per-pixel -- the bitmap
			// has a maximum of 2^24 colors (16777216, Truecolor)
			24, 0,
			// DWORD biCompression -- The type of compression, BI_RGB (code 0) -- uncompressed
			0, 0, 0, 0,
			// DWORD biSizeImage -- The size, in bytes, of the image. This may be set to zero for BI_RGB bitmaps
			biSizeImage & 0xff, biSizeImage >> 8 & 0xff, biSizeImage >> 16 & 0xff, biSizeImage >> 24 & 0xff,
			// LONG biXPelsPerMeter, unused
			0,0,0,0,
			// LONG biYPelsPerMeter, unused
			0,0,0,0,
			// DWORD biClrUsed, the number of color indexes of palette, unused
			0,0,0,0,
			// DWORD biClrImportant, unused
			0,0,0,0
		];

		var iPadding = (4 - ((biWidth * 3) % 4)) % 4;

		var aImgData = oData.data;

		var strPixelData = '';
		var biWidth4 = biWidth<<2;
		var y = biHeight;
		var fromCharCode = String.fromCharCode;

		do {
			var iOffsetY = biWidth4*(y-1);
			var strPixelRow = '';
			for (var x = 0; x < biWidth; x++) {
				var iOffsetX = x<<2;
				strPixelRow += fromCharCode(aImgData[iOffsetY+iOffsetX+2]) +
							   fromCharCode(aImgData[iOffsetY+iOffsetX+1]) +
							   fromCharCode(aImgData[iOffsetY+iOffsetX]);
			}

			for (var c = 0; c < iPadding; c++) {
				strPixelRow += String.fromCharCode(0);
			}

			strPixelData += strPixelRow;
		} while (--y);

		var strEncoded = encodeData(BITMAPFILEHEADER.concat(BITMAPINFOHEADER)) + encodeData(strPixelData);

		return strEncoded;
	};

    function convertToImage(canvas, width, height, type) {
        if(canvasIsSupported()) {
            if(typeof canvas == "string") {canvas = document.getElementById(canvas);}
            if(type == undefined) {type = SUPPORTED_TYPES.PNG;}
            type = prepareImgType(type);
            if(/bmp/.test(type)) {
                let data = getImageData(scaleCanvas(canvas, width, height));
                let strData = genBitmapImage(data);
                return genImage(makeURI(strData, 'image/bmp'));
            } else {
                let strData = getDataURL(canvas, type, width, height);
                return genImage(strData);
            }
        }
    }

    function saveAsImage(canvas, width, height, type) {
        if(canvasIsSupported()) {
            if(typeof canvas == "string") {canvas = document.getElementById(canvas);}
            if(type == undefined) {type = SUPPORTED_TYPES.PNG;}
            type = prepareImgType(type);
            if(/bmp/.test(type)) {
                let data = getImageData(scaleCanvas(canvas, width, height));
                let strData = genBitmapImage(data);
                saveFile(makeURI(strData, 'image/bmp'));
            } else {
                let strData = getDataURL(canvas, type, width, height);
                return saveFile(strData);
            }
        }
    }

    this.saveAsImage = saveAsImage;
    this.convertToImage = convertToImage;

    this.saveAsPNG = function(canvas, width, height) {
        return saveAsImage(canvas, width, height, SUPPORTED_TYPES.PNG);
    }

    this.saveAsJPEG = function(canvas, width, height) {
        return saveAsImage(canvas, width, height, SUPPORTED_TYPES.JPEG);
    }

    this.saveAsGIF = function(canvas, width, height) {
        return saveAsImage(canvas, width, height, SUPPORTED_TYPES.GIF);
    }

    this.saveAsBMP = function(canvas, width, height) {
        return saveAsImage(canvas, width, height, SUPPORTED_TYPES.BMP);
    }

    this.convertToPNG = function(canvas, width, height) {
        return convertToImage(canvas, width, height, SUPPORTED_TYPES.PNG);
    }

    this.convertToJPEG = function(canvas, width, height) {
        return convertToImage(canvas, width, height, SUPPORTED_TYPES.JPEG);
    }

    this.convertToGIF = function(canvas, width, height) {
        return convertToImage(canvas, width, height, SUPPORTED_TYPES.GIF);
    }

    this.convertToBMP = function(canvas, width, height) {
        return convertToImage(canvas, width, height, SUPPORTED_TYPES.BMP);
    }

}

module.exports = new CanvasToImage;