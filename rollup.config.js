import babel from "rollup-plugin-babel";
import commonjs from "rollup-plugin-commonjs";
import copy from "rollup-plugin-copy-assets";
import pkg from "./package.json";

export default {
  input: "src/index.js",
  external: Object.keys(pkg.peerDependencies),
  output: [{ file: "lib/cjs/side-effect.js", format: "cjs" }],
  plugins: [
    babel({
      exclude: "node_modules/**"
    }),
    commonjs(),
    copy({
      assets: ["./index.js"]
    })
  ]
};
