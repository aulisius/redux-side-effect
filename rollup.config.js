import babel from "rollup-plugin-babel";
import commonjs from "rollup-plugin-commonjs";
import copy from "rollup-plugin-copy-assets";
import { uglify } from "rollup-plugin-uglify";
import { minify } from "uglify-es";
import pkg from "./package.json";

const INPUT = "src/index.js";
const peerDependencies = Object.keys(pkg.peerDependencies);
const createBuild = ({ input, filename, format, external, plugins }) => ({
  input,
  external,
  output: {
    file: filename,
    format
  },
  plugins
});

const createCjsBuild = ({ production = false }) => {
  let plugins = [
    babel({
      exclude: "node_modules/**"
    }),
    commonjs()
  ];
  if (production) {
    plugins.push(uglify({}, minify));
  }
  let filename = `lib/cjs/side-effect${production ? ".min" : ""}.js`;
  return createBuild({
    input: INPUT,
    filename,
    format: "cjs",
    external: peerDependencies,
    plugins
  });
};

const createESBuild = _ => {
  let plugins = [
    babel({
      exclude: "node_modules/**"
    }),
    commonjs(),
    copy({
      assets: ["./index.cjs.js"]
    })
  ];
  let filename = "lib/es/side-effect.js";
  return createBuild({
    input: INPUT,
    filename,
    format: "es",
    external: peerDependencies,
    plugins
  });
};

export default [
  createCjsBuild({ production: false }),
  createCjsBuild({ production: true }),
  createESBuild()
];
