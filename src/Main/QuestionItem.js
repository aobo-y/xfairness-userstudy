import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Card, Tag, Radio, Button, Collapse, Icon, Row, Col } from 'antd';

import InputSlider from './InputSlider';

const SliderAnswer = ({
  value,
  submitted,
  onChange,
  onConfirm,
  onUnknown
}) => {
  if (submitted) {
    return <p>Answer: <strong>{value < 0 ? 'Don\'t know' : value}</strong></p>
  }

  return (
    <>
      <InputSlider value={value} onChange={onChange} />
      <Button type="primary" onClick={onConfirm}>Confirm</Button>
      <Button style={{marginLeft: 10}} onClick={onUnknown}>I don't Know</Button>
    </>
  );
}


const RadioAnswer = ({
  value,
  submitted,
  onLike,
  onDislike,
  onUnknown
}) => {
  if (submitted) {
    let answer;
    if (value === 0) {
      answer = 'Dislike';
    } else if (value > 0) {
      answer = 'Like';
    } else {
      answer = 'Don\'t know';
    }

    return <p>Answer: <strong>{answer}</strong></p>
   }

   return (
    <>
      <Button type="primary" onClick={onLike}>Like</Button>
      <Button type="primary" style={{marginLeft: 10}} onClick={onDislike}>Dislike</Button>
      <Button style={{marginLeft: 10}} onClick={onUnknown}>I don't Know</Button>
    </>
  );
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
        <p>Please compare the two restaurants recommended below. You are expected to judge the quality of the restaurants based on the provided explanations and choose the one that is better.</p>
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

        <div style={{marginBottom: 16}}>
          <p>{'Choose the item you like more (please note you cannot change this answer once selected):'}</p>
          <Radio.Group onChange={this.onChoiceChange} value={choice}>
            <Radio.Button value={0}>1. {items[0].name}</Radio.Button>
            <Radio.Button value={1}>2. {items[1].name}</Radio.Button>
          </Radio.Group>
        </div>

        {
          itemsToShow.map((item, idx) => (
            <div key={idx}>
              <p>{`The following 2 questions are for the explanation of Item ${idx + 1} (${item.name}): ${item.exp}`}</p>
              <div style={{marginBottom: 16}}>
                <p>{'Please rate the sentiment of the explanation:'}</p>
                <Radio.Group onChange={this.onRadioChange.bind(this, `expSentiment[${idx}]`)} value={expSentiment[idx]}>
                <Radio.Button value={5}>Very Positive</Radio.Button>
                  <Radio.Button value={4}>Positive</Radio.Button>
                  <Radio.Button value={3}>Neutral</Radio.Button>
                  <Radio.Button value={2}>Negative</Radio.Button>
                  <Radio.Button value={1}>Very Negative</Radio.Button>
                </Radio.Group>
              </div>
              <div style={{marginBottom: 16}}>
                <p>{'Do you think the explanation is helpful for you to understand why the restaurant is recommended:'}</p>
                <Radio.Group onChange={this.onRadioChange.bind(this, `expRating[${idx}]`)} value={expRating[idx]}>
                  <Radio.Button value={5}>Yes</Radio.Button>
                  <Radio.Button value={4}>Somewhat Yes</Radio.Button>
                  <Radio.Button value={3}>Neutral</Radio.Button>
                  <Radio.Button value={2}>Somewhat No</Radio.Button>
                  <Radio.Button value={1}>No</Radio.Button>
                </Radio.Group>
              </div>
            </div>
          ))
        }


        {
          showReview && (
            <>
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
              <div style={{marginBottom: 16}}>
                <p>Based on our additionally provided information and the real user reviews about the recommended restaurants, do you think you made the right choice at the beginning, based on the explanations?</p>
                <Radio.Group onChange={this.onChoiceRatingChange} value={choiceRating}>
                  <Radio.Button value={1}>Yes</Radio.Button>
                  <Radio.Button value={0}>No</Radio.Button>
                </Radio.Group>
              </div>
              <div style={{marginBottom: 16}}>
                <p>Are you satisfied with our recommendation-explanation system?</p>
                <Radio.Group onChange={this.onSystemRatingChange} value={systemRating}>
                  <Radio.Button value={5}>Yes</Radio.Button>
                  <Radio.Button value={4}>Somewhat Yes</Radio.Button>
                  <Radio.Button value={3}>Neutral</Radio.Button>
                  <Radio.Button value={2}>Somewhat No</Radio.Button>
                  <Radio.Button value={1}>No</Radio.Button>
                </Radio.Group>
              </div>
            </>
          )
        }
      </>
    );
  }
}

export default QuestionItem;
