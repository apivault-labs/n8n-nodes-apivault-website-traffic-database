import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IHttpRequestMethods,
	IRequestOptions,
} from 'n8n-workflow';
import { NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';

const ACTOR_ID = 'apivault_labs~website-traffic-database';

export class WebsiteTrafficDatabase implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Websites by Traffic Volume 2026',
		name: 'websiteTrafficDatabase',
		icon: 'file:websitetrafficdatabase.svg',
		group: ['transform'],
		version: 1,
		description: 'The reverse of SimilarWeb: instead of one domain\'s stats, get every website in a traffic range. Filter 40M+ sites by monthly visits, category, country, rank, traffic channel, engagement, growth, or the keywords they rank for. A cheaper SimilarWeb/Semrush alternative for bulk site discovery. $5/1K.',
		defaults: { name: 'Websites by Traffic Volume 2026' },
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		usableAsTool: true,
		credentials: [{ name: 'apifyApi', required: true }],
		properties: [
   {
      "displayName": "Workflow",
      "name": "workflow",
      "description": "Choose one way to find websites. Auto-detect preserves existing integrations and uses this priority: domain lookup, similar sites, global rank, then traffic filters.",
      "type": "options",
      "options": [
         {
            "name": "Auto-detect (recommended)",
            "value": "auto"
         },
         {
            "name": "Filter by traffic",
            "value": "traffic"
         },
         {
            "name": "Top sites by global rank",
            "value": "globalRank"
         },
         {
            "name": "Look up domains",
            "value": "domains"
         },
         {
            "name": "Find similar sites",
            "value": "similarSites"
         }
      ],
      "default": "auto"
   },
   {
      "displayName": "Minimum monthly visits",
      "name": "minVisits",
      "description": "Return sites with at least this many visits in the most recent month (e.g. 1000 = 1K+ visits/month). Used only in traffic mode. If you use ‘Top sites by Global Rank’ in section ②, this field is ignored automatically — you don't need to clear it.",
      "type": "number",
      "default": 1000,
      "typeOptions": {
         "minValue": 0
      }
   },
   {
      "displayName": "Maximum monthly visits",
      "name": "maxVisits",
      "description": "Return sites with at most this many visits in the most recent month. Leave empty for no upper limit.",
      "type": "number",
      "default": 0
   },
   {
      "displayName": "Top sites worldwide (enter N, e.g. 100)",
      "name": "topGlobalRank",
      "description": "Enter 1000 to get the world's top 1000 sites — global ranks 1 through 1000, ordered from rank 1 (rank 1 = the most visited site in the world). Just fill this one field: the monthly-visits fields in ① and every optional filter in ③ (category, country, etc.) are ignored automatically, so you don't have to clear anything. Leave this empty to select by traffic instead.",
      "type": "number",
      "default": 0,
      "typeOptions": {
         "minValue": 1
      }
   },
   {
      "displayName": "Category contains",
      "name": "category",
      "description": "Keep only sites whose category contains this text (e.g. 'finance', 'health', 'games'). Category is known for a subset of sites, so this narrows results. Leave empty for all.",
      "type": "string",
      "default": ""
   },
   {
      "displayName": "Top country (code)",
      "name": "country",
      "description": "Keep only sites whose #1 visitor country matches this code (e.g. 'US', 'DE', 'GB'). Leave empty for all countries.",
      "type": "string",
      "default": ""
   },
   {
      "displayName": "Minimum search-traffic share (%)",
      "name": "minSearchShare",
      "description": "Keep only sites where organic search is at least this % of traffic (e.g. 50 = SEO-dependent sites). Leave empty to ignore.",
      "type": "number",
      "default": 0,
      "typeOptions": {
         "minValue": 0,
         "maxValue": 100
      }
   },
   {
      "displayName": "Only sites with AI/LLM traffic",
      "name": "hasAiTraffic",
      "description": "Keep only sites that get visits from AI assistants (ChatGPT, Perplexity, etc.).",
      "type": "boolean",
      "default": false
   },
   {
      "displayName": "Only growing sites",
      "name": "onlyGrowing",
      "description": "Keep only sites whose most recent month is higher than their earliest tracked month (positive trend).",
      "type": "boolean",
      "default": false
   },
   {
      "displayName": "Minimum growth (%)",
      "name": "minGrowthPercent",
      "description": "Keep only sites growing at least this % from their earliest to most recent tracked month (e.g. 20 = fast-growing / trending sites). Leave empty to ignore.",
      "type": "number",
      "default": 0
   },
   {
      "displayName": "Ranks for keyword",
      "name": "keyword",
      "description": "Keep only sites that have this keyword among their top search keywords (reverse keyword lookup, e.g. 'crypto wallet'). Best combined with other filters. Leave empty to ignore.",
      "type": "string",
      "default": ""
   },
   {
      "displayName": "Traffic channel",
      "name": "trafficSource",
      "description": "Which traffic channel to filter by (used together with 'Minimum channel share' below). E.g. pick 'social' + 40 to find sites where social is 40%+ of traffic.",
      "type": "options",
      "options": [
         {
            "name": "Organic search",
            "value": "search"
         },
         {
            "name": "Direct",
            "value": "direct"
         },
         {
            "name": "Social",
            "value": "social"
         },
         {
            "name": "Referral",
            "value": "referral"
         },
         {
            "name": "Email",
            "value": "mail"
         },
         {
            "name": "Paid ads",
            "value": "ads"
         },
         {
            "name": "AI / LLM",
            "value": "ai"
         }
      ],
      "default": "search"
   },
   {
      "displayName": "Minimum channel share (%)",
      "name": "minSourceShare",
      "description": "Keep only sites where the chosen 'Traffic channel' is at least this % of total traffic (e.g. 40). Leave empty to ignore this filter.",
      "type": "number",
      "default": 0,
      "typeOptions": {
         "minValue": 0,
         "maxValue": 100
      }
   },
   {
      "displayName": "Maximum bounce rate (%)",
      "name": "maxBounce",
      "description": "Keep only sites with a bounce rate at or below this % (lower = more engaged visitors, e.g. 40). Leave empty to ignore.",
      "type": "number",
      "default": 0,
      "typeOptions": {
         "minValue": 0,
         "maxValue": 100
      }
   },
   {
      "displayName": "Minimum pages per visit",
      "name": "minPagesPerVisit",
      "description": "Keep only sites where visitors view at least this many pages per visit (engagement, e.g. 3). Leave empty to ignore.",
      "type": "number",
      "default": 0,
      "typeOptions": {
         "minValue": 0
      }
   },
   {
      "displayName": "Minimum time on site (seconds)",
      "name": "minTimeOnSite",
      "description": "Keep only sites with an average visit duration of at least this many seconds (e.g. 120 = 2 min). Leave empty to ignore.",
      "type": "number",
      "default": 0,
      "typeOptions": {
         "minValue": 0
      }
   },
   {
      "displayName": "Max results",
      "name": "maxResults",
      "description": "Maximum number of websites to return — this is also your cost control, since you pay per result. Up to 50,000 are returned as an accurate global top-N; larger values (up to 1,000,000) switch to a streaming bulk export for full-list pulls.",
      "type": "number",
      "default": 25,
      "typeOptions": {
         "minValue": 1,
         "maxValue": 1000000
      }
   },
   {
      "displayName": "Sort by",
      "name": "sortBy",
      "description": "Which field to sort results by.",
      "type": "options",
      "options": [
         {
            "name": "Monthly visits",
            "value": "visits"
         },
         {
            "name": "Global rank",
            "value": "global_rank"
         },
         {
            "name": "Bounce rate",
            "value": "bounce"
         },
         {
            "name": "Pages per visit",
            "value": "pages"
         },
         {
            "name": "Time on site",
            "value": "time_on_site"
         },
         {
            "name": "Category rank",
            "value": "category_rank"
         },
         {
            "name": "Country rank",
            "value": "country_rank"
         },
         {
            "name": "AI visits",
            "value": "ai_visits"
         }
      ],
      "default": "visits"
   },
   {
      "displayName": "Sort order",
      "name": "sortOrder",
      "description": "Highest first (descending) or lowest first (ascending).",
      "type": "options",
      "options": [
         {
            "name": "Descending (highest first)",
            "value": "desc"
         },
         {
            "name": "Ascending (lowest first)",
            "value": "asc"
         }
      ],
      "default": "desc"
   },
   {
      "displayName": "Output detail",
      "name": "outputPreset",
      "description": "Compact returns core traffic and ranking facts. Outreach adds engagement, growth and channel mix. Full keeps monthly history, countries, keywords and every available field. Calls that omit this field retain the legacy full output.",
      "type": "options",
      "options": [
         {
            "name": "Compact — AI friendly",
            "value": "compact"
         },
         {
            "name": "Outreach — recommended",
            "value": "outreach"
         },
         {
            "name": "Full — every field",
            "value": "full"
         }
      ],
      "default": "outreach"
   },
   {
      "displayName": "Domains to look up",
      "name": "domains",
      "description": "Enter one or more domains (e.g. 'stripe.com', 'https://www.nike.com/') to get their traffic data directly. Only domains already tracked in the database return a row. When you fill this, the filter fields above are ignored. (comma or new-line separated)",
      "type": "string",
      "default": ""
   },
   {
      "displayName": "Find competitors of this domain",
      "name": "similarTo",
      "description": "Enter ONE domain (e.g. 'stripe.com') to get its competitors: other sites in the same category with comparable monthly traffic. The domain must be in the database and have a known category. When you fill this, everything above is ignored.",
      "type": "string",
      "default": ""
   }
],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		for (let i = 0; i < items.length; i++) {
			try {
				const body: Record<string, unknown> = {};
				body["workflow"] = this.getNodeParameter("workflow", i);
				body["minVisits"] = this.getNodeParameter("minVisits", i);
				body["maxVisits"] = this.getNodeParameter("maxVisits", i);
				body["topGlobalRank"] = this.getNodeParameter("topGlobalRank", i);
				body["category"] = this.getNodeParameter("category", i);
				body["country"] = this.getNodeParameter("country", i);
				body["minSearchShare"] = this.getNodeParameter("minSearchShare", i);
				body["hasAiTraffic"] = this.getNodeParameter("hasAiTraffic", i);
				body["onlyGrowing"] = this.getNodeParameter("onlyGrowing", i);
				body["minGrowthPercent"] = this.getNodeParameter("minGrowthPercent", i);
				body["keyword"] = this.getNodeParameter("keyword", i);
				body["trafficSource"] = this.getNodeParameter("trafficSource", i);
				body["minSourceShare"] = this.getNodeParameter("minSourceShare", i);
				body["maxBounce"] = this.getNodeParameter("maxBounce", i);
				body["minPagesPerVisit"] = this.getNodeParameter("minPagesPerVisit", i);
				body["minTimeOnSite"] = this.getNodeParameter("minTimeOnSite", i);
				body["maxResults"] = this.getNodeParameter("maxResults", i);
				body["sortBy"] = this.getNodeParameter("sortBy", i);
				body["sortOrder"] = this.getNodeParameter("sortOrder", i);
				body["outputPreset"] = this.getNodeParameter("outputPreset", i);
				{ const _v = this.getNodeParameter("domains", i, '') as string; const _a = _v.split(/[,\n]/).map(s=>s.trim()).filter(s=>s.length>0); if (_a.length) body["domains"] = _a; }
				body["similarTo"] = this.getNodeParameter("similarTo", i);
				const options: IRequestOptions = {
					method: 'POST' as IHttpRequestMethods,
					url: `https://api.apify.com/v2/acts/${ACTOR_ID}/runs`,
					body,
					json: true,
				};
				const started = await this.helpers.requestWithAuthentication.call(this, 'apifyApi', options);
				const runId = started?.data?.id;
				if (!runId) throw new NodeOperationError(this.getNode(), 'Apify did not return a run ID', { itemIndex: i });
				let run = started.data;
				const deadline = Date.now() + 60 * 60 * 1000;
				while (!['SUCCEEDED', 'FAILED', 'ABORTED', 'TIMED-OUT'].includes(run.status)) {
					if (Date.now() >= deadline) throw new NodeOperationError(this.getNode(), 'Waiting timed out; check the existing run in Apify before retrying', { itemIndex: i });
					const polled = await this.helpers.requestWithAuthentication.call(this, 'apifyApi', { method: 'GET', url: `https://api.apify.com/v2/actor-runs/${runId}?waitForFinish=20`, json: true });
					run = polled.data;
				}
				if (run.status !== 'SUCCEEDED') throw new NodeOperationError(this.getNode(), 'Apify run ended with status ' + run.status, { itemIndex: i });
				let offset = 0;
				while (true) {
					const page = await this.helpers.requestWithAuthentication.call(this, 'apifyApi', { method: 'GET', url: `https://api.apify.com/v2/datasets/${run.defaultDatasetId}/items?clean=1&limit=1000&offset=${offset}`, json: true });
					if (!Array.isArray(page)) throw new NodeOperationError(this.getNode(), 'Unexpected Dataset response', { itemIndex: i });
					for (const result of page) returnData.push({ json: result as IDataObject, pairedItem: { item: i } });
					offset += page.length;
					if (page.length < 1000) break;
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: (error as Error).message }, pairedItem: { item: i } });
					continue;
				}
				throw new NodeOperationError(this.getNode(), error as Error, { itemIndex: i });
			}
		}
		return [returnData];
	}
}
