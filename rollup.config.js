import babel from "rollup-plugin-babel";
import commonjs from "rollup-plugin-commonjs";
import filesize from "rollup-plugin-filesize";
import pkg from "./package.json";

let createBuild = ({ format }) => ({
  input: pkg.config.source,
  external: Object.keys(pkg.peerDependencies),
  output: {
    file: `lib/${format}.js`,
    format
  },
  plugins: [
    babel({
      exclude: "node_modules/**"
    }),
    commonjs(),
    filesize()
  ]
});

export default [
  createBuild({
    format: "cjs"
  }),
  createBuild({
    format: "es"
  })
];
