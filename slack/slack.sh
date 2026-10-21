#!/bin/sh

SLACK_WEBHOOK_BASEURL=${SLACK_WEBHOOK_BASEURL:-}
SLACK_WEBHOOK_TOKEN_DEVELOP=${SLACK_WEBHOOK_TOKEN_DEVELOP:-}
SLACK_WEBHOOK_TOKEN_PREPROD=${SLACK_WEBHOOK_TOKEN_PREPROD:-}


if [ "$TEST_ENVIRONMENT" = "develop" ]; then
  SLACK_WEBHOOK_URL="$SLACK_WEBHOOK_BASEURL$SLACK_WEBHOOK_TOKEN_DEVELOP"
elif [ "$TEST_ENVIRONMENT" = "pre-prod" ]; then
  SLACK_WEBHOOK_URL="$SLACK_WEBHOOK_BASEURL$SLACK_WEBHOOK_TOKEN_PREPROD"
fi

echo "SLACK_WEBHOOK_URL: $SLACK_WEBHOOK_URL"
echo "TEST_ENVIRONMENT: $TEST_ENVIRONMENT"

CI_PROJECT_URL=https://gitlab.com/groupe-lucien-barriere/online-apps/jel-tests-auto/

REPORTS_JOB_ID="$(cat reports_job_id_desktop.txt)"
STATUS_JOB_ID="$(cat status_job_id_desktop.txt)"
REPORT_URL="$CI_PROJECT_URL/-/jobs/$REPORTS_JOB_ID/artifacts/external_file/playwright-report/index.html"
CI_PROJECT_URL_IO="https://groupe-lucien-barriere.gitlab.io/-/online-apps/jel-tests-auto/-/jobs/$REPORTS_JOB_ID/artifacts/playwright-report/index.html"
RESULT_DESKTOP="$(cat results_test_desktop.txt)"

REPORTS_JOB_ID_MOBILE="$(cat reports_job_id_mobile.txt)"
STATUS_JOB_ID_MOBILE="$(cat status_job_id_mobile.txt)"
REPORT_URL_MOBILE="$CI_PROJECT_URL/-/jobs/$REPORTS_JOB_ID_MOBILE/artifacts/external_file/playwright-report/index.html"
CI_PROJECT_URL_IO_MOBILE="https://groupe-lucien-barriere.gitlab.io/-/online-apps/jel-tests-auto/-/jobs/$REPORTS_JOB_ID_MOBILE/artifacts/playwright-report/index.html"
RESULT_MOBILE="$(cat results_test_mobile.txt)"

REPORTS_JOB_ID_SAFARI_MOBILE="$(cat reports_job_id_safari_mobile.txt)"
STATUS_JOB_ID_SAFARI_MOBILE="$(cat status_job_id_safari_mobile.txt)"
REPORT_URL_SAFARI_MOBILE="$CI_PROJECT_URL/-/jobs/$REPORTS_JOB_ID_SAFARI_MOBILE/artifacts/external_file/playwright-report/index.html"
CI_PROJECT_URL_IO_SAFARI_MOBILE="https://groupe-lucien-barriere.gitlab.io/-/online-apps/jel-tests-auto/-/jobs/$REPORTS_JOB_ID_SAFARI_MOBILE/artifacts/playwright-report/index.html"
RESULT_SAFARI="$(cat results_test_safari.txt)"

REPORTS_JOB_ID_WEBVIEW="$(cat reports_job_id_webview.txt)"
STATUS_JOB_ID_WEBVIEW="$(cat status_job_id_webview.txt)"
REPORT_URL_WEBVIEW="$CI_PROJECT_URL/-/jobs/$REPORTS_JOB_ID_WEBVIEW/artifacts/external_file/playwright-report/index.html"
CI_PROJECT_URL_IO_WEBVIEW="https://groupe-lucien-barriere.gitlab.io/-/online-apps/jel-tests-auto/-/jobs/$REPORTS_JOB_ID_WEBVIEW/artifacts/playwright-report/index.html"
RESULT_WEB_VIEW="$(cat results_test_web_view.txt)"

REPORTS_JOB_ID_FIREFOX="$(cat reports_job_id_firefox.txt)"
STATUS_JOB_ID_FIREFOX="$(cat status_job_id_firefox.txt)"
REPORT_URL_FIREFOX="$CI_PROJECT_URL/-/jobs/$REPORTS_JOB_ID_FIREFOX/artifacts/external_file/playwright-report/index.html"
CI_PROJECT_URL_IO_FIREFOX="https://groupe-lucien-barriere.gitlab.io/-/online-apps/jel-tests-auto/-/jobs/$REPORTS_JOB_ID_FIREFOX/artifacts/playwright-report/index.html"
RESULT_FIREFOX="$(cat results_test_firefox.txt)"

TEST_PLAN_TEXT="🧪 Résultat du test plan *$CI_COMMIT_REF_NAME*"
CI_PIPELINE_URL="https://gitlab.com/groupe-lucien-barriere/online-apps/jel-tests-auto/-/pipelines/$CI_PIPELINE_ID"

if [ "$STATUS_JOB_ID" = "success" ]; then
  STATUS_MESSAGE_DESKTOP="✅ Playwright tests view desktop passed"
  RESULT_MESSAGE_DESKTOP="👉 $RESULT_DESKTOP"
else
  STATUS_MESSAGE_DESKTOP="❌ Playwright tests view desktop failed"
  RESULT_MESSAGE_DESKTOP="👉 $RESULT_DESKTOP"
fi
   
if [ "$STATUS_JOB_ID_MOBILE" = "success" ]; then
  STATUS_MESSAGE_MOBILE="✅ Playwright tests view mobile passed"
  RESULT_MESSAGE_MOBILE="👉 $RESULT_MOBILE"
else
  STATUS_MESSAGE_MOBILE="❌ Playwright tests view mobile failed"
  RESULT_MESSAGE_MOBILE="👉 $RESULT_MOBILE"
fi

if [ "$STATUS_JOB_ID_SAFARI_MOBILE" = "success" ]; then
  STATUS_MESSAGE_SAFARI_MOBILE="✅ Playwright tests view mobile Safari passed"
  RESULT_MESSAGE_SAFARI_MOBILE="👉 $RESULT_SAFARI"
else
  STATUS_MESSAGE_SAFARI_MOBILE="❌ Playwright tests view mobile Safari failed"
  RESULT_MESSAGE_SAFARI_MOBILE="👉 $RESULT_SAFARI"
fi

if [ "$STATUS_JOB_ID_WEBVIEW" = "success" ]; then
  STATUS_MESSAGE_WEBVIEW="✅ Playwright tests web view passed"
  RESULT_MESSAGE_WEBVIEW="👉 $RESULT_WEB_VIEW"
else
  STATUS_MESSAGE_WEBVIEW="❌ Playwright tests web view failed"
  RESULT_MESSAGE_WEBVIEW="👉 $RESULT_WEB_VIEW"
fi

if [ "$STATUS_JOB_ID_FIREFOX" = "success" ]; then
  STATUS_MESSAGE_FIREFOX="✅ Playwright tests view Firefox desktop passed"
  RESULT_MESSAGE_FIREFOX="👉 $RESULT_FIREFOX"
else
  STATUS_MESSAGE_FIREFOX="❌ Playwright tests view Firefox desktop failed"
  RESULT_MESSAGE_FIREFOX="👉 $RESULT_FIREFOX"
fi

cat > payload.json <<EOF
{
  "blocks": [
        { "type": "divider" },
        {
        "type": "section",
        "text": { "type": "mrkdwn", "text": "$TEST_PLAN_TEXT" }
        },
        {
        "type": "section",
        "text": { "type": "mrkdwn", "text": "$STATUS_MESSAGE_DESKTOP" }
        },
        {
        "type": "section",
        "text": { "type": "mrkdwn", "text": "$RESULT_MESSAGE_DESKTOP" }
        },
        { "type": "divider" },
        {
        "type": "section",
        "text": {
            "type": "mrkdwn",
            "text": "Voir le rapport Playwright 🎭 vue desktop 👨‍💻 "
        },
        "accessory": {
            "type": "button",
            "text": {
            "type": "plain_text",
            "text": "Click Me",
            "emoji": true
            },
            "value": "click_me_123",
            "url": "$CI_PROJECT_URL_IO",
            "action_id": "button-action"
        }
        },
        { "type": "divider" },
        {
        "type": "section",
        "text": { "type": "mrkdwn", "text": "$STATUS_MESSAGE_MOBILE" }
        },
        {
        "type": "section",
        "text": { "type": "mrkdwn", "text": "$RESULT_MESSAGE_MOBILE" }
        },
        { "type": "divider" },
        {
        "type": "section",
        "text": {
            "type": "mrkdwn",
            "text": "Voir le rapport Playwright 🎭 vue mobile 📲 "
        },
        "accessory": {
            "type": "button",
            "text": {
            "type": "plain_text",
            "text": "Click Me",
            "emoji": true
            },
            "value": "click_me_123",
            "url": "$CI_PROJECT_URL_IO_MOBILE",
            "action_id": "button-action"
        }
        },
        { "type": "divider" },
        {
        "type": "section",
        "text": { "type": "mrkdwn", "text": "$STATUS_MESSAGE_SAFARI_MOBILE" }
        },
        {
        "type": "section",
        "text": { "type": "mrkdwn", "text": "$RESULT_MESSAGE_SAFARI_MOBILE" }
        },
        { "type": "divider" },
        {
        "type": "section",
        "text": {
            "type": "mrkdwn",
            "text": "Voir le rapport Playwright 🎭 vue safari mobile 🧭 "
        },
        "accessory": {
            "type": "button",
            "text": {
            "type": "plain_text",
            "text": "Click Me",
            "emoji": true
            },
            "value": "click_me_123",
            "url": "$CI_PROJECT_URL_IO_SAFARI_MOBILE",
            "action_id": "button-action"
        }
        },
        { "type": "divider" },
        {
        "type": "section",
        "text": { "type": "mrkdwn", "text": "$STATUS_MESSAGE_WEBVIEW" }
        },
        {
        "type": "section",
        "text": { "type": "mrkdwn", "text": "$RESULT_MESSAGE_WEBVIEW" }
        },
        { "type": "divider" },
        {
        "type": "section",
        "text": {
            "type": "mrkdwn",
            "text": "Voir le rapport Playwright 🎭 sur la web view 🧑‍💻 "
        },
        "accessory": {
            "type": "button",
            "text": {
            "type": "plain_text",
            "text": "Click Me",
            "emoji": true
            },
            "value": "click_me_123",
            "url": "$CI_PROJECT_URL_IO_WEBVIEW",
            "action_id": "button-action"
        }
        },
        { "type": "divider" },
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": "Voici le lien de la Pipeline 🦾"
            },
            "accessory": {
                "type": "button",
                "text": {
                "type": "plain_text",
                "text": "Click Me",
                "emoji": true
                },
                "value": "click_me_123",
                "url": "$CI_PIPELINE_URL",
                "action_id": "button-action"
            }
        }
    ]
}
EOF


# Envoi vers Slack
curl -X POST -H "Content-Type: application/json" \
     --data @payload.json \
     $SLACK_WEBHOOK_URL
