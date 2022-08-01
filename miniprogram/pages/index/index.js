// pages/index/index.js

var app = getApp()
Page({
  data: {
    nbFrontColor: '#000000',
    nbBackgroundColor: '#ffffff',
    inputCode:"",
    inputName:"",
    inputNumber:"",
    formArr:[
    ],
    focus: false,
    viewOnOff:true,

    show: false,
    duration: 300,
    position: 'center',
    round: true,
    overlay: true,
    customStyle: '',
    overlayStyle: '',

    checkedIndex:'',
  },
  onLoad() {
    this.setData({
      nbTitle: '新时代超市',
    })
  },
  onShow(){
    const index = app.globalData.checkedIndex
    console.log(index)
    if(index!==''){
      const formArr = app.globalData.goodsMessage[index]
      formArr.shift()
      app.globalData.goodsMessage.splice(index,1)
      console.log(app.globalData.goodsMessage)
      this.setData({
        formArr: formArr,
        checkedIndex:index
      })
      app.globalData.checkedIndex = ''
    }
  },
  delete(e){
    const index = e.currentTarget.dataset.src
    this.data.formArr.splice(index,1)
    const formArr = this.data.formArr
    console.log('delete success')
    this.setData({
      formArr:formArr
    })
  },
  save(){
    const formArr = this.data.formArr
    const time = new Date()
    const nowTime = time.getFullYear()+'年'+time.getMonth()+'月'+time.getDate()+'日'+'  '+time.getHours()+':'+time.getSeconds()
    formArr.unshift(nowTime)
    const goodsMsg = app.globalData.goodsMessage
    goodsMsg.push(formArr)
    console.log(goodsMsg)
    this.setData({
      formArr:[]
    })
  },
  popup(e){
    const position = e.currentTarget.dataset.position
    let customStyle = ''
    let duration = this.data.duration
    this.setData({
      position,
      show: true,
      customStyle,
      duration
    })
  },
  inputCode(e){
    this.setData({
      inputCode:e.detail.value
    });
  },
  inputName(e){
    this.setData({
      inputName:e.detail.value
    });
  },
  inputNumber(e){
    this.setData({
      inputNumber:e.detail.value
    })
  },
  scanCode(){
    wx.scanCode({
      onlyFromCamera: true,
      scanType: [],
      success: (res) => {
        this.setData({
          inputCode:res.result
        })
      },
      fail: (res) => {},
      complete: (res) => {
        this.setData({
         focus:true
        })
      },
    })

  },
  finish(){
    this.setData({
      show: false
    }),
    this.next()
  },
  next(){
    const data = this.data
    if(data.inputCode&&data.inputName&&data.inputNumber){
      const code = data.inputCode
      const number = data.inputNumber
      const name = data.inputName
      var obj = {
        'code': code,
        'number': number,
        'name': name
      }
      const len = this.data.formArr.length
      const push = 'formArr['+len+']'
      this.setData({
        [push]: obj,
        inputCode:'',
        inputName:'',
        inputNumber:''
      })
      console.log(this.data.formArr)
    }
  }
  
})