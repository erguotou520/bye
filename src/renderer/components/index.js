import Vue from 'vue'
import { Row, Col } from 'erguotou-iview/src/components/grid'
import { Select, Option, OptionGroup } from 'erguotou-iview/src/components/select'
import AppView from './AppView'
import ExternalLink from './ExternalLink'

import {
  Alert,
  AutoComplete,
  Button,
  Checkbox,
  Dropdown,
  Form,
  Icon,
  Input,
  InputNumber,
  Message,
  Tabs,
  Table,
  Tag,
  Tree,
  Tooltip,
  Poptip,
  Spin
} from 'erguotou-iview'

const components = {
  Alert,
  AutoComplete,
  Button,
  ButtonGroup: Button.Group,
  Checkbox,
  Col,
  Dropdown,
  DropdownMenu: Dropdown.Menu,
  DropdownItem: Dropdown.Item,
  Form,
  FormItem: Form.Item,
  Icon,
  Input,
  InputNumber,
  Message,
  Option,
  OptionGroup,
  Row,
  Select,
  Tabs,
  TabPane: Tabs.Pane,
  Table,
  Tag,
  Tree,
  Tooltip,
  Poptip,
  Spin
}

Object.keys(components).forEach(key => {
  if (process.env.NODE !== 'production') {
    console.log('i' + key)
  }
  Vue.component('i' + key, components[key])
})

Vue.prototype.$Message = Message
Vue.component('AppView', AppView)
Vue.component('ExternalLink', ExternalLink)
