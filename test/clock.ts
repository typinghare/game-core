import { Clock } from '../src/'

let num = 0
const clock = new Clock(function() {
    console.log(++num)
})

clock.run()