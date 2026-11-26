# Changelog

All notable changes to this project are documented in this file.

## Unreleased

### Changed

- **Tabs** (underline variant): the active indicator and active label now use the coral accent token (`pio-coral`) instead of the teal token, so tab active state matches the single accent used by buttons, pills and navigation. Inactive labels use the muted text token; the active label is also semibold so state is not carried by color alone.
- **Input**: every variant/fill now renders at one fixed 48px height (height on the field container, input fills it) with Plus Jakarta Sans at 15px, and the default variant's focus border uses the coral accent. Mixed forms (text/email/password side by side) now line up exactly.
- **WeekCalendar**: default `layout` is now `'auto'`. Narrow containers (below `autoBreakpoint`, default 640px) switch to a mobile day or agenda view instead of horizontally scrolling the week grid. To keep the previous always-week behavior, pass `layout="week"`.

### Added

- **Input**: `htmlType` prop for the native input type (`text`, `email`, `password`, `search`, …) — previously hardcoded to `text`, which forced consumers to hand-roll password fields — plus `id`, `name`, `disabled`, `readOnly` and `autoComplete` pass-throughs.
- **WeekCalendar**: `day` and `agenda` layouts, container-width auto switching, selected-day API, swipe between days, agenda empty-day options, and optional event `meta` badges.
- **Hooks**: `useContainerWidth`, `useControllableState` (public package exports).
