import * as _ from 'lodash';
import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import qs from 'query-string';
import {
  Card,
  notification,
  Button,
  Icon,
  Row,
  Col,
  Alert,
  Spin,
} from 'antd';

import axios from 'axios';

import ContextModal from './ContextModal';
import Survey from './Survey';
import ParticipantInfo from './ParticipantInfo';

import styles from './index.module.css';


const attentionMath = [
  ['two', 'one', 3],
  ['one', 'zero', 1],
  ['four', 'one', 5],
  ['one', 'three', 4],
  ['three', 'two', 5],
]

class Main extends PureComponent {
  state = {
    context: null,
    survey: null,
    submitted: false,
    loading: false,
  }

  componentDidMount() {
    this.setContext()
  }

  setContext = () => {
    let {dataset_key} = qs.parse(window.location.search);

    axios.get(`/context/${dataset_key}`, {timeout: 1000}).then(res => {
      console.log(res.data)
      const pairs = res.data
      const survey = {
        dataset_key,
        mturk_id: null,
        gender: null,
        age: null,
        duration: null,
        questions: pairs.map((items, idx) => ({
          items,
          choice: null,
          choiceRating: null,
          systemRating: null,
          expSentiment: [null, null],
          expRating: [null, null],
          expInfomativeness: [null, null],
          expDetailedness: [null, null],
          attn: {q: _.sample(attentionMath), a: null}
        }))
      }

      this.setState({
        context: {dataset_key},
        survey,
      }, () => {
        // this.showWarning();
        this.startTime = new Date();
      });
    }).catch(err => {
      if (err.response.status === 400) {
        notification.error({
          duration: 10,
          message: 'Error',
          description: `Invalid context: ${dataset_key}`
        });
      } else {
        const msg = err.response ? err.response.data : 'Network error';

        notification.error({
          duration: 10,
          message: 'Error',
          description: `${msg}! Please contact us in Mturk.`
        });
      }
    }).finally(() => {
      this.setState({loading: false})
    });

    this.setState({loading: true})
  }

  onContextSubmit = context => {
    window.history.pushState({}, null, '?' + qs.stringify(context));
    this.setContext();
  }

  onSurveyChange = (key, value) => {
    const {survey} = this.state;
    _.set(survey, key, value)
    this.setState({
      survey: {...survey}
    }, () => {
      this.verifySurvey();
    })
  }

  verifyQuestion = (q) => {
    return Object.entries(q).some(([_, val]) => {
      if (Array.isArray(val)) {
        return val.some(v => v === null)
      } else {
        return val === null
      }
    });
  }

  verifySurvey = () => {
    const {survey} = this.state;
    if (survey.mturk_id === null || survey.gender === null || survey.age === null) {
      return 'Participant Infomation';
    }
    for (let i = 0; i < survey.questions.length; i++) {
      let q = survey.questions[i];

      if (this.verifyQuestion(q)) {
        return `Questionaire ${i + 1}`;
      }
    }

    return null;
  }

  onSubmit = () => {
    const verifyResult = this.verifySurvey();

    if (verifyResult !== null) {
      notification.error({
        duration: 10,
        message: 'Error',
        description: `Please complete ${verifyResult} to submit`,
      });

      return;
    }

    const { survey } = this.state;

    const duration = ((new Date()) - this.startTime);

    survey.duration = duration;

    axios.post('/survey', {
      survey,
      auth: 'f8792bn109_bh32jh989^81',
    }, {timeout: 1000}).then(res => {
      this.setState({submitted: true});
      this.showNotification();
    }).catch(err => {
      const msg = err.response ? err.response.data : 'Network error';

      notification.error({
        duration: 10,
        message: 'Error',
        description: `${msg}! Please contact us in Mturk.`
      })
    }).finally(() => {
      this.setState({loading: false})
    });

    this.setState({loading: true})
  }

  showNotification = () => {
    const config = {
      duration: 10,
      message: 'Congratulation!',
      description: 'You have answered all questions.'
    };

    notification.success(config);
  }

  showWarning = () => {
    notification.warning({
      duration: 60,
      message: 'Attention',
      description: 'Welcome to our study! The purpose of this study is to test the effectiveness of a recommendation explanation system. You will be presented with two items and make a choice based on the explanations provided. Afterward, we will provide you with additional information and real user reviews about the items to evaluate the effectiveness of the explanations. Please note that there is no correct or wrong answer to the questions. Simply use your best judgment when answering the questions.'
    });
  }

  render() {
    const { context, survey, submitted, loading } = this.state;

    return (
      <>
        {
          submitted &&
            <Alert
              message="Congratulation!"
              description="You have successfully completed the survey! Thank you for your participation! You may close this page now."
              type="success"
              showIcon
              style={{marginBottom: 24}}
            />
        }
        {loading && <Spin size="large" />}
        {
          survey && !submitted &&
            <>
              <Alert
                message="Welcome to our study!"
                description={
                  <>
                    The purpose of this study is to evaluate the effectiveness of a recommendation explanation generation system. You will need to complete a questionnaire which contains the following three steps.
                    <ol>
                      <li>You will be presented with two recommended items and the generated explanations for the recommendations. Please make a choice based on the explanations.</li>
                      <li>You will be asked questions to evaluate the quality of the explanations from different perspectives.</li>
                      <li>We will provide you with additional information and real user reviews about the items to evaluate the effectiveness of the explanations.</li>
                    </ol>
                    Please note that there is no correct or wrong answer to the questions. Simply use your best judgment when answering the questions.
                  </>
                }
                type="info"
                showIcon
                style={{marginBottom: 24}}
              />
              <Alert
                message="Attention"
                description={
                  <>
                    <b>Random answers will be rejected. </b>
                    Your behavior on this questionnaire is recorded for quality control. Please answer the questions thoughtfully and carefully to receive the full reward.
                  </>
                }
                type="info"
                showIcon
                style={{marginBottom: 24}}
              />
              <Row gutter={24}>
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                  <Card title={(<><Icon type="user" className={styles.icon} />Participant Infomation</>)} style={{marginBottom: 20}}>
                    <ParticipantInfo survey={survey} onChange={this.onSurveyChange} />
                  </Card>

                  <Survey survey={survey} onChange={this.onSurveyChange} />

                  <Button type="primary" size="large" onClick={this.onSubmit} disabled={loading}>
                    Submit
                  </Button>
                </Col>
              </Row>
            </>
        }

        {/* <ContextModal visible={!Boolean(context)} onSubmit={this.onContextSubmit} /> */}
      </>
    );
  }
}


export default Main;
