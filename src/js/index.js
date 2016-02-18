import 'babel-polyfill'

import React from 'react'
import ReactDOM from 'react-dom'
import Root from './Root'
import store from './reducers/store'
import Parse from "parse";

document.addEventListener('DOMContentLoaded', function() {
  ReactDOM.render(
    <Root />,
    document.getElementById('root')
  );
});
