import { date } from 'quasar'

const dateDbFormat = (val) => {
  return date.formatDate(val, 'YYYY-MM-DD')
}
const dateBOD = (val) => {
  return date.formatDate(val, 'YYYYMMDD')
}
const dateLIS = (val) => {
  return date.formatDate(val, 'YYYYMMDDHHmmss')
}
const dateUnix = (val) => {
  return date.formatDate(val, 'X')
}
const humanDate = (val) => {
  return date.formatDate(val, 'DD MMMM YYYY')
}

const timeDiff = (start, end) => {
  start = start.split(':')
  end = end.split(':')
  const startDate = new Date(0, 0, 0, start[0], start[1], 0)
  const endDate = new Date(0, 0, 0, end[0], end[1], 0)
  let diff = endDate.getTime() - startDate.getTime()
  let hours = Math.floor(diff / 1000 / 60 / 60)
  diff -= hours * 1000 * 60 * 60
  const minutes = Math.floor(diff / 1000 / 60)

  // If using time pickers with 24 hours format, add the below line get exact hours
  if (hours < 0) { hours = hours + 24 }

  return (hours <= 9 ? '0' : '') + hours + ':' + (minutes <= 9 ? '0' : '') + minutes
}
const diffDate = (val) => {
  const date1 = new Date()
  const date2 = val
  const unit = 'years'

  const diff = date.getDateDiff(date1, date2, unit)
  return diff
}
const calcDate = (val1, val2, type) => {
  const date1 = val1
  const date2 = val2
  const unit = type

  const diff = date.getDateDiff(date1, date2, unit)
  return diff
}

const formatRp = (value) => {
  if (value !== null) {
    return Number(value)
      .toFixed(0)
      .replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, '$1.')
  }
}

const formatRpDouble = (value, dg) => {
  if (value !== null) {
    return 'Rp. ' + Number(value)
      .toFixed(dg)
      .replace('.', ',')
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
    // .replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, '$1.')
  }
}
const formatDouble = (value, dg) => {
  if (value !== null && value !== 0) {
    return Number(value)
      .toFixed(dg)
      .replace('.', ',')
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
    // .replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, '$1.')
  }
  else { return 0 }
}
const formatDoubleKoma = (value, dg) => {
  if (value !== null && value !== 0) {
    return Number(value)
      .toFixed(dg)
      .replace('.', ',')
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1')
    // .replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, '$1.')
  }
  else { return 0 }
}

const formattanpaRp = (value) => {
  if (value !== null && value !== '') {
    return (
      Number(value)
        .toFixed(2)
        // titik
        // .replace(/\d(?=(\d{3})+(?:\.\d+)?$)/g, "$1.");

        // koma
        // .replace(/(\d)(?=(\d{3})+\.)/g, '$&,')
        .replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, '$1,')
    )
  }
}
const dateFullFormat = (val) => {
  return date.formatDate(val, 'DD MMMM YYYY')
}
const dateHalfFormat = (val) => {
  return date.formatDate(val, 'DD MM YYYY')
}
const dateCppt = (val) => {
  return val ? date.formatDate(val, 'DD/MM/YYYY') : null
}
const dateFilter = (val) => {
  return val ? date.formatDate(val, 'YYYY-MM-DD') : null
}
const dateFull = (val) => {
  return date.formatDate(val, 'DD MMMM YYYY HH:mm:ss')
}
const tglJamFormat = (val) => {
  return date.formatDate(val, 'YYYY-MM-DD HH:mm:ss')
}
const formatJam = (val) => {
  return date.formatDate(val, 'HH:mm:ss')
}
const jamTnpDetik = (val) => {
  return date.formatDate(val, 'HH:mm')
}
const dateOnly = (val) => {
  return date.formatDate(val, 'DD')
}
const dayName = (val) => {
  return date.formatDate(val, 'dddd')
}

function titleCase(str) {
  const splitStr = str.toLowerCase().split(' ')
  for (let i = 0; i < splitStr.length; i++) {
    // You do not need to check if i is larger than splitStr length, as your for does that for you
    // Assign it back to the array
    splitStr[i] =
      splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1)
  }
  // Directly return the joined string
  return splitStr.join(' ')
}
const olahUang = (val) => {
  // console.log('olah uang type', typeof val)
  if (typeof val === 'string') {
    let data = ''
    const array = val.split('.')
    for (let i = 0; i < array.length; i++) {
      data += array[i]
    }
    // console.log('olah uang return', parseFloat(data))
    return parseFloat(data)
  }
  else {
    return val
  }
}

const getNewLine = (text) => {
  return text?.replace(/\n/g, '<br/>')
}

export {
  dateFull, dateFilter,
  dateHalfFormat, dateCppt,
  dateDbFormat,
  humanDate,
  diffDate, calcDate, tglJamFormat, formatJam, dateOnly, jamTnpDetik,
  dateBOD,
  dateUnix,
  formatRp,
  formatRpDouble,
  olahUang,
  dateFullFormat,
  titleCase,
  dateLIS,
  timeDiff,
  formatDouble,
  dayName,
  formattanpaRp,
  formatDoubleKoma,
  getNewLine
}
