import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'

const StyledPreview = styled.div`
  position: relative;
  height: 100%;
  flex-grow: 1;

  .react-draggable-transparent-selection &::after {
    content: '';
    position: absolute;
    inset: 0;
  }

  iframe {
    border: 0;
    background-color: white;
    width: 100%;
    height: 100%;
  }

  .preview-error {
    position: absolute;
    top: 10px;
    left: 10px;
    color: red;
  }
`

type Props = {
  code: string
  bundlingStatus: string
}

const html = `
<html>
<head>
  <style>html { background-color: white; }</style>
</head>
<body>
  <div id="root"></div>
  <script>
    const handleError = (err) => {
      const root = document.querySelector('#root');
      root.innerHTML = '<div style="color: red;"><h4>Runtime Error</h4>' + err + '</div>';
      console.error(err);
    };

    window.addEventListener('error', (event) => {
      event.preventDefault();
      handleError(event.error);
    });

    window.addEventListener('message', (event) => {
      try {
        eval(event.data);
      } catch (err) {
        handleError(err);
      }
    }, false);
  </script>
</body>
</html>
  `

const Preview: React.FC<Props> = ({ code, bundlingStatus }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    if (!iframeRef.current) return
    iframeRef.current.srcdoc = html

    const timer = setTimeout(() => {
      iframeRef.current?.contentWindow?.postMessage(code, '*')
    }, 100)

    return () => clearTimeout(timer)
  }, [code])

  return (
    <StyledPreview>
      <iframe
        ref={iframeRef}
        title="preview"
        sandbox="allow-scripts"
        srcDoc={html}
      />
      {bundlingStatus && <div className="preview-error">{bundlingStatus}</div>}
    </StyledPreview>
  )
}

export default Preview
