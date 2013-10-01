/* 
 * 
 */


$(function() {
    console.log('tada');
    tnlist = 'abcdefghijk'.split('');
    numOfGroups = 3;

    output = rotraep(tnlist, numOfGroups);

    bGroups = output.bGroups;
    rGroups = output.rGroups;

    printGroupsDiv(bGroups, 'Basisgruppen');


    printObj(bGroups, "Basisgruppen"); // indentation level = 2

    for (i = 0; i < rGroups.length; i++) {
        printGroupsDiv(rGroups[i], 'Runde' + i + '-Gruppen');
    }
    printObj(rGroups, "Rundengruppen");

});


var rotraep = function(iList, numOfGroups) {

    var genGroups = function(iList, numOfGroups) {


        var rem = iList.length % numOfGroups;
        var memPerGroup = Math.floor(iList.length / numOfGroups);
        printObj(iList, 'genGroups iList rem:' + rem + ' memPerGroup:' + memPerGroup);

        var _list = iList.slice(0);
        _list = shuffle(_list);

        _groups = [];
        for (i = 0; i < numOfGroups; i++) {
            _temp = [];
            for (j = 0; j < memPerGroup; j++) {
                _temp.push(_list.pop());
            }
            if (rem) {
                _temp.push(_list.pop());
                rem--;
            }
            _groups.push(_temp);
        }

        return _groups;
    };
    // input: bGroups
    // list of baseGroups: [[g0m0, g0m1, ..],[g1m0, ..] .. ]

    /*
     * Input: 
     *      List of base groups
     * Output:
     *      List of round groups 
     *      (each round group exists of one representator of a base group)
     */
    var genRoundGroups = function(bGroup) {
        var maxRounds = 5;

        var fillItUp = function( grouplist, subst) {
            _max = 0;
            _min = 0;
            _sizes = [];
            for (i = 0; i < grouplist.length; i++) {
                _sizes.push(grouplist[i].length);
            }
            printObj(_sizes, "Groupsizes");

            _max = Math.max.apply(Math, _sizes);
            for (i = 0; i < grouplist.length; i++) {
                _diff = _max - grouplist[i].length;
                if ( _diff ) {
                    for (j = 0; j < _diff; j++) {
                        grouplist[i].push(subst);
                    }
                }
            }
            printObj(grouplist, "Filled up groups");
        };

        fillItUp(bGroup, "LEHRER");


        var getOffset = function ( round, group ) {
            return round*group;
        }
           /*
            * 2 groups, size n -> maxRounds = n
            * 3 groups size n -> maxRounds = n/2
            * 4 groups size n -> maxRounds = n/3
            */           
        var getMaxRounds = function ( noOfGroups, gSize ) {            
            // groupno = noOfGroups -1
            // round * groupno = gSize
            return Math.floor( gSize / (noOfGroups-1) );
            
        }
        maxRounds = getMaxRounds( bGroup.length, bGroup[0].length );
        console.log( 'MAX ROUNDS: '+maxRounds);
        

        var _roundGroups = [];
        var gSize = bGroup[0].length;
        printObj(bGroup, "genRoundGroups bGroup input");
        var _end = false;

        console.log('GENROUNDS maxRounds:' + maxRounds + '  gSize:' + gSize);
        var _rounds = [];//element: groups (per round)
        var _rgroups = [];//element: rgroup
        var _rgroup = [];//element: groupelement

        for (round = 0; round <= maxRounds; round++) { //rounds
            _rgroups = [];
            
            for (roundGroup = 0; roundGroup < gSize; roundGroup++) { 
                _rgroup = [];
                
                for (roundGroupElem = 0; 
                        roundGroupElem < bGroup.length; 
                        roundGroupElem++) { //rgroup
                    
                    groupNo = roundGroupElem;
                    offset = round*roundGroupElem;
                    gIdx = ( offset + roundGroup ) % bGroup[0].length;
                    
                    //console.log("round:"+round+"  roundGroupElem:"+roundGroupElem+" offset:"+offset+" gIdx:"+gIdx);
                     _member = bGroup[groupNo][gIdx];
                    
                    _rgroup.push(_member);
                   //printObj( _member, "round "+round+" rgroup "+roundGroup+" push element");
                }
                _rgroups.push(_rgroup);
                //printObj( _rgroup, "round "+round+" push group");                
            }
            
            _rounds.push(_rgroups);
        }

        return _rounds;
    };

    _baseGroups = genGroups(iList, numOfGroups);
    
    var teststr = "g0e0 g0e1 g0e2 g0e3 g0e4 g0e5 g0e6;g1e0 g1e1 g1e2 g1e3 g1e4 g1e5 g1e6;g2e0 g2e1 g2e2 g2e3 g2e4 g2e5 g2e6";
    var testgroups = teststr.split(';');
    for (i=0; i<testgroups.length; i++) {
        testgroups[i] = testgroups[i].split(' ');
    }
    printObj(testgroups,"testgroups");
    _roundGroups = genRoundGroups( testgroups );

    //_roundGroups = genRoundGroups(_baseGroups);
    return {bGroups: _baseGroups, rGroups: _roundGroups};

};


var shuffle = function(o) {
    for (var j, x, i = o.length;
            i;
            j = Math.floor(Math.random() * i),
            x = o[--i], o[i] = o[j], o[j] = x
            )
        ;
    return o;
};

var getRandomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

var printGroupsDiv = function(grouplist, namestr) {
    $('body').append('<div>' + namestr + '</div>');
    for (i = 0; i < grouplist.length; i++) {
        $('body').append('<div>Gruppe ' + i + '</div>');
        for (j = 0; j < grouplist[i].length; j++) {
            $('body').append('<span>' + grouplist[i][j] + '</span>');
        }
        console.log('output: [ Group ' + i + ' ] ');
    }
};

var pprintObj = function(obj, name) {
    var str = JSON.stringify( {"name": name, "obj": obj}, undefined, " " );
    console.log( str );
};
var printObj = function(obj, name) {
    var str = JSON.stringify( {"name": name, "obj": obj} );
    console.log( str );
};
    