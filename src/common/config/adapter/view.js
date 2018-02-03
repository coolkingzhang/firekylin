const url = require('url');
const path = require('path');
const nunjucks = require('think-view-nunjucks');

const buildQuery = obj => '?' +
Object.keys(obj).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(obj[k])).join('&');

/**
 * view adapter config
 * @type {Object}
 */
module.exports = {
  type: 'nunjucks',
  common: {
    viewPath: path.join(think.ROOT_PATH, 'view'),
    sep: '_',
    extname: '.html',
    content_type: 'text/html'
  },
  nunjucks: {
    handle: nunjucks,
    prerender(env, nunjucks) {
      env.addFilter('utc', time => (new Date(time)).toUTCString());
      env.addFilter('pagination', function(page) {
        const {pathname, query} = url.parse(this.ctx.http.url, true);

        query.page = page;
        return pathname + buildQuery(query);
      });
      env.addFilter('xml', str => {
        const NOT_SAFE_IN_XML = /[^\x09\x0A\x0D\x20-\xFF\x85\xA0-\uD7FF\uE000-\uFDCF\uFDE0-\uFFFD]/gm;
        return str.replace(NOT_SAFE_IN_XML, '');
      });
    }
  }
};
