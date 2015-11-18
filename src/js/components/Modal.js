import React, { Component, PropTypes } from 'react'

export default class Modal extends Component {

  render() {
    return (
      <div className="modal">
        { this.props.children }
      </div>
    )
  }
}
