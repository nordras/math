module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.js'],
  collectCoverageFrom: [
    'lib/**/*.js',
    '!lib/**/*.d.ts',
    '!**/node_modules/**',
  ],
  coverageDirectory: '__tests__/coverage',
  verbose: true,
  transform: {
    '^.+\\.js$': ['babel-jest', { configFile: './babel.config.test.js' }],
  },
  transformIgnorePatterns: [
    'node_modules/(?!(nanoid)/)',
  ],
};
