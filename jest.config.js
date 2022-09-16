// Classic jest config for tests to be run in jsdom environment
// Useful for classic unit tests or enzyme component tests

module.exports = {
  roots: ['<rootDir>/src'],
  testMatch: [
    '**/(*.)+test.(ts|tsx|js)',
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  verbose: true,
}
