import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Card, Tag, Radio, Icon, Row, Col } from 'antd';
import * as _ from 'lodash';

import styles from './index.module.css';


const RadioQuestion = ({
  text,
  value,
  options,
  onChange,
}) => {
  return (
    <div style={{marginBottom: 16}}>
      <p><Icon type="question-circle" className={styles.icon} />{text}</p>
      <Radio.Group onChange={onChange} value={value}>
        {options.map(([t, v]) => (
          <Radio.Button key={v} value={v}>{t}</Radio.Button>
        ))}
      </Radio.Group>
    </div>
  )
}


const Item = ({
  id,
  name,
  exp,
}) => {
  return (
    <Card title={name}>
      {
        Boolean(exp) && (
          <>
            <p><Icon type="solution" style={{ marginRight: 8 }} />Explanation</p>
            <p>{exp}</p>
          </>
        )
      }
    </Card>
  )
}

const Item2 = ({
  id,
  name,
  metadata,
  review,
}) => {
  return (
    <Card title={name}>
      Attributes:
      {
        Boolean(metadata) && metadata.map((tag, idx) =>
          <Tag key={idx} color="blue" style={{marginBottom: 6}}>
            {tag}
          </Tag>
        )
      }
      {
        Boolean(review) && (
          <>
            <p><Icon type="solution" style={{ marginRight: 8 }} />User Review</p>
            <p>{review}</p>
          </>
        )
      }
    </Card>
  )
}

class QuestionItem extends Component {
  static propTypes = {
    id: PropTypes.number.isRequired,
    items: PropTypes.arrayOf(PropTypes.object).isRequired,
    itemName: PropTypes.string,
    choice: PropTypes.number,
    choiceRating: PropTypes.number,
    systemRating: PropTypes.number,
    onChange: PropTypes.func,
  }

  static defaultProps = {
    choice: null,
    rating: null,
    itemName: 'restaurant',
  }

  onRadioChange = (key, e) => {
    const {id, onChange} = this.props;
    onChange(id, key, e.target.value)
  }

  render() {
    const {
      id,
      itemName,
      items,
      choice,
      choiceRating,
      systemRating,
      expSentiment,
      expRating,
      expInfomativeness,
      expDetailedness,
      attn,
    } = this.props;

    const itemsToShow = items.filter((item, idx) => idx === 0 ? choice !== null : expRating[idx - 1])
    const showReview = expRating[1] !== null;

    return (
      <>
        <p>Please compare the two restaurants recommended below. You need to judge the quality of the restaurants based on the provided explanations.</p>
        <Row gutter={24} style={{marginBottom: 16}}>
          <Col xs={24} sm={24} md={12} lg={12} xl={12}>
            <Item
              id={items[0].id}
              name={items[0].name}
              exp={items[0].exp}
            />
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={12}>
            <Item
              id={items[1].id}
              name={items[1].name}
              exp={items[1].exp}
            />
          </Col>
        </Row>

        <RadioQuestion
          text={`Choose the ${itemName} you think is better (please note you cannot change this answer once selected):`}
          value={choice}
          onChange={this.onRadioChange.bind(this, 'choice')}
          options={[
            [`1. ${items[0].name}`, 0],
            [`2. ${items[1].name}`, 1],
          ]}
        />

        {
          itemsToShow.map((item, idx) => (
            <div key={idx} className={styles.section}>
              <p>The following questions are for evaluating the explanation of item <b>{item.name}</b></p>
              <p>Explanation: <b>{item.exp}</b></p>
              <RadioQuestion
                text='Please rate the sentiment of the explanation:'
                value={expSentiment[idx]}
                onChange={this.onRadioChange.bind(this, `expSentiment[${idx}]`)}
                options={[
                  ['Very Negative', 1],
                  ['Negative', 2],
                  ['Neutral', 3],
                  ['Positive', 4],
                  ['Very Positive', 5],
                ]}
              />
              <RadioQuestion
                text='Is the explanation informative:'
                value={expInfomativeness[idx]}
                onChange={this.onRadioChange.bind(this, `expInfomativeness[${idx}]`)}
                options={[
                  ['Not at all', 1],
                  ['Somewhat', 2],
                  ['Moderate', 3],
                  [' Very ', 4],
                  ['Extremely', 5],
                ]}
              />
              <RadioQuestion
                text='Is the explanation detailed:'
                value={expDetailedness[idx]}
                onChange={this.onRadioChange.bind(this, `expDetailedness[${idx}]`)}
                options={[
                  ['Not at all', 1],
                  ['Somewhat', 2],
                  ['Moderate', 3],
                  [' Very ', 4],
                  ['Extremely', 5],
                ]}
              />
              <RadioQuestion
                text='Is the explanation helpful for you to get some ideas about the restaurant?'
                value={expRating[idx]}
                onChange={this.onRadioChange.bind(this, `expRating[${idx}]`)}
                options={[
                  ['Not at all', 1],
                  ['Somewhat', 2],
                  ['Moderate', 3],
                  [' Very ', 4],
                  ['Extremely', 5],
                ]}
              />
            </div>
          ))
        }


        {
          showReview && (
            <div className={styles.section}>
              <p>{`Now, additional information and a real user review are presented for the ${itemName}s.`}</p>
              <Row gutter={24} style={{marginBottom: 16}}>
                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                  <Item2
                    id={items[0].id}
                    name={items[0].name}
                    metadata={items[0].metadata}
                    review={items[0].review}
                  />
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                  <Item2
                    id={items[1].id}
                    name={items[1].name}
                    metadata={items[1].metadata}
                    review={items[1].review}
                  />
                </Col>
              </Row>
              <RadioQuestion
                text='Based on our additionally provided information and the real user reviews about the recommended restaurants, do you think you made the right choice at the beginning, based on the explanations?'
                value={choiceRating}
                onChange={this.onRadioChange.bind(this, 'choiceRating')}
                options={[
                  ['Yes', 1],
                  ['No', 0],
                ]}
              />
              <RadioQuestion
                text={`What is the result of ${attn.q[0]} plus ${attn.q[1]}?`}
                value={attn.a}
                onChange={this.onRadioChange.bind(this, 'attn.a')}
                options={[
                  ['One', 1],
                  ['Two', 2],
                  ['Three', 3],
                  ['Four', 4],
                  ['Five', 5],
                ]}
              />
              <RadioQuestion
                text='In general, are you satisfied with the recommendation-explanation system?'
                value={systemRating}
                onChange={this.onRadioChange.bind(this, 'systemRating')}
                options={[
                  ['Not at all', 1],
                  ['Somewhat', 2],
                  ['Moderate', 3],
                  [' Very ', 4],
                  ['Extremely', 5],
                ]}
              />
            </div>
          )
        }
      </>
    );
  }
}

export default QuestionItem;
