import React, {createClass} from 'react'
import Immutable, {List, Map, OrderedMap} from 'immutable'
import PureRenderMixin from 'react-addons-pure-render-mixin'

import ScoreRound from '../../pages/ScoreRound/ScoreRound.jsx'
import FinalSummary from '../../pages/FinalSummary/FinalSummary.jsx'
import SetInitialDealer from '../../pages/SetInitialDealer/SetInitialDealer.jsx'
import SetPlayers from '../../pages/SetPlayers/SetPlayers.jsx'

import moment from 'moment'

const storageKey = 'quiddler-scoreboard'

import '../../../theme/main.scss'

function addData(data, round, roundData) {
  let players = roundData.get('scores').keySeq().toArray()

  round = round.toString()

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

  componentWillMount() {
    let data = localStorage.getItem(storageKey)

    if (!data) {
      return
    }

    data = JSON.parse(data)

    if (data && data.exp && moment(data.exp).isAfter(moment())) {
      this.setState({
        initialDealer: data.initialDealer,
        turn: parseInt(data.turn) || 1,
        data: Immutable.fromJS(data.data),
      })
    }
  },

  componentDidUpdate(prevProps, prevState) {
    if (prevState.data !== this.state.data && prevState.turn <= this.state.turn) {
      this.cacheData()
    }
  },

  cacheData() {
    localStorage.setItem(storageKey, JSON.stringify({
      exp: moment().add(1, 'hours').format(),
      initialDealer: this.state.initialDealer,
      turn: this.state.turn,
      data: this.state.data.toJS(),
    }))
  },

  clearCache() {
    localStorage.removeItem(storageKey)
  },

  reset() {
    this.clearCache()

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
    this.clearCache()
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
        scores: data.get('scores').map(x => x && x.has(turn.toString()) ? x.get(turn.toString()) : undefined),
        most: data.getIn(['most', turn.toString()]),
        longest: data.getIn(['longest', turn.toString()]),
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
