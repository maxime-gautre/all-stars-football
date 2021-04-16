module.exports = {
  "preset": "ts-jest/presets/default",
  "moduleFileExtensions": [
    "js",
    "json",
    "ts"
  ],
  "rootDir": ".",
  "testEnvironment": "node",
  "globals": {
    "ts-jest": {
      "isolatedModules": true
    }
  },
  "collectCoverageFrom": [
    "**/*.(t|j)s"
  ],
  "coverageDirectory": "./coverage",
  "testRegex": "\\.spec\\.ts$"
}


