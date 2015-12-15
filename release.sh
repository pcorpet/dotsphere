#!/bin/bash
# Script to release the dotsphere plugin for dotclear. It takes one parameter,
# the version string and produces one zip file in the dotclear plugin format.
readonly VERSION=$1

if [ -z "${VERSION}" ]; then
  echo "Needs a version string as first parameter." 1>&2
  exit 1
fi

set -e

echo "Releasing ${VERSION}..." 1>&2

rm -rf dotsphere
mkdir dotsphere

# Simple files.
for f in _admin.php LICENSE icon.png locales; do
  ln -s "../${f}" dotsphere
done

# File containing version.
sed "s/'dev'/'${VERSION}'/" _define.php > dotsphere/_define.php

# JavaScript files.
mkdir dotsphere/js
ln -s "../../js/public.js" dotsphere/js

CCJS=/usr/bin/ccjs
if [ -x "${CCJS}" ]; then
  "${CCJS}" js/post.js --compilation_level=ADVANCED --externs=js/externs.js --use_types_for_optimization --jscomp_warning=\* > dotsphere/js/post.min.js
else
  ln -s "../../js/post.js" dotsphere/js/post/min.js
fi

PSV_FILE="dotsphere/js/photo-sphere-viewer.min.js"
wget https://cdnjs.cloudflare.com/ajax/libs/three.js/r73/three.min.js -O "${PSV_FILE}"
wget https://raw.githubusercontent.com/mistic100/Photo-Sphere-Viewer/master/dist/photo-sphere-viewer.min.js -O - >> "${PSV_FILE}"

PLUGIN="plugin-dotsphere-${VERSION}.zip"
rm -f "${PLUGIN}"
zip -r "${PLUGIN}" dotsphere
rm -rf dotsphere
