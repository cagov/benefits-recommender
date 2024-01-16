#!/bin/sh

echo "\n> Deploying arc.codes app to production."
# Attempt to deploy. This will appear to hang. Just wait for it.
npx arc deploy --production --tags Project=odieng-benefts-recommender --tags odieng-env=production --tags odieng-purpose=experimental --tags odieng-branch=main

echo "\n> Generating front-end preview assets."
npm run widget:build
npm run widget:build:preview

echo "\n> Uploading to S3."
aws s3 sync ./widget/dist s3://cdn.innovation.ca.gov/br/ --follow-symlinks

echo "\n> Sending invalidation to Cloudfront cache."
AWS_RETRY_MODE="standard"
AWS_MAX_ATTEMPTS=6
AWS_PAGER="" 
aws cloudfront create-invalidation --distribution-id EAQBFZOLKQ2AZ --paths "/br/*"

echo "\nApp deployed to production."