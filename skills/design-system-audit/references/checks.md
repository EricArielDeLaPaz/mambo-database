# Audit checks

Scripts cover rows marked [script]. Judge the rest by opening at most 5 representative files or components.

## Tokens
- [script] Contrast: Text and Text secondary on Background and Surface 4.5:1; Inverse text on Primary 4.5:1; Link 4.5:1; Primary, Border, feedback colors as UI 3:1. Checked in every theme found.
- [script] Color count 6 to 16 per theme. Dark theme exists.
- Role names follow Primary, Secondary, Tertiary, Accent / Background, Surface, Surface variant, Neutral, Border, Text, Text secondary, Inverse text, Disabled, Overlay / Success, Warning, Danger, Info / Link, Highlight. Names that describe the color ("blue-500") instead of the job are a finding.
- Two layers: raw values then roles (and optionally component tokens). Components should use roles, not raw values.
- Every token has a one-line purpose (that is what lets an AI remember it).

## Code
- [script] Hardcoded hex outside token definitions; whether a token with that value exists.
- [script] Spacing off the 4-point scale (4, 8, 12, 16, 20, 24, 32, then multiples of 8).
- [script] Too many radii (over 5), font sizes (over 8), weights (over 4), families (over 3).
- [script] Hover without focus styles; removed outlines; motion without prefers-reduced-motion; no dark mode.
- Touch targets at least 44px on touch platforms.
- Color is never the only signal (errors, status, charts).
- Text can scale to 200% without clipping; body text 16px or larger on mobile.

## Components (sample up to 5)
- States exist and look different: default, hover (not touch-only), focus (always), pressed, disabled, plus loading or error where relevant.
- Focus ring is visible against every background it sits on (3:1).
- Right element and ARIA: buttons are buttons, labeled inputs, dialogs trap focus and return it, tabs and menus have keyboard support.
- Variants are named by meaning (primary, destructive), not by look.
- Each has when to use, when not to use, anatomy and tokens used. Missing docs is a finding.

## Consistency
- The same job looks the same everywhere (one primary button style, one card radius).
- Duplicates: two components doing one job; detached or overridden instances (Figma).
- Interface inventory (Brad Frost): list the distinct treatments of each component (every kind of button, field, card) side by side; more than a few for one job is duplication to merge.
- Unused tokens and components (count with a search, do not guess).

Severity: error = fails a stated minimum or blocks use (contrast, no focus, keyboard trap). warn = drift or inconsistency. info = missing nice-to-have.

## What not to flag
- A raw value that is intentional: a brand color used once in a logo, an illustration, a third-party embed, or a value inside the tokens file that defines it.
- A one-off spacing value with a comment explaining it (optical alignment), or a value inside a vendored or generated file.
- Naming style you would have chosen differently when the system is internally consistent.
- Anything you only suspect from a name. "This looks custom" is not evidence.

## Evidence standard
- Good: file and line, the raw value beside a token that exists, the same pattern tokenized elsewhere in the project, a computed contrast ratio.
- Weak: a guess about intent, a rule from another system, a count with no examples. Do not report these; list them under "Not verified".
- Consolidate systemic findings: if 40 lines break one rule, report one finding with the count and 3 examples, not 40 findings.
- Rank by user impact (accessibility, then drift, then consistency). Prefer the cheaper fix when two fixes solve the same problem.
- Review without mutating: do not edit files until the person approves the plan.
