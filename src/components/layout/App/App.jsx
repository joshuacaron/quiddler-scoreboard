import React, {createClass} from 'react'
import Immutable, {List, Map, OrderedMap} from 'immutable'
import PureRenderMixin from 'react-addons-pure-render-mixin'

import ScoreRound from '../../pages/ScoreRound/ScoreRound.jsx'
import FinalSummary from '../../pages/FinalSummary/FinalSummary.jsx'
import SetInitialDealer from '../../pages/SetInitialDealer/SetInitialDealer.jsx'
import SetPlayers from '../../pages/SetPlayers/SetPlayers.jsx'

import '../../../theme/main.scss'

function addData(data, round, roundData) {
  let players = roundData.get('scores').keySeq().toArray()

  for (let player of players) {
    if (player && data.getIn(['scores', player])) {
      data = data.updateIn(['scores', player], p => p.set(round, roundData.getIn(['scores', player])))
    } else {
      data = data.setIn(['scores', player], new Map().set(round, roundData.getIn(['scores', player])))
    }
  }

  if (roundData.get('most')) {
    data = data.update('most', most => most.set(round, roundData.get('most')))
  }

  if (roundData.get('longest')) {
    data = data.update('longest', longest => longest.set(round, roundData.get('longest')))
  }

  return data
}

const App = createClass({
  displayName: 'App',
  mixins: [PureRenderMixin],

  getInitialState() {
    return {
      turn: 1,
      initialDealer: null,
      data: Immutable.fromJS({
        scores: new OrderedMap(),
        most: {},
        longest: {},
      }),
    }
  },

  reset() {
    this.setState({
      turn: 1,
      initialDealer: null,
      data: Immutable.fromJS({
        scores: new OrderedMap(),
        most: {},
        longest: {},
      }),
    })
  },

  again() {
    this.setState({
      turn: 2,
      initialDealer: null,
      data: this.state.data
        .update('scores', scores => scores.map(x => new Map()))
        .set('most', new Map())
        .set('longest', new Map()),
    })
  },

  addPlayers(names) {
    let initialData = names.reduce((acc, x) => {
      acc[x] = new Map()
      return acc
    }, {})

    this.setState({
      data: this.state.data.update('scores', () => new OrderedMap(initialData)),
      turn: 2,
    })
  },

  setDealer(name) {
    return () => {
      this.setState({
        initialDealer: name,
        turn: 3,
      })
    }
  },

  nextTurn(scores) {
    this.setState({
      data: addData(this.state.data, this.state.turn, scores),
      turn: this.state.turn + 1,
    })
  },

  previousTurn(scores) {
    this.setState({
      data: addData(this.state.data, this.state.turn, scores),
      turn: this.state.turn - 1,
    })
  },

  render() {
    let {turn, data, initialDealer} = this.state
    let players = data.get('scores').keySeq().toList()

    let output

    if (turn >= 3 && turn < 11) {
      let roundData = Immutable.fromJS({
        scores: data.get('scores').map(x => x && x.has(turn) ? x.get(turn) : undefined),
        most: data.getIn(['most', turn]),
        longest: data.getIn(['longest', turn]),
      })

      output = <ScoreRound
        turn={turn}
        data={data}
        roundData={roundData}
        players={players}
        initialDealer={initialDealer}
        next={this.nextTurn}
        previous={this.previousTurn} />
    }

    if (turn > 10) {
      output = <FinalSummary data={data} reset={this.reset} again={this.again} />
    }

    if (turn <= 1) {
      output = <SetPlayers addPlayers={this.addPlayers} />
    }

    if (turn === 2) {
      output = <SetInitialDealer setDealer={this.setDealer} players={players} />
    }

    return <div className='app'>
      {output}
    </div>
  },
})

export default App
