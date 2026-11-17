# Definition steps

## scope-metrics: Scope and success metrics (a short PRD)
- **Purpose:** agree what the first version includes and how success is measured.
- **Ask:** launch date or constraint; the one metric that matters most (3 options plus Other); must-have constraints (budget, platform, legal).
- **Research:** none.
- **Write:** goals, non-goals, scope for version 1, success metrics with a target and how each is measured, constraints, risks (top 3), open questions.
- **Done when:** every goal has a metric or is marked as qualitative.

## stories-mvp: User stories and the MVP cut
- **Purpose:** list what people must be able to do and cut to the smallest useful release.
- **Ask:** nothing new unless the earlier outputs are missing; confirm the main users.
- **Research:** none.
- **Write:** stories in the form "As a <user> I can <action> so that <outcome>" with acceptance criteria, grouped into Must, Should, Later. Mark the MVP line. Flag stories that depend on each other.
- **Done when:** the Must group fits the constraints from scope-metrics.

## info-architecture: Information architecture
- **Purpose:** decide how content and features are grouped, named and reached.
- **Ask:** the main objects people work with (free text); whether people browse, search or both.
- **Research:** none (offer the competitive audit's naming if it exists).
- **Write:** a sitemap or navigation tree (indented list), labels with one-line meanings, the primary navigation pattern, and what lives where on mobile versus desktop.
- **Done when:** every MVP story has a place to start from in the tree.

## user-flows: Key user flows
- **Purpose:** map the paths for the most important tasks, including errors and empty states.
- **Ask:** the 3 most important tasks (pick from the MVP stories).
- **Research:** none.
- **Write:** for each task, numbered steps with decisions and failure paths, entry and exit points, and the screens or states each step needs. Offer a diagram if the person wants one (Mermaid text).
- **Done when:** each flow has a happy path, one error path and one empty or first-time state.
