# Build and launch steps

## handoff-specs: Handoff specs
- **Purpose:** give builders everything they need without guessing.
- **Ask:** the stack or platform if known; who builds it.
- **Research:** none.
- **Write:** per screen or component: purpose, states (default, hover on pointer devices, focus, pressed, disabled, error, empty, loading), content limits, tokens by name, behavior, and accessibility (role, keyboard, focus, labels). Keep spacing on the 4-point scale (4, 8, 12, 16, 20, 24, 32) and touch targets at 44px or more. Link to the design system README.
- **Site:** component entries (Browse) list anatomy, states and accessibility for reuse. Optional.
- **Done when:** a developer could build each MVP story from the specs and the design system alone.

## qa-accessibility: QA and accessibility checklist
- **Purpose:** decide what must pass before release.
- **Ask:** target standard (WCAG AA is the default); browsers and devices to cover.
- **Research:** web only if the person wants current standards or store requirements checked; run the research handoff first.
- **Write:** a checklist with: contrast (4.5:1 text, 3:1 large text and UI) in each theme; keyboard reach and visible focus; labels and names; error messages that say how to fix the problem; reduced motion; target size; text resizing; color not used alone; plus functional, content, performance and device checks, and a release gate (what blocks a launch).
- **Site:** the site's contrast checker and guides (accessibility basics, contrast and WCAG). Optional.
- **Done when:** each item is pass or fail and one person owns the sign-off.

## analytics-plan: Analytics plan
- **Purpose:** decide what to measure so the success metrics can be answered.
- **Ask:** the tools already in use, if any; privacy constraints.
- **Research:** none.
- **Write:** the metrics from scope-metrics with a definition and where each is measured, the events to track (name, trigger, properties), a naming convention, dashboards to build first, a privacy and consent note, and the first review date. Solo: the 5 events that answer the main metric.
- **Done when:** every success metric has an event or a manual source.

## launch-plan: Launch plan
- **Purpose:** get the product to the first users and learn fast.
- **Ask:** the first audience and size; channels already available; date.
- **Research:** web only if the person wants channel or timing research; run the research handoff first.
- **Write:** launch type (private beta, soft launch, public), the audience and how to reach them, messaging (one line plus 3 proof points), a checklist for the week before and after, support plan, a rollback plan, and what you will measure in the first 30 days.
- **Done when:** there are dates, owners and a rollback decision.
