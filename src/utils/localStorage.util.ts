const development_mode = import.meta.env.VITE_DEVELOPMENT_MDOE;
export class LocalStorageClass {
  static store(key: string | null, value: string | null) {
    if (!key || !value) {
      if (development_mode == "DEV") {
        console.warn("Key and Value cannot be null");
      }
      return false;
    }
    if (localStorage.getItem(key)) {
      localStorage.removeItem(key);
      localStorage.setItem(key, value);
      return value;
    }
    localStorage.setItem(key, value);
    return value;
  }
  static clearStorage() {
    localStorage.clear();
  }
  static isAlreadyStored(key: string | null): boolean {
    if (!key) return false;
    return localStorage.getItem(key) ? true : false;
  }
  static getValue(key: string | null) {
    if (!key) return key;

    return localStorage.getItem(key);
  }
}
