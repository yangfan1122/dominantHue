// pages/mainColorTest/mainColorTest.js

const utils = require('utils.js').utils;

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },




  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

    const imagePath = "example-image.jpg";
    const canvasId = "img-canvas";    
    utils.colors(imagePath, canvasId, {
      success: function (res) {
        console.log("dominant: " + res.dominant);
        console.log("secondary: " + res.secondary);
        console.log("palette: " + res.palette);

        const fontColor = utils.isLight(res.dominant)?"#000000":"#ffffff";
        const bgColor = utils.rgbToHex(res.dominant);
        console.log("bgColor: " + bgColor);
        wx.setNavigationBarColor({
          frontColor: fontColor,//前景颜色值，包括按钮、标题、状态栏的颜色，仅支持 #ffffff 和 #000000
          backgroundColor: bgColor,
          animation: {
            duration: 400,
            timingFunc: 'easeIn'
          }
        })
      },
      width: 375,
      height: 280
    });

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})