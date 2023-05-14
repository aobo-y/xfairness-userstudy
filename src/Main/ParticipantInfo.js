import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { Alert, Input, Radio } from 'antd';


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

  onAgeChange = (e) => {
    const { onChange } = this.props;
    onChange("age", e.target.value)
  }

  render() {
    const { survey } = this.props;

    return (
      <>
        <Alert
            message="Please note that your demographic information will not be stored,  associated with your Mechanical Turk ID, or used to identify any individuals. It will only be used for aggregated analysis of the results."
            type="info"
        />
        <div style={{marginTop: 16, marginBottom: 16}}>
            <p>Your Amazon Mechnical Turk ID:</p>
            <Input placeholder="Mturk ID" value={survey.mturk_id} onChange={this.onMIDChange}/>
        </div>

        <div style={{marginBottom: 16}}>
            <p>Your Gender:</p>
            <Radio.Group onChange={this.onGenderChange} value={survey.gender}>
                <Radio.Button value="male">Male</Radio.Button>
                <Radio.Button value="female">Female</Radio.Button>
                <Radio.Button value="other">Other</Radio.Button>
                <Radio.Button value="null">Prefer not to say</Radio.Button>
            </Radio.Group>
        </div>

        <div style={{marginBottom: 16}}>
            <p>Your Age:</p>
            <Radio.Group onChange={this.onAgeChange} value={survey.age}>
                <Radio.Button value="<20>">Less than 20</Radio.Button>
                <Radio.Button value="20-29">20-29</Radio.Button>
                <Radio.Button value="30-39">30-39</Radio.Button>
                <Radio.Button value="40-49">40-49</Radio.Button>
                <Radio.Button value=">50">Above 50</Radio.Button>
                <Radio.Button value="null">Prefer not to say</Radio.Button>
            </Radio.Group>
        </div>
      </>
    );
  }
}

export default ParticipantInfo;
