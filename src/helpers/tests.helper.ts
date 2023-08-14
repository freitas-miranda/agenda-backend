export class TestsHelper {
  private item: any = { id: 'abc' };
  private list: any = [this.item];

  mockService() {
    return {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };
  }

  mockRepository() {
    return {
      name: 'mockRepository',
      create: jest.fn(() => this.item),
      find: jest.fn(() => this.list),
      findOneOrFail: jest.fn(() => this.item),
      findOneBy: jest.fn(() => this.item),
      findOne: jest.fn(() => this.item),
      merge: jest.fn(),
      save: jest.fn(),
      softDelete: jest.fn(),
    };
  }
}
