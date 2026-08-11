---
name: GLOF Sentry
colors:
  surface: '#0c141c'
  surface-dim: '#0c141c'
  surface-bright: '#323a42'
  surface-container-lowest: '#070f16'
  surface-container-low: '#141c24'
  surface-container: '#182028'
  surface-container-high: '#232b33'
  surface-container-highest: '#2e363e'
  on-surface: '#dbe3ee'
  on-surface-variant: '#c4c5d7'
  inverse-surface: '#dbe3ee'
  inverse-on-surface: '#293139'
  outline: '#8e90a0'
  outline-variant: '#444654'
  surface-tint: '#b8c4ff'
  primary: '#b8c4ff'
  on-primary: '#002486'
  primary-container: '#6c88ff'
  on-primary-container: '#001f76'
  inverse-primary: '#2a50d8'
  secondary: '#5de6ff'
  on-secondary: '#00363e'
  secondary-container: '#00cbe6'
  on-secondary-container: '#00515d'
  tertiary: '#c3c7cc'
  on-tertiary: '#2d3135'
  tertiary-container: '#8d9196'
  on-tertiary-container: '#262a2f'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#dde1ff'
  primary-fixed-dim: '#b8c4ff'
  on-primary-fixed: '#001355'
  on-primary-fixed-variant: '#0036bc'
  secondary-fixed: '#a2eeff'
  secondary-fixed-dim: '#2fd9f4'
  on-secondary-fixed: '#001f25'
  on-secondary-fixed-variant: '#004e5a'
  tertiary-fixed: '#e0e2e8'
  tertiary-fixed-dim: '#c3c7cc'
  on-tertiary-fixed: '#181c20'
  on-tertiary-fixed-variant: '#43474c'
  background: '#0c141c'
  on-background: '#dbe3ee'
  surface-variant: '#2e363e'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: 0.02em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  data-lg:
    fontFamily: JetBrains Mono
    fontSize: 20px
    fontWeight: '500'
    lineHeight: '1.2'
  data-md:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.2'
  label-caps:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: 0.1em
  meta-xs:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: '400'
    lineHeight: '1.2'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  container-padding: 24px
  gutter: 12px
  module-gap: 1px
---

## Brand & Style
The design system is engineered for high-stakes environmental surveillance, adopting a **Mission-Control** aesthetic that prioritizes situational awareness and rapid data ingestion. The interface evokes a sense of scientific authority and precision, reminiscent of aerospace telemetry systems.

The visual style is characterized by a **refined technical minimalism**:
- **High Information Density**: Content is packed efficiently to allow for simultaneous monitoring of multiple data streams without visual clutter.
- **Precision Instrumentation**: Use of hairline 1px borders and 0.5pt grid patterns to create a structured, "heads-up display" (HUD) feel.
- **Scientific Rigor**: Aesthetics are secondary to legibility and semantic accuracy. Every visual element—from a status light to a line weight—carries functional meaning.

## Colors
This design system utilizes a deep-space palette to minimize eye strain during long-duration monitoring sessions and to provide maximum contrast for critical alerts.

- **Foundations**: The background is a deep #0A0E12, providing a void-like canvas that makes data "pop." Surfaces use #12171D to create subtle layering without heavy shadows.
- **Accents**: A primary Indigo-to-Cyan gradient is reserved strictly for interactive primary actions and active state indicators (e.g., a selected station).
- **Functional Semantics**: Colors are strictly regulated. Red is reserved for outburst threats; Amber for rising water levels or sensor drift; Cyan for nominal telemetry; and Teal for operational "heartbeat" signals. 
- **Subtle Textures**: A 10% opacity radial vignette should be applied to the main background to anchor the viewport.

## Typography
The typography strategy separates **instructional/interface text** from **raw data values**.

- **Inter (UI/General)**: Used for the primary navigation, headers, and descriptions. It provides a modern, neutral foundation that remains legible at small scales.
- **JetBrains Mono (Data/Metrics)**: Used for all numerical values, coordinates, timestamps, and sensor IDs. The monospaced nature ensures that fluctuating numbers do not cause horizontal layout "jitter" during real-time updates.
- **Section Headers**: Use `label-caps` for all sidebar and module headings to establish a clear structural hierarchy reminiscent of technical manuals.

## Layout & Spacing
The design system employs a **fixed-grid, modular philosophy**. The interface should feel like a singular consolidated instrument panel rather than a collection of separate pages.

- **The HUD Layout**: A 12-column grid is used for the main dashboard. Columns are separated by 1px hairlines rather than traditional wide gutters to maximize screen real estate.
- **Density**: Use a tight 4px baseline unit. Margins within data cards should be restricted to 12px or 16px to maintain the high-density aesthetic.
- **Responsive Behavior**: On smaller viewports, modules stack vertically, but the 1px border treatment remains consistent to preserve the technical feel.

## Elevation & Depth
Depth is signaled through **chromatic layering and borders** rather than shadows. 

- **Tonal Layers**: The hierarchy of depth is: Background (#0A0E12) -> Card Surface (#12171D) -> Interactive Overlay (#1E252E).
- **Hairline Outlines**: Every module must be contained within a 1px solid border (#232B33). Avoid soft drop shadows entirely to prevent the UI from feeling "mushy."
- **Active State Glow**: Active or focused elements may use a subtle outer glow (4px blur) using the accent color at 20% opacity to simulate a luminous display screen.

## Shapes
In keeping with the precision-tooled aesthetic, the shape language is **geometric and sharp**.

- **Corner Radius**: A universal 6px radius is applied to cards and buttons. This provides just enough softness to be modern while maintaining a structural, architectural feel.
- **Interactive Elements**: Buttons and inputs should be strictly rectangular or have the minimal 6px radius. Rounded "pills" are prohibited as they conflict with the "defense-spec" narrative.

## Components
- **Data Cards**: Feature a top-aligned `label-caps` header and a 1px bottom border separating the title from the content. Metrics within cards use JetBrains Mono.
- **Instrumentation Charts**: Axis lines must be #232B33. Threshold lines (e.g., "Critical Flood Level") use a dashed stroke in the semantic `critical` color.
- **Status Pings**: Small circular indicators that "pulse" using a CSS scale animation to show active data ingestion.
- **Buttons**: Primary buttons use the Indigo-to-Cyan gradient with white text. Secondary buttons use a ghost style with a 1px border.
- **Source Attribution**: Labels like "Sentinel-2 L2A" or "USGS-G1" are rendered in `meta-xs` Mono, placed in the bottom-right corner of modules to provide data provenance without distracting from the primary metrics.
- **Map Treatment**: Maps use a dark-grey hillshade base with indigo-tinted water bodies. Glacial outlines are highlighted with a 1px cyan stroke.