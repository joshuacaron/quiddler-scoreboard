import React, {createClass, PropTypes} from 'react'
import {findDOMNode} from 'react-dom'

const Input = createClass({
  displayName: 'Input',
  propTypes: {
    autoFocus: PropTypes.bool,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    onChange: PropTypes.func,
    required: PropTypes.bool,
    style: PropTypes.object,
    type: PropTypes.string,
    validate: PropTypes.func,
    value: PropTypes.any,
  },

  getInitialState() {
    return {
      autoFocus: false,
      errorMessage: '',
      valid: true,
      value: this.props.value && this.props.value.toString ? this.props.value.toString() : '',
    }
  },

  getDefaultPropTypes() {
    return {
      className: '',
      disabled: false,
      required: false,
      style: {},
      type: 'text',
    }
  },

  onChange(e) {
    if (this.props.onChange) {
      this.props.onChange(e.target.value)
    }

    if (!this.state.valid) {
      this.validate()
    }

    this.setState({
      value: e.target.value,
    })
  },

  getValue() {
    return this.state.value
  },

  focus() {
    if (this.refs.underlying) {
      let node = findDOMNode(this.refs.underlying)

      if (node) {
        node.focus()
      }
    }
  },

  validate() {
    let value = this.state.value

    if (!value && this.props.required) {
      let output = {
        valid: false,
        errorMessage: 'This field is required.',
      }

      this.setState(output)
      return output
    }

    if (this.props.validate) {
      let output = this.props.validate(value)

      if (output instanceof Promise) {
        output.then(o => {
          this.setState(o)
          return o
        })
      } else {
        this.setState(output)
        return output
      }
    }

    if (!this.state.valid) {
      this.setState({
        valid: true,
        errorMessage: '',
      })
    }
  },

  render() {
    return <div style={this.props.style} className={this.props.className}>
      <input type={this.props.type} disabled={this.props.disabled} onChange={this.onChange} value={this.state.value}
        ref='underlying' autoFocus={this.props.autoFocus} />
      <p>{this.state.errorMessage && !this.state.correct ? this.state.errorMessage : ''}</p>
    </div>
  },
})

export default Input
