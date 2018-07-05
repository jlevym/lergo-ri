'use strict';

/**
 * @module LessonsController
 * @type {exports}
 */

var managers = require('../managers');
var services = require('../services');
var async = require('async');
var logger = require('log4js').getLogger('LessonsController');
var PlayList = require('../models/Lesson');
var _ = require('lodash');
var Like = require('../models/Like');

exports.getUserLessons = function(req, res) {
	var queryObj = req.queryObj;
	queryObj.filter.userId = req.sessionUser._id;
	managers.playLists.complexSearch(queryObj, function(err, obj) {
		if (!!err) {
			err.send(res);
			return;
		} else {
			res.send(obj);
			return;
		}
	});
};

exports.getUserLikedLessons = function(req, res) {
	var queryObj = req.queryObj;
	Like.find({
		userId : req.sessionUser._id,
		itemType : 'playList'
	}, {
		itemId : 1,
		_id : 1
	}, function(err, result) {
		if (!!err) {
			err.send(res);
			return;
		}
		var mapResults = {};
		_.each(result, function(r) {
			mapResults[r.itemId.toString()] = r._id.getTimestamp();
		});
		queryObj.filter._id = {
			$in : _.map(result, 'itemId')
		};
		managers.playLists.complexSearch(queryObj, function(err, obj) {
			if (!!err) {
				err.send(res);
				return;
			} else {
				_.each(obj.data, function(o) {
					o.lastUpdate = mapResults[o._id.toString()];
				});
				return res.send(obj);
			}
		});
	});

};

// assumes user and playList exists and user can see playList
// or playList is public and then we don't need user
exports.getLessonById = function(req, res) {
	if (!req.playList) {
		new managers.error.NotFound('could not find playList').send(res);
		return;
	}
	res.send(req.playList);
};

exports.getAdminLessons = function(req, res) {

	managers.playLists.complexSearch(req.queryObj, function(err, result) {
		if (!!err) {
			new managers.error.InternalServerError(err, 'unable to get all admin playLists').send(res);
			return;
		}

        var usersId = _.map(result.data,'userId');
        Lesson.countPublicLessonsByUser( usersId , function(err, publicCountByUser ){
            if ( !!err ){
                new managers.error.InternalServerError(err, 'unable to add count for public playLists').send(res);
                return;
            }
            _.each(result.data, function(r){
                r.publicCount = publicCountByUser[r.userId];
            });
            res.send(result);
        });
	});
};

exports.adminUpdateLesson = function(req, res) {
	var playList = req.body;
    playList.userId = services.db.id(playList.userId);
	playList._id = services.db.id(playList._id);
	managers.playLists.updateLesson(playList, function(err, obj) {
		if (!!err) {
			err.send(res);
			return;
		} else {
			res.send(obj);
			return;
		}
	});
};

exports.getPublicLessons = function(req, res) {

	try {
		var queryObj = req.queryObj;

		if (!queryObj.filter || !queryObj.filter.public || queryObj.filter.public.$exists !== 1) {

			throw new Error('public must be $exists 1');
		}
	} catch (e) {
		res.status(400).send('playLists controller - illegal filter value : ' + e.message);
		return;
	}

	var playLists = [];
	async.waterfall([ function loadLessons(callback) {
		managers.playLists.complexSearch(req.queryObj, function(err, result) {

			if (!!err) {
				callback(new managers.error.InternalServerError(err, 'unable to get all admin playLists'));
				return;
			}
            playLists = result;
			callback();
		});
	}, function loadUsers(callback) {

		var usersId = _.map(playLists.data, 'userId');
		managers.users.getPublicUsersDetailsMapByIds(usersId, function(err, usersById) {

			if (!!err) {
				callback(new managers.error.InternalServerError(err, 'unable to load users by id'));
				return;
			}
			_.each(playLists.data, function(l) {
				l.user = usersById[l.userId];
			});

			callback();
		});
	} ], function returnResponse(err) {
		if (!!err) {
			err.send(res);
			return;
		} else {
			res.send(playLists);
		}
	});

};

exports.getLessonIntro = function(req, res) {
	managers.playListss.getLessonIntro(req.params.playListId, function(err, result) {
		res.send(result);
	});
};

exports.overrideQuestion = function(req, res) {
	logger.info('overriding question :: ' + req.question._id + ' in playList ::' + req.playList._id);

	var newQuestion = null;
	async.waterfall([ function copyQuestion(callback) {
		logger.info('copying question');
		managers.questions.copyQuestion(req.sessionUser, req.question, callback);
	}, function replaceQuestion(_newQuestion, callback) {
		logger.info('replacing question');
		try {
			newQuestion = _newQuestion;
			var oldQuestion = req.question;
			var playListObj = new Lesson(req.playList);
            playListObj.replaceQuestionInLesson(oldQuestion._id.toString(), newQuestion._id.toString());
			playListObj.update();
			callback(null);
			return;
		} catch (e) {
			logger.error('unable to override question', e);
			callback(e);
			return;
		}
		// wrap playList object with our model and invoke save.

	} ], function(err) {
		logger.info('override async finished');
		if (!!err) {
			res.status(500).send('unable to replace' + err.message);
			return;
		} else if (newQuestion === null) {
			res.status(500).send('unknown error');
			return;
		} else { // newQuestion != null
			logger.info('completed successfully');
			res.status(200).send({
				'playList' : req.playList,
				'quizItem' : newQuestion
			});
		}
	});
};

exports.copyLesson = function(req, res) {
	managers.playLists.copyLesson(req.sessionUser, req.playList, function(err, result) {
		res.send(result);
	});
};

function _updateLesson( playList , res ){
    managers.playLists.updateLesson(playList, function(err, obj) {
        if (!!err) {
            err.send(res);
            return;
        } else {
            res.send(obj);
            return;
        }
    });
}

/**
 *
 *
 * ---- new function format. this format will align to a new API REST format
 * similar to http://api.stackexchange.com/docs/
 *
 * it will assume user was authorized to get here, and will NOT assume user own
 * the resource.
 *
 * For example - update playList will not assume the editor is the user on the
 * request, but will assume the user on the request is allowed to edit this
 * playList;
 *
 *
 *
 */

exports.update = function(req, res) {
	logger.info('updating playList');
	var playList = req.body;

	playList.userId = req.playList.userId;
	playList._id = services.db.id(playList._id);

    _updateLesson( playList, res );

};


/**
 *
 * This function only publishes a playList.
 *
 * We separate this from 'update' to allow the existance of 'publishers' in the system which are not 'editors'.
 *
 * @param req
 * @param res
 */
exports.publish = function(req, res){
    var playList = req.playList;
    playList.public = new Date().getTime();
    _updateLesson( playList, res );
};


/**
 *
 * This function only unpublishes a playList.
 *
 * We separate this from 'update' to allow the existance of 'publishers' in the system which are not 'editors'.
 *
 * @param req
 * @param res
 */
exports.unpublish = function(req, res){
    var playList = req.playList;
    delete playList.public;
    _updateLesson( playList, res );
};

/**
 *
 * Creates a new playList and assigns it to the logged in user.
 *
 * @param req
 * @param res
 */

exports.create = function(req, res) {
	var playList = {};
	playList.userId = req.sessionUser._id;
	managers.playList.createPlayList(playList, function(err, obj) {
		if (!!err) {
			err.send(res);
			return;
		} else {
			res.send(obj);
			return;
		}
	});
};

/**
 * gets a list of ids and returns the corresponding playLists.
 *
 * how to pass a list of ids over req query?
 *
 * ?idsList[]=1&idsList[]=2&idsList[]=3
 *
 * @param req
 * @param res
 */
exports.findLessonsByIds = function(req, res) {

	var objectIds = req.getQueryList('playListsId');
	logger.info('this is object ids', objectIds);
	objectIds = services.db.id(objectIds);

	Lesson.find({
		'_id' : {
			'$in' : objectIds
		}
	}, {}, function(err, result) {
		if (!!err) {
			new managers.error.InternalServerError(err, 'unable to find playLists by ids').send(res);
			return;
		} else {
			res.send(result);
			return;
		}
	});
};

exports.deleteLesson = function(req, res) {
	managers.playLists.deleteLesson(req.playList._id, function(err, deletedLesson) {
		if (!!err) {
			logger.error('error deleting playList', err);
			err.send(res);
			return;
		} else {
			managers.playListsInvitations.deleteByLessonId(req.playList._id, function(err/*
																						 * ,
																						 * deletedInvitations
																						 */) {
				if (!!err) {
					logger.error('error deleting playLists invitations', err);
					err.send(res);
					return;
				} else {
					res.send(deletedLesson);
					return;
				}
			});
		}
	});

};

exports.findUsages = function(req, res) {
	Lesson.findByQuizItems(req.question, function(err, obj) {
		if (!!err) {
			err.send(res);
			return;
		} else {
			res.send(obj);
			return;
		}
	});
};
