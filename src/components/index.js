import {Page} from './page';

const install = function(Vue, opts = {}) {
  /* istanbul ignore if */
  if (install.installed) return;
  Vue.component(Page.name, Page);
}

// auto install
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default {
  install,
  Page
}
