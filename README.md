# dominantHue

一个应用在微信小程序中提取图片主要颜色的工具库。  

### 用法

在wxml中添加canvas标签

```javascript
<canvas canvas-id='img-canvas'></canvas>
```

相应的js文件中引入库

```javascript
const utils = require('utils.js').utils;
```

在合适的状态里（如onLoad、onReady等）调用colors方法

```javascript
const imagePath = "example-image.jpg";
const canvasId = "img-canvas";
utils.colors(imagePath, canvasId, {
	success : function (res) {
		console.log("dominant: " + res.dominant);
		console.log("secondary: " + res.secondary);
		console.log("palette: " + res.palette);

		const fontColor = utils.isLight(res.dominant) ? "#000000" : "#ffffff";//根据主要颜色设置字体颜色
		const bgColor = utils.rgbToHex(res.dominant);
		console.log("bgColor: " + bgColor);
		//设置导航栏背景色及标题颜色
		wx.setNavigationBarColor({
			frontColor : fontColor, 
			backgroundColor : bgColor,
			animation : {
				duration : 400,
				timingFunc : 'easeIn'
			}
		})
	},
	width: 375,
	height: 280
});
```

### 配置项

#### `imagePath`
Type: `string`  
图片地址

#### `canvasId`
Type: `string`  
canvas标签Id

#### `options`
success: 获取颜色成功后的回调  
width: canvas宽  
height: canvas高  


### 微信小程序的限制

常规Web开发中，可通过getImageData获取像素数据。  
但小程序中只能通过<canvas>的wx.canvasGetImageData获取图片像素数据。  
canvas加载图片并无类似onload等事件通知加载完毕，所以此处采用了轮询方式（轮询条件还需进一步验证）检查加载完毕。  


### 源码来源
  
[RGBaster](https://github.com/briangonzalez/rgbaster.js)  
只是做了适合微信小程序使用的改造




