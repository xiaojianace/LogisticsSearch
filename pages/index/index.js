//index.js
//获取应用实例
var util = require('../../utils/util.js');  
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    kdgs:'',
    kddh:'',
    selectData:['申通','中通','圆通'],
    index:-1,
    show:false
  },

    // 点击下拉显示框
    selectTap(){
      this.setData({
        show: !this.data.show
      });
    },
     // 点击下拉列表
  optionTap(e){
    let Index=e.currentTarget.dataset.index;//获取点击的下拉列表的下标
    this.setData({
      index:Index,
      show:!this.data.show
    });
    if(Index==0)
     {
        this.setData({
          kdgs:"STO"
          // disabled:value.length==0
        })
     }else if(Index==1)
     {
        this.setData({
          kdgs:"ZTO"
          // disabled:value.length==0
        })
     }else if(Index==2)
     {
        this.setData({
          kdgs:"YTO"
          // disabled:value.length==0
        })
     }
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  bindkdgsinput:function(e){
    let value=e.detail.value;
    if(value=="申通")
     {
        this.setData({
          kdgs:"STO",
          disabled:value.length==0
        })
     }else if(value=="中通")
     {
        this.setData({
          kdgs:"ZTO",
          disabled:value.length==0
        })
     }else if(value=="圆通")
     {
        this.setData({
          kdgs:"YTO",
          disabled:value.length==0
        })
     }
   },
  bindkddhinput:function(e){
    let value=e.detail.value;
    this.setData({
       kddh:value
       //disabled:value.length==0
    })
   },
  search:function(){
    var that=this;
    wx.request({
      url: 'https://api.kdniao.com/Ebusiness/EbusinessOrderHandle.aspx',
      method:'POST',
      data:{
        RequestData:encodeURIComponent("{'OrderCode':'','ShipperCode':'" + that.data.kdgs + "','LogisticCode':'"+ that.data.kddh +"'}"),
        EBusinessID:'1309561',//快递鸟用户ID
        RequestType:'1002',
        DataSign:encodeURIComponent(util.Base64(util.md5("{'OrderCode':'','ShipperCode':'" + that.data.kdgs + "','LogisticCode':'"+ that.data.kddh +"'}413c9869-bf6a-47a7-8dce-d363846a8e0c"))),
        DataType:'2'
      },
      header:{
        'content-type':'application/x-www-form-urlencoded;charset=utf-8',
        'Accept':'*/*'
      },
       fail :function(res) { 
        console.log(res.data.Reason);
      },
      success : function(res) { 
        if(res.data.Success==false)
        {
          console.log(res.data.Reason);
        }else{
        that.setData({
          returndata:res.data.Traces
       })
        }
      }
    })
 
  }
})
