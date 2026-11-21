import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/order.dto';

describe('OrderController передаёт заказ в OrderService', () => {
  let controller: OrderController;
  const orderService = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [{ provide: OrderService, useValue: orderService }],
    }).compile();

    controller = module.get(OrderController);
    jest.clearAllMocks();
  });

  it('create вызывает сервис с тем же dto и возвращает его ответ', async () => {
    const dto = {
      email: 'a@b.co',
      phone: '+79990000000',
      tickets: [],
    } as CreateOrderDto;
    const result = { total: 0, items: [] };
    orderService.create.mockResolvedValue(result);

    await expect(controller.create(dto)).resolves.toBe(result);
    expect(orderService.create).toHaveBeenCalledWith(dto);
  });
});
