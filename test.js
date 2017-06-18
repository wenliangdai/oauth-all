import OAuthAll from './index.js'
import OAuthPluginWeibo from './lib/oauth-plugin-weibo'
import OAuthPluginQq from './lib/oauth-plugin-qq'

const oauth = new OAuthAll({
  weibo: new OAuthPluginWeibo({
    app_id: '913357886',
    app_secret: 'b1005bd438ab787007f1b0a097a3ee1f'
  }),
  qq: new OAuthPluginQq({
    app_id: '101189837',
    app_secret: 'eb71ba43ef532340b8dfd5d5caef9c9e'
  })
})

const Koa = require('koa');
const app = new Koa();

app.use(async ctx => {
  const url = ctx.request.req.url
  const userInfo = await oauth.getUserInfo('qq', ctx.request.req, ctx.response.res)
  ctx.body = JSON.stringify(userInfo)
  console.log(33, url, userInfo)
});

app.listen(3000);
