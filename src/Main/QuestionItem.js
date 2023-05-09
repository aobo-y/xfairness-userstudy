import React, { PureComponent } from 'react';
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
  metadata,
  exp,
  review,
}) => {
  return (
    <Card title={name}>
      {
        Boolean(exp) && (
          <Collapse defaultActiveKey={["1"]} bordered={false}>
            <Collapse.Panel
              key="1"
              header={<><Icon type="solution" style={{ marginRight: 8 }} />Explanation</>}
              style={{border: 0}}
            >
              <p>{`This item is recommended because: ${exp}`}</p>
            </Collapse.Panel>
          </Collapse>
        )
      }
      {
        Boolean(metadata) && metadata.map((tag, idx) =>
          <Tag key={idx} color="blue" style={{marginBottom: 6}}>
            {tag}
          </Tag>
        )
      }
      {
        Boolean(review) && (
          <Collapse defaultActiveKey={["1"]} bordered={false}>
            <Collapse.Panel
              key="1"
              header={<><Icon type="solution" style={{ marginRight: 8 }} />User Review</>}
              style={{border: 0}}
            >
              <p>{review}</p>
            </Collapse.Panel>
          </Collapse>
        )
      }
    </Card>
  )
}

class QuestionItem extends PureComponent {
  static propTypes = {
    id: PropTypes.number.isRequired,
    items: PropTypes.arrayOf(PropTypes.object).isRequired,
    choice: PropTypes.number,
    rating: PropTypes.number,
    onChoiceChange: PropTypes.func,
    onRatingChange: PropTypes.func,
  }

  static defaultProps = {
    choice: null,
    rating: null
  }

  onChoiceChange = e => {
    const {id, onChoiceChange} = this.props;
    onChoiceChange(id, e.target.value)
  }

  onRatingChange = e => {
    const {id, onRatingChange} = this.props;
    onRatingChange(id, e.target.value)
  }

  render() {
    const {id, items, choice, rating} = this.props;

    return (
      <>
        <p>Q{id + 1}. Please compare the 2 items recommended below and read the explanations of why they are recommended. Then you will be asked to choose one of them based your preference.</p>
        <Row gutter={24} style={{marginBottom: 16}}>
          <Col xs={24} sm={24} md={12} lg={12} xl={12}>
            <Item
              id={items[0].id}
              name={items[0].name}
              metadata={choice !== null ? items[0].metadata : null}
              exp={items[0].exp}
              review={choice !== null ? items[0].review : null}
            />
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={12}>
            <Item
              id={items[1].id}
              name={items[1].name}
              metadata={choice !== null ? items[1].metadata : null}
              exp={items[1].exp}
              review={choice !== null ? items[1].review : null}
            />
          </Col>
        </Row>

        <div style={{marginBottom: 16}}>
          <p>Choose the item you like more:</p>
          <Radio.Group onChange={this.onChoiceChange} value={choice}>
            <Radio.Button value={0}>1. {items[0].name}</Radio.Button>
            <Radio.Button value={1}>2. {items[1].name}</Radio.Button>
          </Radio.Group>
        </div>

        {
          choice !== null && (
            <div style={{marginBottom: 16}}>
              <p>Now, additional information and a user review are presented in the items. After reading them, do you think the explanations helped you make the right choice:</p>
              <Radio.Group onChange={this.onRatingChange} value={rating}>
                <Radio.Button value={5}>Yes</Radio.Button>
                <Radio.Button value={4}>Somewhat Yes</Radio.Button>
                <Radio.Button value={3}>Neutral</Radio.Button>
                <Radio.Button value={2}>Somewhat No</Radio.Button>
                <Radio.Button value={1}>No</Radio.Button>
              </Radio.Group>
            </div>
          )
        }
      </>
    );
  }
}

export default QuestionItem;
