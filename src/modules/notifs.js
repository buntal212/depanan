import { Notify } from "quasar"
import { tabThumbUp, tabAlertTriangle } from 'quasar-extras-svg-icons/tabler-icons-v2'


const notifSuccess = (msg) => {
  Notify.create({
    message: msg || 'Sucees!, Wow Kerja Bagus!',
    icon: tabThumbUp,
    position: 'bottom',
    actions: [
      { label: 'Dismiss', color: 'primary', handler: () => { /* console.log('wooow') */ } }
    ]
  })
}
const notifError = (msg) => {
  Notify.create({
    message: msg || 'Ada Kesalahan!',
    icon: tabAlertTriangle,
    position: 'bottom',
    actions: [
      { label: 'Dismiss', color: 'negative', handler: () => { /* console.log('wooow') */ } }
    ]
  })
}


export { notifSuccess, notifError }
