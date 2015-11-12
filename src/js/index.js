import 'babel-polyfill'

import React from 'react'
import ReactDOM from 'react-dom'
import Root from './Root'
import Parse from 'parse'

Parse.initialize("X7EtnKlIJ1bOE5EBELVGUuKg5vC5f5k1xNSyDq66", "G2Z7m0l5tA5FHjbIThzeJW3Kl5N0maUmVR7rAbE6")

document.addEventListener('DOMContentLoaded', function() {
  ReactDOM.render(
    <Root />,
    document.getElementById('root')
  );
});
