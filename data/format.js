const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);

const file = args[0] || '';

function format_data(file) {
  console.log(`Format ${file}...`);

  const data = require(`./${file}.json`).map(pairs => {
    return pairs.map(item => {
      return {
        'id': item.item_id,
        'name': item.item_name,
        'attribute': item.attribute,
        'exp': item.explanation,
        'review': item.review.join(' '),
        'metadata': item.meta_data.categories.split(', ')
      };
    });
  });

  fs.writeFileSync(path.join(__dirname, `../src/data/${file}.json`), JSON.stringify(data));
}

format_data(file);
