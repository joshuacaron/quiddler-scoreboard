import React, {createClass, PropTypes} from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'

import Immutable, {List, Map} from 'immutable'

import setTitle from '../../../helpers/title.js'

import Input from '../../forms/Input/Input.jsx'
import Radio from '../../forms/Radio/Radio.jsx'
import RadioGroup from '../../forms/Radio/RadioGroup.jsx'

import {calcTotals} from '../../../helpers/calculations.js'

import styles from './ScoreRound.scss'

const ScoreRound = createClass({
  displayName: 'ScoreRound',
  mixins: [PureRenderMixin],
  propTypes: {
    next: PropTypes.func.isRequired,
    previous: PropTypes.func.isRequired,
    turn: PropTypes.number.isRequired,
    data: PropTypes.instanceOf(Map).isRequired,
    roundData: PropTypes.instanceOf(Map).isRequired,
    players: PropTypes.instanceOf(List).isRequired,
    initialDealer: PropTypes.string.isRequired,
  },

  submit() {
    let data = this.getData()

    this.props.next(data)
  },

  back() {
    let data = this.getData()

    this.props.previous(data)
  },

  getData() {
    let scores = new Map(
      Object.keys(this.refs)
        .filter(x => this.props.players.includes(x))
        .reduce((acc, x) => {
          acc[x] = parseInt(this.refs[x].getValue())
          return acc
        }, {}))

    let most = RadioGroup.getChecked('most')
    let longest = RadioGroup.getChecked('longest')

    return Immutable.fromJS({
      scores,
      most,
      longest,
    })
  },

  render() {
    let {players, turn, initialDealer, data, roundData} = this.props
    let originalIndex = players.indexOf(initialDealer)
    let dealerIndex = (originalIndex + turn - 3) % players.size
    let dealer = players.get(dealerIndex)

    console.log('data', data.toJS())
    console.log('round data', roundData.toJS())

    let totals = calcTotals(data, turn)

    let inputs = players.map(x => <tr key={turn + '.' + x}>
      <td>{x} <span className={styles.total}>(<span className={styles.totalText}>Total:&nbsp;</span>{totals.get(x)})</span></td>
      <td><Input ref={x} value={roundData.get('scores').get(x)} type='number' /></td>
      <td><Radio name='longest' checked={roundData.get('longest') === x} value={x} /></td>
      <td><Radio name='most' checked={roundData.get('most') === x} value={x} /></td>
      </tr>).toArray()

    return <div>
      <h1>{dealer} dealing {turn} cards</h1>

      <table>
        <thead>
          <tr>
            <th>Player</th>
            <th>Score</th>
            <th>Longest<span className={styles.plusTen}> Word (+10)</span></th>
            <th>Most<span className={styles.plusTen}> Words (+10)</span></th>
          </tr>
        </thead>
        <tbody>
          {inputs}
        </tbody>
      </table>


      <div className={styles.leftButtons}>
        <button onClick={this.back} className={styles.previous}>Previous</button>
      </div>
      <div className={styles.rightButtons}>
        <button onClick={this.submit} className={styles.next}>Next</button>
      </div>
    </div>
  },
})

export default ScoreRound
