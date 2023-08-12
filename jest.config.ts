import { Config } from 'jest';
import { pathsToModuleNameMapper } from 'ts-jest';
import { compilerOptions } from './tsconfig.json';

export const configBase = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['<rootDir>/src/app/**/*.(t|j)s', '!<rootDir>/src/**/*module.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  rootDir: './',
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),
  slowTestThreshold: 15,
};

const config: Config = configBase;

export default config;
