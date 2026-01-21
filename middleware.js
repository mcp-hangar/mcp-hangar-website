export default function middleware(request) {
    const url = new URL(request.url);

    if (url.hostname === 'get.mcp-hangar.io') {
        return Response.redirect('https://mcp-hangar.io/install.sh', 302);
    }
}

export const config = {
    matcher: '/:path*',
};
