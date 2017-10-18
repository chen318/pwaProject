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
workboxSW.precache([
  {
    "url": "css/app.css",
    "revision": "a1e919d488f317023e86717d8532cc84"
  },
  {
    "url": "js/app.js",
    "revision": "03eb4cf4ebf81fa7211059f4c851f1d1"
  },
  {
    "url": "js/idb.js",
    "revision": "219c0a6f46dbe946422097d9de2b1961"
  },
  {
    "url": "js/workbox/sw.js",
    "revision": "f8c481f7210b6b5060578c5c44c51fc7"
  },
  {
    "url": "js/workbox/workbox-background-sync.prod.v2.0.3.js",
    "revision": "2da4c7c2602de81accb7e3e4f611e73f"
  },
  {
    "url": "js/workbox/workbox-routing.prod.v2.1.0.js",
    "revision": "6f06b61555a17a0b5f725612e1a00850"
  },
  {
    "url": "js/workbox/workbox-runtime-caching.prod.v2.0.3.js",
    "revision": "3952e49869711ec5aa171e3052efe603"
  },
  {
    "url": "js/workbox/workbox-sw.prod.v2.1.0.js",
    "revision": "e5f207838d7fd9c81835d5705a73cfa2"
  },
  {
    "url": "service-worker.js",
    "revision": "7880d107df863bf86141b214ae33f192"
  }
]);

workboxSW.router.registerRoute('/', workboxSW.strategies.networkFirst());

let msgQueue = new workbox.backgroundSync.QueuePlugin({
  callbacks: {
    replayDidSucceed: async(hash, res) => {
      self.registration.showNotification('Background sync demo', {
        body: 'Messages here'
       });
      console.log(res);
    },
    replayDidFail: (hash) => { console.log('replayDidFail')},
    requestWillEnqueue: (reqData) => { console.log('Enqueue')},
    requestWillDequeue: (reqData) => { console.log('Dequeue')},
  },
  queueName: 'messages'
});

self.addEventListener('fetch', function(e) {
  if (!e.request.url.startsWith('http://localhost:8000/messages')) {
    return;
  }

  const clone = e.request.clone();
  msgQueue.fetchDidFail({
    request: clone,
  });
});

let transQueue = new workbox.backgroundSync.QueuePlugin({
  callbacks: {
    replayDidSucceed: async(hash, res) => {
      self.registration.showNotification('Background sync demo', {
        body: 'Transactions here.'
       });
      console.log(res);
    },
    replayDidFail: (hash) => { console.log('replayDidFail')},
    requestWillEnqueue: (reqData) => { console.log('Enqueue')},
    requestWillDequeue: (reqData) => { console.log('Dequeue')},
  },
  queueName: 'transactions'
});

self.addEventListener('fetch', function(e) {
  if (!e.request.url.startsWith('http://localhost:8000/transactions')) {
    return;
  }

  const clone = e.request.clone();
  transQueue.fetchDidFail({
    request: clone,
  });
});


const requestWrapper = new workbox.runtimeCaching.RequestWrapper({
  plugins: [transQueue,msgQueue],
});

const route = new workbox.routing.RegExpRoute({
  regExp: new RegExp('^http://localhost:8000'),
  handler: new workbox.runtimeCaching.NetworkOnly({requestWrapper}),
});

const router = new workbox.routing.Router();
router.registerRoute({route});
