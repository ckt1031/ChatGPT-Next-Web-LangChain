import { STORAGE_KEY } from "@/app/constant";
import { SyncStore } from "@/app/store/sync";

export type WebDAVConfig = SyncStore["webdav"];
export type WebDavClient = ReturnType<typeof createWebDavClient>;

export function createWebDavClient(store: SyncStore) {
  const folder = STORAGE_KEY;
  const fileName = `${folder}/backup.json`;
  const config = store.webdav;
  const proxyUrl =
    store.useProxy && store.proxyUrl.length > 0 ? store.proxyUrl : undefined;

  return {
    async check() {
      try {
        const res = await fetch(this.path(folder, proxyUrl, true), {
          method: "GET",
          headers: this.headers(),
        });
        const success = [201, 200, 404, 405, 301, 302, 307, 308].includes(
          res.status,
        );
        console.log(
          `[WebDav] check ${success ? "success" : "failed"}, ${res.status} ${
            res.statusText
          }`,
        );
        return success;
      } catch (e) {
        console.error("[WebDav] failed to check", e);
      }

      return false;
    },

    async get(key: string) {
      const res = await fetch(this.path(fileName, proxyUrl), {
        method: "GET",
        headers: this.headers(),
      });

      if (!res.ok) {
        throw new Error(`Failed to run WebDAV get: ${res.status}`);
      }

      console.log("[WebDav] get key = ", key, res.status, res.statusText);

      return await res.text();
    },

    async set(key: string, value: string) {
      const res = await fetch(this.path(fileName, proxyUrl), {
        method: "PUT",
        headers: this.headers(),
        body: value,
      });

      if (!res.ok) {
        throw new Error(`Failed to run WebDAV set: ${res.status}`);
      }

      console.log("[WebDav] set key = ", key, res.status, res.statusText);
    },

    headers() {
      const auth = btoa(config.username + ":" + config.password);

      return {
        authorization: `Basic ${auth}`,
      };
    },
    path(path: string, proxyUrl: string = "", isMKCOL = false) {
      if (path.startsWith("/")) {
        path = path.slice(1);
      }

      if (proxyUrl.endsWith("/")) {
        proxyUrl = proxyUrl.slice(0, -1);
      }

      let url;
      const pathPrefix = "/api/webdav/";

      try {
        let u = new URL(proxyUrl + pathPrefix + path);
        // add query params
        u.searchParams.append("endpoint", config.endpoint);
        if (isMKCOL) u.searchParams.append("mkcol", "true");
        url = u.toString();
      } catch (e) {
        url =
          pathPrefix +
          path +
          "?endpoint=" +
          config.endpoint +
          `&mkcol=${isMKCOL}`;
      }

      return url;
    },
  };
}
