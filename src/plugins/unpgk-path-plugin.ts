import * as esbuild from "esbuild-wasm";
import axios from "axios";

export const unpkgPathPlugin = () => {
  return {
    // name key is good for dubugging with many plugin on esbuild
    name: "unpkg-path-plugin",

    // bundling process attaching onResolve and onLoad event
    setup(build: esbuild.PluginBuild) {
      build.onResolve(
        { filter: /.*/ }, // filter to check type of file would like to executed
        async (
          args: esbuild.OnResolveArgs
        ): Promise<esbuild.OnResolveResult> => {
          console.log("onResolve", args);

          if (args.path === "index.js") {
            return { path: args.path, namespace: "a" }; // namespace similar filter that specific name of file where you wanna execute
          }

          if (args.path.includes("./") || args.path.includes("../")) {
            return {
              namespace: "a",
              path: new URL(args.path, args.importer + "/").href,
            };
          }

          return {
            namespace: "a",
            path: `https://unpkg.com/${args.path}`,
          };
          // else if (args.path === "tiny-test-pkg") {
          //   return {
          //     path: "https://unpkg.com/tiny-test-pkg@1.0.0/index.js",
          //     namespace: "a",
          //   };
          // }
        }
      );

      build.onLoad(
        { filter: /.*/ },
        async (args: esbuild.OnLoadArgs): Promise<esbuild.OnLoadResult> => {
          console.log("onLoad", args);

          if (args.path === "index.js") {
            return {
              loader: "jsx",
              contents: `
              const message = require('medium-test-pkg');
              console.log(message);
            `,
            };
          }

          const { data } = await axios.get(args.path);
          return {
            loader: "jsx",
            contents: data,
          };
        }
      );
    },
  };
};
