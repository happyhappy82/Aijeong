# Aijeong Notion to WordPress Publish

This workflow publishes one Notion page from the AJEONG column or education-case databases to WordPress.

## Notion Flow

1. Write the page in Notion and keep `Status` as `Review`.
2. When ready, change `Status` to `Published`.
3. Trigger the GitHub Action with the page ID and route type.
4. The Action publishes through the WordPress REST API.
5. The Action writes the result back to Notion:
   - `WP Post ID`
   - `WP URL`
   - `Published At`
   - `Publish Error`

The publisher refuses to run unless the Notion page status is exactly `Published`.

## GitHub Action

Workflow file:

```text
.github/workflows/notion-wp-publish.yml
```

Required GitHub secrets:

```text
NOTION_API_KEY
AIJEONG_WP_USER
AIJEONG_WP_APP_PASSWORD
```

Optional GitHub variable:

```text
AIJEONG_WP_BASE_URL=https://aijeong.com
```

Manual run inputs:

```text
type: column | edu
notion_page_id: Notion page ID
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

Notion webhook actions can send POST requests and custom headers, but database button payloads cannot be freely shaped into the JSON body GitHub's dispatch API requires. Because of that, the reliable production setup is:

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

If a direct Notion database automation is used instead of a database button, first verify the outgoing payload through a request inspection endpoint before pointing it at GitHub.

References:

- Notion database automations: https://www.notion.com/help/database-automations
- Notion buttons: https://www.notion.com/help/buttons
- GitHub repository dispatch API: https://docs.github.com/en/rest/repos/repos#create-a-repository-dispatch-event
- GitHub workflow dispatch API: https://docs.github.com/en/rest/actions/workflows#create-a-workflow-dispatch-event
