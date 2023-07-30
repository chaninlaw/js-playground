import * as esbuild from "esbuild-wasm";
import { useState, useEffect, useRef } from "react";
import { unpkgPathPlugin } from "./plugins/unpgk-path-plugin";
import { fetchPlugin } from "./plugins/fetch-plugin";

const App: React.FC = () => {
  const ref = useRef<esbuild.Service>();
  const [input, setInput] = useState("");
  const [code, setCode] = useState<esbuild.OutputFile[]>([]);

  const startService = async () => {
    ref.current = await esbuild.startService({
      worker: true,
      wasmURL: "/esbuild.wasm",
    });
  };

  useEffect(() => {
    startService().catch((err) => console.error(err));
  }, []);

  const onClick = () => {
    void (async () => {
      if (!ref.current) {
        return;
      }

      const env = ["process", "env", "NODE_ENV"].join(".");
      const result = await ref.current.build({
        entryPoints: ["index.js"],
        bundle: true,
        write: false,
        plugins: [unpkgPathPlugin(), fetchPlugin(input)],
        define: {
          [env]: '"production"',
          global: "window",
        },
      });

      setCode(result.outputFiles);
    })();
  };

  return (
    <>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        cols={30}
        rows={10}
      />
      <div>
        <button onClick={onClick}>Submit</button>
      </div>
      <pre>
        {code.map((item) => {
          return <div key={item.path}>{item.text}</div>;
        })}
      </pre>
    </>
  );
};

export default App;
