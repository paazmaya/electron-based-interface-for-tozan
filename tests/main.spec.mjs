/**
 * Example Playwright script for Electron
 * showing/testing various API features
 * in both renderer and main processes
 */

import { expect, test } from '@playwright/test';
import {
  clickMenuItem,
  findLatestBuild,
  ipcMainCallFirstListener,
  ipcRendererCallFirstListener,
  parseElectronApp,
} from 'electron-playwright-helpers';
import jimp from 'jimp';
import { ElectronApplication, Page, _electron as electron } from 'playwright';

let electronApp;

test.beforeAll(async () => {
  // find the latest build in the out directory
  const latestBuild = findLatestBuild();
  // parse the directory and find paths and other info
  const appInfo = parseElectronApp(latestBuild);
  // set the CI environment variable to true
  process.env.CI = 'e2e';
  electronApp = await electron.launch({
    args: [appInfo.main],
    executablePath: appInfo.executable,
  });
  electronApp.on('window', async (page) => {
    const filename = page.url()?.split('/').pop();
    console.log(`Window opened: ${filename}`);

    // capture errors
    page.on('pageerror', (error) => {
      console.error(error);
    });
    // capture console messages
    page.on('console', (msg) => {
      console.log(msg.text());
    });
  });
});

test.afterAll(async () => {
  await electronApp.close();
});

let page;

test('renders the first page', async () => {
  const expectedText = 'tozan - File hash table of duplicates';
  page = await electronApp.firstWindow();
  await page.waitForSelector('h1');
  const text = await page.$eval('h1', (el) => el.textContent);
  expect(text).toBe(titleText);
  const title = await page.title();
  expect(title).toBe(titleText);
});

test('select a menu item via the main process', async () => {
  await clickMenuItem(electronApp, 'Generate random 300 rows');
  const newPage = await electronApp.waitForEvent('window');
  expect(newPage).toBeTruthy();
  expect(await newPage.title()).toBe('Window 5');
  page = newPage;
});

test('make sure two screenshots of the same page match', async ({ page }) => {
  // take a screenshot of the current page
  const screenshot1: Buffer = await page.screenshot();
  // create a visual hash using Jimp
  const screenshot1hash = (await jimp.read(screenshot1)).hash();
  // take a screenshot of the page
  const screenshot2: Buffer = await page.screenshot();
  // create a visual hash using Jimp
  const screenshot2hash = (await jimp.read(screenshot2)).hash();
  // compare the two hashes
  expect(screenshot1hash).toEqual(screenshot2hash);
});
