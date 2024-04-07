import * as mod from 'https://deno.land/std@0.213.0/dotenv/mod.ts';
import {
  Document,
  VectorStoreIndex,
  SimpleDirectoryReader,
} from 'npm:llamaindex@0.1.8';
const keys = await mod.load({ export: true }); // read API key from .env

const documents = await new SimpleDirectoryReader().loadData({
  directoryPath: './data',
});
const index = await VectorStoreIndex.fromDocuments(documents);
const queryEngine = index.asQueryEngine();

const handler2 = async (req) => {
  const headers = new Headers();
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS'
  );
  headers.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Accept, X-Custom-Header'
  );

  if (req.method === 'OPTIONS') {
    // Preflight response does not need a body
    return new Response(null, { headers });
  }

  if (req.method == 'POST') {
    // we'll expect the incoming query to be a JSON object of the form {query: ...}
    let data = await req.json();
    let answer = await queryEngine.query({ query: data.query });
    // and our response will be a JSON object of the form {response: ...}
    let responseObj = {
      response: answer.toString(),
    };
    return new Response(JSON.stringify(responseObj), {
      headers,
      status: 200,
    });
  } else {
    return new Response('Not found', { status: 404 });
  }
};

let server2 = Deno.serve({ port: 8002 }, handler2);
