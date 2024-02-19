module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    '**/*.{ts,tsx}',
    '!mock-server/**',
    '!**/tests/**',
    '!**/types/**',
    '!App.tsx'
  ],
  preset: 'react-native',
  setupFilesAfterEnv: ['<rootDir>/tests/integration/setup.ts'],
  transformIgnorePatterns: [
    'node_modules/(?!(@react-native|react-native|@react-navigation/elements|rn-flipper-async-storage-advanced|react-native-flipper|react-native-vector-icons)/)'
  ]
};
