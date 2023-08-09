const mockService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const mockRepository = {
  create: jest.fn(),
  find: jest.fn(),
  findOneOrFail: jest.fn(),
  findOneBy: jest.fn(),
  findOne: jest.fn(),
  merge: jest.fn(),
  save: jest.fn(),
  softDelete: jest.fn(),
};

export const TestsHelper = {
  mockRepository,
  mockService,
};
