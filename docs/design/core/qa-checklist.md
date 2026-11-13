# Accessibility and design QA checklist

Report each item as pass or fail with notes. Do not mark an item passed from assumption.

## Visual

- [ ] Only tokens used; raw colors and arbitrary values reviewed.
- [ ] Two font families maximum plus one mono family.
- [ ] One accent at about 10%; no banned patterns.
- [ ] Spacing rhythm and grid alignment checked.
- [ ] One icon library; no emoji in UI.
- [ ] Interactive, empty, error, success, and loading states designed.

## Accessibility

- [ ] Text contrast >= 4.5:1, large text >= 3:1, UI and focus >= 3:1.
- [ ] Full keyboard access, logical order, visible focus, and skip link where needed.
- [ ] Focus is not hidden by sticky elements.
- [ ] Targets >= 24x24px and 44x44px on touch.
- [ ] Ordered headings, landmarks, and language metadata.
- [ ] Alt text and accessible names are present.
- [ ] Fields have labels and linked errors.
- [ ] Reduced-motion path works and autoplay can pause.
- [ ] Reflow works at 320px and 200% zoom.

## Responsive and performance

- [ ] 320, 375, 768, 1024, 1440, and 1920px checked in normal and reduced motion.
- [ ] No horizontal overflow.
- [ ] Lighthouse mobile run recorded if required: performance >= 90, accessibility 100, SEO 100.
- [ ] Metadata, OG, canonical, and structured data are truthful.

## Copy

- [ ] Humanizer rules pass.
- [ ] CTAs use verb plus object.
- [ ] Every number has a source in the PRD or evidence.
- [ ] Future work is not presented as live functionality.
