self.addEventListener("install", function (event) {
  event.waitUntil(preLoad());
});

var preLoad = function () {
  console.log("Installing web app");
  return caches.open("offline").then(function (cache) {
    console.log("caching index and important routes");
    return cache.addAll(["/"]);
  });
};