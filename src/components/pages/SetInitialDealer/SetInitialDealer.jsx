import React, {createClass, PropTypes} from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'

import setTitle from '../../../helpers/title.js'

import {List} from 'immutable'

import styles from './SetInitialDealer.scss'

const SetInitialDealer = createClass({
  displayName: 'SetInitialDealer',
  mixins: [PureRenderMixin],
  propTypes: {
    players: PropTypes.instanceOf(List).isRequired,
    setDealer: PropTypes.func.isRequired,
  },

  componentWillMount() {
    setTitle('Select Dealer')
  },

  render() {
    return <div>
      <h1>Select the initial dealer</h1>
      <ul className={styles.playerList}>
        {this.props.players.map(x => <li key={x} onClick={this.props.setDealer(x)}>{x}</li>).toArray()}
      </ul>
    </div>
  },
})

export default SetInitialDealer
