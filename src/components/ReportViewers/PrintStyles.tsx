import React from "react";
/**
 * These styles hide everything but the current report when printing.
 */
export function PrintStyles() {
  return (
    <style type="text/css" media="print">
      {`
      * {
        scrollbar-width: none !important;      /* Firefox */
        -ms-overflow-style: none !important;   /* IE 10+ */
        height: auto !important;
        overflow: visible !important;
      }
      *::-webkit-scrollbar {
        display: none !important;              /* Safari and Chrome */
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
      }
      #report
      {
        padding-right: 0 !important;
      }
      tr:nth-of-type(2n) {
        background-color: transparent !important;
      }`}
    </style>
  );
}
