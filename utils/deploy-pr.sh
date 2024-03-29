#!/bin/sh

# Useful variables for development...
# CODEBUILD_WEBHOOK_HEAD_REF="refs/heads/the-branch"
# CODEBUILD_WEBHOOK_TRIGGER="pr/5"
# BENEFITS_RECS_DEPLOY_OUTPUT="✓ Success! Deployed app in 55.815 seconds\n    https://7ksmy2xna5.execute-api.us-west-1.amazonaws.com\n"

# Get the name for our arc.codes instance.
if [ -z "$CODEBUILD_WEBHOOK_HEAD_REF" ]
then
  # Provide this default if we're testing and the PR info isn't available.
  BENEFITS_RECS_INSTANCE_NAME="codebuild-test"
else
  # Strip "refs/heads/" from the GitHub ref.
  BENEFITS_RECS_INSTANCE_NAME=$(echo ${CODEBUILD_WEBHOOK_HEAD_REF#refs\/heads\/} | sed 's|[^A-Za-z0-9-]|-|g' | sed -E 's|-*([A-Za-z0-9]*.*[A-Za-z0-9]+)-*|\1|') 
fi

# Get the PR number.
if [ -z "$CODEBUILD_WEBHOOK_TRIGGER" ]
then
  BENEFITS_RECS_PR_NUMBER="9999"
else
  # strip "pr/" from webhook trigger
  BENEFITS_RECS_PR_NUMBER=${CODEBUILD_WEBHOOK_TRIGGER#pr\/}
fi

echo "\n> Deploying arc.codes app."
echo "PR number: $BENEFITS_RECS_PR_NUMBER"
echo "Git branch: $BENEFITS_RECS_INSTANCE_NAME"

# Attempt to deploy. This will appear to hang. Just wait for it.
BENEFITS_RECS_DEPLOY_OUTPUT=$(npx arc deploy --name $BENEFITS_RECS_INSTANCE_NAME --tags Project=odieng-benefts-recommender --tags odieng-env=development --tags odieng-purpose=experimental --tags odieng-branch=$BENEFITS_RECS_INSTANCE_NAME)
BENEFITS_RECS_DEPLOY_STATUS=$?

# If deployment failed, let's bail out here.
if [ $BENEFITS_RECS_DEPLOY_STATUS -gt 0 ]
then
  echo "$BENEFITS_RECS_DEPLOY_OUTPUT"
  exit $BENEFITS_RECS_DEPLOY_STATUS
fi

BENEFITS_RECS_ENDPOINT_URL=$(echo "$BENEFITS_RECS_DEPLOY_OUTPUT" | tail -n 2 | xargs | sed 's/\\x1B\[\?25h//g')
echo " <= That's ANSI escape output from capturing the deploy logs."

echo "Endpoint: $BENEFITS_RECS_ENDPOINT_URL"

echo "\n> Generating front-end preview assets."
npm run widget:build
npm run widget:build:preview -- $BENEFITS_RECS_INSTANCE_NAME $BENEFITS_RECS_PR_NUMBER $BENEFITS_RECS_ENDPOINT_URL

echo "\n> Uploading to S3."
aws s3 sync ./widget/dist s3://staging.cdn.innovation.ca.gov/br/pr/$BENEFITS_RECS_INSTANCE_NAME --follow-symlinks

echo "\n> Sending invalidation to Cloudfront cache."
AWS_PAGER="" 
AWS_RETRY_MODE="standard"
AWS_MAX_ATTEMPTS=6
aws cloudfront create-invalidation --distribution-id EPGKQG9OR4C9S --paths "/br/*"

echo "\nPreview: https://staging.cdn.innovation.ca.gov/br/pr/$BENEFITS_RECS_INSTANCE_NAME/preview/index.html"