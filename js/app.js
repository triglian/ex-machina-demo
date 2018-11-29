import products from './products.js';

const app = {
  init() {
    this.setupEventListeners();
    this.renderProducts();
    this.setProductView('grid');
  },

  setupEventListeners(){
    // one click handler for all click events we're interested in
    // we use event bubbling to reduce the memory footprint for
    // handling events
    document.addEventListener('click', event => {

      // view toggle buttons
      if (event.target.id === 'list-view-btn' ||
        (event.target.parentElement && event.target.parentElement.id === 'list-view-btn')){
        return this.setProductView('list');
      }

      if (event.target.id === 'grid-view-btn' ||
        (event.target.parentElement && event.target.parentElement.id === 'grid-view-btn')){
        return this.setProductView('grid');
      }

      return null;
    });
  },

  setProductView(viewStyle){
    if(viewStyle === 'grid'){
      document.getElementById('list-view-btn').classList.remove('active');
      document.getElementById('grid-view-btn').classList.add('active');
      document.getElementById('product-list').classList.remove('list-view');
      document.getElementById('product-list').classList.add('grid-view');
    }else if(viewStyle === 'list'){
      document.getElementById('grid-view-btn').classList.remove('active');
      document.getElementById('list-view-btn').classList.add('active');
      document.getElementById('product-list').classList.remove('grid-view');
      document.getElementById('product-list').classList.add('list-view');
    }
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
