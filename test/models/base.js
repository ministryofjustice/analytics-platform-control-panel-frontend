

const { assert } = require('chai');
const { mock_api } = require('../conftest');
const { Model, ModelSet } = require('../../app/models');


describe('Base Model', () => {
  it('allows attribute access', () => {
    const expected = 'value';
    const model = new Model({ attr: expected });
    assert.equal(model.attr, expected);
  });

  it('allows setting attributes', () => {
    const expected = 'value';
    const model = new Model({});
    model.attr = expected;
    assert.equal(model.attr, expected);
  });
});

describe('Base ModelSet', () => {
  it('acts as an Array', () => {
    const modelset = new ModelSet(Model, [{}]);
    assert.equal(modelset.length, 1);
    modelset.push(new Model({}));
    assert.equal(modelset.length, 2);
    const expected = [0, 1];
    assert.deepEqual(modelset.map((m, i) => i), expected);
  });
});
