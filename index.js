class OAuthAll {
  /**
   * 构造函数
   * @param  {[type]} config oauth相关配置
   * {
   *    // 针对使用的每个插件的配置
   *    weibo: {
   *      app_id: '',
   *      app_secret: ''
   *    },
   *    qq: {}
   * }
   */
   constructor(config, plugins) {
     this.config = config
     this.plugins = {}
     Object.keys(plugins).forEach(pluginName => {
       const Plugin = plugins[pluginName]
       this.plugins[pluginName] = new Plugin(config[pluginName])
     })
   }

   async getUserInfo(pluginName, req, res) {
     const rdurl = this.getRdUrl(req)
     const plugin = this.plugins[pluginName]
     const oauthUrl = await plugin.getAuthUrl(rdurl)
     this.redirect(res, oauthUrl)
   }

   getRdUrl() {
     const url = 'http://' + this.req.headers.host + this.req.url
     return url
   }

   redirect(res, url) {
     res.statusCode = '302'
     res.setHeader('Location', url)
     res.end()
   }
}


const weiboPlugin = require('./lib/oauth-plugin-weibo')
const oauth = new OAuthAll({
  weibo: {
    app_id: '913357886',
    app_secret: 'b1005bd438ab787007f1b0a097a3ee1f'
  }
}, {
  weibo: WeiboPlugin
})

export default OAuthAll
