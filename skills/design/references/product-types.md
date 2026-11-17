# Product types: which steps to recommend

R = recommended, O = optional (not recommended by default), S = skip by default. Show R as "(Recommended)"; list O steps too, unmarked; leave S steps out of the first call but say they exist.

| Step | Software app (SaaS) | Mobile app | Marketplace or e-commerce | Content site | Internal tool | AI product |
|---|---|---|---|---|---|---|
| Discovery |  |  |  |  |  |  |
| problem-framing | R | R | R | R | R | R |
| interviews | R | R | R | O | R | R |
| competitive-audit | R | R | R | R | S | R |
| users-jtbd | R | R | R | O | R | R |
| Definition |  |  |  |  |  |  |
| scope-metrics | R | R | R | R | R | R |
| stories-mvp | R | R | R | O | R | R |
| info-architecture | R | O | R | R | O | O |
| user-flows | R | R | R | O | R | R |
| Design |  |  |  |  |  |  |
| wireframes | R | R | R | R | R | R |
| design-system | R | R | R | O | O | O |
| ui-prototype | R | R | R | R | O | R |
| usability-testing | R | R | R | O | O | R |
| handoff | R | R | R | R | R | R |
| Launch |  |  |  |  |  |  |
| qa-accessibility | R | R | R | R | R | R |
| analytics-plan | R | R | R | R | O | R |
| launch-plan | R | R | R | R | S | R |

## Extra steps by type (call 2)
Cards are in `steps-extras.md`.
- Software app: pricing-packaging, onboarding-activation
- Mobile app: platform-guidelines, store-listing
- Marketplace or e-commerce: supply-demand, trust-payments, catalog-checkout
- Content site: content-model, seo-discovery
- Internal tool: process-mapping, roles-rollout
- AI product: ai-feasibility, safety-failure

## Where are you now
- **Just an idea:** start at problem-framing.
- **Problem is validated:** mark problem-framing and interviews as done only if the person confirms they have the notes; ask them to attach or paste a summary, and use it as the input to the next step.
- **I have designs or a prototype:** leave Discovery and Definition unticked unless the person ticks them; recommend usability-testing and handoff.
- **Already built, improving it:** recommend problem-framing, users-jtbd, analytics-plan, usability-testing and qa-accessibility only (add handoff if they want the code skill to rebuild or extend it); the rest stay optional.

## Audience and team
- Internal staff only: drop competitive-audit and launch-plan; point to roles-rollout instead.
- Solo: mark usability-testing and analytics-plan "light" (a one-page version) and say so in the plan.
- Larger team: add a line in each output for who owns the decision.
