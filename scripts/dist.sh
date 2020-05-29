# If the directory, `dist`, doesn't exist, create `dist`
stat dist || mkdir dist
# Archive artifacts
# zip $npm_package_name.zip -r src dist package.json yarn.lock .elasticbeanstalk
zip $npm_package_name.zip Dockerrun.aws.json