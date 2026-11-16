# Extra steps by product type

Short cards. Same fields as the other step files. Place each step after the one named in "After".

## pricing-packaging (software app) . After: scope-metrics
Research: web (comparable pricing; run the handoff). Ask: the buyer and who pays; free tier or trial. Write: 2 to 3 packaging options, what each includes, the value metric, risks, and what to test first. Done when: one option is chosen to test.

## onboarding-activation (software app) . After: user-flows
Research: none. Ask: the moment a new person first gets value. Write: the first-run flow, the "activation" event, empty states, and prompts. Done when: the path from sign-up to first value has no more than the needed steps.

## platform-guidelines (mobile app) . After: info-architecture
Research: web (current platform design guidance; run the handoff). Ask: iOS, Android or both. Write: navigation, gesture, sheet and alert patterns for each platform, and where the product will deliberately differ. Done when: each platform choice has a reason.

## store-listing (mobile app) . After: launch-plan
Research: web (current listing and review requirements; run the handoff). Ask: markets and languages. Write: name and subtitle options, description, screenshot plan, privacy details, and a review-readiness checklist. Done when: every required field is drafted.

## supply-demand (marketplace) . After: scope-metrics
Research: web optional. Ask: which side is harder to get. Write: the cold-start plan (who first, how, incentives), liquidity metric, and the minimum viable market. Done when: there is a plan for the first 20 transactions.

## trust-payments (marketplace) . After: user-flows
Research: web (payments, fees, local rules; run the handoff). Ask: what is exchanged and where. Write: identity and review model, dispute flow, payment flow and fees, abuse cases, and what needs legal advice (flag it; do not give legal conclusions). Done when: each risk has an owner or a decision.

## catalog-checkout (marketplace or e-commerce) . After: user-flows
Research: none. Ask: item types, variants, shipping or delivery. Write: the catalog model, search and filters, cart and checkout steps, error and out-of-stock states. Done when: a purchase can be traced from search to confirmation.

## content-model (content site) . After: info-architecture
Research: none. Ask: the content types and who writes them. Write: each type's fields, relationships, the editorial workflow, and an example entry. Done when: each page in the tree maps to a content type.

## seo-discovery (content site) . After: info-architecture
Research: web (search intent for the main topics; run the handoff). Ask: the main topics. Write: keyword groups per page, titles and descriptions, internal links, a technical checklist. Done when: every key page has a target topic.

## process-mapping (internal tool) . After: problem-framing
Research: none. Ask: the current process, who touches it, where it breaks. Write: an as-is process map with steps, owners, handoffs and delays, and the steps the tool will change. Done when: the owner confirms the map is accurate.

## roles-rollout (internal tool) . After: handoff-specs
Research: none. Ask: roles, data sensitivity, how people will switch. Write: roles and permissions table, a rollout plan (pilot group, training, cutover, fallback), and a feedback loop. Done when: each role's access is explicit.

## ai-feasibility (AI product) . After: scope-metrics
Research: web (current model capabilities and costs; run the handoff). Ask: what the AI decides or generates; acceptable error rate. Write: tasks the AI will do, data needed, a small evaluation set plan (examples, pass rules), cost and latency estimate, and a non-AI fallback. Done when: there is a test that could prove the idea wrong.

## safety-failure (AI product) . After: user-flows
Research: web optional. Ask: harm if the AI is wrong; what data it sees. Write: failure modes, how the interface shows uncertainty, human review points, privacy handling, feedback and correction flows. Done when: each failure mode has a design response.
