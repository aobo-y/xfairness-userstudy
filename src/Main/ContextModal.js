import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  Modal, Form, Radio, Button, Select
} from 'antd';

import datasets from '../lib/dataset';

class ContextModal extends PureComponent {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    onSubmit: PropTypes.func.isRequired
  }

  state = {
    dataset_key: 'yelp',
  }

  onDatasetChange = v => {
    this.setState({ dataset_key: v });
  }

  onSubmit = () => {
    this.props.onSubmit({...this.state});
  }

  mapDatasetKeyToLabel = (dataset_key) => {
    return dataset_key.replace('_', ' ');
  }

  render() {
    const { visible } = this.props;
    const { dataset_key } = this.state;

    return (
      <Modal
        title="Choose Context"
        visible={visible}
        footer={null}
        closable={false}
      >
        <Form>

          <Form.Item
            label="Dataset"
          >
            <Select
              value={dataset_key}
              onChange={this.onDatasetChange}
              style={{width: 280}}
            >
              {
                Object.keys(datasets).map((v, idx) => (
                  <Select.Option key={v} value={v}>{idx}. {this.mapDatasetKeyToLabel(v)}</Select.Option>
                ))
              }
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" onClick={this.onSubmit}>Submit</Button>
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default ContextModal;
