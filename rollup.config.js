// rollup.config.js
import typescript from "rollup-plugin-typescript2";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import PKG_JSON from "./package.json";

const external = [...new Set([...Object.keys(PKG_JSON.peerDependencies || {})])];

export default [
  {
    input: "src/index.ts",
    output: [
      {
        file: "dist/index.esm.js",
        format: "es",
        name: "vue-hook-store",
        sourcemap: true,
      },
      {
        file: "dist/index.js",
        format: "cjs",
        name: "vue-hook-store",
        sourcemap: true,
      },
      {
        file: "dist/index.umd.js",
        format: "umd",
        name: "vueHookStore",
        sourcemap: true,
      },
    ],
    external,
    plugins: [
      resolve({ browser: true }),
      commonjs(),
      typescript({
        clean: true,
        tsconfig: "tsconfig.json",
        rollupCommonJSResolveHack: false,
      }),
    ],
  },
];
