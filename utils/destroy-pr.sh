#!/bin/sh

# Useful variables for development...
# CODEBUILD_WEBHOOK_HEAD_REF="refs/heads/the-branch"

# Get the name for our arc.codes instance.
if [ -z "$CODEBUILD_WEBHOOK_HEAD_REF" ]
then
  # Provide this default if we're testing and the PR info isn't available.
  BENEFITS_RECS_INSTANCE_NAME="codebuild-test"
else
  # Strip "refs/heads/" from the GitHub ref.
  BENEFITS_RECS_INSTANCE_NAME=$(echo ${CODEBUILD_WEBHOOK_HEAD_REF#refs\/heads\/} | sed 's|[^A-Za-z0-9-]|-|g' | sed -E 's|-*([A-Za-z0-9]*.*[A-Za-z0-9]+)-*|\1|') 
fi

echo "\n> Deleting arc.codes app."
echo "Git branch: $BENEFITS_RECS_INSTANCE_NAME"

# Attempt to delete. This will appear to hang. Just wait for it.
npx arc destroy --app benefits-recommendation-api --name $BENEFITS_RECS_INSTANCE_NAME --force

if [ -n "$BENEFITS_RECS_INSTANCE_NAME" ]
then
  echo "\n> Removing from S3."
  aws s3 rm s3://staging.cdn.innovation.ca.gov/br/pr/$BENEFITS_RECS_INSTANCE_NAME/ --recursive
else 
  echo "Skipping S3 delete due to blank git branch name."
fi

echo "App deleted."