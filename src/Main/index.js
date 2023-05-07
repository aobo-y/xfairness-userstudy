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
        mturk_id: null,
        gender: null,
        duration: null,
        questions: pairs.map((items, idx) => ({
          items,
          choice: null,
          rating: null
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

  verifySurvey = () => {
    const {survey} = this.state;
    if (survey.mturk_id === null) {
      return;
    }
    if (survey.gender === null) {
      return;
    }
    for (let i = 0; i < survey.questions.length; i++) {
      let q = survey.questions[i];
      if (q.choice === null || q.rating === null) {
        return;
      }
    }

    this.onSubmit();
  }


  onSubmit = () => {
    const { context, survey, submitted } = this.state;


    const duration = ((new Date()) - this.startTime);


    this.setState({submitted: true});
    this.showNotification();
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
      duration: 10,
      message: 'Attention',
      description: 'Please answer each question based your preference. Your behavior on this page will be recorded, and no token will be given to acquire reward on MTurk if you just randomly assign scores. Thanks!'
    });
  }

  render() {
    const { context, survey, submitted } = this.state;

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
                <Card title={(<><Icon type="user" className={styles.icon} />Participant Infomation</>)} style={{marginBottom: 16}}>
                  <ParticipantInfo survey={survey} onChange={this.onSurveyChange} />
                </Card>

                <Card title={(<><Icon type="question" className={styles.icon} />Questionnaire</>)} style={{marginBottom: 16}}>
                  <Survey survey={survey} onChange={this.onSurveyChange} />
                </Card>
              </Col>
            </Row>
        }

        <ContextModal visible={!Boolean(context)} onSubmit={this.onContextSubmit} />
      </>
    );
  }
}


export default Main;
