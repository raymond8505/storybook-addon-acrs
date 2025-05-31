import React from "react"
/**
 * These styles hide everything but the current report when printing.
 */
export function PrintStyles() {
  return <style type="text/css" media="print">
      {`
        body, #root, #report, html {
            -ms-overflow-style: none !important;
            scrollbar-width: none !important;
            overflow: visible !important;
          }
          body::-webkit-scrollbar, #root::-webkit-scrollbar, #report::-webkit-scrollbar {
            display: none !important;
            width: 0 !important;
            background: transparent !important;
          }
        #root > div
        {
          display: block;
          height: auto;
        }
        #tab-inner,
        #tab-wrapper
        {
          padding: 0 !important;
        }
        #root > div > div:not(:nth-child(2)),
        main > div:first-child,
        #report-type-tabs,
        #sidebar,
        h1 {
          display: none;
        }
        #reports {
          width: 100%;
        }`}
    </style>
}