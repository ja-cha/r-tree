module.exports = {
    transform: {'^.+\\.ts?$': 'ts-jest'},
    testEnvironment: 'node',
    testRegex: '/tests/.*\\.(test|spec)?\\.(ts|tsx)$',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    roots: [
      '<rootDir>/tests/'
    ],
     // skipped other properties
  modulePathIgnorePatterns: [
    "<rootDir>/build/"
  ]
  };