"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vite_1 = require("vite");
const plugin_react_1 = __importDefault(require("@vitejs/plugin-react"));
const path_1 = require("path");
exports.default = (0, vite_1.defineConfig)({
    plugins: [(0, plugin_react_1.default)()],
    build: {
        lib: {
            entry: (0, path_1.resolve)(__dirname, 'src/extension.ts'),
            name: 'Extension',
            fileName: 'extension',
            formats: ['cjs'],
        },
        rollupOptions: {
            external: ['vscode'],
            output: {
                globals: {
                    vscode: 'vscode',
                },
            },
        },
        outDir: 'out',
        emptyOutDir: true,
    },
});
//# sourceMappingURL=vite.config.js.map