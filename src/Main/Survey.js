import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { List } from 'antd';

import QuestionItem from './QuestionItem';

class Survey extends PureComponent {
  static propTypes = {
    survey: PropTypes.object,
    onChange: PropTypes.func.isRequired
  }

  onChoiceChange = (qid, value) => {
    const { onChange } = this.props;
    onChange(`questions[${qid}].choice`, value)
  }

  onRatingChange = (qid, value) => {
    const { onChange } = this.props;
    onChange(`questions[${qid}].rating`, value)
  }

  render() {
    const { survey } = this.props;
    const questions = survey.questions.filter((q, idx) => idx === 0 || survey.questions[idx-1].rating !== null);

    return (
      <List
        itemLayout="vertical"
        size="large"
        dataSource={questions}
        rowKey="id"
        renderItem={(question, idx) => (
          <List.Item>
            <QuestionItem
              id={idx}
              items={question.items}
              choice={question.choice}
              rating={question.rating}
              onChoiceChange={this.onChoiceChange}
              onRatingChange={this.onRatingChange}
            />
          </List.Item>
        )}
      />
    );
  }
}

export default Survey;
