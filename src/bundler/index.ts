import * as esbuild from 'esbuild-wasm'
import { unpkgPathPlugin } from './plugins/unpgk-path-plugin'
import { fetchPlugin } from './plugins/fetch-plugin'

let service: esbuild.Service
const bundle = async (rawCode: string) => {
  if (!service) {
    service = await esbuild.startService({
      worker: true,
      wasmURL: 'https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm',
    })
  }

  const env = ['process', 'env', 'NODE_ENV'].join('.')

  try {
    const result = await service.build({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), fetchPlugin(rawCode)],
      define: {
        [env]: '"production"',
        global: 'window',
      },
    })

    return result.outputFiles[0].text
  } catch (error) {
    if (error instanceof Error) {
      return {
        code: '',
        error: error.message,
      }
    } else {
      throw error
    }
  }
}

export default bundle
