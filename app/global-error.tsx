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
            display: 'block', maxWidth: '80px', margin: '0 auto'
          }} onClick={() => reset()}>Try again</button>
        </div>
      </body>
    </html>
  )
}