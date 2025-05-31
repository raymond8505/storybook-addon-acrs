import React, { Fragment, useMemo } from "react";
import { Report } from "src/components/ReportViewer";
import { getResultsByImpact, getRuleConformanceLevel, getViolationsByTag } from "src/components/ReportViewers/VPAT/helpers";
import { WCAGRuleLink } from "src/hooks/useVPATServer";
import { DL, Table, UL } from "storybook/internal/components";
import { useGlobals, useStorybookApi, useStorybookState } from "storybook/internal/manager-api";
import { API_StoryEntry } from "storybook/internal/types";


export interface RuleTableProps {
  report:Report,
  ruleDefinitions:WCAGRuleLink[],
  tags:string[]
}
export function RuleTable({ report, ruleDefinitions, tags }: RuleTableProps) {
  const tableRules = ruleDefinitions.filter(rule => {
    return tags.some(tag => rule.tags?.includes(tag))
  })

  const sbState = useStorybookState()
  const api = useStorybookApi()
  const [globals,updateGlobals] = useGlobals()
  const stories = useMemo(() => sbState.index, [sbState.index])
  return <Table style={{
    width: "100%",
  }}>
    <thead>
      <tr>
        <th>Rule</th>
        <th>Conformance Level</th>
        <th>Notes</th>
      </tr>
    </thead>
    <tbody>
    {
      tableRules.map((rule, index) => {

        const conformanceLevel = getRuleConformanceLevel(rule, report)
        const ruleViolations = getViolationsByTag(report, rule.ruleTag)
        const violationsByImpact = getResultsByImpact(ruleViolations)
        return <tr key={index}>
          <td><a href={rule.url} target="_blank">{rule.label}</a></td>
          <td>{conformanceLevel}</td>
          <td>
            {conformanceLevel === "No Violations Found" ? '' : <DL>
              {['critical', 'serious', 'moderate', 'minor'].map((impact) => {
                const impactResults = violationsByImpact[impact as keyof ReturnType<typeof getResultsByImpact>].filter((result,index,arr) => {
                  return arr.findIndex(r => r.storyId === result.storyId) === index
                })

                if(impactResults.length === 0) {
                  return null
                }

                return <Fragment key={`${index}-${impact}`}>
                  <dt>{impact}</dt>
                  <dd>
                    <UL>
                      {impactResults.map((result,resultIndex) => {
                        const story = (stories[result.storyId] as API_StoryEntry)

                        return <li key={`${index}-${impact}-${result.id}-${resultIndex}`}>
                          <a href="#" onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            api.selectStory(story.id)
                            api.setQueryParams({
                              tab: undefined
                            })
                          }}>{story.title} - {story.name}</a>
                        </li>
                      })}
                    </UL>
                  </dd>
                </Fragment>
              })}
              </DL>}
          </td>
          </tr>
      })
    }
    </tbody>
  </Table>
}