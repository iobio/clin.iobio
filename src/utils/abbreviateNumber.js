/* Copyright 2017-2020, Frameshift Labs, Inc., All rights reserved. */
// shortens numbers greater than 10,000 by using SI post fixes (k, M, G, etc)
export default (number) => {
    const SI_POSTFIXES = ['', 'k', 'M', 'G', 'T', 'P', 'E'];

    // Math.log10 will break with an input of 0
    if (number === 0) return `${number}`;

    // what tier? (determines SI prefix)
    const tier = Math.floor(Math.log10(Math.abs(number)) / 3);

    // if zero, we don't need a prefix
    if (tier === 0) return `${number}`;

    // get postfix and determine scale
    const postfix = SI_POSTFIXES[tier];
    const scale = 10 ** (tier * 3);

    // scale the number
    const scaled = number / scale;

    // format number and add postfix as suffix
    // sets it so there will be 4 digits regardless of number size(unless there are trialing zeros)
    // ie: 1.123M
    //     10.23M
    //     100.2M
    let formatted = scaled.toString().slice(0, 5);

    // remove '.0' case
    if (/\.0$/.test(formatted)) { formatted = formatted.substr(0, formatted.length - 2); }

    return formatted + postfix;
};
