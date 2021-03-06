
import * as App from './App'
import u from 'updeep'
import { isEqual, omit } from 'lodash'

export const getInitialState = initializationData => ({
  app: initializationData.app,
  lastSavedApp: initializationData.app,
  cloudRef: initializationData.cloudRef || null,
  running: false,
  compiling: false,
  publishingStatus: null
})

const stripCompiled = app => omit(app, 'compiled')
export const expensivelyCheckIfAppModified = () => state => !isEqual(
  stripCompiled(state.app),
  stripCompiled(state.lastSavedApp)
)

export const isRunning = () => state => !!state.running
export const isCompiling = () => state => !!state.compiling
export const startCompiling = e => u({ compiling: true })
export const startRunning = compiledApp => u({
  running: () => compiledApp,
  compiling: false
})
export const stopRunning = () => u({ running: false })
export const errorCompiling = e => u({ compiling: false })
export const getRunningCompiledApp = () => state => state.running
export const isNew = () => state => !state.cloudRef
export const getDeployOptions = () => state => state.cloudRef

export const isPublishing = () => state => state.publishingStatus === 'loading'
export const didPublish = () => state => state.publishingStatus === 'completed'
export const startPublishing = () => state => u({
  publishingStatus: 'loading',
  savingApp: () => state.app
})(state)
export const finishPublishing = newCloudRef => state => u({
  publishingStatus: 'completed',
  cloudRef: () => newCloudRef,
  lastSavedApp: () => state.savingApp,
  savingApp: () => undefined
})(state)
export const errorPublishing = e => u({ publishingStatus: 'error' })
export const getCloudRef = () => state => state.cloudRef

export const moveComponent = (component, position) => toApp(
  app => app.moveComponent(component, position)
)
export const selectComponent = (component) => u({
  selectedComponentId: id => id === component._id ? null : component._id
})
export const selectComponentById = id => u({ selectedComponentId: () => id })

export const getApp = () => state => state.app
export const toApp = (message) => u({ app: app => message(App)(app) })

export const unselectComponent = () => u({
  selectedComponentId: null
})

export const getSelectedComponent = () => (state) => (
  App.getComponentById(state.selectedComponentId)(state.app)
)
