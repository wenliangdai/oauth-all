import qs from 'qs'
import promisify from 'es6-promisify'
import request from 'request'

const requestPromise = promisify(request)

const OAUTH_URL = 'https://open.weixin.qq.com/connect/qrconnect';
const ACCESS_TOKEN_URL = 'https://api.weixin.qq.com/sns/oauth2/access_token';
const USER_INFO_URL = 'https://api.weixin.qq.com/sns/userinfo';

class OAuthPluginWechat {
  constructor(config) {
    this.config = config
  }

  getAuthUrl({rdUrl}) {
    const params = {
      appid: this.config.app_id,
      redirect_uri: rdUrl,
      response_type: 'code',
      scope: 'snsapi_login',
      state: Math.random().toString()
    };

    return `${OAUTH_URL}?${qs.stringify(params)}`;
  }

  /**
  * 检查url参数中，是否含有授权码
  */
  hasCode(url) {
    // url = 'http://api.baomitu.com/?state=0.861663684564502&code=e3a6e51729c0de8dc79de91e084b7276'
    return qs.parse(url).hasOwnProperty('code')
  }

  async getAccessToken({code, state, rdUrl}) {
    console.log(1234567890)
    const params = {
      appid: this.config.app_id,
      secret: this.config.app_secret,
      grant_type: 'authorization_code',
      code
    };

    const res = await requestPromise({
      method: 'GET',
      uri: ACCESS_TOKEN_URL,
      qs: params
    });

    const data = JSON.parse(res.body);
    return data;
  }

  async getUserInfo(opts) {
    const access_token = opts.access_token;
    const openid = opts.openid;

    const params = {
      access_token,
      openid
    };

    const res = await requestPromise({
      method: 'GET',
      uri: USER_INFO_URL,
      qs: params
    });

    const data = JSON.parse(res.body);
    return this.adaptUserInfo(data);
  }

  adaptUserInfo(rawData) {
    return {
      rawData,
      user_open_id: rawData.openid,
      user_name: rawData.nickname,
      user_desc: '',
      user_avatar: rawData.headimgurl
    }
  }
}

export default OAuthPluginWechat
