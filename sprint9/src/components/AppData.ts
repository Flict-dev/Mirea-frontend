import { Model } from "./base/Model";
import { IProduct, IOrder, IDeliveryForm, IAppState, FormErrors, IContactForm } from "../types";

// Тип события изменения каталога
export type CatalogChangeEvent = {
  catalog: Product[];
};

// Класс Product расширяет базовый класс Model и представляет товар
export class Product extends Model<IProduct> {
  id: string;
  title: string;
  price: number | null;
  description: string;
  category: string;
  image: string;
}

// Класс AppState представляет состояние приложения
export class AppState extends Model<IAppState> {
  catalog: Product[]; // Каталог товаров
  basket: Product[] = []; // Корзина
  order: IOrder = {
    payment: 'online',
    address: '',
    email: '',
    phone: '',
    total: 0,
    items: []
  };
  preview: string | null; // Предпросмотр товара
  formErrors: FormErrors = {}; // Ошибки формы

  /**
   * Очищает корзину и обновляет её состояние
   */
  clearBasket() {
    this.basket = [];
    this.updateBasket();
  }

  /**
   * Очищает заказ, сбрасывая все его поля
   */
  clearOrder() {
    this.order = {
      payment: 'online',
      address: '',
      email: '',
      phone: '',
      total: 0,
      items: []
    };
  }

  /**
   * Устанавливает каталог товаров
   * @param items - Список товаров
   */
  setCatalog(items: IProduct[]) {
    this.catalog = items.map(item => new Product(item, this.events));
    this.emitChanges('items:changed', { catalog: this.catalog });
  }

  /**
   * Устанавливает предпросмотр товара
   * @param item - Товар для предпросмотра
   */
  setPreview(item: Product) {
    this.preview = item.id;
    this.emitChanges('preview:changed', item);
  }

  /**
   * Добавляет товар в корзину, если его там нет
   * @param item - Товар для добавления
   */
  addToBasket(item: Product) {
    if (this.basket.indexOf(item) < 0) {
      this.basket.push(item);
      this.updateBasket();
    }
  }

  /**
   * Удаляет товар из корзины
   * @param item - Товар для удаления
   */
  removeFromBasket(item: Product) {
    this.basket = this.basket.filter((it) => it != item);
    this.updateBasket();
  }

  /**
   * Обновляет состояние корзины и вызывает события изменений
   */
  updateBasket() {
    this.emitChanges('counter:changed', this.basket);
    this.emitChanges('basket:changed', this.basket);
  }

  /**
   * Устанавливает поле доставки заказа
   * @param field - Поле формы доставки
   * @param value - Значение поля
   */
  setDeliveryField(field: keyof IDeliveryForm, value: string) {
    this.order[field] = value;
    if (this.validateDelivery()) {
      this.events.emit('delivery:ready', this.order);
    }
  }

  /**
   * Устанавливает поле контактов в заказе
   * @param field - Поле формы контактов
   * @param value - Значение поля
   */
  setContactField(field: keyof IContactForm, value: string) {
    this.order[field] = value;
    if (this.validateContact()) {
      this.events.emit('contact:ready', this.order);
    }
  }

  /**
   * Проверяет корректность заполнения формы доставки
   * @returns true, если форма заполнена корректно, иначе false
   */
  validateDelivery() {
    const errors: typeof this.formErrors = {};
    if (!this.order.address) {
      errors.address = "Необходимо указать адрес";
    }
    this.formErrors = errors;
    this.events.emit('formErrors:change', this.formErrors);
    return Object.keys(errors).length === 0;
  }

  /**
   * Проверяет корректность заполнения формы контактов
   * @returns true, если форма заполнена корректно, иначе false
   */
  validateContact() {
    const errors: typeof this.formErrors = {};

    if (!this.order.email) {
      errors.email = 'Необходимо указать email';
    } else if (!this.order.email.includes('@')) {
      errors.email = 'Email должен содержать @';
    }

    if (!this.order.phone) {
      errors.phone = 'Необходимо указать телефон';
    } else if (!/^\+7\d{10}$/.test(this.order.phone)) {
      errors.phone = 'Телефон должен начинаться с +7 и содержать 11 цифр';
    }

    this.formErrors = errors;
    this.events.emit('formErrors:change', this.formErrors);

    return Object.keys(errors).length === 0;
  }
}
