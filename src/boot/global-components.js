import { defineBoot } from '#q-app/wrappers'
import { defineAsyncComponent } from 'vue'

const globalComponents = import.meta.glob('components/~global/*.vue')

export default defineBoot(({ app }) => {
  Object.entries(globalComponents).forEach(([path, loader]) => {
    const componentName = path.split('/').pop().replace(/\.vue$/, '')
    app.component(componentName, defineAsyncComponent(loader))
  })
})
