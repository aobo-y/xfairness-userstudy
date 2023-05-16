import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { Card, Icon } from 'antd';

import QuestionItem from './QuestionItem';
import styles from './index.module.css';

class Survey extends PureComponent {
  static propTypes = {
    survey: PropTypes.object,
    onChange: PropTypes.func.isRequired
  }

  onQuestionChange = (qid, key, value) => {
    const { onChange } = this.props;
    onChange(`questions[${qid}].${key}`, value)
  }

  render() {
    const { survey } = this.props;
    const questions = survey.questions.filter((q, idx) => idx === 0 || survey.questions[idx-1].systemRating !== null);

    return (
      <>
        {questions.map((question, idx) => (
          <Card
            key={idx}
            title={(<><Icon type="solution" className={styles.icon} />Questionnaire {idx + 1}</>)}
            style={{marginBottom: 16}}
          >
            <QuestionItem
              id={idx}
              items={question.items}
              choice={question.choice}
              choiceRating={question.choiceRating}
              systemRating={question.systemRating}
              expRating={question.expRating}
              expSentiment={question.expSentiment}
              expInfomativeness={question.expInfomativeness}
              expDetailedness={question.expDetailedness}
              onChange={this.onQuestionChange}
            />
          </Card>
        ))}
      </>
    );
  }
}

export default Survey;
