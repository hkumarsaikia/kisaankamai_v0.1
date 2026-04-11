import { Client, Databases, Storage, ID } from 'node-appwrite';
import { InputFile } from 'node-appwrite/file';
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Appwrite Configuration
const APPWRITE_ENDPOINT = 'https://fra.cloud.appwrite.io/v1';
const APPWRITE_PROJECT = '69d918770025e8d680f6';
const APPWRITE_KEY = 'standard_f97a8ce36484d1fe7cd4aa890a17a4e87cc08e0f523c8d11b6801ee48c59306dacdb388ce736a5ab3eed02b58dee59221313c24bfcb3bda974f5a4504a526da92be3f5ae110510f035a7131a7e3beefd9b0760975e692128174deeee9f75906db55c555279b17d476ee2982baf9256effea1720405f58240ffe5d5e78b9c0232';
const DATABASE_ID = 'kisan-kamai-db';
const BUCKET_ID = 'performance_traces';
const COLLECTION_ID = 'performance_insights';

const TARGET_URLS = [
  'http://localhost:3001',
  'http://localhost:3001/faq',
  'http://localhost:3001/support'
];

async function runProfiler() {
  console.log('Initializing profiler...');
  const client = new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT)
    .setKey(APPWRITE_KEY);

  const databases = new Databases(client);
  const storage = new Storage(client);

  const browser = await puppeteer.launch({ headless: true });

  for (const url of TARGET_URLS) {
    try {
      console.log(`Profiling ${url}...`);
      const page = await browser.newPage();
      
      // Enable tracing
      const tracePath = path.join(__dirname, `trace-${Date.now()}.json`);
      await page.tracing.start({ path: tracePath, screenshots: true });

      const startTime = Date.now();
      await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
      const loadTime = Date.now() - startTime;

      // Get Web Vitals / Metrics via Page Execution
      const metrics = await page.evaluate(() => {
        const perfData = window.performance.getEntriesByType('navigation')[0];
        if (!perfData) return { ttfb: 0, domContentLoaded: 0, loadTime: 0 };
        return {
          ttfb: perfData.responseStart - perfData.requestStart,
          domContentLoaded: perfData.domContentLoadedEventEnd - perfData.startTime,
          loadTime: perfData.loadEventEnd - perfData.startTime
        };
      });

      await page.tracing.stop();
      await page.close();

      // 1. Upload Trace to Appwrite Storage
      console.log(`Uploading trace for ${url}...`);
      const file = await storage.createFile(
        BUCKET_ID,
        ID.unique(),
        InputFile.fromPath(tracePath, path.basename(tracePath))
      );

      // 2. Save Insights to Database
      console.log(`Saving insights for ${url}...`);
      await databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(),
        {
          pageUrl: url,
          timestamp: new Date().toISOString(),
          loadTime: Math.round(metrics.loadTime || loadTime),
          ttfb: Math.round(metrics.ttfb),
          traceFileId: file.$id,
          lcp: 0, 
          fid: 0,
          cls: 0
        }
      );

      // Cleanup local trace file
      fs.unlinkSync(tracePath);
    } catch (err) {
      console.error(`Error profiling ${url}:`, err.message);
    }
  }

  await browser.close();
  console.log('Profiling cycle complete!');
}

runProfiler().catch(console.error);
