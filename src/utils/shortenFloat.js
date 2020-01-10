/* Copyright 2017-2020, Frameshift Labs, Inc., All rights reserved. */
import * as d3 from 'd3';

export default (number) => {
    let formatString = '.2f';
    const absNumber = Math.abs(number);
    let numberArg = number;
    if (absNumber < 1) {
        // 3 decimals
        formatString = '.3f';
    } else if (absNumber < 100) {
        // 2 decimals
        // 1.234 -> 1.23
        // 10.234 -> 10.23
        // 1.234 -> 1.23
        formatString = '.2f';
    } else if (absNumber < 1000) {
        // 1 decimal
        // 100.234 -> 100.2
        formatString = '.1f';
    } else {
        // if number is bigger than 1000, just round it and add commas
        numberArg = Math.round(number);
        formatString = ',';
    }
    const formattedNumber = d3.format(formatString)(numberArg);

    // handles 102.05 being returned as 102.0, now just returns 102
    // handles 10.005 being returned as 10.00, now just returns 10
    const splitNumber = formattedNumber.split('.');
    if (splitNumber[1]) {
        const zeroArray = splitNumber[1].split('').filter((char) => char === '0');
        if (zeroArray.length === splitNumber[1].length) {
            return splitNumber[0];
        }
    }

    return formattedNumber;
};
