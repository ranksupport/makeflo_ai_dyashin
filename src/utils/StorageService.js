import base from "base-64";

/**
 * This class used for Store value on localStorage of browser.
 */

const StorageService = {
  /**
   * check value exists on localStorage of browser.
   */
  exists(key) {
    return this.get(key);
  },

  /**
   * set value from localStorage of browser.
   */
  set(key, value, opts = {}) {
    let storedValue = value;
    if (opts.stringify) storedValue = JSON.stringify(storedValue);
    if (opts.hash) storedValue = base.encode(storedValue);
    try {
      if (opts.keepMe) {
        const d = new Date();
        d.setTime(d.getTime() + 30 * 24 * 60 * 60 * 1000);
        const expires = `expires=${d.toUTCString()}`;
        document.cookie = `${key}=${JSON.stringify({
          opts,
          body: storedValue,
        })};${expires};path=/`;
      } else {
        document.cookie = `${key}=${JSON.stringify({
          opts,
          body: storedValue,
        })};path=/`;
      }
    } catch (err) {
      throw err;
    }
  },

  /**
   * get value from localStorage of browser.
   */
  get(key) {
    const name = `${key}=`;
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        const data = JSON.parse(c.substring(name.length, c.length));
        let { body } = data;
        if (data.opts && data.opts.hash) body = base.decode(body);
        if (data.opts && data.opts.stringify && body.indexOf("{") > -1)
          body = JSON.parse(body);
        return body;
      }
    }
    return false;
  },

  /**
   * delete value from localStorage of browser.
   */
  delete(key, opts = {}) {
    const d = new Date();
    d.setTime(d.getTime() + 0);
    const expires = `expires=${d.toUTCString()}`;
    document.cookie = `${key}=${JSON.stringify({
      opts,
      body: "",
    })};${expires};path=/`;
    // localStorage.removeItem(key);
  },

  /**
   * clear localStorage of browser.
   */
  clear() {
    this.delete("user");
    this.delete("jwtToken");
  },
};

export default StorageService;
