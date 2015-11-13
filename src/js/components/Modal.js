import React, { Component, PropTypes } from 'react'

export default class Modal extends Component {

  handleClose() {
    this.props.onClose()
  }

  render() {
    return (
      <div className="modal">
        <button
          className="modal__close-button"
          onClick={ this.handleClose.bind(this) }
          >
          close
        </button>
        { this.props.children }
      </div>
    )
  }
}
