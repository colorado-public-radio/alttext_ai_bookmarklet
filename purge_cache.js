addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const { url } = await request.json();
  if (!url) {
    return new Response('Bad Request: URL is required', { status: 400 });
  }

  const cfResponse = await fetch(`https://api.cloudflare.com/client/v4/zones/8ee2cbd8a68710a6ce99505136146746/purge_cache`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${CACHE_PURGE_TOKEN}`,
    },
    body: JSON.stringify({ files: [url] }),
  });

  return cfResponse;
}



