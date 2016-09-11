class RadioGroup {
  constructor() {
    this.groups = {}
  }

  add(name, ref) {
    if (this.groups[name]) {
      this.groups[name].push(ref)
    } else {
      this.groups[name] = [ref]
    }
  }

  remove(name, ref) {
    if (this.groups[name]) {
      let index = this.groups[name].indexOf(ref)

      if (index !== -1) {
        this.groups[name].splice(index, 1)
      }
    }
  }

  getChecked(name) {
    if (!this.groups[name] || this.groups[name].length === 0) {
      return undefined
    }

    for (let ref of this.groups[name]) {
      if (ref && ref.isChecked && ref.isChecked() && ref.getValue) {
        return ref.getValue()
      }
    }

    return null
  }

  // Call this method to set checked on a radio button in a group so it removes it from the other button
  setChecked(name, ref) {
    let radios = this.groups[name]

    if (!radios || radios.length === 0) {
      return
    }

    for (let radio of radios) {
      if (radio === ref) {
        radio.setChecked()
      } else {
        radio.removeChecked()
      }
    }
  }
}

// Singleton
let group = new RadioGroup()

export default group
