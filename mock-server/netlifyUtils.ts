import {getStore} from "@netlify/blobs";

// TODO: Add error handling when these requests fail

const getNetlifyStore = (storeName: string) =>
  getStore({
    name: storeName,
    edgeURL: process.env.NETLIFY_SITE_URL,
    siteID: process.env.NETLIFY_SITE_ID,
    token: process.env.NETLIFY_API_KEY
  });

export const getItemFromStore = async <T>(storeName: string, key: string) => {
  const store = getNetlifyStore(storeName);
  return (await store.get(key, {type: "json"})) as T;
};

export const getItemsFromStore = async <T>(storeName: string) => {
  const store = getNetlifyStore(storeName);

  const {blobs} = await store.list();
  return await Promise.all<T>(
    blobs.map(async item => await store.get(item.key, {type: "json"}))
  );
};

export const writeItemToStore = async <T>(
  storeName: string,
  key: string,
  itemToStore: T
) => {
  const store = getNetlifyStore(storeName);

  const previousItem: T = await store.get(key, {type: "json"});
  if (!previousItem) await store.setJSON(key, itemToStore);

  return previousItem ?? itemToStore;
};

export const removeItemFromStore = async (storeName: string, key: string) => {
  const store = getNetlifyStore(storeName);
  return await store.delete(key);
};

export const clearAllStoreData = async (storeName: string) => {
  const store = getNetlifyStore(storeName);

  const {blobs} = await store.list();
  await Promise.all(blobs.map(async blob => await store.delete(blob.key)));
};

export const clearAllData = async () => {
  await clearAllStoreData("holds");
  await clearAllStoreData("rush-grants");
};
