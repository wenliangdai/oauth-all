import qs from 'qs'

/**
 * Base class of all plugins.
 * Common methods should be written here.
 */
class OAuthPluginBase {

  constructor(config) {
    this.config = config;
  }

  /**
   * If hasCode() returns true, then we got the code and can proceed to the next step.
   * Most third-party OAuth does the first step in this manner, if there is something different, this method should be overrided.
   * @param The querystring in Node.js's vanilla req.url (i.e. everything after the host in the href)
   * @return true if req.url contains the code after step.1 of OAuth, otherwise false.
   */
  hasCode(querystring) {
    return qs.parse(querystring).hasOwnProperty('code');
  }
}

export default OAuthPluginBase
