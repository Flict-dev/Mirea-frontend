import { Api } from "./base/api";
import { IOrderResult, IProduct, IOrder, ApiListResponse, ILarekAPI } from "../types";

// Класс LarekAPI расширяет базовый класс Api и реализует интерфейс ILarekAPI
export class LarekAPI extends Api implements ILarekAPI {
  readonly cdn: string;

  /**
   * Конструктор класса LarekAPI
   * @param cdn - Базовый URL CDN для загрузки изображений
   * @param baseUrl - Базовый URL API
   * @param options - Дополнительные параметры запроса
   */
  constructor(cdn: string, baseUrl: string, options?: RequestInit) {
    super(baseUrl, options);
    this.cdn = cdn;
  }

  /**
   * Получает список продуктов с API
   * @returns Промис с массивом продуктов
   */
  getProductList(): Promise<IProduct[]> {
    return this.get('/product').then((data: ApiListResponse<IProduct>) =>
      data.items.map((item) => ({
        ...item,
        image: this.cdn + item.image // Добавляем полный URL изображения
      }))
    );
  }

  /**
   * Получает информацию о конкретном продукте
   * @param id - Идентификатор продукта
   * @returns Промис с объектом продукта
   */
  getProductItem(id: string): Promise<IProduct> {
    return this.get(`/product/${id}`).then(
        (item: IProduct) => ({
            ...item,
            image: this.cdn + item.image, // Добавляем полный URL изображения
        })
    );
  }

  /**
   * Создает заказ на продукты
   * @param order - Объект заказа
   * @returns Промис с результатом заказа
   */
  orderProducts(order: IOrder): Promise<IOrderResult> {
    return this.post(`/order`, order).then(
      (data: IOrderResult) => data // Возвращаем результат заказа
    );
  }
}
