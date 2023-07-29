const mockService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const mockRepository = {
  create: jest.fn(),
  update: jest.fn(),
  find: jest.fn(),
  getById: jest.fn(),
  getByEmail: jest.fn(),
  delete: jest.fn(),
  save: jest.fn(),
};

export const TestsHelper = {
  mockRepository,
  mockService,
};
