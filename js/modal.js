class Modal {
  constructor() {
    try {
      const mEl = document.getElementById('modal-template');
      const clone = document.importNode(mEl.content, true);
      this.el = clone.querySelector('.modal');
      this.contentEl = this.el.querySelector('.modal-main-content');
      document.body.appendChild(this.el);

      // close button
      this.el
        .querySelector('.modal-close-button')
        .addEventListener('click', this.hide.bind(this));
    } catch (e) {
      console.error('Error in creating modal');
      console.error(e);
    }
  }

  render(htmlNode) {
    this.contentEl.innerHTML = '';
    this.contentEl.appendChild(htmlNode);
  }

  show() {
    this.el.style.display = 'flex';
  }

  hide() {
    this.el.style.display = 'none';
  }
}

export default Modal;
