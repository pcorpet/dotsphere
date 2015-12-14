var PhotoSphereViewer = PhotoSphereViewer || null;


/**
 * Creates a Photo Sphere Viewer in the last element created that has the class
 * "dotsphere". If the Photo Sphere Viewer library is not loaded, it will load
 * it from path, but it makes sure to load it only once even if this function
 * is called multiple times.
 * @param {!Object.<string, *>} opt The options for the PhotoSphereViewer. It
 *     must at least contains the panorama property which defines the URL of
 *     the picture, and doesn't need the container property which will be
 *     filled automatically.
 * @param {string} path The path where to find the PhotoSphereViewer Js
 *     library.
 */
var dotsphere = dotsphere || function(opt, path) {
  var allContainers = document.getElementsByClassName('dotsphere');
  if (allContainers.length == 0) {
    throw 'dotsphere() called but no container is defined yet.';
  }
  opt.container = allContainers[allContainers.length - 1];

  if (!PhotoSphereViewer) {
    dotsphere.delayed = [];
    PhotoSphereViewer = function(options) {
      dotsphere.delayed.push(options);
    };
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = path + 'photo-sphere-viewer.min.js';
    var callback = function() {
      while (dotsphere.delayed.length > 0) {
        PhotoSphereViewer(dotsphere.delayed.pop());
      }
    };
    script.onload = callback;
    script.onreadystatechange = callback;
    var firstScript = document.getElementsByTagName('script')[0];
    firstScript.parentElement.insertBefore(script, firstScript);
  }

  PhotoSphereViewer(opt);
};
