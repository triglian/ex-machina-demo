import products from './products.js';

const app = {
  init() {
    this.renderProducts();
  },

  renderProducts() {
    const ulEl = document.getElementById('product-list');
    const tEl = document.getElementById('product-row');

    products.forEach(p => {
      const clone = document.importNode(tEl.content, true);

      // using indexes would be faster but more error prone
      // if we change the templated
      const imgEl = clone.querySelector('div.product-item-image-placeholder img');
      imgEl.src = p.image;
      imgEl.alt = `${p.name} image`;
      clone.querySelector('div.product-item-name').textContent = p.name;
      clone.querySelector('div.product-item-price').textContent = p.price;
      clone
        .querySelector('div.product-item-add-to-cart > button')
        .setAttribute('data-item-id', p.id);

      ulEl.appendChild(clone);
    });
  }
};

export default app;
