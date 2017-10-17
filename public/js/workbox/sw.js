importScripts('js/workbox/workbox-sw.prod.v2.1.0.js');
importScripts('js/workbox/workbox-background-sync.prod.v2.0.3.js');
importScripts('js/workbox/workbox-runtime-caching.prod.v2.0.3.js');
importScripts('js/workbox/workbox-routing.prod.v2.1.0.js');

/**
 * DO NOT EDIT THE FILE MANIFEST ENTRY
 *
 * The method precache() does the following:
 * 1. Cache URLs in the manifest to a local cache.
 * 2. When a network request is made for any of these URLs the response
 *    will ALWAYS comes from the cache, NEVER the network.
 * 3. When the service worker changes ONLY assets with a revision change are
 *    updated, old cache entries are left as is.
 *
 * By changing the file manifest manually, your users may end up not receiving
 * new versions of files because the revision hasn't changed.
 *
 * Please use workbox-build or some other tool / approach to generate the file
 * manifest which accounts for changes to local files and update the revision
 * accordingly.
 */

const workboxSW = new self.WorkboxSW();
workboxSW.precache([]);

workboxSW.router.registerRoute('/', workboxSW.strategies.networkFirst());

let bgQueue = new workbox.backgroundSync.QueuePlugin({
  callbacks: {
    replayDidSucceed: async(hash, res) => {
      self.registration.showNotification('Background sync demo', {
        body: 'Product has been purchased.',
        icon: '/images/shop-icon-384.png',
       });
      console.log(res);
    },
    replayDidFail: (hash) => { console.log(hash);},
    requestWillEnqueue: (reqData) => { console.log(reqData);},
    requestWillDequeue: (reqData) => { console.log(reqData);},
  },
});

bgQueue.fetchDidFail({
    request: new Request('http://localhost:8000'),
});

const requestWrapper = new workbox.runtimeCaching.RequestWrapper({
  plugins: [bgQueue],
});

const route = new workbox.routing.RegExpRoute({
  regExp: new RegExp('^http://localhost:8000'),
  handler: new workbox.runtimeCaching.NetworkOnly({requestWrapper}),
});

const router = new workbox.routing.Router();
router.registerRoute({route});
