# n8n-nodes-apivault-website-traffic-database

An [n8n](https://n8n.io) community node for **Websites by Traffic Volume 2026**, powered by the [`apivault_labs/website-traffic-database` Apify Actor](https://apify.com/apivault_labs/website-traffic-database).

The reverse of SimilarWeb: instead of one domain's stats, get every website in a traffic range. Filter 40M+ sites by monthly visits, category, country, rank, traffic channel, engagement, growth, or the keywords they rank for. A cheaper SimilarWeb/Semrush alternative for bulk site discovery. $5/1K.

The node is a thin connector: collection, analysis, retries and billing run in the hosted Actor. It contains no private scraper implementation or embedded credentials.

## Installation

1. Open **Settings → Community Nodes** in your n8n instance.
2. Select **Install**.
3. Enter `n8n-nodes-apivault-website-traffic-database` and confirm.

## Credentials

Create an **Apify API** credential in n8n and paste your personal token from [Apify Console → Integrations](https://console.apify.com/account/integrations). The token is sent to Apify as a bearer credential and is never bundled with this package.

## Usage

Add **Websites by Traffic Volume 2026** to a workflow, fill the public Actor inputs below, and execute the node. Every Dataset result becomes one n8n item, so it can flow into Sheets, databases, CRMs, alerts or your own code. The node respects n8n's **Continue On Fail** behavior.

## Ready-to-import workflow

Import [`examples/quickstart-workflow.json`](examples/quickstart-workflow.json), select your Apify API credential in the Actor node, replace the sample business inputs and run it. The workflow returns destination-ready rows without exposing Actor internals.

| Input | Type | Description |
|---|---|---|
| `workflow` | `string` | Choose one way to find websites. Auto-detect preserves existing integrations and uses this priority: domain lookup, similar sites, global rank, then traffic filters. |
| `minVisits` | `integer` | Return sites with at least this many visits in the most recent month (e.g. 1000 = 1K+ visits/month). Used only in traffic mode. If you use ‘Top sites by Global Rank’ in section ②,  |
| `maxVisits` | `integer` | Return sites with at most this many visits in the most recent month. Leave empty for no upper limit. |
| `topGlobalRank` | `integer` | Enter 1000 to get the world's top 1000 sites — global ranks 1 through 1000, ordered from rank 1 (rank 1 = the most visited site in the world). Just fill this one field: the monthly |
| `category` | `string` | Keep only sites whose category contains this text (e.g. 'finance', 'health', 'games'). Category is known for a subset of sites, so this narrows results. Leave empty for all. |
| `country` | `string` | Keep only sites whose #1 visitor country matches this code (e.g. 'US', 'DE', 'GB'). Leave empty for all countries. |
| `minSearchShare` | `integer` | Keep only sites where organic search is at least this % of traffic (e.g. 50 = SEO-dependent sites). Leave empty to ignore. |
| `hasAiTraffic` | `boolean` | Keep only sites that get visits from AI assistants (ChatGPT, Perplexity, etc.). |
| `onlyGrowing` | `boolean` | Keep only sites whose most recent month is higher than their earliest tracked month (positive trend). |
| `minGrowthPercent` | `integer` | Keep only sites growing at least this % from their earliest to most recent tracked month (e.g. 20 = fast-growing / trending sites). Leave empty to ignore. |
| `keyword` | `string` | Keep only sites that have this keyword among their top search keywords (reverse keyword lookup, e.g. 'crypto wallet'). Best combined with other filters. Leave empty to ignore. |
| `trafficSource` | `string` | Which traffic channel to filter by (used together with 'Minimum channel share' below). E.g. pick 'social' + 40 to find sites where social is 40%+ of traffic. |
| `minSourceShare` | `integer` | Keep only sites where the chosen 'Traffic channel' is at least this % of total traffic (e.g. 40). Leave empty to ignore this filter. |
| `maxBounce` | `integer` | Keep only sites with a bounce rate at or below this % (lower = more engaged visitors, e.g. 40). Leave empty to ignore. |
| `minPagesPerVisit` | `integer` | Keep only sites where visitors view at least this many pages per visit (engagement, e.g. 3). Leave empty to ignore. |
| `minTimeOnSite` | `integer` | Keep only sites with an average visit duration of at least this many seconds (e.g. 120 = 2 min). Leave empty to ignore. |
| `maxResults` | `integer` | Maximum number of websites to return — this is also your cost control, since you pay per result. Up to 50,000 are returned as an accurate global top-N; larger values (up to 1,000,0 |
| `sortBy` | `string` | Which field to sort results by. |
| `sortOrder` | `string` | Highest first (descending) or lowest first (ascending). |
| `outputPreset` | `string` | Compact returns core traffic and ranking facts. Outreach adds engagement, growth and channel mix. Full keeps monthly history, countries, keywords and every available field. Calls t |
| `domains` | `array` | Enter one or more domains (e.g. 'stripe.com', 'https://www.nike.com/') to get their traffic data directly. Only domains already tracked in the database return a row. When you fill  |
| `similarTo` | `string` | Enter ONE domain (e.g. 'stripe.com') to get its competitors: other sites in the same category with comparable monthly traffic. The domain must be in the database and have a known c |

## Pricing

The package is free. Actor runs are billed by Apify using the pricing shown on the [Actor page](https://apify.com/apivault_labs/website-traffic-database); platform usage may also apply.

## Resources

- [Actor and live input schema](https://apify.com/apivault_labs/website-traffic-database)
- [Source repository](https://github.com/apivault-labs/n8n-nodes-apivault-website-traffic-database)
- [n8n community-node documentation](https://docs.n8n.io/integrations/community-nodes/)

## License

MIT. The hosted Actor is a separate paid service governed by Apify terms.
