import { AxeResult, AxeResultWithStoryId, Report, StoryResult } from "src/components/ReportViewer";
import { WCAGRuleLink } from "src/hooks/useVPATServer";

export type ResultsByImpact = {critical:AxeResultWithStoryId[],serious:AxeResultWithStoryId[],moderate:AxeResultWithStoryId[],minor:AxeResultWithStoryId[]}

export function getResultsByImpact(results:AxeResultWithStoryId[]): ResultsByImpact
{
  return [...results].reduce<ResultsByImpact>((acc, result) => {
    
    acc[result.impact].push(result)
    return acc

  },{
    critical: [],
    serious: [],
    moderate: [],
    minor: []
  })
}
export function getRuleConformanceLevel(rule: WCAGRuleLink, report:Report): 'No Violations Found' | 'Partially Supports' | 'Does Not Support' {
  const ruleResults = report.reduce<{violations:AxeResult[],storyId:string}[]>((acc, story) => {
    const violations = story.violations.filter(violation => violation.tags.includes(rule.ruleTag))
    if (violations.length > 0) {
      acc.push({
        violations,
        storyId: story.meta.storyId
      })
    }
    return acc
  },[])

  if(ruleResults.length === 0) {
    return "No Violations Found"
  }
  else
  {
    for(const result of ruleResults) {
      const impactCount = getResultsByImpact(result.violations)
      if(impactCount.critical.length === 0 && impactCount.serious.length === 0) {
        if(impactCount.moderate.length === 0 && impactCount.minor.length === 0) {
          return "No Violations Found"
        }
        return "Partially Supports"
      }

        return "Does Not Support"
      
    }
  }
}
export function getViolationsByTag(report:Report, tag:string):AxeResultWithStoryId[] {
  
  const resultsWithTag = [...report.filter(story => {
    return story.violations.some(violation => violation.tags.includes(tag))
  })]

  let results:AxeResultWithStoryId[] = []

  resultsWithTag.forEach(story => {

    const violations = [...story.violations.filter(violation => violation.tags.includes(tag))].map((v)=>({
      ...v,
      storyId: story.meta.storyId
    }))

    results = results.concat(violations)
  })

  return results
}