import React, {createClass, PropTypes} from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'

import {calcTotals} from '../../../helpers/calculations.js'

import {Map} from 'immutable'

import styles from './FinalSummary.scss'

const FinalSummary = createClass({
  displayName: 'FinalSummary',
  mixins: [PureRenderMixin],
  propTypes: {
    data: PropTypes.instanceOf(Map).isRequired,
    again: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
  },

  render() {
    let scores = this.props.data
    let totals = calcTotals(scores)

    const maxScore = totals.max()

    const isWinner = name => totals.get(name) === maxScore

    return <div>
      <h1>Game Over</h1>
      {totals.keySeq().map(key => <p key={key} className={isWinner(key) ? styles.winner : ''}>
        {key + (isWinner(key) ? ' (Winner)' : '')}: {totals.get(key)}</p>).toArray()}

      <button onClick={this.props.reset} className={styles.reset}>Reset</button>
      <button onClick={this.props.again} className={styles.again}>Play Again</button>
    </div>
  },
})

export default FinalSummary
