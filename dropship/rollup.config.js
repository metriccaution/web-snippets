import html from "@rollup/plugin-html";
import replace from "@rollup/plugin-replace";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "rollup-plugin-babel";
import { readFileSync } from "fs";
import scss from "rollup-plugin-scss";
import { terser } from "rollup-plugin-terser";
import copy from "rollup-plugin-copy";

// TODO - Dev Server
// TODO - Prod mode vs dev mode

const extensions = [".js", ".jsx", ".ts", ".tsx"];
// eslint-disable-next-line no-undef
const production = process.env.NODE_ENV === "production";

export default {
  input: "src/index.tsx",
  output: {
    file: "public/index.js",
    format: "iife",
  },
  plugins: [
    // Production mode where needed
    replace({
      "process.env.NODE_ENV": JSON.stringify(
        production ? "production" : "development"
      ),
    }),
    // Module system - Actually allow imports
    resolve({
      extensions,
    }),
    commonjs({
      include: /node_modules/,
    }),
    // ts/tsc -> js
    babel({
      extensions,
      exclude: /node_modules/,
      babelrc: false,
      runtimeHelpers: true,
      presets: [["@babel/typescript", { jsxPragma: "h" }]],
      plugins: [
        [
          "@babel/plugin-transform-react-jsx",
          {
            pragma: "h",
            pragmaFrag: "Fragment",
          },
        ],
      ],
    }),
    // Give the page a body to bootstrap
    html({
      fileName: "index.html",
      title: "Dropship",
      template: () => readFileSync("templates/index-template.html"),
    }),
    // Style sheets
    scss({
      output: "public/styles.css",
    }),
    // Minifying
    terser(),
    // Static resources, e.g. favicon
    copy({
      targets: [{ src: "static/**/*", dest: "public" }],
    }),
  ],
};
