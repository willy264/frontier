# Core design system

## Color

Use named semantic tokens, not raw colors in component rules. Keep contrast at least 4.5:1 for normal text and 3:1 for large text. One accent should dominate roughly 10% of a screen; status colors must retain meaning in text, not color alone.

## Typography

Use no more than two type families plus one mono family. Define type sizes in the stylesheet token layer. Avoid display-scale type inside compact tools. Keep labels short and concrete.

## Spacing and shape

Use a 4px scale. Use stable dimensions for controls and fixed-format surfaces. Do not let hover, loading, or validation states resize a layout.

## Banned defaults

No purple-cyan gradients, glassmorphism, glow orbs, gradient text, fake logos, generic stock art, nested cards, or identical marketing cards. No bounce or elastic easing.
