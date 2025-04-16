import { Form } from "./common/Form";
import { IDeliveryForm, IContactForm, IActions } from "../types";
import { IEvents } from "../types";
import { ensureElement } from "../utils/utils";

// Класс формы доставки, расширяет базовый класс Form
export class DeliveryForm extends Form<IDeliveryForm> {
  protected _cardButton: HTMLButtonElement; // Кнопка выбора оплаты картой
  protected _cashButton: HTMLButtonElement; // Кнопка выбора оплаты наличными

  constructor(container: HTMLFormElement, events: IEvents, actions?: IActions) {
    super(container, events);

    // Получаем кнопки выбора способа оплаты
    this._cardButton = ensureElement<HTMLButtonElement>('button[name="card"]', this.container);
    this._cashButton = ensureElement<HTMLButtonElement>('button[name="cash"]', this.container);

    // По умолчанию кнопка "Оплата картой" активна
    this._cardButton.classList.add('button_alt-active');

    // Назначаем обработчики событий клика, если они переданы
    if (actions?.onClick) {
        this._cardButton.addEventListener('click', actions.onClick);
        this._cashButton.addEventListener('click', actions.onClick);
    }
  }

  /**
   * Переключает активное состояние кнопок оплаты
   * @param target - Элемент, который был нажат
   */
  toggleButtons(target: HTMLElement) {
    this._cardButton.classList.toggle('button_alt-active');
    this._cashButton.classList.toggle('button_alt-active');
  }

  /**
   * Устанавливает адрес доставки в поле формы
   */
  set address(value: string) {
    (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
  }
}

// Класс формы контактов, расширяет базовый класс Form
export class ContactForm extends Form<IContactForm> {
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
    }

    /**
     * Устанавливает номер телефона в поле формы
     */
    set phone(value: string) {
        (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
    }

    /**
     * Устанавливает email в поле формы
     */
    set email(value: string) {
        (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
    }
}