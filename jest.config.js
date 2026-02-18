// jest.config.js
// Полная конфигурация Jest для проекта на TypeScript с React

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  // Используем ts-jest для обработки TypeScript-файлов
  preset: 'ts-jest',

  // Тестовая среда: jsdom (для имитации браузера)
  testEnvironment: 'jsdom',

  // Собирать информацию о покрытии кода
  collectCoverage: true,

  // Директория для отчётов покрытия
  coverageDirectory: 'coverage',

  // Провайдер покрытия (v8 быстрее)
  coverageProvider: 'v8',

  // Маппинг путей (алиасы) – должны соответствовать paths в tsconfig.json
  moduleNameMapper: {
    // Алиас @api указывает на файл burger-api.ts
    '^@api$': '<rootDir>/src/utils/burger-api.ts',

    // Остальные алиасы из tsconfig.json
    '^@pages$': '<rootDir>/src/pages',
    '^@components$': '<rootDir>/src/components',
    '^@ui$': '<rootDir>/src/components/ui',
    '^@ui-pages$': '<rootDir>/src/components/ui/pages',
    '^@utils-types$': '<rootDir>/src/utils/types',
    '^@slices$': '<rootDir>/src/services/slices',
    '^@selectors$': '<rootDir>/src/services/selectors',
    '^@store$': '<rootDir>/src/services/store',

    // Заглушки для стилей и изображений
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js'
  },

  // Если есть файл настройки тестов (например, для jest-dom), раскомментируйте:
  // setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],

  // Игнорируемые пути
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],

  // Шаблон для поиска тестовых файлов
  testMatch: ['**/__tests__/**/*.ts?(x)', '**/?(*.)+(spec|test).ts?(x)']
};
