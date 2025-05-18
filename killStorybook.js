
import pids from 'port-pid';
import {kill} from 'process'

const ports = [6006]

console.log('killing apps using ports',ports.join(', '))

ports.forEach(port => {
    pids(port).then(apps => {
        apps.all.forEach(pid => {
            console.log(`killing PID ${pid} on port ${port}`)
            kill(pid)
        })
    })
})