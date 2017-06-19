import qs from 'qs'
import promisify from 'es6-promisify'
import request from 'request'

const requestPromise = promisify(request)

const API_BASE = 'http://github.com/login/oauth';
const OAUTH_URL = `${API_BASE}/authorize`;
const ACCESS_TOKEN_URL = `${API_BASE}/access_token`;
// const OPEN_ID_URL = `${API_BASE}/oauth2.0/me`;
const USER_INFO_URL = `http://api.github.com/user`;

class OAuthPluginGithub {
  constructor(config) {
    this.config = config
  }

  getAuthUrl({rdUrl}) {
    const params = {
      client_id: this.config.app_id,
      client_secret: this.config.app_secret,
      redirect_uri: rdUrl,
      scope: 'user',
      state: 'dwldwl'
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
    // console.log(`code: ${code}`);
    // console.log(`state: ${state}`);
    // console.log(`rdUrl: ${rdUrl}`);

    const params = {
      client_id: this.config.app_id,
      client_secret: this.config.app_secret,
      redirect_uri: rdUrl,
      state: 'dwldwl',
      code,
      // state
    };

    
    const res = await requestPromise({
      method: 'POST',
      url: ACCESS_TOKEN_URL,
      headers: {
        'Accept': 'application/json'
      },
      body: params,
      json: true
    });

    console.log(111111, res)

    return res.body;
  }

  async getUserInfo(opts) {
    const access_token = opts.access_token;

    return await requestPromise({
      method: 'GET',
      uri: USER_INFO_URL,
      headers: {
        Authorization: `token ${access_token}`
      }
    });
  }

  adaptUserInfo(rawData) {
    return {
      rawData,
      user_open_id: rawData.id,
      user_name: rawData.nickname,
      user_desc: '',
      user_avatar: rawData.avatar_url
    };
  }
}

export default OAuthPluginGithub;