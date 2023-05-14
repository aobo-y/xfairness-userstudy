import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Card, Tag, Radio, Button, Collapse, Icon, Row, Col } from 'antd';

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
          <Radio.Button id={v} value={v}>{t}</Radio.Button>
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
    choice: PropTypes.number,
    choiceRating: PropTypes.number,
    systemRating: PropTypes.number,
    onChange: PropTypes.func,
  }

  static defaultProps = {
    choice: null,
    rating: null
  }

  onChoiceChange = e => {
    const {id, choice, onChange} = this.props;
    if (choice === null) {
      onChange(id, 'choice', e.target.value)
    }
  }

  onChoiceRatingChange = e => {
    const {id, onChange} = this.props;
    onChange(id, 'choiceRating', e.target.value)
  }

  onSystemRatingChange = e => {
    const {id, onChange} = this.props;
    onChange(id, 'systemRating', e.target.value)
  }

  onRadioChange = (key, e) => {
    const {id, onChange} = this.props;
    console.log(key)
    onChange(id, key, e.target.value)
  }

  render() {
    const {id, items, choice, choiceRating, systemRating, expSentiment, expRating} = this.props;

    const itemsToShow = items.filter((item, idx) => idx === 0 ? choice !== null : expRating[idx - 1])
    const showReview = expRating[1] !== null;

    return (
      <>
        <p>Please compare the two restaurants recommended below. You need to judge the quality of the restaurants based on the provided explanations and choose the one that is better.</p>
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
          text='Choose the item you like more (please note you cannot change this answer once selected):'
          value={choice}
          onChange={this.onChoiceChange}
          options={[
            [`1. ${items[0].name}`, 0],
            [`2. ${items[1].name}`, 1],
          ]}
        />

        {
          itemsToShow.map((item, idx) => (
            <div key={idx} className={styles.section}>
              <p>The following <b>2</b> questions are for evaluating the explanation of item <b>{item.name}</b></p>
              <p>Explanation: <b>{item.exp}</b></p>
              <RadioQuestion
                text='Please rate the sentiment of the explanation:'
                value={expSentiment[idx]}
                onChange={this.onRadioChange.bind(this, `expSentiment[${idx}]`)}
                options={[
                  ['Very Positive', 5],
                  ['Positive', 4],
                  ['Neutral', 3],
                  ['Negative', 2],
                  ['Very Negative', 1],
                ]}
              />
              <RadioQuestion
                text='Do you think the explanation is helpful for you to understand why the restaurant is recommended:'
                value={expRating[idx]}
                onChange={this.onRadioChange.bind(this, `expRating[${idx}]`)}
                options={[
                  ['Yes', 5],
                  ['Somewhat Yes', 4],
                  ['Neutral', 3],
                  ['Somewhat No', 2],
                  ['No', 1],
                ]}
              />
            </div>
          ))
        }


        {
          showReview && (
            <div className={styles.section}>
              <p>Now, additional information and a user review are presented in the items.</p>
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
                text='Are you satisfied with our recommendation-explanation system?'
                value={systemRating}
                onChange={this.onRadioChange.bind(this, 'systemRating')}
                options={[
                  ['Yes', 5],
                  ['Somewhat Yes', 4],
                  ['Neutral', 3],
                  ['Somewhat No', 2],
                  ['No', 1],
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
