"use client";
import { useEffect } from 'react';
import dynamic from 'next/dynamic';
//import MediaGallery from '@/components/use-client/media-gallery';

const MediaGallery = dynamic(() => import( '@/components/use-client/media-gallery' ));

export default function Content() {

  /*useEffect(() => {

    fetch('/api/get-media', {
      method: 'POST', cache: 'no-store',
      body: JSON.stringify({ skip: 0, take: 10 })
    }).then( async (response) => {
      console.log( await response.json() );
    });
  });*/

  return (
    <div style={{ flexBasis: '100%', alignSelf: "flex-start", marginTop: '70px' }}>
      <h2>メディア</h2>
      <MediaGallery mode="default" />
    </div>
  )
}