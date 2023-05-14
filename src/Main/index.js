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
} from 'antd';

import axios from 'axios';

// import QuestionList from './QuestionList';
// import ItemList from './ItemList';
import ContextModal from './ContextModal';
import Survey from './Survey';
import ParticipantInfo from './ParticipantInfo';
// import SurveyModal from './SurveyModal';

import datasets from '../lib/dataset';

import styles from './index.module.css';

const QUESTION_NUM = 2;

class Main extends PureComponent {
  state = {
    context: null,
    survey: null,
    submitted: false,
  }

  componentDidMount() {
    this.setContext();
  }

  setContext = () => {
    let {dataset_key} = qs.parse(window.location.search);

    if (dataset_key && dataset_key in datasets) {
      const dataset = datasets[dataset_key];
      const pairs = _.sampleSize(dataset, QUESTION_NUM);
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
        }))
      }

      this.setState({
        context: {dataset_key},
        survey,
      }, () => {
        this.showWarning();
        this.startTime = new Date();
      });
    }
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

    const { context, survey, submitted } = this.state;
    const duration = ((new Date()) - this.startTime);

    survey.duration = duration;

    axios.post('/survey', {
      survey,
      auth: '',
    }, {timeout: 1000}).then(res => {
      this.setState({submitted: true});
      this.showNotification();
    }).catch(err => {
      const msg = err.response ? err.response.data : 'Network error';

      notification.error({
        duration: 10,
        message: 'Error',
        description: `${msg}! Please contact us in Mturk.`
      });
    });
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
    const { context, survey, submitted } = this.state;
    console.log(!Boolean(context))
    return (
      <>
        {
          submitted &&
            <Alert
              message="Congratulation!"
              description="You have successfully completed the survey! Thank you for your participation! You may close this page now."
              type="info"
              showIcon
              style={{marginBottom: 24}}
            />
        }
        {
          survey && !submitted &&
            <Row gutter={24}>
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <Card title={(<><Icon type="user" className={styles.icon} />Participant Infomation</>)} style={{marginBottom: 20}}>
                  <ParticipantInfo survey={survey} onChange={this.onSurveyChange} />
                </Card>

                <Survey survey={survey} onChange={this.onSurveyChange} />

                <Button type="primary" size="large" onClick={this.onSubmit}>
                  Submit
                </Button>
              </Col>
            </Row>
        }

        <ContextModal visible={!Boolean(context)} onSubmit={this.onContextSubmit} />
      </>
    );
  }
}


export default Main;
