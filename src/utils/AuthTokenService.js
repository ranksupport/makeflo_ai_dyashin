import StorageService from "./StorageService";

const STORAGE_USER = "user";
const STORAGE_KEY = "jwtToken";

const AuthTokenService = {
  /**
   * check the user logging token exists or not.
   */
  exists() {
    return StorageService.exists(STORAGE_KEY);
  },

  init(token) {
    if (!this.exists()) {
      this.storeToken({ token: token });
    }
    return true;
  },

  /**
   * store token in the local storage of browser
   */
  storeToken(authToken) {
    StorageService.set(STORAGE_KEY, JSON.stringify(authToken), {
      hash: true,
      keepMe: authToken.keepMeLoggedIn,
    });
    this.init();
  },

  updateLang(lang) {
    let tokenObj = StorageService.get(STORAGE_KEY);
    if (tokenObj) {
      try {
        tokenObj = JSON.parse(StorageService.get(STORAGE_KEY));
        tokenObj.lang = lang;
        this.storeToken(tokenObj);
      } catch (err) {
        tokenObj = { token: tokenObj };
      }
    }
  },

  /**
   * get token for the local storage
   */
  get() {
    let tokenObj = StorageService.get(STORAGE_KEY);
    if (tokenObj) {
      try {
        tokenObj = JSON.parse(StorageService.get(STORAGE_KEY));
      } catch (err) {
        tokenObj = { token: tokenObj };
      }
    }
    return tokenObj ? tokenObj.token : null;
  },

  getLang() {
    let tokenObj = StorageService.get(STORAGE_KEY);
    if (tokenObj) {
      try {
        tokenObj = JSON.parse(StorageService.get(STORAGE_KEY));
      } catch (err) {
        tokenObj = { token: tokenObj };
      }
    }
    return tokenObj ? tokenObj.lang : "en";
  },

  getAppId() {
    return JSON.parse(StorageService.get(STORAGE_KEY)).appId;
  },

  /**
   * clear token set, this method called on logout.
   */
  clear() {
    // Clearing the whole local storage on logout should be moved
    // into it's own auth status/action handler service
    // StorageService.delete(STORAGE_USER);
    return StorageService.delete(STORAGE_KEY);
  },
};

export default AuthTokenService;
