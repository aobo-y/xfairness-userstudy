import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { Input, Radio } from 'antd';


class ParticipantInfo extends PureComponent {
  static propTypes = {
    survey: PropTypes.object,
    onChange: PropTypes.func.isRequired
  }

  onMIDChange = (e) => {
    const { onChange } = this.props;
    onChange("mturk_id", e.target.value)
  }

  onGenderChange = (e) => {
    const { onChange } = this.props;
    onChange("gender", e.target.value)
  }

  render() {
    const { survey } = this.props;

    return (
      <>
        <div style={{marginBottom: 16}}>
            <p>Your Amazon Mechnical Turk ID:</p>
            <Input placeholder="Mturk ID" value={survey.mturk_id} onChange={this.onMIDChange}/>
        </div>

        <div style={{marginBottom: 16}}>
            <p>Your Gender:</p>
            <Radio.Group onChange={this.onGenderChange} value={survey.gender}>
                <Radio.Button value="male">Male</Radio.Button>
                <Radio.Button value="female">Female</Radio.Button>
                <Radio.Button value="other">Other</Radio.Button>
            </Radio.Group>
        </div>
      </>
    );
  }
}

export default ParticipantInfo;
