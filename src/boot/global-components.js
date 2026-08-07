import { defineBoot } from '#q-app/wrappers'
import _ from 'lodash'

const globalComponents = import.meta.glob('components/~global/*.vue', { eager: true, import: 'default' })
const startIndex = '/~global/'.length


export default defineBoot(({ app }) => {

    const componentName = Object.keys(globalComponents).map(key => {
    
      return {
        path: key.substring(startIndex, key.length - 4),
        comp: _.upperFirst(_.camelCase(key.split('/').pop().replace(/\.\w+$/, ''))),
        component: globalComponents[key]
      }
    })
  
    componentName.forEach(async(val) => {
      app.component(`${val?.comp}`, val?.component)
    })
  
})