import * as esbuild from 'esbuild-wasm'
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import localforage from 'localforage'

const fileCache = localforage.createInstance({
  name: 'filecache',
})

export const fetchPlugin = (inputCode: string) => {
  return {
    name: 'fetch-plugin',
    setup(build: esbuild.PluginBuild) {
      build.onLoad({ filter: /(^index\.js$)/ }, () => {
        return {
          loader: 'jsx',
          contents: inputCode,
        }
      })

      build.onLoad({ filter: /.*/ }, async (args) => {
        const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(
          args.path
        )
        // if already fetched the package
        if (cachedResult) {
          return cachedResult
        }
      })

      build.onLoad({ filter: /.css$/ }, async (args) => {
        const { data, request }: { data: string; request: XMLHttpRequest } =
          await axios.get(args.path)
        const escaped = data
          .replace(/\n/g, '')
          .replace(/"/g, '\\"')
          .replace(/'/g, "\\'")

        // \`${data}\` also work too
        const contents = `
          const style = document.createElement('style');
          style.innerText = '${escaped}';
          document.head.appendChild(style);
          `

        const result: esbuild.OnLoadResult = {
          loader: 'css',
          contents,
          resolveDir: new URL('./', request.responseURL).pathname,
        }

        await fileCache.setItem(args.path, result)
        return result
      })

      build.onLoad({ filter: /.*/ }, async (args) => {
        const res: { data: string; request: XMLHttpRequest } = await axios.get(
          args.path
        )

        const result: esbuild.OnLoadResult = {
          loader: 'jsx',
          contents: res.data,
          resolveDir: new URL('./', res.request.responseURL).pathname,
        }

        await fileCache.setItem(args.path, result)
        return result
      })
    },
  }
}
