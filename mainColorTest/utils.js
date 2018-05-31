const utils = {
  makeRGB: function (name) {
    return ['rgb(', name, ')'].join('');
  },

  mapPalette: function (palette) {
    var arr = [];
    for (var prop in palette) { arr.push(this.frmtPobj(prop, palette[prop])) };
    arr.sort(function (a, b) { return (b.count - a.count) });
    return arr;
  },

  fitPalette: function (arr, fitSize) {
    if (arr.length > fitSize) {
      return arr.slice(0, fitSize);
    } else {
      for (var i = arr.length - 1; i < fitSize - 1; i++) { arr.push(this.frmtPobj('0,0,0', 0)) };
      return arr;
    };
  },

  frmtPobj: function (a, b) {
    return { name: this.makeRGB(a), count: b };
  },

  PALETTESIZE: 10,
  RGBaster: {},
  canvasId: "",
  imagePath: "",
  options: {},
  retrySum: 100,// enough? too much? It needs more experiences.

  /**
   * 获取主色调
   * @imagePath 路径
   * @canvasId canvas ID
   * @opts {success: 成功回调, width: 宽, height: 高}
   */
  colors: function (imagePath, canvasId, opts) {
    this.canvasId = canvasId;
    this.imagePath = imagePath;
    this.options = opts;

    var data, width=opts.width||150, height=opts.height||100;
    const ctx = wx.createCanvasContext(canvasId);
    ctx.drawImage(imagePath, 0, 0, width, height);
    ctx.draw();

    setTimeout(function () {
      const u = this;
      wx.canvasGetImageData({
        canvasId: canvasId,
        x: 0,
        y: 0,
        width: width,
        height: height,
        success(res) {
          console.log(res.width)
          console.log(res.height)
          console.log(res.data instanceof Uint8ClampedArray)
          console.log(res.data.length) // res.width * res.height * 4
          u.calculate(res.data, opts);
        },
        fail() {
          console.log("fail");
        }
      })
    }.bind(this), 50);
  },

  calculate: function (data, opts) {
    opts = opts || {};
    var exclude = opts.exclude || [], paletteSize = opts.paletteSize || this.PALETTESIZE;
    // for example, to exclude white and black:  [ '0,0,0', '255,255,255' ]
    var colorCounts = {},
      rgbString = '',
      rgb = [],
      colors = {
        dominant: { name: '', count: 0 },
        palette: []
      };

    var i = 0;
    for (; i < data.length; i += 4) {
      rgb[0] = data[i];
      rgb[1] = data[i + 1];
      rgb[2] = data[i + 2];
      rgbString = rgb.join(",");

      // skip undefined data and transparent pixels
      if (rgb.indexOf(undefined) !== -1 || data[i + 3] === 0) {
        continue;
      }

      // Ignore those colors in the exclude list.
      if (exclude.indexOf(this.makeRGB(rgbString)) === -1) {
        if (rgbString in colorCounts) {
          colorCounts[rgbString] = colorCounts[rgbString] + 1;
        }
        else {
          colorCounts[rgbString] = 1;
        }
      }

    }

    if (opts.success) {
      var palette = this.fitPalette(this.mapPalette(colorCounts), paletteSize + 1);

      //图片未加载完
      //合理？
      if (palette[0].name == palette[1].name && palette[1].name=="rgb(0,0,0)") {

        if (this.retrySum-- <= 0) {
          console.log("retrySum: " + this.retrySum);
          palette.length = 0;
          palette.push(this.frmtPobj("0,0,0", 0));
          palette.push(this.frmtPobj("0,0,0", 1));
        } else {
          this.colors(this.imagePath, this.canvasId, this.options);
          return;
        }
      }

      opts.success({
        dominant: palette[0].name,
        secondary: palette[1].name,
        palette: palette.map(function (c) { return c.name; }).slice(1)
      });
    }
  },

  /**
   * invert color
   * @oldColor rgb(0,0,0)
   */
  invertColor: function(oldColor) {
    const tempArr = oldColor.slice(4, oldColor.length-1).split(",");
    return "rgb("+(255-tempArr[0])+","+(255-tempArr[1])+","+(255-tempArr[2])+")";
  },

  /**
   * rgb转16进制
   */
  rgbToHex: function (rgb) {
    // rgb(x, y, z)
    var color = rgb.toString().match(/\d+/g); // 把 x,y,z 推送到 color 数组里
    var hex = "#";

    for (var i = 0; i < 3; i++) {
      // 'Number.toString(16)' 是JS默认能实现转换成16进制数的方法.
      // 'color[i]' 是数组，要转换成字符串.
      // 如果结果是一位数，就在前面补零。例如： A变成0A
      hex += ("0" + Number(color[i]).toString(16)).slice(-2);
    }
    return hex;
  },

  /**
   * 明暗色调
   */
  isLight: function (rgb) {
    var color = rgb.toString().match(/\d+/g);
    console.log("color: "+color);
    return (
      0.213 * color[0] +
      0.715 * color[1] +
      0.072 * color[2] >
      255 / 2
    );
  }



};

module.exports.utils = utils;