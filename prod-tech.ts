import * as mod from 'https://deno.land/std@0.213.0/dotenv/mod.ts';
import {
  Document,
  VectorStoreIndex,
  SimpleDirectoryReader,
  RouterQueryEngine,
  storageContextFromDefaults,
  ContextChatEngine,
} from 'npm:llamaindex@0.1.12';
const keys = await mod.load({ export: true }); // read API key from .env

const storageContext = await storageContextFromDefaults({
  persistDir: './storage',
});

const documents = await new SimpleDirectoryReader().loadData({
  directoryPath: './data_wiki', // we have the React wikipedia page in here
});
let index = await VectorStoreIndex.fromDocuments(documents, {
  storageContext,
});

let engine = await index.asQueryEngine();
let response = await engine.query({ query: 'What is JSX?' });
console.log(response.toString());