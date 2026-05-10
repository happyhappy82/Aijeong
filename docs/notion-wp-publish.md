# Aijeong Notion to WordPress Publish

This workflow is a manual/dispatch fallback for publishing one Notion page from the AJEONG column or education-case databases to WordPress.

The normal one-click path is the existing Notion database button:

```text
Notion button -> Make webhook -> GitHub/WordPress publisher
```

Do not ask the user for a WordPress account/password in a normal Codex session. WordPress credentials must already live in the downstream automation layer. If this fallback workflow is used directly, those credentials must exist as GitHub Secrets.

## Notion Flow

1. Write the page in Notion and keep `Status` as `Review`.
2. When ready, change `Status` to `Published`.
3. Upload the thumbnail to `대표 이미지` if the post needs a featured image.
4. Click the Notion database button. The button sends the selected properties, including `대표 이미지`, to the existing webhook and also sets `Publish Requested` to checked.
5. The publisher writes the result back to Notion and clears `Publish Requested`:
   - `WP Post ID`
   - `WP URL`
   - `Published At`
   - `Publish Error`

The publisher refuses to publish unless the Notion page status is exactly `Published`.

## GitHub Action

Workflow file:

```text
.github/workflows/notion-wp-publish.yml
```

Required GitHub secrets for this fallback workflow:

```text
NOTION_API_KEY
AIJEONG_WP_USER
AIJEONG_WP_APP_PASSWORD
```

Optional GitHub variable:

```text
AIJEONG_WP_BASE_URL=https://aijeong.com
```

Manual run inputs for one page:

```text
mode: single
type: column | edu
notion_page_id: Notion page ID
```

Manual run inputs for scan mode:

```text
mode: scan
type: all | column | edu
notion_page_id: leave empty
```

Repository dispatch payload:

```json
{
  "event_type": "publish-aijeong-wp",
  "client_payload": {
    "type": "column",
    "notion_page_id": "NOTION_PAGE_ID"
  }
}
```

## Notion Button Wiring

The AJEONG column and education-case database buttons are wired to send a webhook. The selected payload should include:

```text
Title
대표 이미지
Date
Excerpt
Slug
Status
Tags
```

The button also edits the current page:

```text
Publish Requested -> checked
```

The reliable webhook setup is:

```text
Notion button -> small webhook bridge -> GitHub repository_dispatch -> GitHub Actions -> WP REST API
```

The bridge must call:

```text
POST https://api.github.com/repos/happyhappy82/Aijeong/dispatches
```

with:

```json
{
  "event_type": "publish-aijeong-wp",
  "client_payload": {
    "type": "column or edu",
    "notion_page_id": "clicked page id"
  }
}
```

GitHub token permission needed for repository dispatch:

```text
Contents: Read and write
```

If a different Notion database automation is used instead of the existing database button, first verify the outgoing payload through a request inspection endpoint before pointing it at GitHub.

References:

- Notion database automations: https://www.notion.com/help/database-automations
- Notion buttons: https://www.notion.com/help/buttons
- GitHub repository dispatch API: https://docs.github.com/en/rest/repos/repos#create-a-repository-dispatch-event
- GitHub workflow dispatch API: https://docs.github.com/en/rest/actions/workflows#create-a-workflow-dispatch-event
