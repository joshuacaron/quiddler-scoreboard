import React, {createClass, PropTypes} from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'

import RadioGroup from './RadioGroup.jsx'

const Radio = createClass({
  displayName: 'Radio',
  mixins: [PureRenderMixin],
  propTypes: {
    checked: PropTypes.string.isRequired,
    label: PropTypes.string,
    name: PropTypes.string,
    onChange: PropTypes.func,
    value: PropTypes.string,
  },

  getInitialState() {
    return {
      checked: this.props.checked,
    }
  },

  componentWillMount() {
    if (this.props.name) {
      RadioGroup.add(this.props.name, this)
    }
  },

  componentWillUnmount() {
    if (this.props.name) {
      RadioGroup.remove(this.props.name, this)
    }
  },

  isChecked() {
    return this.state.checked
  },

  getValue() {
    return this.props.value
  },

  setChecked() {
    this.setState({checked: true})
  },

  removeChecked() {
    this.setState({checked: false})
  },

  onChange(e) {
    if (this.state.checked) {
      this.removeChecked()
      return
    }

    if (this.props.name) {
      RadioGroup.setChecked(this.props.name, this)
    } else {
      this.setChecked()
    }

    if (this.props.onChange) {
      this.props.onChange(e.target.checked)
    }
  },

  render() {
    return <div>
      <input type='radio' name={this.props.name} checked={this.state.checked}
        onChange={this.onChange} />
    </div>
  },
})

export default Radio
