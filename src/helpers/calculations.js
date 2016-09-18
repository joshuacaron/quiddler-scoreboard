export function calcTotals(data, maxlevel = null) {
  let totals = data.get('scores')
    .map(x => x.reduce((acc, y, i) => y && typeof y === 'number' && (!maxlevel || maxlevel > i) ? y + acc : acc, 0))

  for (let i = 0; i < (maxlevel || 11); ++i) {
    let most = data.getIn(['most', i.toString()])
    let longest = data.getIn(['longest', i.toString()])

    if (most) {
      totals = totals.update(most, x => x + 10)
    }

    if (longest) {
      totals = totals.update(longest, x => x + 10)
    }
  }

  return totals
}
