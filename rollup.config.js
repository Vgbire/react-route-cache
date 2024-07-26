import { nodeResolve } from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"
import typescript from "@rollup/plugin-typescript"
import terser from "@rollup/plugin-terser"
import postcss from "rollup-plugin-postcss"
import dts from "rollup-plugin-dts"

export default {
  input: "src/index.ts",
  output: [
    {
      file: "./lib/index.cjs",
      format: "cjs",
      sourcemap: false,
      name: "react-route-cache",
    },
    {
      file: "./es/index.js",
      format: "esm",
      sourcemap: false,
    },
  ],
  plugins: [nodeResolve(), commonjs(), typescript(), postcss(), terser()],
  external: ["react", "react-dom", "react-router-dom"],
}
