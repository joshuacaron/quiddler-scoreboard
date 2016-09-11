import {findDOMNode} from 'react-dom'

export default class ValidationGroup {
  constructor(submit) {
    this._components = []
    this._submit = submit
  }

  addComponent(ref) {
    if (!ref) {
      return
    }

    let node = findDOMNode(ref)

    if (node) {
      node.addEventListener('keypress', this.enterHandler)
    }

    this._components.push(ref)
  }

  removeComponent(ref) {
    let index = this._components.indexOf(ref)

    if (index !== -1) {
      this._components.splice(index, 1)
    }

    let node = findDOMNode(ref)

    if (node) {
      node.removeEventListener('keypress', this.enterHandler)
    }
  }

  enterHandler(e) {
    if (e.which === 13) {
      this.submit()
    }
  }

  validate() {
    let promises = []

    for (let ref of this._components) {
      let valid = ref && ref.validate ? ref.validate() : true

      if (!valid instanceof Promise) {
        valid = Promise.resolve(valid)
      }

      promises.push(valid)
    }

    Promise.all(promises)
      .then(validity => {
        for (let i = 0; i < validity.length; ++i) {
          let valid = validity[i]

          if (valid && !valid.valid) {
            let ref = this._components[i]

            if (ref.focus) {
              ref.focus()
              return false
            }
          }
        }
      })

    return true
  }

  submit() {
    let valid = this.validate()

    if (valid) {
      this._submit()
    }
  }
}
