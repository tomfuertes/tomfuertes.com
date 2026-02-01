// Worker runs before static assets - add custom logic here if needed
export default {
  async fetch(request: Request, env: any): Promise<Response> {
    const url = new URL(request.url);

    // Example: redirect old domain
    // if (url.hostname === "old-domain.com") {
    //   return Response.redirect(`https://tomfuertes.com${url.pathname}`, 301);
    // }

    // Fall through to static assets (handled by [assets] binding)
    return env.ASSETS.fetch(request);
  },
};
