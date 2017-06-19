import OAuthAll from './index.js'
import OAuthPluginWeibo from './lib/oauth-plugin-weibo'
import OAuthPluginQq from './lib/oauth-plugin-qq'
import OAuthPluginGithub from './lib/oauth-plugin-github'

const oauth = new OAuthAll({
  weibo: new OAuthPluginWeibo({
    app_id: '913357886',
    app_secret: 'b1005bd438ab787007f1b0a097a3ee1f'
  }),
  qq: new OAuthPluginQq({
    app_id: '101189837',
    app_secret: 'eb71ba43ef532340b8dfd5d5caef9c9e'
  }),
  github: new OAuthPluginGithub({
    app_id: "b14db52131eb32c2495b",
    app_secret: "0df440743c7ff6819dc9cfe881b74ca22d4f091a",
  })
})

const Koa = require('koa');
const app = new Koa();

app.use(async ctx => {
  const url = ctx.request.req.url
  const userInfo = await oauth.getUserInfo('github', ctx.request.req, ctx.response.res)
  // ctx.body = JSON.stringify(userInfo)
  // console.log(33, url, userInfo)
});

app.listen(3000);
