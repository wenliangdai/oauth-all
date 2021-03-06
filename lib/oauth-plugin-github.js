import qs from 'qs'
import promisify from 'es6-promisify'
import request from 'request'
import Base from './oauth-plugin-base.js'

const requestPromise = promisify(request)

const OAUTH_URL = 'http://github.com/login/oauth/authorize';
const ACCESS_TOKEN_URL = 'https://github.com/login/oauth/access_token';
const USER_INFO_URL = `https://api.github.com/user`;

class OAuthPluginGithub extends Base {
  constructor(config) {
    super(config);
  }

  getAuthUrl({rdUrl}) {
    const params = {
      client_id: this.config.app_id,
      client_secret: this.config.app_secret,
      redirect_uri: rdUrl,
      scope: 'user',
      state: Math.random().toString()
    };

    return `${OAUTH_URL}?${qs.stringify(params)}`;
  }

  async getAccessToken({code, state, rdUrl}) {
    const params = {
      client_id: this.config.app_id,
      client_secret: this.config.app_secret,
      redirect_uri: rdUrl,
      state,
      code
    };

    const res = await requestPromise({
      method: 'POST',
      url: ACCESS_TOKEN_URL,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      form: params
    });

    if(res.err) {
      console.error(`Error: ${res.err}`);
    }

    return res.body;
  }

  async getUserInfo(opts) {
    const access_token = JSON.parse(opts).access_token;

    const res = await requestPromise({
      method: 'GET',
      uri: USER_INFO_URL,
      headers: {
        "User-Agent": this.config.user_agent, // required!
        Authorization: `token ${access_token}`
      }
    });

    const data = JSON.parse(res.body);
    return this.adaptUserInfo(data);
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