#!/bin/sh

rm -rf ./build
mkdir ./build

# fonts
cp -R ./fonts ./build/fonts

# css
mkdir ./build/css
cp -R ./css/fontawesome-free-5.5.0-web ./build/css/fontawesome-free-5.5.0-web

# images
cp -R ./images ./build/images

# index.html
cp ./index.html ./build
# use minified assets
npx replace-in-file '<link rel="stylesheet" href="css/style.css">' '<link rel="stylesheet" href="css/style.min.css">' build/index.html
npx replace-in-file '<script type="module" src="./js/App.js"></script>' '<script src="./js/main.js"></script>' build/index.html
    