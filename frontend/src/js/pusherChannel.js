import Pusher from 'pusher-js'

let pusher = new Pusher("dc71268506bf79f3b5cd")
export default pusher.subscribe("chat")
