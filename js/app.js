import products from './products.js';
import Modal from './modal.js';

class App {
  init() {
    this.state = {
      products,
      shoppingCart: [],
      user: {
        name: '',
        gender: '',
        address: ''
      }
    };
    this.viewRenderFns = {
      userDataForm: this.createUserDataForm.bind(this),
      shoppingCart: this.createShoppingCart.bind(this),
      checkoutView: this.createCheckoutView.bind(this)
    };
    this.modal = new Modal();
    this.setupEventListeners();
    this.renderProducts();
    this.setProductView('grid');
  }

  static getAncestorBySel(leafEl, selector) {
    if (leafEl.matches(selector)) return leafEl;
    let currentEl = leafEl.parentNode;
    while (currentEl) {
      if (
        typeof currentEl.matches === 'function' &&
        currentEl.matches(selector)
      )
        return currentEl;

      currentEl = currentEl.parentNode;
    }

    return null;
  }

  setupEventListeners() {
    // one click handler for all click events we're interested in
    // we use event bubbling to reduce the memory footprint for
    // handling events
    document.addEventListener('click', event => {
      // view toggle buttons
      if (App.getAncestorBySel(event.target, '#list-view-btn')) {
        return this.setProductView('list');
      }

      if (App.getAncestorBySel(event.target, '#grid-view-btn')) {
        return this.setProductView('grid');
      }

      if (App.getAncestorBySel(event.target, '#view-shopping-cart-btn')) {
        return this.renderViewModal('shoppingCart');
      }

      if (App.getAncestorBySel(event.target, '#view-user-data-btn')) {
        return this.renderViewModal('userDataForm');
      }

      if (App.getAncestorBySel(event.target, '#view-checkout-btn')) {
        return this.renderViewModal('checkoutView');
      }

      if (App.getAncestorBySel(event.target, '#send-order-btn')) {
        return this.printOrder();
      }

      let buttonEl;
      if (
        (buttonEl = App.getAncestorBySel(
          event.target,
          '.button-add-to-cart'
        ))
      ) {
        return this.addToCartHandler(buttonEl)
      }

      if (
        (buttonEl = App.getAncestorBySel(
          event.target,
          '.button-remove-from-cart'
        ))
      ) {
        return this.removeFromCartHandler(buttonEl)
      }

      return null;
    });

    document.addEventListener('submit', event => {
      let form;
      if ((form = App.getAncestorBySel(event.target, '#user-data-form'))) {
        event.preventDefault();
        this.state = {
          ...this.state,
          user: {
            name: form.username.value.trim(),
            gender: form.gender.value.trim(),
            address: form.address.value.trim()
          }
        };
      }
    });
  }

  addToCartHandler(buttonEl){
    try {
      const id = parseInt(buttonEl.dataset.itemId);
      const product = this.productById(id);
      this.addItemToCart(product);
      return this.renderViewModal('shoppingCart');
    } catch (e) {
      console.error('Error adding item to cart');
      console.error(e);
    }
  }

  removeFromCartHandler(buttonEl){
    try {
      const id = parseInt(buttonEl.dataset.itemId);
      const product = this.productById(id);
      this.removeItemFromCart(product);
      return this.renderViewModal('shoppingCart');
    } catch (e) {
      console.error('Error removing item from cart');
      console.error(e);
    }
  }

  productById(id) {
    return this.state.products.find(p => p.id === id);
  }

  setProductView(viewStyle) {
    if (viewStyle === 'grid') {
      document.getElementById('list-view-btn').classList.remove('active');
      document.getElementById('grid-view-btn').classList.add('active');
      document.getElementById('product-list').classList.remove('list-view');
      document.getElementById('product-list').classList.add('grid-view');
    } else if (viewStyle === 'list') {
      document.getElementById('grid-view-btn').classList.remove('active');
      document.getElementById('list-view-btn').classList.add('active');
      document.getElementById('product-list').classList.remove('grid-view');
      document.getElementById('product-list').classList.add('list-view');
    }
  }

  renderProducts() {
    const ulEl = document.getElementById('product-list');
    const tEl = document.getElementById('product-item-template');

    this.state.products.forEach(p => {
      const clone = document.importNode(tEl.content, true);

      // using indexes would be faster but more error prone
      const imgEl = clone.querySelector(
        'div.product-item-image-placeholder img'
      );
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

  addItemToCart(item) {
    const existingProduct = this.state.shoppingCart.find(p => p.id === item.id);
    if (existingProduct) return;
    // always create a new state
    this.state = {
      ...this.state,
      shoppingCart: [...this.state.shoppingCart, item]
    };
  }

  removeItemFromCart(item) {
    // always create a new state
    this.state = {
      ...this.state,
      shoppingCart: this.state.shoppingCart.filter(p => p.id !== item.id)
    };
  }

  createUserDataForm() {
    const userDataFormTemplateEl = document.getElementById(
      'user-data-form-template'
    );

    const userDataFormClone = document.importNode(
      userDataFormTemplateEl.content,
      true
    );

    return userDataFormClone;
  }

  createShoppingCart() {
    const shoppingCartTemplateEl = document.getElementById(
      'shopping-cart-template'
    );

    const shoppingCartClone = document.importNode(
      shoppingCartTemplateEl.content,
      true
    );

    // if shopping cart is empy just display a message
    if (this.state.shoppingCart.length === 0) {
      const emptyTemplateEl = document.getElementById(
        'shopping-cart-empty-message'
      );
      const clone = document.importNode(emptyTemplateEl.content, true);
      shoppingCartClone.appendChild(clone);
      return shoppingCartClone;
    }

    const shoppingCartItemsTemplateEl = document.getElementById(
      'shopping-cart-items-template'
    );
    const shoppingCartItemsClone = document.importNode(
      shoppingCartItemsTemplateEl.content,
      true
    );

    shoppingCartClone.appendChild(shoppingCartItemsClone);

    const ulEl = shoppingCartClone.getElementById('shopping-cart-list');
    const tEl = document.getElementById('product-row-shopping-cart-template');

    this.state.shoppingCart.forEach(p => {
      const clone = document.importNode(tEl.content, true);

      // using indexes would be faster but more error prone
      const imgEl = clone.querySelector(
        'div.product-item-image-placeholder img'
      );
      imgEl.src = p.image;
      imgEl.alt = `${p.name} image`;
      clone.querySelector('div.product-item-name').textContent = p.name;
      clone.querySelector('div.product-item-price').textContent = p.price;
      clone
        .querySelector('div.product-item-remove-from-cart > button')
        .setAttribute('data-item-id', p.id);

      ulEl.appendChild(clone);
    });

    return shoppingCartClone;
  }

  createCheckoutView() {
    const checkoutViewTemplateEl = document.getElementById(
      'checkout-view-template'
    );

    const checkoutViewClone = document.importNode(
      checkoutViewTemplateEl.content,
      true
    );

    // personal info
    checkoutViewClone.querySelector(
      '.checkout-user-name'
    ).textContent = this.state.user.name;

    checkoutViewClone.querySelector(
      '.checkout-user-gender'
    ).textContent = this.state.user.gender;

    checkoutViewClone.querySelector(
      '.checkout-user-address'
    ).textContent = this.state.user.address;

    // shopping cart
    const ulEl = checkoutViewClone.getElementById('checkout-product-list');
    const tEl = document.getElementById('product-row-checkout-template');

    this.state.shoppingCart.forEach(p => {
      const clone = document.importNode(tEl.content, true);

      // using indexes would be faster but more error prone
      const imgEl = clone.querySelector(
        'div.product-item-image-placeholder img'
      );
      imgEl.src = p.image;
      imgEl.alt = `${p.name} image`;
      clone.querySelector('div.product-item-name').textContent = p.name;
      clone.querySelector('div.product-item-price').textContent = p.price;

      ulEl.appendChild(clone);
    });

    return checkoutViewClone;
  }

  printOrder(){
    console.log("Payload for server:");
    const payload = {
      user: this.state.user,
      itemIds: this.state.shoppingCart.map(p => p.id)
    };
    console.log(payload);
  }

  renderViewModal(view) {
    try {
      const htmlNode = this.viewRenderFns[view]();
      this.renderModal(htmlNode);
    } catch (e) {
      console.error(`Error when trying to render view ${view}`);
      console.error(error);
    }
  }

  renderModal(htmlNode) {
    this.modal.render(htmlNode);
    this.modal.show();
  }
}

export default App;
