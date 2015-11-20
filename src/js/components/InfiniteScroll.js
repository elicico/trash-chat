import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'

export default class InfiniteScroll extends Component {
  handleScroll(e) {
    var node = ReactDOM.findDOMNode(this.refs.container);
    if (node.scrollTop === 0) {
      this.props.onTopReached();
    }
  }

  render() {
    return React.createElement(
      this.props.tagName,
      { ...this.props, ref: "container", onScroll: this.handleScroll.bind(this) },
      this.props.children
    )
  }
}
