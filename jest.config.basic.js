const path = require('path');

module.exports = {
  preset: 'ts-jest',
  collectCoverage: true,
  testPathIgnorePatterns: ['mocks', 'node_modules'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/tests/__mocks__/fileMock.ts',
    '\\.(css|less|scss)$': 'identity-obj-proxy',
    [`^app/(.*)`]: '<rootDir>/src/$1',
  },
};
