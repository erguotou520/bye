import Vue from 'vue'
import { Row, Col } from 'iview/src/components/grid'
import { Select, Option, OptionGroup } from 'iview/src/components/select'
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
  Upload
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
  Upload
}

Object.keys(components).forEach(key => {
  if (process.env.NODE !== 'production') {
    console.log('i' + key)
  }
  Vue.component('i' + key, components[key])
})

Vue.component('ExternalLink', ExternalLink)
