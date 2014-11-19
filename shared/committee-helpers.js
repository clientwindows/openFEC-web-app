module.exports = {
    buildCommitteeContext: function(results) {
        var i,
            len,
            committee,
            committees = [],
            type,
            designation,
            name,
            treasurer,
            state,
            party;

        if (typeof results !== 'undefined') {
            len = results.length;
        }

        for (i = 0; i < len; i++) {
            committee = results[i][0];

            if (typeof committee.candidates !== 'undefined') {
                type = committee.candidates[0].type;
                designation = committee.candidates[0].designation;
            }
            else {
                type = committee.type;
                designation = '';
            }

            name = committee.name || '';
            if (typeof committee.treasurer !== 'undefined') {
                treasurer = committee.treasurer.name_full;
            }
            else {
                treasurer = '';
            }
            state = committee.address.state || '';
            party = '';

            committees.push({
                name: name,
                treasurer: treasurer,
                state: state,
                party: party,
                type: type,
                designation: designation
            });
        }

        return committees;
    }
};