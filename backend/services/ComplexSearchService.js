'use strict';
var logger = require('log4js').getLogger('ComplexSearchService');
var async = require('async');
/**
 *
 * This function gets a proprietary filter object and translates it to a mongo query
 *
 * We can handle really difficult queries here.
 *
 *
 * The current ( September 20th ) structure of the function is 2 stages : build and query
 *
 *  - build filter,sort etc.. by using async.parallel
 *  - once the first async.parallel is over, invoke queries in another parallel
 *
 *  so it pseudo code is looks like this
 *
 *   async.parallel (
 *     [ build functions ],
 *      async.parallel (
 *         [ query functions ],
 *         return response
 *      )
 *    );
 *
 *
 *
 * @param queryObj - describe filter & project & sort & paging
 *
 *
 * {
 *    'filter' : {},
 *    'projection' : {},
 *    'sort' : {},
 *    'paging' : {
 *        'skip' : {}
 *        'limit' : {}
 *    }
 *
 * }
 *
 *
 * The projection, sort and paging are straight forward.
 *
 * However the filter section can get very complex - we can ask to cross reference data from other collections
 * and the logic to decipher the logic is proprietary to specific collection.
 *
 *
 *
 * @param builder - an interface we can pass to this function to add specific logic in case it is needed.
 * for example - in tag search for lessons, we should first search for questions with matching tags, extract
 * their IDs and add them to the filter.
 *
 * when you add a method to the builder, you need to document it here.
 *
 * the builder has the following structure:
 *
 *  {
 *      collection : the collection to use for count and find functions
 *  }
 *
 *
 *
 *
 *
 *
 * @param callback
 *
 *
 *
 *
 * @response
 *
 * The response for each complexSearch should contain the pagination information as well.
 *
 * {
 *    'data' : [ the data ],
 *    'count' : total filtered object,
 *    'total' : total collection size
 *    'skip' : starting where
 *    'limit' : how many did we bring?
 *
 * }
 *
 *
 */


exports.complexSearch = function (queryObj, builder, callback) {

    logger.info('performing complex search on ', queryObj);

    var collection = builder.collection;


    // default values;
    var filter = {};
    var sort = {};
    var projection = {};
    var skip = 0;
    var limit = 100;
    var total = 0;
    var count = 0;
    var data = [];

    async.parallel(
        [

            function getTotal(callback) {

                // totalFilter - used to count the total. for example user's reports - we want total to include only reports belonging to user..

                // we will use the queryObj.filter.userId as a default fallback, which I think is good enough. but allow to specify
                var totalFilter = {};
                try {
                    if (!!queryObj.totalFilter) {
                        totalFilter = queryObj.totalFilter;
                    } else if (!!queryObj.filter.userId ){
                        totalFilter.userId = queryObj.filter.userId;
                    }

                }catch(e){
                    logger.error('unable to set total filter',e);
                }

                collection.count( queryObj.totalFilter || {}, function (err, result) {
                    total = result;
                    callback(err);
                });
            },
            function buildFilter(callback) {

                filter = queryObj.filter; //at first lets just take the filter as it is..


                callback();
            },
            function buildSort(callback) {
                if (queryObj.hasOwnProperty('sort')) {
                    sort = queryObj.sort;
                }
                callback();
            },
            function buildProjection(callback) {

                callback();
            },
            function buildLimit(callback) {
                if (queryObj.hasOwnProperty('limit')) {
                    limit = queryObj.limit;
                }

                callback();
            },
            function buildSkip(callback) {
                if (queryObj.hasOwnProperty('skip')) {
                    skip = queryObj.skip;
                }
                callback();
            }
        ],
        function finishedBuilding(err) {

            if (!!err) {
                callback(err);
                return;
            }

            // if no error, lets query

            async.parallel([
                    function getCount(callback) {
                        logger.info('counting');
                        collection.count(filter, function (err, countResult) {
                            logger.info('this is count result', countResult);
                            if (!!err) {
                                callback(err);
                                return;
                            }
                            count = countResult;
                            callback();
                        });
                    },
                    function getQuery(callback) {
                        logger.info('the compiled query obj generated ', filter, projection, sort, skip, limit);
                        collection.find(filter, projection).sort(sort).skip(skip).limit(limit).toArray(function (err, dataResult) {
                            if (!!err) {
                                callback(err);
                                return;
                            }

                            data = dataResult;
                            callback();
                        });
                    }

                ],
                function finishedQuery() {
                    logger.info('calling callback ');
                    callback(err, {
                        'data': data,
                        'count': count,
                        'total': total,
                        'skip': skip,
                        'limit': limit
                    });
                });


        }
    );
};