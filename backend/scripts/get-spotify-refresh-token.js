const http = require('http');
const crypto = require('crypto');
const axios = require('axios');

const REDIRECT_URI = 'http://127.0.0.1:8888/callback';
const PORT = 8888;
const SCOPES = ['user-top-read', 'user-read-currently-playing'].join(' ');

function parseArgs(argv) {
  const out = {};
  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--id') out.id = argv[++i];
    else if (arg === '--secret') out.secret = argv[++i];
  }
  return out;
}

const args = parseArgs(process.argv);
const CLIENT_ID = (args.id || process.env.SPOTIFY_CLIENT_ID || '').trim();
const CLIENT_SECRET = (args.secret || process.env.SPOTIFY_CLIENT_SECRET || '').trim();

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error(
    '\nMissing credentials. Provide them one of these ways:\n' +
      '  SPOTIFY_CLIENT_ID=xxx SPOTIFY_CLIENT_SECRET=yyy node scripts/get-spotify-refresh-token.js\n' +
      '  node scripts/get-spotify-refresh-token.js --id xxx --secret yyy\n'
  );
  process.exit(1);
}

const state = crypto.randomBytes(16).toString('hex');

const authUrl =
  'https://accounts.spotify.com/authorize?' +
  new URLSearchParams({
    response_type: 'code',
    client_id: CLIENT_ID,
    scope: SCOPES,
    redirect_uri: REDIRECT_URI,
    state,
    show_dialog: 'true',
  }).toString();

async function exchangeCodeForTokens(code) {
  const authString = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
  const response = await axios.post(
    'https://accounts.spotify.com/api/token',
    new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI,
    }),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${authString}`,
      },
    }
  );
  return response.data;
}

const server = http.createServer(async (req, res) => {
  const requestUrl = new URL(req.url, `http://127.0.0.1:${PORT}`);

  if (requestUrl.pathname !== '/callback') {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
    return;
  }

  const error = requestUrl.searchParams.get('error');
  const code = requestUrl.searchParams.get('code');
  const returnedState = requestUrl.searchParams.get('state');

  if (error) {
    res.writeHead(400, { 'Content-Type': 'text/html' });
    res.end(`<h1>Authorization failed</h1><p>${error}</p>`);
    console.error(`\nAuthorization failed: ${error}`);
    server.close();
    process.exit(1);
    return;
  }

  if (returnedState !== state) {
    res.writeHead(400, { 'Content-Type': 'text/html' });
    res.end('<h1>State mismatch</h1><p>Possible CSRF. Please rerun the script.</p>');
    console.error('\nState mismatch - aborting for safety. Rerun the script.');
    server.close();
    process.exit(1);
    return;
  }

  try {
    const tokens = await exchangeCodeForTokens(code);
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(
      '<h1>Success</h1><p>Refresh token generated. You can close this tab and return to the terminal.</p>'
    );

    console.log('\n==================== SPOTIFY TOKENS ====================');
    console.log('\nSPOTIFY_REFRESH_TOKEN:\n');
    console.log(tokens.refresh_token);
    console.log('\nGranted scopes:', tokens.scope);
    console.log('\nNext step: set SPOTIFY_REFRESH_TOKEN in your backend Vercel');
    console.log('project env (Settings -> Environment Variables), then redeploy.');
    console.log('\n========================================================\n');
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'text/html' });
    res.end('<h1>Token exchange failed</h1><p>Check the terminal for details.</p>');
    console.error('\nToken exchange failed:', err.response?.data || err.message);
  } finally {
    server.close();
    process.exit(0);
  }
});

server.listen(PORT, () => {
  console.log('\nSpotify refresh token helper is running.');
  console.log(`Local callback server listening on ${REDIRECT_URI}`);
  console.log('\n1) Make sure this redirect URI is registered in your Spotify app settings:');
  console.log(`     ${REDIRECT_URI}`);
  console.log('\n2) Open this URL in your browser and approve access:\n');
  console.log(authUrl);
  console.log('\nWaiting for the redirect...\n');
});
