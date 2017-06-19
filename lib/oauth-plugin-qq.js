
import qs from 'qs'
import promisify from 'es6-promisify'
import request from 'request'

const requestPromise = promisify(request)

const API_BASE = 'https://graph.qq.com'
const OAUTH_URL = `${API_BASE}/oauth2.0/authorize`;
const ACCESS_TOKEN_URL = `${API_BASE}/oauth2.0/token`;
const OPEN_ID_URL = `${API_BASE}/oauth2.0/me`;
const USER_INFO_URL = `${API_BASE}/user/get_user_info`;

class OAuthPluginQq {
  constructor(config) {
    this.config = config
  }
  /*
  * 生成授权地址
  * */
  getAuthUrl({rdUrl}) {
    const params = {
      client_id: this.config.app_id,
      redirect_uri: rdUrl,
      state: Math.random(),
      response_type: 'code'
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

    const params = {
      grant_type: 'authorization_code',
      client_id: this.config.app_id,
      client_secret: this.config.app_secret,
      code: code,
      redirect_uri: rdUrl
    }

    const res = await requestPromise({
      method: 'GET',
      uri: ACCESS_TOKEN_URL,
      qs: params
    });

    const body = qs.parse(res.body);
    const openIdInfo = await this.getOpenId(body.access_token)
    body.open_id = openIdInfo.openid

    return body;
  }

  async getOpenId(accessToken) {
    const params = {
      access_token: accessToken
    };

    const res = await requestPromise({
      method: 'GET',
      uri: OPEN_ID_URL,
      qs: params
    });

    const callback = (obj) => {
      return obj;
    }
    const body = eval(res.body);
    return body;
  }

  /*
   * 获取用户信息
   * 参数为请求Access_token接口返回的数据
  * */
  async getUserInfo(opts) {
    const params = {
      access_token: opts.access_token,
      openid: opts.open_id,
      oauth_consumer_key: this.config.app_id
    }

    const res = await requestPromise({
      method: 'GET',
      uri: USER_INFO_URL,
      qs: params,
      json: true
    });

    const body = this.adaptUserInfo(Object.assign({}, res.body, {open_id: opts.open_id}))

    return body;
  }

  adaptUserInfo(rawData) {
    return {
      rawData,
      user_open_id: rawData.open_id,
      user_name: rawData.nickname,
      user_desc: '',
      user_avatar: rawData.figureurl_2
    }
  }
}

export default OAuthPluginQq
