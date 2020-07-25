rm .gitignore
git add public/
git commit -m "UI Build"
git subtree split --prefix public/ -b gh-pages
git push -f origin gh-pages:gh-pages
