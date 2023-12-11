'use client';
//import React, { useEffect } from 'react';
 
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {

  return (
    <html>
      <body>
        <div style={{
          display: 'block', width: '70%',
          padding: '10px', margin: '0 auto',
          textAlign: 'center'
        }}>
          <h2>Something went wrong!</h2>
          <p style={{ display: 'block' }}>{ error.message }</p>
          <button style={{
            display: 'inline-block', fontSize: '18pt',
            padding: '5px 15px', border: '1px solid var( --border-color )'
          }} onClick={() => reset()}>Try again</button>
          <a style={{
            display: 'inline-block', fontSize: '18pt', padding: '5px 15px',
            marginLeft: '20px', border: '1px solid var( --border-color )'
          }} href="/">Go Home</a>
        </div>
      </body>
    </html>
  )
}