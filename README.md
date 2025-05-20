# Storybook Addon Accessibility Conformance Reports
Generate ACRs from your storybook

Uses Playwright and Axe to scan all your stories and generate an Accessibility Conformance Report (VPAT) (more options coming)

Best used with Storybook's own [a11y addon](https://www.npmjs.com/package/@storybook/addon-a11y). Report will link stories with violations
so you can easily inspect the problems flagged in the VPAT.

## WiP

- not yet a package, you'll need to clone and link
- only works locally
- best to maintain a local branch of your project with this package linked so you can merge and scan latest locally.

## Install

1. Clone this repo
2. run `npm link` or `yarn link` to link this package
3. run `npm run build` or `yarn build` to build the component
4. run `npm link storybook-addon-vpat` or `yarn link "storybook-addon-vpat"` in the dir of your project
5. add `storybook-addon-vpat` to your `addons` in your storybook config
6. run the server with `npx storybook-vpat-server`
7. run storybook in your project
