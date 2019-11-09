// pages/home/home.js
import {
  getMultidata,
  getGoodsData
  } from '../../service/home.js'

  const types = ['pop','new','sell']
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowHeight:0,
    banners:[],
    recommends:[],
    titles:['流行','新款','精选'],
    goods:{
      pop:{page: 0,list:[]},
      new: { page: 0, list: []},
      sell: { page: 0, list: []}
    },
    currentType:'pop',
    isTabFixed:false,
    tabScrollTop:0,
    topPosition:0,
    showBackTop:false
  },

  //---------点击函数---------
  handleTabclick(event){
    const index = event.detail.index;
    this.setData({
      currentType : types[index]
    })
  },

  handleImageload(){
    wx.createSelectorQuery().select('#tab-control')
      .boundingClientRect(rect => {
        this.data.tabScrollTop = rect.top;
      }).exec()
  },

  onBackTop(){
    this.setData({
      topPosition : 0,
      showBackTop : false,
      isTabFixed:false
    })
  },
  handleScrollPosition(event){
    const position = event.detail.scrollTop;
    // 2.设置是否显示
    this.setData({
      showBackTop: position > 1000,
      isTabFixed: position > this.data.tabScrollTop
    })
  },
  loadMore(){
    //加载更多
    this._getGoodsData(this.data.currentType)
  },
   //---------点击函数---------

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getSystemInfo({
             success: (res) => {
                let clientHeight = res.windowHeight,
                  clientWidth = res.windowWidth,
                  rpxR = 750 / clientWidth;
                var calc = clientHeight * rpxR;
                this.setData({
                  windowHeight: calc
                });
             }
        });
 
    //1.请求轮播图以及推荐数据
    this._getMultidata();
    this._getGoodsData('pop');
    this._getGoodsData('new');
    this._getGoodsData('sell');

  },
//----------------网络请求函数-----------
//以下划线开头的函数表示私有函数
  _getMultidata(){
    getMultidata().then(res => {
      const banners = res.data.data.banner.list;
      const recommends = res.data.data.recommend.list;

      //将banners和recommends放到data中
      this.setData({
        //es6语法可以省略
        banners,
        recommends
      })
    })
  },

  _getGoodsData(type){
    //获取页码
    const page = this.data.goods[type].page + 1;
    //网络请求
    getGoodsData(type, page).then(res => {
      //取出数据
      // const list = res.data.data.list;

      const list = this._getGoodsList();

      //将数据设置到对应type的list里面
      const oldList = this.data.goods[type].list;
      oldList.push(...list);
    
      const typeKey = `goods.${type}.list`;
      const pageKey = `goods.${type}.page`;
      this.setData({
        [typeKey]:oldList,
        [pageKey]:page
      })
    })
  },
  //----------------网络请求函数-----------

  _getGoodsList(){
    const item = {
      title: "2018秋季新款韩版百搭格子长袖衬衫+前短后长针织气质开衫外+高腰直筒九分牛仔裤三件套装",
      price: "59.00",
      cfav: "49",
      show: {
        img: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1205990395,1628243212&fm=26&gp=0.jpg'
      }   
    }
    const list = [];
    for (let i = 0; i < 30; i++) {
      list.push(item)
    }
    return list;
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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