import OAuthAll from './index.js'
import OAuthPluginWeibo from './lib/oauth-plugin-weibo'
import OAuthPluginQq from './lib/oauth-plugin-qq'
import OAuthPluginGithub from './lib/oauth-plugin-github'
import OAuthPluginWechat from './lib/oauth-plugin-wechat'

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
    user_agent: "@zcfy" // This is required by GitHub when getting userInfo with access_token. This value should be included in header "User-Agent"
  }),
  wechat: new OAuthPluginWechat({
    app_id: "wxa12dbe0ddc354603",
    app_secret: "f07edde0b3e76b3f93dc3a5fce4d33ea"
  })
})

const Koa = require('koa');
const app = new Koa();

app.use(async ctx => {
  const url = ctx.request.req.url
  const userInfo = await oauth.getUserInfo('wechat', ctx.request.req, ctx.response.res, ctx)
  ctx.body = JSON.stringify(userInfo)
  console.log(33, url, userInfo)
});

app.listen(3000);
