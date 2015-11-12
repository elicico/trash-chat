import React, { Component, PropTypes } from 'react'

export default class Modal extends Component {

  handleClose(e) {
    e.preventDefault()
    this.props.onClose()
  }

  render() {
    return (
      <div className="modal">
        <div className="modal__box">
          <button
            className="modal__box__close-button"
            onClick={ this.handleClose.bind(this) }
            >
            close
          </button>
          { this.props.children }
        </div>
      </div>
    )
  }
}
