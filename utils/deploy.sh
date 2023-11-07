#!/bin/sh

#CODEBUILD_WEBHOOK_BASE_REF="refs/heads/the-branch"
#CODEBUILD_WEBHOOK_TRIGGER="pr/5"

# Get the name for our arc.codes instance.
if [ -n $CODEBUILD_WEBHOOK_BASE_REF ]
then
  # Strip "refs/heads/" from the GitHub ref.
  BENEFITS_RECS_INSTANCE_NAME=$(echo ${CODEBUILD_WEBHOOK_BASE_REF/refs\/heads\//} | sed 's|[^A-Za-z0-9-]|-|g' | sed -E 's|-*([A-Za-z0-9]*.*[A-Za-z0-9]+)-*|\1|')
else 
  # Provide this default if we're testing and the PR info isn't available.
  BENEFITS_RECS_INSTANCE_NAME="codebuild-test"
fi

if [ -n $CODEBUILD_WEBHOOK_TRIGGER ]
then
  # strip "pr/" from webhook trigger
  BENEFITS_RECS_PR_NUMBER=${CODEBUILD_WEBHOOK_TRIGGER/pr\//}
fi

echo "PR number: $BENEFITS_RECS_PR_NUMBER"
echo "Git branch: $BENEFITS_RECS_INSTANCE_NAME"

# Attempt to deploy. tee streams the output.
#BENEFITS_RECS_DEPLOY_OUTPUT=$(npx arc deploy | tee /dev/stderr)
#BENEFITS_RECS_DEPLOY_STATUS=$?

# If deployment failed, let's bail out here.
#if [ $BENEFITS_RECS_DEPLOY_STATUS -gt 0 ]
#then
#  echo "\001$BENEFITS_RECS_DEPLOY_OUTPUT\002"
#  exit $BENEFITS_RECS_DEPLOY_STATUS
#fi

BENEFITS_RECS_DEPLOY_OUTPUT="✓ Success! Deployed app in 55.815 seconds

    https://7ksmy2xna5.execute-api.us-west-1.amazonaws.com
"

BENEFITS_RECS_ENDPOINT_URL=$(echo "\001$BENEFITS_RECS_DEPLOY_OUTPUT\002" | tail -n 2 | xargs)
echo "\001Endpoint: $BENEFITS_RECS_ENDPOINT_URL\002"