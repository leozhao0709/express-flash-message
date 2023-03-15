const basicConfig = require('./jest.config.basic.cjs');

module.exports = {
  ...basicConfig,
  preset: 'ts-jest/presets/default-esm',
  setupFilesAfterEnv: ['./jest.setup.ts'],
  testEnvironment: 'node',
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/tests/__mocks__/fileMock.ts',
    [`^@app/(.*)`]: '<rootDir>/src/$1',
  },
  // testRegex: 'tests/.*.(js|jsx|ts|tsx)$',
  testMatch: ['<rootDir>/tests/**/*.test.(js|jsx|ts|tsx)'],
};
