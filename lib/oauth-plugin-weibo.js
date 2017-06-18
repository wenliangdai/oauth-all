import qs from 'qs'
import promisify from 'es6-promisify'
import request from 'request'

const requestPromise = promisify(request)

const API_BASE = 'https://api.weibo.com'
const OAUTH_URL = `${API_BASE}/oauth2/authorize`;
const ACCESS_TOKEN_URL = `${API_BASE}/oauth2/access_token`;
const USER_INFO_URL = `${API_BASE}/2/users/show.json`;


class OAuthPluginWeibo {
  constructor(config) {
    this.config = config
  }
  /*
  * 生成授权地址
  * */
  getAuthUrl({rdUrl}) {
    let params = {
      client_id: this.config.app_id,
      redirect_uri: rdUrl,
      state: Math.random()
    }
    return OAUTH_URL + '?' + qs.stringify(params);
  }

  /**
  * 检查url参数中，是否含有授权码
  */
  hasCode(url) {
    // url = 'http://api.baomitu.com/?state=0.861663684564502&code=e3a6e51729c0de8dc79de91e084b7276'
    return qs.parse(url).hasOwnProperty('code')
  }

  /*
  * 获取Access_token
  * 参数包括：
  *   授权成功，回调url中带的参数
  *   rdUrl: 授权时传的rdUrl
  * */
  async getAccessToken({code, rdUrl}) {
    let params = {
      grant_type: 'authorization_code',
      client_id: this.config.app_id,
      client_secret: this.config.app_secret,
      code: code,
      redirect_uri: rdUrl
    }

    const res = await requestPromise({
      method: 'POST',
      uri: ACCESS_TOKEN_URL,
      form: params,
      json: true
    });

    const body = res.body
    return body;
  }

  /*
   * 获取用户信息
   * 参数为请求Access_token接口返回的数据
  * */
  async getUserInfo(opts) {
    const params = {
      access_token: opts.access_token,
      uid: opts.uid,
      oauth_consumer_key: this.config.app_id
    }

    const res = await requestPromise({
      method: 'GET',
      uri: USER_INFO_URL,
      qs: params,
      json: true
    });

    const body = this.adaptUserInfo(Object.assign({}, res.body, {open_id: opts.uid}))
    return body;
  }

  adaptUserInfo(rawData) {
    return {
      rawData,
      user_open_id: rawData.open_id,
      user_name: rawData.name,
      user_desc: '',
      user_avatar: rawData.avatar_large,
    }
  }
}

export default OAuthPluginWeibo
