'use strict'

const React = require('react')
const { Component } = React
const summarizeFile = require('../../lib/grouping/summarize-file')
const assert = require('assert')

const severityClassNames = [
    'green i'
  , 'blue'
  , 'red b'
]

const underlineTdClass = ' bb b--silver pt2 pb2'

function coloredTds(arr) {
  return arr.map((x, idx) => {
    const className = x > 0
      ? severityClassNames[idx] + ' tr' + underlineTdClass
      : 'silver i tr' + underlineTdClass
    return <td className={className}>{x}</td>
  })
}

function bySeverityScoreDesc({ summary: s1 }, { summary: s2 }) {
  return s1.severityScore < s2.severityScore ? -1 : 1
}

class FilesView extends Component {
  constructor(props) {
    super(props)
    const { onfileClicked } = props
    assert.equal(typeof onfileClicked, 'function', 'need to pass onfileClicked function')
  }

  render() {
    const { groups, className = '' } = this.props
    const tableHeader = this._renderTableHeader()
    const rows = []
    const filesSeverities = Array.from(groups)
      .map(([ file, info ]) => {
        const { deopts, ics } = info
        const summary = summarizeFile({ ics, deopts })
        return { file, summary }
      })
      .sort(bySeverityScoreDesc)

    for (const { file, summary } of filesSeverities) {
      const { icSeverities, deoptSeverities } = summary
      rows.push(this._renderFile({ file, icSeverities, deoptSeverities }))
    }
    return (
      <div className={className}>
        <table cellspacing='0'>
          {tableHeader}
          <tbody>{rows}</tbody>
        </table>
      </div>
    )
  }

  _renderTableHeader() {
    const topHeaderClass = 'bt br bl bw1 b--silver bg-light-green tc br1'
    const subHeaderClass = 'bb br bl bw1 b--silver br1'
    return (
      <thead>
        <tr>
          <td className={topHeaderClass + ' bb'} rowspan='2'>File</td>
          <td colspan='3' className={topHeaderClass}>Deoptimizations</td>
          <td colspan='3' className={topHeaderClass}>Inline Caches</td>
        </tr>
        <tr>
          <td className={subHeaderClass}>Severity 1</td>
          <td className={subHeaderClass}>Severity 2</td>
          <td className={subHeaderClass}>Severity 3</td>
          <td className={subHeaderClass}>Severity 1</td>
          <td className={subHeaderClass}>Severity 2</td>
          <td className={subHeaderClass}>Severity 3</td>
        </tr>
      </thead>
    )
  }

  _renderFile({ file, deoptSeverities, icSeverities }) {
    const { selectedFile } = this.props
    const deoptColumns = coloredTds(deoptSeverities.slice(1))
    const icColumns = coloredTds(icSeverities.slice(1))
    const onfileClicked = this._onfileClicked.bind(this, file)
    const selectedClass = file === selectedFile ? 'bg-light-yellow' : ''
    return (
      <tr className={'bb b--silver ' + selectedClass}>
        <td>
          <a className={'i silver' + underlineTdClass}
            href='#'
            onClick={onfileClicked}>
            {file}
          </a>
        </td>
        {deoptColumns}
        {icColumns}
      </tr>
    )
  }

  _onfileClicked(file) {
    const { onfileClicked } = this.props
    onfileClicked(file)
  }
}

module.exports = { FilesView }