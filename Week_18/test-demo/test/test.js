var assert = require('assert');
import { add, mul } from '../add.js';
// const { add } = require('../add.js');
// const { mul } = require('../add.js');

describe("add function testing", function() {
    it('1 + 2 should 3', function() {
        assert.equal(add(1, 2), 3);
    });
    
    it('-5 + 2 should 3', function() {
        assert.equal(add(-5, 2), -3);
    });

    it('-5 * 2 should 10', function() {
        assert.equal(mul(-5, 2), -10);
    });
})
