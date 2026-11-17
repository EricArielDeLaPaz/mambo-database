# Build rules

## Shape of the work
- **Vertical slice:** one thin path through every layer a person can use, not all markup first and all logic later. Finish it before starting the next.
- **Simplicity first:** the smallest change that satisfies the acceptance lines. No abstraction until the same shape appears three times. Prefer deleting to adding.
- **Scope:** if you notice something outside the slice, write it in `progress.md` under "Noticed", do not fix it now.
- **Keep it runnable:** after every slice the project builds and the page loads with no console errors.
- **Reuse first:** search the project for an existing component, token or helper before writing one. Mambo ids in the handoff map to the entries at https://ericarieldelapaz.github.io/mambo-database/ (anatomy, states, accessibility).

## Tokens and spacing
- Colors, radii, type sizes, shadows and spacing come from the tokens file by name. No raw hex, rgb(), or `p-[13px]`.
- Spacing steps: 4, 8, 12, 16, 20, 24, 32, then multiples of 8. Touch targets 44px or more. Line length 45 to 75 characters for body text.
- Dark mode: define the dark values on the same token names; components never branch on theme.

## States (every one the screen spec lists)
default, hover (pointer devices only), focus-visible, pressed, disabled, error, empty, loading, success. A data screen without loading, empty and error is unfinished. Empty and error text says what happened and what to do next.

## Accessibility (build it in, then check)
- Native elements first: `button`, `a`, `input` with `label`, `nav`, `main`, headings in order, one `h1`.
- Every interactive element reachable and operable by keyboard in a logical order; focus ring visible (never `outline: none` without a replacement); modals trap and restore focus.
- Names and errors: accessible names for icon-only controls, errors tied to fields, status changes announced politely.
- Color is never the only signal. Respect `prefers-reduced-motion`. Text resizes to 200% without loss.
- Contrast 4.5:1 text, 3:1 large text and UI parts, in light and dark.

## Responsive
Mobile first. Check at 320, 768, 1024 and 1440 pixels. No horizontal page scroll at 320. Layout changes come from the screen spec, not guesses.

## Avoid the generic AI look
Purple or indigo by default; gradients everywhere; maximum rounding on everything; a generic hero; lorem ipsum; equal huge padding; uniform card grids; heavy layered shadows. Use the design system's actual choices and the spec's real content.

## Rationalizations to refuse
| Thought | Instead |
|---|---|
| "I'll add the states later" | They are part of the slice. |
| "Close enough to the spec" | Match it or write the difference in `progress.md`. |
| "A hardcoded value is faster" | Use the token; if none fits, ask for one. |
| "It is only a prototype" | Prototypes get shipped. Same rules. |
| "I'll skip the check, it looks fine" | Run it; looking is not evidence. |

## Red flags (stop and fix)
Component over 200 lines; inline styles with pixel values; missing empty, loading or error state; focus style removed; color as the only error signal; a new dependency nobody asked for.
