const handler = (req) => {
  // Create a new response object
  const body = new TextEncoder().encode("Hello World!");
  return new Response(body, { status: 200 });
};

let server = Deno.serve({ port: 8001 }, handler);