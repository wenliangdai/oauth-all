import qs from 'qs'

class OAuthAll {
  /**
   * 构造函数
   * @param  {[type]} config oauth相关配置
   * {
   *    // 针对使用的每个插件的配置
   *    weibo: {
   *      client_id: '',
   *      client_secret: ''
   *    },
   *    qq: {}
   * }
   */
   constructor(plugins) {
     this.plugins = plugins
   }

   async getUserInfo(pluginName, req, res) {
     const reqUrl = this.getReqUrl(req)
     const plugin = this.plugins[pluginName]

     if(plugin.hasCode(reqUrl)) {
       const accessTokenRes = await plugin.getAccessToken(Object.assign(qs.parse(reqUrl), {rdUrl: reqUrl}))
       console.log(accessTokenRes)
      //  const userInfoRes = await plugin.getUserInfo(accessTokenRes)
      //  return userInfoRes
     } else {
       const authUrl = await plugin.getAuthUrl({rdUrl: reqUrl})
       this.redirect(res, authUrl)
     }
   }

   getReqUrl(req) {
     const url = 'http://' + req.headers.host + req.url
     return url
   }

   redirect(res, url) {
     res.statusCode = '302'
     res.setHeader('Location', url)
     res.end()
   }
}



export default OAuthAll
