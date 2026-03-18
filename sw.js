var CACHE='fizux-v2';
var FILES=['./','./index.html','./fizux-app.js','./manifest.json'];
self.addEventListener('install',function(e){self.skipWaiting();e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(FILES).catch(function(){});}))});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(keys){return Promise.all(keys.filter(function(k){return k!==CACHE}).map(function(k){return caches.delete(k)}))}).then(function(){return self.clients.claim()}))});
self.addEventListener('fetch',function(e){var url=e.request.url;if(url.indexOf('anthropic')>-1||url.indexOf('googleapis')>-1||url.indexOf('openai')>-1||url.indexOf('deepseek')>-1||url.indexOf('openrouter')>-1||url.indexOf('huggingface')>-1||url.indexOf('pollinations')>-1||url.indexOf('workers.dev')>-1)return;e.respondWith(caches.match(e.request).then(function(r){return r||fetch(e.request)}))});
