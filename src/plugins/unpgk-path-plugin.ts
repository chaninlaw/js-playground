import * as esbuild from "esbuild-wasm";
import axios from "axios";
import localforage from "localforage";

const fileCache = localforage.createInstance({
  name: "filecache",
});

export const unpkgPathPlugin = (inputCode: string) => {
  return {
    // name key is good for dubugging with many plugin on esbuild
    name: "unpkg-path-plugin",

    // bundling process attaching onResolve and onLoad event
    setup(build: esbuild.PluginBuild) {
      build.onResolve(
        // filter to check type of file would like to executed
        { filter: /.*/ },
        async (args) => {
          console.log("onResolve", args);

          if (args.path === "index.js") {
            return { path: args.path, namespace: "a" };
          }

          if (args.path.includes("./") || args.path.includes("../")) {
            return {
              // namespace similar filter that specific name of file where you wanna execute
              namespace: "a",
              path: new URL(args.path, `https://unpkg.com${args.resolveDir}/`)
                .href,
            };
          }

          return {
            namespace: "a",
            path: `https://unpkg.com/${args.path}`,
          };
        }
      );

      build.onLoad({ filter: /.*/ }, async (args) => {
        console.log("onLoad", args);

        if (args.path === "index.js") {
          return {
            loader: "jsx",
            contents: inputCode,
          };
        }
        // Cache Layer
        // Check to see if we have already fetched this file
        // and if it's in ther cache
        const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(
          args.path
        );
        // if it's, return it immediately
        if (cachedResult) {
          return cachedResult;
        }

        const res = await axios.get(args.path);
        const result: esbuild.OnLoadResult = {
          loader: "jsx",
          contents: res.data,
          resolveDir: new URL("./", res.request.responseURL).pathname,
        };
        // store response in cache
        await fileCache.setItem(args.path, result);
        return result;
      });
    },
  };
};
