var e = function (req, res) {
    var Surveys = require('../models/survey').model;
    var ret = Surveys.find();
    var documentStream = ret.stream();
    var group = {}, processed = 0;
    documentStream.on('data', function (doc) {
        //Make a copy of the doc
        //var copy = _.clone(doc);
        //
        ////Delete the ID (since it's unique)
        //copy["_id"] = "";
        //copy.date = undefined;
        var copy = {
            a: doc.comment,
            b: doc.lecturenum,
            c: doc.questions[0].num,
            d: doc.questions[0].rating,
            e: doc.questions[0].comment,
            c1: doc.questions[1].num,
            d1: doc.questions[1].rating,
            e1: doc.questions[1].comment,
            c2: doc.questions[2].num,
            d2: doc.questions[2].rating,
            e2: doc.questions[2].comment,
            c3: doc.questions[3].num,
            d3: doc.questions[3].rating,
            e3: doc.questions[3].comment,
            c4: doc.questions[4].num,
            d4: doc.questions[4].rating,
            e4: doc.questions[4].comment,
        };
        console.log('key ' + JSON.stringify(copy, null, '\t'));
        //Hash the object
        var key = murmurhash3_32_gc(JSON.stringify(copy), 0xad4f3b4f);
        //Ensure the key's value is an array so we can push 
        //objects into it
        if (typeof group[key] == 'undefined') {
            group[key] = [];
        }
        //Group the Ids by their hash
        group[key].push(doc);
        //Show how many documents have been processed so far
        process.stdout.write((++processed + "processed so far") + "\r");
    });
    documentStream.on('close', function () {
        var toRemove = [];
        //For each hash in the group of hashes
        for (var key in group) {
            console.log('out ' + key);
            //If this array has more than one document
            if (group[key].length > 1) {
                //There is a purposeful "off by one" error below since I want to leave the first value in the array untouched
                //Loop through all but the first value in the array 
                for (var i = group[key].length - 1; i > 0; i--) {
                    //Add the _id to the list of IDs to remove
                    toRemove.push(group[key][i].id);
                }
                ;
            }
        }
        //Once we've built up the list, lets remove them woo!
        Surveys.find({ _id: { $in: toRemove } }, function (a, b) {
            console.log(a + " WTF " + b);
            console.log(a + " WTF " + b);
        }).remove().exec();
    });
    function murmurhash3_32_gc(key, seed) {
        var remainder, bytes, h1, h1b, c1, c1b, c2, c2b, k1, i;
        remainder = key.length & 3; // key.length % 4
        bytes = key.length - remainder;
        h1 = seed;
        c1 = 0xcc9e2d51;
        c2 = 0x1b873593;
        i = 0;
        while (i < bytes) {
            k1 =
                ((key.charCodeAt(i) & 0xff)) |
                    ((key.charCodeAt(++i) & 0xff) << 8) |
                    ((key.charCodeAt(++i) & 0xff) << 16) |
                    ((key.charCodeAt(++i) & 0xff) << 24);
            ++i;
            k1 = ((((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16))) & 0xffffffff;
            k1 = (k1 << 15) | (k1 >>> 17);
            k1 = ((((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16))) & 0xffffffff;
            h1 ^= k1;
            h1 = (h1 << 13) | (h1 >>> 19);
            h1b = ((((h1 & 0xffff) * 5) + ((((h1 >>> 16) * 5) & 0xffff) << 16))) & 0xffffffff;
            h1 = (((h1b & 0xffff) + 0x6b64) + ((((h1b >>> 16) + 0xe654) & 0xffff) << 16));
        }
        k1 = 0;
        switch (remainder) {
            case 3: k1 ^= (key.charCodeAt(i + 2) & 0xff) << 16;
            case 2: k1 ^= (key.charCodeAt(i + 1) & 0xff) << 8;
            case 1:
                k1 ^= (key.charCodeAt(i) & 0xff);
                k1 = (((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16)) & 0xffffffff;
                k1 = (k1 << 15) | (k1 >>> 17);
                k1 = (((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16)) & 0xffffffff;
                h1 ^= k1;
        }
        h1 ^= key.length;
        h1 ^= h1 >>> 16;
        h1 = (((h1 & 0xffff) * 0x85ebca6b) + ((((h1 >>> 16) * 0x85ebca6b) & 0xffff) << 16)) & 0xffffffff;
        h1 ^= h1 >>> 13;
        h1 = ((((h1 & 0xffff) * 0xc2b2ae35) + ((((h1 >>> 16) * 0xc2b2ae35) & 0xffff) << 16))) & 0xffffffff;
        h1 ^= h1 >>> 16;
        return h1 >>> 0;
    }
};
module.exports = e;
//# sourceMappingURL=duplicate_scrub.js.map