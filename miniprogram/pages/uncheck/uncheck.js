// pages/uncheck/uncheck.js

var app = getApp()
Page({
  data:{
    goodsMessage:[],
    existBtn:false,
  },
  onShow(){
    const goodsMsg = app.globalData.goodsMessage
    this.setData({
      goodsMessage: goodsMsg
    })
    console.log(this.data.goodsMessage)
    console.log('onshow')
  },
  checkboxChange(e){
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)

    const goodsMessage = this.data.goodsMessage
    const values = e.detail.value
    for (let i = 0, lenI = goodsMessage.length; i < lenI; ++i) {
      goodsMessage[i].checked = false

      for (let j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (i == values[j]) {
          goodsMessage[i].checked = true
        }
      }
    }
    const existBtn = values.length>0?true:false
    this.setData({
      goodsMessage,
      existBtn: existBtn
    })
    console.log(goodsMessage)
  },
  delete(e){
    const index = e.currentTarget.dataset.src
    app.globalData.goodsMessage.splice(index,1)
    console.log('delete success')
    console.log(app.globalData.goodsMessage)
    this.onShow()
  },
  changeAgain(){
    const indexArr = this.forIndex()
    console.log(indexArr)
    if(indexArr.length==1){
      console.log('checked序组',indexArr)
      app.globalData.checkedIndex = indexArr[0]
      wx.switchTab({
        url: '/pages/index/index',
      })
      this.clearChecked()
      this.setData({
        existBtn:false
      })
    }

  },
  upload(){
    var that = this
    const dataArr = that.getUploadData()
    
    //单选开光
    if(dataArr.length>1){
      wx.showModal({
        title:'请只选择一个单据',
        success(res){
        }
      })
      return
    }

    wx.showModal({
      title: '确定上传吗？？',
      success (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.showLoading({
            title: '上传数据中'
          })
          for(let i = 0 ; i < dataArr.length ; i++){
            const uploadData = that.dataToObject(dataArr[i])
            that.collectionCloud(uploadData)
          }
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  forIndex(){
    var indexArr = []
    const goodsMsg = this.data.goodsMessage
    for(let i = 0; i < goodsMsg.length; i++ ){
      if(goodsMsg[i].checked){
        indexArr.push(i)
      }
    }
    return indexArr
  },
  clearChecked(){
    const goodsMsg = this.data.goodsMessage
    for(let i = 0; i < goodsMsg.length; i++ ){
      goodsMsg[i].checked = false
    }
  },
  collectionCloud(uploadData){
    wx.cloud.init()
    const db = wx.cloud.database()
    const commodity = db.collection('getCommodity')
    commodity.add({
      data: uploadData
    }).then(res=>{
      console.log(res)
      wx.hideLoading()
      if(res.errMsg === "collection.add:ok"){
        wx.showToast({
          title: '上传成功',
          icon: 'success',
          duration: 2000
        })
        this.noIndexDelete()
      }
      else{
        wx.showToast({
          title: '上传失败',
          icon: 'error',
          duration: 2000
        })
      }
      
    })
  },
  getUploadData(){
    const indexArr = this.forIndex()
    console.log(indexArr)
    const goodsMsg = this.data.goodsMessage
    const dataArr = []
    for(let i = 0 ; i < indexArr.length ; i++){
      const j = indexArr[i]
      const data = goodsMsg[j]
      dataArr.push(data)
    }
    return dataArr
  },
  dataToObject(data){
    console.log(data)
    const time = data.shift()
    console.log(time)
    const commodities = data
    const uploadData = {
      "time":time,
      "commodities":commodities
    }
    return uploadData
  },
  noIndexDelete(){
    const indexArr = this.forIndex()
    for(let i = 0 ; i < indexArr.length ; i++){
      const j = indexArr[i]
      app.globalData.goodsMessage.splice(j,1)
    }
    this.onShow()
  }
})