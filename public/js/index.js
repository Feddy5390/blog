class Popup {
  constructor(obj) {
    this.createHtml(obj);
  }

  createHtml(obj) {
    this.html = `<div id="popup">`;
    if(obj.showCloseBtn) {
      this.html += `<a class="material-icons" id='popup-close'>close</a>`;
    }
    this.html += `<h1>${obj.title}</h1>`;
    this.html += `<div class="login">`;
    this.html += `<form class="content">${obj.content}</form>`;
    this.html += `</div></div></div>`;
  }

  show() {
    $('body').addClass('mask');
    $('body').append(this.html);
  }

  destroy(effect) {
    $('body').removeClass('mask');
    $('#popup').remove();
  }
}

class Loading {
  constructor(obj) {
    this.html = `<div id="loading" class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>`;
  }

  show() {
    $('body').addClass('mask');
    $('body').append(this.html);
  }

  destroy() {
    $('#loading').remove();
    $('#popup').remove();
  }
}

export {
  Popup, Loading
};
