git config --global user.name metriccaution
git config --global user.email 8094629+metriccaution@users.noreply.github.com
# git remote add origin https://github.com/metriccaution/web-snippets.git

rm .gitignore
git add public/
git commit -m "UI Build"
git subtree split --prefix public/ -b gh-pages
git push -f origin gh-pages:gh-pages
