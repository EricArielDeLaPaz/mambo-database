---
id: javascript-basics
title: JavaScript basics for designers
summary: What JavaScript does on a web page, how it reacts to clicks and keys, and what designers should know about states, accessibility and hand-off.
topic: HTML & CSS
level: Beginner
order: 14
---

JavaScript is the language that makes a page **do things**.[^12] This guide is a pretty cool extra, not required reading. A little knowledge helps you design states and have better conversations with engineers.

## Back to the house

In [HTML basics](#/guide/html-basics) the page was a house. HTML is the frame and rooms, and [CSS](#/guide/css-basics) is the paint, furniture and lighting. JavaScript is the **electricity and plumbing**. You do not see it, but when you flip a switch, something happens: a light turns on, a tap runs, a menu opens.

## What JavaScript is and is not

- It **is** a programming language that runs in the browser and can change the page after it loads.
- It **is not** Java, which is a different language with a confusingly similar name.[^12]
- It **is not** for looks. Colors, spacing and type belong to CSS.
- It **is not** for meaning. What something is belongs to HTML.

A good rule: if it is about what a thing **is**, use HTML. If it is about how it **looks**, use CSS. If it is about what it **does**, use JavaScript.

## Where it runs

JavaScript runs in the visitor's browser, on their device. It waits quietly until something happens, then reacts. Because it runs on their device, it can respond instantly, without reloading the page.

## Events: things that happen

An **event** is something the visitor does, or something the browser notices.

| Event | When it fires |
| --- | --- |
| `click` | Mouse click, tap, or Enter or Space on a button[^1] |
| `mouseenter` | Pointer moves over an element (hover)[^2] |
| `keydown` | A key is pressed[^3] |
| `focus` | An element receives keyboard focus[^4] |
| `submit` | A form is sent[^5] |

JavaScript **listens** for an event and then runs some code. That is the light switch in the analogy.

## How it changes the page

Once an event fires, JavaScript can change the page in a few common ways.

- **Show or hide** something, like a menu or a dialog.
- **Toggle a class**, which lets CSS do the visual work. This is the most common and cleanest approach.
- **Update text**, like "3 items in your cart" or an error message.
- **Change an attribute**, like `aria-expanded` or `disabled`.

## The tiny vocabulary

Four ideas cover most of what you will read.

- A **variable** is a labeled box that holds a value: `let count = 3;`
- A **value** is the thing inside: text (`"Menu"`), a number (`3`) or true or false (`true`).
- A **function** is a named recipe you can run again: `function openMenu() { ... }`
- **if / else** makes a choice: if the menu is open, close it, otherwise open it.

```js
let isOpen = false;

if (isOpen) {
  console.log("Close the menu");
} else {
  console.log("Open the menu");
}
```

## A tiny real example: an open and close menu

The HTML is the frame. It has a real `button` and a menu.

```html
<button id="menu-button" aria-expanded="false" aria-controls="menu">
  Menu
</button>
<ul id="menu" hidden>
  <li><a href="/pricing">Pricing</a></li>
  <li><a href="/help">Help</a></li>
</ul>
```

The JavaScript is the wiring. It listens for a click and flips the switch.

```js
const button = document.querySelector("#menu-button");
const menu = document.querySelector("#menu");

button.addEventListener("click", function () {
  const isOpen = button.getAttribute("aria-expanded") === "true";
  button.setAttribute("aria-expanded", String(!isOpen));
  menu.hidden = isOpen;
});
```

In plain words: find the button and the menu. When the button is clicked, check whether the menu is open, then do the opposite. CSS can then style the open state, for example with `button[aria-expanded="true"]`.[^6]

## Why designers should care

- **States.** Every behavior has states: closed, open, loading, error, success. If you do not design them, engineers will guess. Design each one.
- **Hand-off.** Say what triggers a change ("click the card to expand") and what happens to focus afterward. Short notes beat long specs.
- **Accessibility.** Not everyone uses a mouse, so keyboard operation is not optional.[^10]

> **Do not rely on the mouse.** Anything that opens on hover must also work with the keyboard and on touch screens, where there is no hover.[^10]

Here is a quick checklist for interactive pieces.

1. Use a real `button` or `a`: Enter works on both, and Space on a button.[^1]
2. Show a clear **focus** style, and keep focus in a sensible place. When a dialog opens, focus moves into it. When it closes, focus returns to the button.[^8]
3. Use `aria-expanded` on things that open and close, so screen readers announce "expanded" or "collapsed".[^7]
4. Let the Escape key close menus and dialogs.[^8][^9]
5. Do not hide important information behind hover alone.

## Frameworks in one paragraph

React, Vue, Svelte and similar tools are **just organized JavaScript**. They help teams build big interfaces from reusable pieces, which is why a React "component" often matches a component in your design system. The language underneath is the same. You do not need to learn them to design well, but knowing the word helps you follow the conversation.

## What to ask engineers

- "Which states does this component have, and can I see each one?"
- "Does it work with only a keyboard? Where does focus go?"
- "Is it a real `button` or `a`, or a styled `div`?"
- "What happens while it is loading, and when it fails?"
- "Does it respect reduced motion for animations?"[^11]

You are not expected to write the wiring. You are expected to know that it exists, and to design for every moment when someone flips the switch.

Back to: [HTML basics](#/guide/html-basics) and [CSS basics](#/guide/css-basics).

## Where to read more

[^1]: Element: click event — MDN Web Docs (Mozilla). https://developer.mozilla.org/en-US/docs/Web/API/Element/click_event . Accessed 2026-11-14.
[^2]: Element: mouseenter event — MDN Web Docs (Mozilla). https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseenter_event . Accessed 2026-11-14.
[^3]: Element: keydown event — MDN Web Docs (Mozilla). https://developer.mozilla.org/en-US/docs/Web/API/Element/keydown_event . Accessed 2026-11-14.
[^4]: Element: focus event — MDN Web Docs (Mozilla). https://developer.mozilla.org/en-US/docs/Web/API/Element/focus_event . Accessed 2026-11-14.
[^5]: HTMLFormElement: submit event — MDN Web Docs (Mozilla). https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/submit_event . Accessed 2026-11-14.
[^6]: Attribute selectors — MDN Web Docs (Mozilla). https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors . Accessed 2026-11-14.
[^7]: ARIA: aria-expanded attribute — MDN Web Docs (Mozilla). https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-expanded . Accessed 2026-11-14.
[^8]: Dialog (Modal) Pattern — WAI-ARIA Authoring Practices Guide, W3C. https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/ . Accessed 2026-11-14.
[^9]: Menu and Menubar Pattern — WAI-ARIA Authoring Practices Guide, W3C. https://www.w3.org/WAI/ARIA/apg/patterns/menubar/ . Accessed 2026-11-14.
[^10]: Web Content Accessibility Guidelines (WCAG) 2.2 — W3C. https://www.w3.org/TR/WCAG22/ . Accessed 2026-11-14. (SC 2.1.1 Keyboard; SC 1.4.13 Content on Hover or Focus.)
[^11]: prefers-reduced-motion CSS media feature — MDN Web Docs (Mozilla). https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion . Accessed 2026-11-14.
[^12]: JavaScript — MDN Web Docs (Mozilla). https://developer.mozilla.org/en-US/docs/Web/JavaScript and Glossary: JavaScript, https://developer.mozilla.org/en-US/docs/Glossary/JavaScript . Accessed 2026-11-14.
