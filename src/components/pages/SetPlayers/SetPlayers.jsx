import React, {createClass, PropTypes} from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'

import setTitle from '../../../helpers/title.js';

import Input from '../../forms/Input/Input.jsx'

import styles from './SetPlayers.scss'

const SetPlayers = createClass({
  displayName: 'SetPlayers',
  mixins: [PureRenderMixin],
  propTypes: {
    addPlayers: PropTypes.func.isRequired,
  },

  getInitialState() {
    return {
      numFields: 1,
    }
  },

  lastFieldChange(val) {
    if (val) {
      this.setState({
        numFields: this.state.numFields + 1,
      })
    }
  },

  submit() {
    let players = []

    for (let i = 0; i < this.state.numFields; ++i) {
      if (this.refs[i] && this.refs[i].getValue && this.refs[i].getValue()) {
        players.push(this.refs[i].getValue())
      }
    }

    this.props.addPlayers(players)
  },

  render() {
    let inputs = []

    for (let i = 0; i < this.state.numFields - 1; ++i) {
      inputs.push(<Input key={i} ref={i} />)
    }

    inputs.push(<Input key={this.state.numFields - 1} onChange={this.lastFieldChange} ref={this.state.numFields - 1}
      autoFocus={this.state.numFields === 1} />)

    return <div>
      <div className={styles.inputs}>
        {inputs}
      </div>
      <button onClick={this.submit} className={styles.submit}>Add Players</button>
    </div>
  },
})

export default SetPlayers
