---
id: ios-vs-android
title: iOS vs Android: every difference that affects your app design
summary: A side-by-side tour of how iPhone and Android apps differ, from navigation and gestures to date pickers and dialog buttons, with a design tip for each.
topic: Mobile
level: Beginner
order: 12
---

iPhone apps and Android apps do the same jobs, but they follow different design rules. People who use one platform every day build habits: where the back button is, which side the main button sits on, what a switch looks like. If your app breaks those habits, it feels "off" even when nobody can say why.

This guide compares the two platforms topic by topic. Each section has a short explanation, a table (iOS on the left, Android on the right), and a **Design tip**. It is about phone apps only, not desktop.

Two names to know first:

- **iOS** is Apple's system for iPhone. Its design rules are the **Human Interface Guidelines**, often shortened to HIG.
- **Android** is Google's system. Its design language is **Material Design**, and the current version is **Material 3**.[^1]

> Numbers in this guide come from Apple's and Google's own documentation (see Where to read more at the end). Where a platform does not publish a number, the guide says so instead of guessing. Both platforms update often. Check the current pages before you hand off a final design.

## 1. Design languages

A design language is the full set of rules for how things look and behave. Apple and Google each publish one, and both come with ready-made components and design kits for Figma.[^2]

| Aspect | iOS | Android |
| --- | --- | --- |
| Name | Human Interface Guidelines (HIG) | Material Design 3 |
| Made by | Apple | Google |
| General feel | Clean, flat, soft glass-like bars that let content show through (Apple calls this Liquid Glass in its newest guidance)[^3] | Colorful surfaces, rounded shapes, strong use of color roles and tone |
| Personal color | The app picks an accent color, and the system supplies the rest | Colors can come from the user's wallpaper (dynamic color, see section 21)[^4] |
| Starter design kits | Apple Design Resources | Material 3 Design Kit |

Why this matters: standard components already behave correctly on each platform. A custom control must work like the standard one, or people will not know how to use it.

**Design tip:** Pick the standard component first. Only invent a custom one when the standard one truly cannot do the job.

## 2. Units and screen sizes

Phone screens have different numbers of pixels, so designers do not work in raw pixels. Each platform uses a "density-independent" unit that looks about the same physical size on every screen.

| Aspect | iOS | Android |
| --- | --- | --- |
| Layout unit | **pt** (point) | **dp** (density-independent pixel) |
| Text unit | pt (and it scales with Dynamic Type) | **sp** (scale-independent pixel, scales with the user's font size setting) |
| Adapting to size | Size classes: compact or regular, for width and for height | Window size classes: compact, medium, expanded[^5] |
| Compact width | Most iPhones in portrait | Under 600dp wide (most phones in portrait) |
| Larger layouts | iPad, large iPhones in landscape, split view | Tablets, foldables, split screen (medium and expanded) |

Both platforms say to design for the space you have, not for a specific device. Apple tells designers to base layout on size classes, not on device type or orientation. Android's adaptive guidance works the same way, using window size classes.

**Design tip:** In Figma, start with one common phone frame for each platform, then test a narrow phone, a large phone and a tablet. Never rely on one screen size.

## 3. Safe areas, notch, status bar and home indicator

Modern phones have cameras, rounded corners and gesture areas that cover part of the screen. Both platforms ask you to let backgrounds run edge to edge while keeping buttons and text out of those areas.

| Aspect | iOS | Android |
| --- | --- | --- |
| The idea | **Safe area**: the part of the screen not covered by hardware or system bars | **Insets**: system bar insets, system gesture insets and display cutout insets |
| Top | Status bar and Dynamic Island or notch | Status bar and camera cutout, which varies by manufacturer |
| Bottom | Home indicator (a thin bar used to go home) | Gesture handle, or three navigation buttons, depending on the user's setting |
| Edge-to-edge[^6] | Background art and scrolling content may extend under bars, while controls stay in the safe area | Same idea. New apps are drawn edge to edge, and Android 15 makes this the default for apps built for it[^6] |
| Sizes of bars | Provided by the system | Android does not give fixed heights because they vary by device, so the system reports them at runtime[^7] |

On Android there are two navigation modes, so the bottom of the screen is less predictable. In gesture navigation there are no buttons and the handle stays transparent.[^7] In three-button navigation the system can add a translucent scrim behind the buttons.

**Design tip:** Fill the background to the very edges, but keep every button, tab and text field inside the safe zone. Add extra bottom space on Android because the bottom bar can be a handle or a row of buttons.

## 4. System fonts and text scaling

Each platform has its own system font, and both let people make text bigger in Settings. Your layout has to survive that.

| Aspect | iOS | Android |
| --- | --- | --- |
| System font | San Francisco (SF)[^8] | Roboto on many devices (some phone brands ship their own font)[^9] |
| Default body size | 17 pt[^8] | Material 3 body text is set in sp using its type scale (Body Large 16sp, Body Medium 14sp, Body Small 12sp)[^9] |
| Smallest recommended size | 11 pt[^8] | Material does not set one hard minimum in the pages checked[^9] |
| User text size feature | **Dynamic Type**: 7 standard sizes, plus 5 larger Accessibility sizes people can turn on[^10] | **Font size** and display size settings[^11]; Android 14 added nonlinear scaling up to 200%[^12] |
| How text is styled | Named text styles such as Large Title, Title, Headline, Body, Caption[^8] | Material type scale: Display, Headline, Title, Body, Label (each with Large, Medium, Small)[^9] |
| What to do at huge sizes | Stack things vertically instead of side by side; let text wrap | Same: let text wrap and let containers grow |

Nonlinear scaling on Android means very large text grows more slowly than small text, so a layout does not blow up as much.[^12] It still changes your layout, so test it.

**Design tip:** Never use a fixed height for a text box. Design a normal size and a very large size for every important screen, and use text styles instead of random font sizes.

## 5. Navigation: going back

Going back is the most used action in any app, and the two platforms handle it differently.

| Aspect | iOS | Android |
| --- | --- | --- |
| Back button | A back arrow in the top-left of the navigation bar. Apple says to use the standard symbol and not a text label that says "Back"[^13] | A back arrow (navigation icon) at the start of the top app bar |
| System back | None. The app is responsible for its own back control | A system back action is always available[^7] (swipe from the screen edge, or the Back button in three-button mode) |
| Swipe back | Swipe from the left edge to go back (a shortcut, not a replacement for the button) | Swipe in from the left or right edge to go back |
| Preview | The screen slides with your finger | **Predictive back** shows a preview of where you will land before you let go[^14] |
| Leaving the app | Home indicator swipe up | Swipe up for Home, swipe up and hold for the overview of recent apps |

Apple's gesture guidance says to avoid a custom gesture as the only way to do something, and to avoid a gesture that reuses a familiar one for a new action.[^15] On Android, the system back action works even if your screen has no back arrow, so your app must respond correctly to it. Predictive back previews the destination as you drag; on Android 15 it is the system's back mode.[^14]

**Design tip:** On iOS always draw a back button when someone can go deeper. On Android make sure the back gesture does what a person expects, such as closing a sheet before leaving the screen.

## 6. Navigation: moving between main sections

When an app has several top-level sections, each platform has a standard way to show them.

| Aspect | iOS | Android |
| --- | --- | --- |
| Main phone pattern | **Tab bar** at the bottom[^16] | **Navigation bar** at the bottom (for compact windows)[^17] |
| Labels | Apple recommends text labels, one word when possible[^16] | Items show an icon and a short label |
| Icons | SF Symbols, with filled icons preferred for tab bars[^16] | Material Symbols, with a filled icon often showing the active item[^18] |
| Active indication | Filled icon and accent color | A pill-shaped highlight behind the active icon[^18] |
| Too many sections | The last tab becomes a **More** tab, which Apple says to avoid[^16] | Use a drawer or rail on larger screens[^17], or reduce the number of destinations |
| Tablet or large screen | Tab bar can turn into a sidebar[^16] | **Navigation rail** (a slim bar at the side) for medium and expanded windows |
| Side menu | Uncommon on phones | **Navigation drawer** (slides in from the side, often with a hamburger icon) |
| Badges | Red badge for critical info only | Small badge on the icon, with or without a number |

Apple says a tab bar is for navigation, not for actions, and tabs should not be hidden or disabled when empty.[^16] Instead, explain why the section is empty. On Android, Google's adaptive navigation guide uses the navigation bar for compact windows and the navigation rail for larger ones by default.[^17]

**Design tip:** Keep the same top-level sections on both platforms, but use each platform's own component. Use the tab bar on iPhone and the navigation bar on Android phones, and switch to a rail on tablets.

## 7. Top bars and titles

The top bar holds the screen title, the back button and the main actions.

| Aspect | iOS | Android |
| --- | --- | --- |
| Name | Navigation bar (a kind of toolbar) | Top app bar |
| Title position | Usually centered when small, and a **large title** at the top-left of the screen | Start-aligned (left in left-to-right languages) by default[^19], with center-aligned as an option |
| Big titles | **Large title** shrinks into a small title as you scroll | **Medium** and **Large** flexible app bars collapse into a small bar on scroll[^19] |
| Left side | Back button | Navigation icon (back arrow or menu) |
| Right side | Actions and the primary action, such as Done, on the trailing side | Action icons, and extra ones go in a three-dot overflow menu[^19] |
| Search | Search field below the title or a dedicated search tab | A search app bar that opens a full search view[^19] |
| Scroll behavior | Bar floats above content with a soft glass effect[^3] | The bar can lift (get a tint or shadow) or hide when you scroll[^19] |

Google's top app bar pages list several types: search, small, medium flexible and large flexible.[^19]

**Design tip:** Use the large title on iPhone for top-level screens, and the small title on deeper screens. On Android, left-align the title unless the brand needs it centered.

## 8. Gestures

Taps and swipes are shared, but each platform adds its own special ones.

| Gesture | iOS | Android |
| --- | --- | --- |
| Tap | Activate or select | Activate or select |
| Touch and hold | Reveal more controls (such as a context menu) | Long press: opens a menu, starts selection or shows a tip |
| Swipe | Reveal actions, dismiss a view or scroll | Same |
| Edge swipe from the side | Back | Back (from either edge) |
| Swipe up from the bottom edge | Home | Home (gesture navigation) |
| Swipe up and hold | App switcher | Overview of recent apps |
| Double tap | Zoom in and out | Zoom in and out (in many apps) |
| Pinch | Zoom | Zoom |
| Three-finger swipe | Undo (left) or redo (right)[^15] | Not a standard Android gesture |
| Shake | Undo[^15] | Not a standard action |

Apple says to avoid using a familiar gesture for something that is unique to your app, and to avoid creating a new gesture for a standard action.[^15] Never make a custom gesture the only way to do something important.

**Design tip:** Every gesture needs a visible alternative, such as a button or menu item. Never place a swipe-only feature at the very left or right edge, where system back gestures live.

## 9. Buttons

Buttons look different on each platform, and the feedback when you press them differs as well.

| Aspect | iOS | Android |
| --- | --- | --- |
| Main style | Filled or tinted buttons, plain text buttons, and rounded shapes in the newest design[^20] | Five types: filled, filled tonal, elevated, outlined and text buttons[^21] |
| Shape | Rounded rectangles | Fully rounded corners (the radius scales with the button size)[^21] |
| Press feedback | The button dims or highlights[^20] | **Ripple**: a circle of color spreads from where you touched[^21] |
| Main action | One prominent button per view is ideal (Apple says one or two)[^20] | One filled button for the key action[^21], with others less prominent |
| Floating action | No standard floating button | **FAB** (floating action button)[^21] for the main action on a screen |
| Text buttons | Colored text with no outline, very common in bars and alerts | Text buttons, common in dialogs and cards |
| Loading | A button can show a spinner while it works | Often a progress indicator inside or next to the button |
| Hit area | At least 44 by 44 pt[^20] | At least 48 by 48dp[^22] |

Apple says to use style, not size, to show which button is preferred.[^20] Two buttons of different sizes next to each other look confusing. It also says not to give the primary role to a destructive action, even when it is the likely choice.[^20]

**Design tip:** Make one button stand out per screen. On Android, a FAB is a good place for "create" actions. On iOS, put the main action in the bar or as a full-width button.

## 10. Control placement

Where things go is one of the biggest differences. Here is where each platform expects the important controls.

| Aspect | iOS | Android |
| --- | --- | --- |
| Back | Top left | Top start (left) |
| Primary action in a top bar | Trailing side (right in left-to-right languages), such as Done or Save[^13] | Action icons on the right, with a Save text button often in the top bar for full-screen forms |
| Close button for a modal sheet | Usually a Close (X) or Cancel at the top | Close icon (X) at the top start of a full-screen dialog |
| Main creation action | In the top bar or at the bottom of the content | FAB at the bottom right of the screen |
| Dialog buttons | Row: Cancel on the leading side, default action on the trailing side[^23]. Stack: default on top, Cancel at the bottom[^24] | Buttons are aligned to the end (right) of the dialog, with text buttons[^23] |
| Delete or destructive | Red text or red button, away from the easy-to-tap spot | Often a text button in the dialog, labeled clearly |

Apple states the rule directly: put the button people most likely choose on the trailing side of a row, or on top in a stack. Cancel goes on the leading side of a row, or at the bottom of a stack.[^24] In Android's dialog documentation, buttons are end-aligned by default.[^23]

**Design tip:** Do not copy placement from one platform to the other. A Save button in the top right is normal on iOS. On Android, place the main action where Material places it (FAB, or dialog end buttons).

## 11. Alerts, dialogs, action sheets and bottom sheets

These all interrupt the person to ask something. Each platform has its own names and layouts.

| Aspect | iOS | Android |
| --- | --- | --- |
| Short confirmation | **Alert**: centered box with a title, optional message and up to three buttons[^2] | **Basic dialog**: centered card with a headline, supporting text and text buttons[^23] |
| Choices related to an action | **Action sheet**: a list of buttons that rises from the bottom, with Cancel at the bottom[^24] | **Bottom sheet** or a dialog with a list of choices |
| Large task in a pop-up | **Sheet** that slides up over the screen | **Full-screen dialog** with a close icon and a Save text button in the header |
| Destructive choice | Red destructive button; Apple puts it at the top of an action sheet[^24] | A clearly labeled text button, no special red rule |
| Button wording | Specific verbs such as Delete or Erase. Use OK only for purely informational alerts[^2] | Specific verbs such as Delete and Cancel |
| Alert with a text field[^2] | Allowed on iOS (for example a password) | Dialogs can contain inputs |

Apple's guidance is to use alerts sparingly[^2] and to use an action sheet, not an alert, for choices related to an action someone started. It also says to avoid alerts for common actions people can undo. Google likewise says dialogs are intentionally disruptive and should be used sparingly.[^25]

**Design tip:** Write dialog titles that state the situation. "Delete this photo?" beats "Warning". Label buttons with the result, and always provide a safe way out.

## 12. Menus and context menus

A menu shows a list of commands. The platforms have similar ideas with different names and triggers.

| Aspect | iOS | Android |
| --- | --- | --- |
| Menu from a button | **Pull-down button** opens a menu from a button, such as a More (three dots) button | **Overflow menu** from a three-dot icon, and **dropdown menus** from a button or field |
| Menu after long press | **Context menu**: touch and hold, and the item lifts with a preview and a list | Long press opens a context menu or starts selection mode |
| Menu look | Rounded floating panel with icons beside labels | Rounded surface with a list of items, sometimes with icons |
| Choosing from a short list | **Pop-up button** or pull-down menu | **Exposed dropdown menu** inside a text field, or a menu |

Apple says to use an action sheet, not a menu, to give choices that relate to an action someone just started,[^26] because people expect a menu only when they open one on purpose.

**Design tip:** Do not hide the only way to do something inside a long press. Long press is a shortcut that many people never discover.

## 13. Selection controls

These are the controls for turning options on and off or choosing between options.

| Control | iOS | Android |
| --- | --- | --- |
| On and off | **Switch (toggle)**: green or accent-colored track with a white round knob | **Switch**: Material 3 switch with a pill track and a round thumb, with an optional check icon in the thumb |
| Check several | Checkmark in a list row (a check appears at the right) or a checkbox in some cases | **Checkbox**: a square box that gets a check |
| Pick one | A list with a single checkmark, a menu or pickers | **Radio buttons**: round buttons in a group |
| Switch between 2 to 5 views | **Segmented control**: a row of connected segments | **Segmented button** or **tabs** |
| Filter or tag | Buttons or tokens, no standard chip | **Chips**: filter, input, assist and suggestion chips |
| Slider | Slider with a round thumb | Slider with a handle and optional value label |

iOS settings screens mostly use switches and checkmarks in list rows, and rarely show checkboxes or radio buttons. Android uses checkboxes, radio buttons and switches more openly.

**Design tip:** Use a switch for something that takes effect right away. Use a checkbox or a checkmark when the choice only counts after the person confirms.

## 14. Pickers: dates, times, dropdowns and steppers

Pickers are where the two platforms look the most different. Dates and times are pickers on both platforms, and each has its own look.

### Date pickers

| Aspect | iOS | Android |
| --- | --- | --- |
| Styles | **Compact** (a small button showing the date that opens a calendar pop-up), **Inline** (a calendar placed right in the page), **Wheels** (scrolling columns), and Automatic[^27] | **Modal date picker**[^28] (calendar in a dialog), **Docked date picker** (a field that opens a dropdown calendar), **Modal date input** (type the date with the keyboard) |
| Calendar view | Month grid, shown inline or in a pop-up[^27] | Month grid in a dialog, swipe sideways for months, tap the year to jump[^28] |
| Typing a date | No typing style; pick through the wheels, the compact pop-up or the inline calendar[^27] | Date input mode, with a text field and keyboard[^28] |
| Range of dates | Not a standard picker | Date range picker (tap a start date and an end date)[^28] |
| Confirming | In the compact style, tap outside to confirm[^27] | Dialog has Cancel and OK (text buttons at the end)[^23] |

### Time pickers

| Aspect | iOS | Android |
| --- | --- | --- |
| Main look | **Wheels**: hour, minute and AM or PM columns that you scroll[^27] | **Dial**: a clock face where you tap or drag[^29] to pick hours, then minutes |
| Keyboard option | No typing style in the standard wheels; pick by scrolling the columns[^27] | **Input** mode: type hours and minutes into two boxes[^29] |
| AM or PM | An extra wheel (when the region uses 12 hours)[^27] | A toggle next to the time (when the region uses 12 hours)[^29] |
| Minute steps | By default 60 values (0 to 59). You may set steps that divide evenly into 60, like 15[^27] | Typed or picked as minutes[^29] |
| Countdown timer | A special **countdown timer** style[^27] | Not part of the Material time picker. Timers are built as custom screens[^29] |

### Dropdowns, lists and steppers

| Aspect | iOS | Android |
| --- | --- | --- |
| Choose from a medium or long list | **Picker** (wheel) or a pop-up button | **Exposed dropdown menu** or a dialog with a list |
| Choose from a short list | **Pull-down button** (Apple says a picker has too much visual weight for a short list)[^27] | Dropdown menu, radio buttons or chips |
| Very long list | List or table with an index | List with search |
| Small number change | **Stepper**: a small control with minus and plus buttons | No standard stepper. Designers use two icon buttons beside a number, or a slider or text field |

Apple's picker page also says to avoid switching to a new screen just to show a picker.[^27] A picker works best near the field being edited.

**Design tip:** Match the platform's picker style rather than forcing the same wheel everywhere. Let people type when they know the exact value. On a date of birth field, typing is much faster than scrolling through years.

## 15. Text fields and keyboards

Fields look different, and the keyboard that opens can change the layout.

| Aspect | iOS | Android |
| --- | --- | --- |
| Field look | Plain rounded field or a line in a list row | **Filled** or **outlined** text field with a floating label |
| Label | Placeholder text or a label beside the field | Label sits inside, then floats above the field when you type |
| Helper and error | Usually custom text below or an alert | Supporting text and an error message below the field, with an error icon option |
| Clear button | Small x inside the field (system search fields) | Optional trailing icon |
| Keyboard | Apple keyboard, with a switch to emoji, voice and other languages | Gboard or the phone maker's keyboard. Appearance varies |
| Keyboard type | Choose number, email, phone, URL or default keyboards | Same idea (input types) |
| Keyboard action key | Return key with a label such as Go, Next or Search | Action key (Next, Done, Search, Go) |

Because Android phones come with different keyboards, your layout cannot assume a fixed keyboard height. On both platforms the keyboard can cover the bottom of the screen, so important buttons must stay visible when it opens.

**Design tip:** Pick the right keyboard type for each field. Make sure the field and its error message stay in view when the keyboard is open.

## 16. Search

Search is shaped differently on each platform.

| Aspect | iOS | Android |
| --- | --- | --- |
| Location | Search field under the title, and in newer iOS versions a dedicated search tab at the trailing end of the tab bar[^16] | **Search bar** at the top of the screen. Tapping it opens a **search view** |
| Cancel | A Cancel button next to the field | Back arrow in the search view |
| Suggestions | Shown below the field as you type | Suggestions and recent searches in the search view |
| Voice | Dictation from the keyboard microphone | Optional microphone or avatar icon in the bar |

**Design tip:** Put search where each platform puts it. On iPhone, under the title or as a tab. On Android, as a bar at the top of the home screen.

## 17. Lists and swipe actions

Lists are the heart of many apps. Rows can offer quick actions with a swipe.

| Aspect | iOS | Android |
| --- | --- | --- |
| Look | Rows grouped with thin dividers, often inset in a rounded group | List items with leading icons or images, supporting text and trailing items |
| Dividers | Thin lines between rows | Optional dividers, often none |
| Row tap | Opens the item or shows a disclosure arrow on the right | Opens the item |
| Swipe actions | Swipe a row sideways to show buttons such as Delete or Archive. A full swipe runs the first action | Swipe to dismiss or archive, usually with a colored background and an undo snackbar |
| Edit mode | Edit button, with reorder handles and delete controls | Long press to start selection, with a contextual bar at the top |

**Design tip:** On Android, offer **Undo** after a swipe delete. On iOS, a long swipe can run an action by accident, so use the destructive style carefully.

## 18. Pull to refresh and loading

Both platforms use pull to refresh, but the spinner and the progress style differ.

| Aspect | iOS | Android |
| --- | --- | --- |
| Pull to refresh | Pull the list down and a small spinner appears at the top | Pull the list down and a circular indicator drops in from the top |
| Spinner | Activity indicator (a ring of tiny spokes) | Circular progress (a spinning arc) and linear progress (a bar) |
| Known progress | Progress bar | Determinate circular or linear indicator |
| Placeholders | Skeleton screens are a custom pattern | Skeleton screens are a custom pattern |

**Design tip:** Show something fast. If loading takes more than a moment, show a placeholder layout so the screen does not jump when content arrives.

## 19. Icons

The two platforms ship their own icon sets that match their text and style.

| Aspect | iOS | Android |
| --- | --- | --- |
| System set | **SF Symbols** | **Material Symbols** |
| Weights | Matches the weight of nearby text, with many weights | Variable: weight, fill, grade and optical size can be adjusted |
| Styles | Outline and filled; tab bar prefers filled | Outlined, rounded and sharp; filled for active states |
| License | Meant for apps on Apple platforms (check Apple's terms) | Open source, Apache 2.0 license |
| Share icon | Square with an arrow pointing up | Three connected dots (a node graph) |
| Back icon | Chevron (a bent arrow) pointing left | Arrow pointing left with a stem |

For more on icons, see [Icon types, formats and libraries](#/guide/icon-types).

**Design tip:** Do not mix icon families inside one screen. Use SF Symbols for iOS and Material Symbols for Android.

## 20. Haptics

Haptics are small vibrations that confirm a touch.

| Aspect | iOS | Android |
| --- | --- | --- |
| Support | Built-in system haptics through the Taptic Engine, used in switches, pickers and alerts | Vibration feedback, with quality varying by phone |
| Feel | Short, crisp taps | Ranges from crisp to buzzy depending on the device's motor |
| Design guidance | Use standard controls and the system gets feedback for free | Use standard feedback types so that it matches the system |

**Design tip:** Use haptics to confirm, not to decorate. Make sure the screen and sound also show what happened, since people can turn haptics off.

## 21. Dark mode and color

Both platforms have a system-wide dark mode, but color can be controlled very differently.

| Aspect | iOS | Android |
| --- | --- | --- |
| Dark mode | System setting. Apps follow it using semantic colors | System setting. Apps follow it with a dark theme |
| Color roles | System colors and an app accent color | Material color roles: primary, secondary, tertiary, surface, error and more |
| Personalization | Accent color is chosen by the app. Users can tint icons in newer iOS versions | **Dynamic color**: since Android 12 the system builds a palette from the user's wallpaper, and apps can follow it[^4] |
| Palette size | Smaller set of system colors | Five key colors, each with a tonal palette of 13 tones |
| Brand colors | Used as the accent | Can stay fixed, or let dynamic color replace the brand accents[^4] |

Because Android users may have a purple, green or orange theme from their wallpaper, you cannot assume your brand color is always the main color on screen.

**Design tip:** Design in color roles (primary, surface, on surface), not in fixed color codes. Check contrast in light mode, dark mode and, on Android, a few dynamic color themes. See [Contrast and WCAG](#/guide/contrast-and-wcag).

## 22. Elevation, shadows and surfaces

Both platforms need to show that one layer is above another.

| Aspect | iOS | Android |
| --- | --- | --- |
| Main method | Blur and translucent material, soft shadows, and layering | **Tonal surfaces**: higher layers get a slightly different color tint |
| Shadows | Subtle and soft | Used in moderation. Material 3 relies more on color and tone than on heavy shadows |
| Overlays | Sheets and menus appear over a dimmed or blurred background | Dialogs and sheets appear over a dimmed **scrim** |
| Bars | Glass-like, content shows through | Solid color that can gain a tint when content scrolls under it |

**Design tip:** Do not stack heavy drop shadows on every card. Use a different surface color or a divider to separate things instead.

## 23. Motion

Motion explains what is happening on screen.

| Aspect | iOS | Android |
| --- | --- | --- |
| Style | Smooth springs and gentle slides | Material motion: spring-based animations with fades, scale and shared elements[^30] |
| Screen change | New screen slides in from the right, and the old one shifts slightly | Transitions depend on the relationship: forward, upward, fade through or shared element |
| Back preview | Screen follows the finger during edge swipe | Predictive back shows the destination as you drag[^14] |
| Respecting user choice | **Reduce Motion** setting | Remove animations setting |

Android's predictive back guidance describes the screen scaling down as you drag[^14] and fading to the next view once you pass a commit point. If you let go early, it returns to its starting state.

**Design tip:** Keep motion short and meaningful. Offer a calmer version for people who turn motion off.

## 24. Notifications

Both platforms show notifications as banners and in a list. Permission and style differ.

| Aspect | iOS | Android |
| --- | --- | --- |
| Permission | The app asks for permission, usually on first use or later | On Android 13 and above, the app must ask for the **POST_NOTIFICATIONS** permission[^31], and notifications are off until the person allows them |
| Organization | Notification groups and focus modes | **Notification channels**: users can control each category separately |
| Actions | Buttons on the notification when pressed and held | Action buttons right on the notification |
| Badges | Red number on the app icon | Dot or number on the icon (varies by launcher) |

Android's guidance says to wait before asking, let people explore first, and ask in context, such as after they tap a bell icon or follow an account.[^31]

**Design tip:** Do not ask for notification permission on the first screen. Explain the value, then ask when the person takes an action that makes sense.

## 25. Permission prompts

Camera, location, contacts and similar features require the person's OK.

| Aspect | iOS | Android |
| --- | --- | --- |
| Prompt style | A centered system alert with your short purpose text | A system dialog with choices such as While using the app, Only this time and Don't allow (varies by permission and Android version) |
| Your text | You write a short explanation that appears inside the alert | The system dialog has fixed wording, so you explain in your own screen first |
| After "No" | Person must change it in Settings | After denials the system may stop showing the prompt, so you guide the person to Settings |
| Best practice | Ask at the moment the feature is used | Ask at the moment the feature is used, and show a rationale only when needed |

**Design tip:** Design a "pre-permission" screen or message that explains why you need access. Also design the "permission denied" state, with a button that opens Settings.

## 26. Share sheet

Sharing opens a system panel with apps and actions.

| Aspect | iOS | Android |
| --- | --- | --- |
| Name | **Share sheet** | **Sharesheet** |
| Icon | Square with an upward arrow | Three connected dots |
| Look | Panel from the bottom with a row of people and apps, and a list of actions | Panel from the bottom with direct share targets and an apps list |
| Your role | Provide the content to share. The system builds the panel | Same |

**Design tip:** Use the platform's share icon and open the system panel instead of building your own.

## 27. Widgets

Widgets show app info on the home screen.

| Aspect | iOS | Android |
| --- | --- | --- |
| Where | Home Screen, Lock Screen and other areas[^32] | Home screen |
| Interaction | Tap to open the app, with limited interactive buttons[^32] | Tap to open, with options to include simple controls |
| Color | Follows system styles and tinting[^32] | Supports dynamic color (since Android 12)[^4] |
| Size | Fixed sizes: small, medium, large and more[^32] | Resizable in grid cells, depending on the launcher |

**Design tip:** Make each widget show one useful thing at a glance, and make the tap go to the right place in the app.

## 28. App icons

| Aspect | iOS | Android |
| --- | --- | --- |
| Shape | Square with rounded corners (the system applies the shape)[^33] | **Adaptive icon**: foreground and background layers[^34], cut into a shape chosen by the phone |
| Layers | A single artwork, with options for dark and tinted versions in newer iOS[^33] | Foreground and background layers, plus an optional monochrome layer for themed icons[^35] |
| Themed icons | Tinted icon appearance | Dynamic color can theme adaptive icons (since Android 13)[^35] |
| Safe zone | Keep key artwork away from the rounded corners[^33] | Keep key artwork inside the center so different shapes do not cut it off[^34] |

**Design tip:** Keep the icon simple and leave room around the edges. Test it as a circle, a rounded square and a tinted version.

## 29. Accessibility: VoiceOver and TalkBack

Screen readers speak the screen out loud for people who cannot see it well. Both need labels from you.

| Aspect | iOS | Android |
| --- | --- | --- |
| Screen reader | **VoiceOver** | **TalkBack** |
| Move to next item | Swipe right | Swipe right |
| Activate | Double tap | Double tap |
| Labels | Accessibility labels on icon buttons and images | Content descriptions on icon buttons and images |
| Large text | Dynamic Type, with a Large Content Viewer[^10] for controls that do not scale, like tab bars | Font size and display size settings |
| Motion | Reduce Motion | Remove animations |
| Other features | Voice Control, Switch Control, Larger Text | Voice Access, Switch Access, Select to Speak |

**Design tip:** Add a text label for every icon-only button. Reading order should follow the visual order. Test both with the screen reader on.

## 30. Touch target sizes

| Aspect | iOS | Android |
| --- | --- | --- |
| Minimum size | At least **44 by 44 pt**[^20] | At least **48 by 48dp**[^22] |
| Spacing | Enough space around a button to tell it apart from other items | Keep touch targets **8dp or more** apart[^22] so they do not overlap |
| Visual size | The icon can be smaller than the hit area | An icon can be 24dp inside a 48dp touch area[^22] |

Google's accessibility help says 48dp is about 9mm in the real world[^22], no matter the screen size.

**Design tip:** Design to the larger number (48) when you share components across both platforms. A small icon is fine as long as the tappable area around it is large.

## Quick reference: the biggest differences

| Topic | iOS | Android |
| --- | --- | --- |
| Back | Button in top-left, edge swipe | System back, predictive back |
| Tabs | Bottom tab bar | Bottom navigation bar, rail or drawer |
| Title | Large title, collapses on scroll | Top app bar, start-aligned |
| Main action | Trailing in top bar | FAB or end of dialog |
| Dialog buttons | Cancel left, default right (or default on top) | Text buttons aligned to the end |
| Date and time | Wheels, compact and inline calendar | Calendar dialog, clock dial, keyboard input |
| Feedback | Highlight | Ripple |
| Icons | SF Symbols | Material Symbols |
| Color | Accent color | Dynamic color and color roles |
| Min target | 44pt | 48dp |

## If you design one app for both: a checklist

Sometimes you only have budget for one design. These choices keep both audiences happy.

1. **Share the structure, not the styling.** Keep the same sections, flows and wording. Let components change to match each platform.
2. **Use native components first.** Tab bar, navigation bar, switches, pickers and alerts should be the real ones.
3. **Design touch areas at 48 or larger.** This covers both 44pt and 48dp.
4. **Plan for text scaling.** Allow text to wrap and containers to grow on both platforms.
5. **Respect the edges.** Keep controls inside safe areas and away from system gesture zones.
6. **Support both back behaviors.** Show a back button on iOS, and make the system back work on Android.
7. **Place controls where each platform expects them.** Dialog buttons, primary actions and creation buttons all differ.
8. **Offer visible alternatives to gestures.** A swipe action should also exist as a button or menu item.
9. **Use each platform's icons.** SF Symbols on iOS and Material Symbols on Android.
10. **Design for dark mode and, on Android, dynamic color.** Use color roles and check contrast everywhere.
11. **Ask for permissions in context.** Explain first, ask second, and design the denied state.
12. **Test on real devices.** Check at least one iPhone and one or two Android phones, with large text on, and with a screen reader on.
13. **Write down the differences.** Give engineers a short list of what changes per platform so nothing gets lost in handoff.

## Where to read more

These are the main sources for the claims in this guide. Where a claim rests on a number, a name or a rule, a footnote in the text points to the page it came from. Every page below was checked on 2026-11-14.

[^1]: Material Design 3. Google. https://m3.material.io/ . Accessed 2026-11-14.

[^2]: Apple Human Interface Guidelines: Resources — Apple Design Resources; and Material Design 3: Resources — Google. https://developer.apple.com/design/resources and https://m3.material.io/resources . Accessed 2026-11-14. Both pages list the design kits.
[^3]: Apple Human Interface Guidelines: Tab bars. Apple. https://developer.apple.com/design/human-interface-guidelines/tab-bars . Accessed 2026-11-14. ("rests on a Liquid Glass background"; a dedicated search tab sits at the trailing end.)
[^4]: Android: Dynamic color. Google. https://developer.android.com/develop/ui/views/theming/dynamic-colors . Accessed 2026-11-14. ("Dynamic Color, introduced in Android 12".)
[^5]: Apple Human Interface Guidelines: Layout. Apple. https://developer.apple.com/design/human-interface-guidelines/layout ; and Android: Use window size classes. Google. https://developer.android.com/develop/adaptive-apps/guides/use-window-size-classes . Accessed 2026-11-14. (Android bounds: compact under 600dp, medium 600 to 840dp, expanded over 840dp.)
[^7]: Android: System bars. Google. https://developer.android.com/design/ui/mobile/guides/foundations/system-bars . Accessed 2026-11-14. (No fixed heights — the system reports bar insets at runtime; gesture navigation handle.)
[^6]: Android: Edge-to-edge design. Google. https://developer.android.com/design/ui/mobile/guides/layout-and-content/edge-to-edge . Accessed 2026-11-14. ("Starting from Android 15, apps that target Android 15 are edge-to-edge by default".)
[^8]: Apple Human Interface Guidelines: Typography. Apple. https://developer.apple.com/design/human-interface-guidelines/typography . Accessed 2026-11-14. (San Francisco; Body 17 pt; the smallest style is 11 pt.)
[^9]: Material Design 3: Typography. Google. https://m3.material.io/styles/typography ; and AndroidX Compose Material3 (Typography). Google. https://developer.android.com/jetpack/androidx/releases/compose-material3 . Accessed 2026-11-14. (Roboto; sp units; Body Large 16sp, Body Medium 14sp, Body Small 12sp; no hard minimum stated.)
[^10]: Apple documentation: UIContentSizeCategory. Apple. https://developer.apple.com/documentation/uikit/uicontentsizecategory . Accessed 2026-11-14. (Seven standard cases plus five accessibility cases.) Also: Apple WWDC24: Get started with Dynamic Type. https://developer.apple.com/videos/play/wwdc2024/10074/ . Accessed 2026-11-14. (Dynamic Type exists because people change text size in Settings; covers larger content sizes and the Large Content Viewer.)
[^11]: Android Accessibility Help: Change text & display settings. Google. https://support.google.com/accessibility/android/answer/11183305 . Accessed 2026-11-14.
[^12]: Android 14: Features and APIs overview. Google. https://developer.android.com/about/versions/14/features . Accessed 2026-11-14. ("Starting in Android 14, the system supports font scaling up to 200%", with a nonlinear curve at the largest sizes.)
[^13]: Apple Human Interface Guidelines: Toolbars. Apple. https://developer.apple.com/design/human-interface-guidelines/toolbars . Accessed 2026-11-14. (A back symbol instead of a text label that says Back; a navigation bar is a toolbar of a specific kind.)
[^19]: Material Design 3: Top app bar. Google. https://m3.material.io/components/top-app-bar/overview . Accessed 2026-11-14. (Search, small, medium flexible and large flexible types; start-aligned by default; on scroll apply a fill color.)
[^14]: Android: Predictive back design. Google. https://developer.android.com/design/ui/mobile/guides/patterns/predictive-back . Accessed 2026-11-14.
[^15]: Apple Human Interface Guidelines: Gestures. Apple. https://developer.apple.com/design/human-interface-guidelines/gestures . Accessed 2026-11-14. (Three-finger swipe to undo/redo; shake to undo; "avoid using a familiar gesture in an unfamiliar way"; "avoid new gestures that perform standard actions"; never a custom gesture as the only way.)
[^16]: Apple Human Interface Guidelines: Tab bars. Apple. https://developer.apple.com/design/human-interface-guidelines/tab-bars . Accessed 2026-11-14. (One-word labels; filled symbols preferred; the More tab is limited to a few extra items and should be avoided; a tab bar is for navigation, not actions; never disable or hide tabs; explain empty sections; a dedicated search tab sits at the trailing end; use a sidebar on large windows.)
[^17]: Android: Build adaptive navigation. Google. https://developer.android.com/develop/adaptive-apps/guides/build-adaptive-navigation . Accessed 2026-11-14. (Navigation bar in compact windows; navigation rail in medium and expanded windows; drawer option.)
[^18]: Material Design 3: Navigation bar. Google. https://m3.material.io/components/navigation-bar/overview . Accessed 2026-11-14. (Filled icons and an active indicator show the active state.)
[^26]: Apple Human Interface Guidelines: Menus. Apple. https://developer.apple.com/design/human-interface-guidelines/menus . Accessed 2026-11-14. ("If an action-related choice could use a button, use an action sheet instead.")
[^20]: Apple Human Interface Guidelines: Buttons. Apple. https://developer.apple.com/design/human-interface-guidelines/buttons . Accessed 2026-11-14. (Hit region at least 44 by 44 pt; "use style, not size, to show which button is preferred"; one or two prominent buttons per view; "give the primary role to the button people are most likely to choose".)
[^21]: Material Design 3: Buttons. Google. https://m3.material.io/components/buttons/overview . Accessed 2026-11-14. (Five button types; pressed state shows a ripple; a prominent filled button for the key action — see https://m3.material.io/components/buttons/specs . Accessed 2026-11-14. (Corner radius differs for each button size.)
[^22]: Android Accessibility Help: Touch target size. Google. https://support.google.com/accessibility/android/answer/7101858 . Accessed 2026-11-14. (48dp is about 9mm; keep targets at least 8dp apart; a 24dp icon inside a 48dp target.)
[^23]: Material Components for Android: Dialog. Google. https://github.com/material-components/material-components-android/blob/master/docs/components/Dialog.md . Accessed 2026-11-14. (Full-screen dialog anatomy; text buttons aligned to the end.)
[^24]: Apple Human Interface Guidelines: Action sheets. Apple. https://developer.apple.com/design/human-interface-guidelines/action-sheets . Accessed 2026-11-14. (Rises from the bottom; Cancel at the bottom; "put the most destructive action at the top"; the button order rule in a stack.)
[^25]: Material Design 3: Dialogs. Google. https://m3.material.io/components/dialogs/guidelines . Accessed 2026-11-14. (Use dialogs sparingly; headline, supporting text and text buttons.)
[^27]: Apple Human Interface Guidelines: Pickers. Apple. https://developer.apple.com/design/human-interface-guidelines/pickers . Accessed 2026-11-14. (Compact, inline, wheels and automatic styles; "tapping outside of the view cancels" (compact style); a picker has "too much visual weight for short lists"; "avoid switching to another screen temporarily"; keep the picker near the field; 60 values divide evenly into 60; countdown timer style.)
[^28]: Material Components for Android: Date picker. Google. https://github.com/material-components/material-components-android/blob/master/docs/components/DatePicker.md . Accessed 2026-11-14. (Modal, docked and input modes; Mode.RANGE for date ranges.)
[^29]: Material Design 3: Time pickers. Google. https://m3.material.io/components/time-pickers/guidelines . Accessed 2026-11-14. (Clock dial with a 12-hour face; separate hour and minute inputs; AM/PM selector; no countdown-timer mode.)
[^30]: Material Design 3: Motion. Google. https://m3.material.io/styles/motion . Accessed 2026-11-14.
[^31]: Android: Notification runtime permission. Google. https://developer.android.com/develop/ui/compose/notifications/notification-permission . Accessed 2026-11-14. (Android 13 and above require the POST_NOTIFICATIONS runtime permission; ask in context, for example after a person taps a bell icon or follows an account.)
[^32]: Apple Human Interface Guidelines: Widgets. Apple. https://developer.apple.com/design/human-interface-guidelines/widgets . Accessed 2026-11-14. (Home Screen, Lock Screen and Today View; interactive elements since iOS 17; system tinting; small, medium, large and extra-large families.)
[^33]: Apple Human Interface Guidelines: App icons. Apple. https://developer.apple.com/design/human-interface-guidelines/app-icons . Accessed 2026-11-14. (The system applies the shape; dark and tinted versions in newer iOS; keep key artwork out of the rounded corners.)
[^34]: Android: Adaptive icons. Google. https://developer.android.com/develop/ui/compose/system/icon_design_adaptive . Accessed 2026-11-14. (Foreground and background layers; safe-zone center.)
[^35]: Source: Adaptive icons. Android Open Source Project. https://source.android.com/docs/core/display/adaptive-icons . Accessed 2026-11-14. (Monochrome layer; themed icons since Android 13.)

