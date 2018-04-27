moj.Modules.cookies = {
  read(name) {
    const nameEQ = `${encodeURIComponent(name)}=`;
    const ca = document.cookie.split(';');

    for (let i = 0; i < ca.length; i += 1) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1, c.length);
      }
      if (c.indexOf(nameEQ) === 0) {
        return decodeURIComponent(c.substring(nameEQ.length, c.length));
      }
    }
    return null;
  },

  store(name, value, days) {
    let expires;
    const dayInMS = 24 * 60 * 60 * 1000;

    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + (days * dayInMS));
      expires = `; expires=${date.toGMTString()}`;
    } else {
      expires = '';
    }
    document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}${expires}; path=/`;
  },

  erase(name) {
    this.store(name, '', -1);
  },
};
