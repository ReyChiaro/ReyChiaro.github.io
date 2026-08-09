/**
 * Page Title Helper
 * @description Generate page title.
 * @example
 *     <%- page_title() %>
 */
hexo.extend.helper.register("page_title", function () {
  var title = this.page.title ? this.page.title : this.config.title;

  if (this.is_archive()) {
    title = this.__("nav.articles");

    if (this.is_month()) {
      title += ": " + this.page.year + "/" + this.page.month;
    } else if (this.is_year()) {
      title += ": " + this.page.year;
    }
  } else if (this.is_category()) {
    title = this.__("nav.category") + ": " + this.page.category;
  } else if (this.is_tag()) {
    title = this.__("nav.tag") + ": " + this.page.tag;
  }

  return title;
});

/**
 * Resolve the visible section name used as the first heading on non-post pages.
 * Prefer the data-driven navigation label so the page and menu stay in sync.
 */
hexo.extend.helper.register("section_title", function () {
  var navigation = (this.site.data && this.site.data.navigation) || [];
  var page = this.page;
  var context = this;

  function navigationLabel(key) {
    for (var i = 0; i < navigation.length; i += 1) {
      if (navigation[i].key === key) {
        return navigation[i].label || context.__("nav." + key).replace("nav.", "");
      }
    }

    return context.__("nav." + key).replace("nav.", "");
  }

  if (this.is_home()) {
    return navigationLabel("home");
  }

  if (this.is_category()) {
    return page.category;
  }

  if (this.is_tag()) {
    return page.tag;
  }

  if (this.is_archive()) {
    return navigationLabel("articles");
  }

  if (page.type === "categories") {
    return navigationLabel("categories");
  }

  if (page.layout === "404" || page.path === "404.html") {
    return (this.theme.error_404 && this.theme.error_404.title) || "404";
  }

  var pagePath = "/" + (page.path || "").replace(/index\.html$/, "").replace(/^\/+|\/+$/g, "") + "/";

  for (var i = 0; i < navigation.length; i += 1) {
    var itemUrl = navigation[i].url || "";

    if (!/^https?:\/\//.test(itemUrl)) {
      var navigationPath = "/" + itemUrl.replace(/^\/+|\/+$/g, "") + "/";

      if (navigationPath === pagePath) {
        return navigation[i].label || page.title;
      }
    }
  }

  return page.title || this.page_title();
});
