import WorkboxSW from 'workbox-sw';
import {Queue, QueuePlugin} from 'workbox-background-sync';
import {RequestWrapper, NetworkOnly} from 'workbox-runtime-caching';
import {RegExpRoute, Router} from 'workbox-routing';
require('babel-polyfill');
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

const workboxSW = new WorkboxSW();
workboxSW.precache([
  {
    "url": "css/app.css",
    "revision": "a1e919d488f317023e86717d8532cc84"
  },
  {
    "url": "js/app.js",
    "revision": "a808af084c637bd3d404a29772414498"
  },
  {
    "url": "js/idb.js",
    "revision": "219c0a6f46dbe946422097d9de2b1961"
  },
  {
    "url": "js/sw.js",
    "revision": "a6e892c23aad2ae9427cd29dfe4c30db"
  },
  {
    "url": "service-worker.js",
    "revision": "c0464aa37f20f2a5316b977978f31f82"
  }
]);

workboxSW.router.registerRoute('/', workboxSW.strategies.networkFirst());

let msgQueue = new QueuePlugin({
  callbacks: {
    replayDidSucceed: async(hash, res) => {
      self.registration.showNotification('Background sync demo', {
        body: 'Messages here'
       });
      console.log(res);
    },
    replayDidFail: (hash) => { console.log('replayDidFail')},
    requestWillEnqueue: (reqData) => { console.log('Enqueue')},
    requestWillDequeue: (reqData) => { console.log(reqData)},
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

let transQueue = new QueuePlugin({
  callbacks: {
    replayDidSucceed: async(hash, res) => {
      self.registration.showNotification('Background sync demo', {
        body: 'Transactions here.'
       });
      console.log(res);
    },
    replayDidFail: (hash) => { console.log('replayDidFail')},
    requestWillEnqueue: (reqData) => { console.log('Enqueue')},
    requestWillDequeue: (reqData) => { console.log(reqData)},
  },
  queueName: 'transactions'
});

self.addEventListener('fetch', function(e) {
  if (!e.request.url.startsWith('http://localhost:8000/transactions')) {
    console.log(e.request.url);
    console.log(e.request.method);
    return;
  }

  const clone = e.request.clone();
  transQueue.fetchDidFail({
    request: clone,
  });
});

const requestWrapper = new RequestWrapper({
  plugins: [transQueue,msgQueue],
});

const route = new RegExpRoute({
  regExp: new RegExp('^http://localhost:8000'),
  handler: new NetworkOnly({requestWrapper}),
});

const router = new Router();
router.registerRoute({route});
