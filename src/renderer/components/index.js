import Vue from 'vue'
import { Row, Col } from 'iview/src/components/grid'
import { Select, Option, OptionGroup } from 'iview/src/components/select'
import AppView from './AppView'
import ExternalLink from './ExternalLink'

import {
  Alert,
  Button,
  Checkbox,
  Form,
  Icon,
  Input,
  InputNumber,
  Radio,
  Tabs,
  Tag,
  Tooltip,
  Upload,
  Progress
} from 'iview'

const components = {
  Alert,
  Button,
  Checkbox,
  Col,
  Form,
  FormItem: Form.Item,
  Icon,
  Input,
  InputNumber,
  Option,
  OptionGroup,
  Radio,
  Row,
  Select,
  Tabs,
  TabPane: Tabs.Pane,
  Tag,
  Tooltip,
  Upload,
  Progress
}

Object.keys(components).forEach(key => {
  if (process.env.NODE !== 'production') {
    console.log('i' + key)
  }
  Vue.component('i' + key, components[key])
})

Vue.component('AppView', AppView)
Vue.component('ExternalLink', ExternalLink)
