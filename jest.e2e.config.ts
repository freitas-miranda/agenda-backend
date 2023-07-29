import { Config } from 'jest';
import { configBase } from './jest.config';

const config: Config = configBase;

config.testRegex = '.*\\.e2e-spec\\.ts$';

export default config;
