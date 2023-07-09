import * as esbuild from "esbuild-wasm";

export const unpkgPathPlugin = () => {
  return {
    // good for dubugging with many plugin on esbuild
    name: "unpkg-path-plugin",

    // bundling process attaching onResolve and onLoad event
    setup(build: esbuild.PluginBuild) {
      build.onResolve(
        { filter: /.*/ }, // filter to check type of file would like to executed
        (args: esbuild.OnResolveArgs): esbuild.OnResolveResult => {
          console.log("onResolve", args);
          return { path: args.path, namespace: "a" }; // namespace similar filter that specific name of file where you wanna execute
        }
      );

      build.onLoad(
        { filter: /.*/ },
        (args: esbuild.OnLoadArgs): esbuild.OnLoadResult => {
          console.log("onLoad", args);

          if (args.path === "index.js") {
            return {
              loader: "jsx",
              contents: `
              import message from './message';
              console.log(message);
            `,
            };
          } else {
            return {
              loader: "jsx",
              contents: 'export default "hi there!!!"',
            };
          }
        }
      );
    },
  };
};
