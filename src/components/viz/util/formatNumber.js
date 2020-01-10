/* Copyright 2017-2020, Frameshift Labs, Inc., All rights reserved. */
import isNumber from 'is-number';
import * as d3 from 'd3';

import shortenFloat from './shortenFloat';
import abbreviateNumber from './abbreviateNumber';

export default (number) => {
    if (!isNumber(number)) {
        return NaN;
    }
    const isInt = number % 1 === 0;
    // leave ints less than 1000 as is
    if (Math.abs(number) < 1000 && isInt) {
        return `${number}`;
    }
    // shorten floats less than 1000
    if (Math.abs(number) < 1000) {
        return shortenFloat(number);
    }
    // For numbers between 1,000 and 100,000
    // I don't think these need to be abbreviated, just add a comma
    // If float, round since number is big enough for decimal not to matter
    if (Math.abs(number) >= 1000 && Math.abs(number) < 100000) {
        return d3.format(',')(Math.round(number));
    }
    // for numbers greater than 10,000
    return abbreviateNumber(Math.round(number));
};
