import { JSDOM } from 'jsdom';
//import { detect } from 'jschardet';
import { NextResponse, type NextRequest } from 'next/server';

async function BlogCard( request: NextRequest ) {

  const targetUrl = new URL( request.url ).searchParams.get('url');
  if ( !targetUrl || !targetUrl?.match(/https?:\/\/[\w!?/+\-_~;.,*&@#$%()'[\]]+/) ) {
    return NextResponse.json({ message: 'url param not found.' }, { status: 401 });
  }

  try {
    const result = await fetch( targetUrl, {
      method: 'GET', headers: {
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36"
      }
    });

    if ( result.ok ) {
      const jsdom = new JSDOM( await result.arrayBuffer() );
      const title = jsdom.window.document.title;
      let description = jsdom.window.document.head.querySelector('meta[name="description"]');
      description = jsdom.window.document.head.querySelector(`meta[property="og:description"]`);
      let thumbnail = jsdom.window.document.head.querySelector(`meta[property="og:image"]`);
      const url = new URL( targetUrl );
      const rootDmain = url.host;
      return NextResponse.json({
        title, description: description?.getAttribute('content'),
        thumbnail: thumbnail?.getAttribute('content') || process.env.APP_URL! + '/static-img/no-image.svg',
        icon: `https://www.google.com/s2/favicons?domain=${ targetUrl }`,
        rootDmain, url: targetUrl
      }, { status: 200 });
    }else {
      return NextResponse.json({ message: 'fetch faild.' }, { status: 401 });
    }
  }catch (e) {
    return NextResponse.json({ message: 'other error.', e }, { status: 401 });
  }
}

export { BlogCard as POST, BlogCard as GET }