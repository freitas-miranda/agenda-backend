const item: any = { id: 'abc' };
const list: any = [item];

const mockService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const mockRepository = {
  create: jest.fn(() => item),
  find: jest.fn(() => list),
  findOneOrFail: jest.fn(() => item),
  findOneBy: jest.fn(() => item),
  findOne: jest.fn(() => item),
  merge: jest.fn(),
  save: jest.fn(),
  softDelete: jest.fn(),
};

export const TestsHelper = {
  mockRepository,
  mockService,
};
