export default {
    rootDir: 'src',
    testRegex: '.*\\.spec\\.ts$',

    transform: {
        '^.+\\.ts$': [
            'ts-jest',
            {
                useESM: true,
                tsconfig: './tsconfig.json',
            },
        ],
    },

    extensionsToTreatAsEsm: ['.ts'],

    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
    },

    testEnvironment: 'node',
};