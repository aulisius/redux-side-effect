import babel from "rollup-plugin-babel";
import commonjs from "rollup-plugin-commonjs";

import pkg from "./package.json";

export default {
  input: "src/index.js",
  external: Object.keys(pkg.peerDependencies),
  output: [
    { file: pkg.main, format: "cjs" },
    { file: pkg.module, format: "es" }
  ],
  plugins: [
    babel({
      exclude: "node_modules/**"
    }),
    commonjs()
  ]
};
