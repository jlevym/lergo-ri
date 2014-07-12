var managers = require('../managers');

var _ = require('lodash');
var logger = require('log4js').getLogger('LessonsInvitationsController');

// finds a lesson owned by currently logged in user
function findLesson(req, res, next) {
    var lessonId = req.params.lessonId;
    logger.info('finding lesson', JSON.stringify(lessonId));
    managers.lessons.getLesson({ '_id': managers.db.id(lessonId), 'userId': req.user._id }, function (err, result) {
        if (!!err) {
            logger.error('unable to findLesson', err);
            err.send(res);
            return;
        } else {
            logger.info('putting lesson on request', result);
            req.lesson = result;
            next();
        }
    });
}

exports.create = function (req, res) {
    logger.debug('creating invitation for lesson', req.lesson);

    var invitation = req.body || {};
    var anonymous = !req.body || JSON.stringify(req.body) === '{}';

    invitation = _.merge({ 'anonymous': anonymous, 'lessonId': req.lesson._id }, invitation);

    // add inviter in case we have details and this is not an anonymous invitation
    if (!!req.user && !anonymous ) {
        invitation.inviter = req.user._id;
    }

    // in case user is logged in and there's no invitee details, set logged in user as invitee
    if ( anonymous && !!req.user) {
        logger.debug('setting invitee on invitation');
        invitation.invitee = { 'name': req.user.username };
    }

    managers.lessonsInvitations.create(invitation, function (err, result) {
        if (!!err) {
            logger.error('unable to create lesson invitation', err);
            err.send(res);
            return;
        } else {
            res.send(result);
        }
    });
};

exports.report = function (req, res) {
    managers.lessonsInvitations.updateReport(req.params.invitationId, req.body, function (err, result) {
        if (!!err) {
            err.send(res);
            return;
        } else {
            res.send(result);
        }
    });
};

exports.sendLessonInviteReportReady = function (req, res) {
    managers.lessonsInvitations.sendReportLink(req.emailResources, req.params.invitationId, function (err) {
        if (!!err) {
            err.send(res);
            return;
        }

        res.send(200);

    });
};


exports.getReport = function (req, res) {
    managers.lessonsInvitations.getReport(req.params.invitationId, function (err, report) {
        if (!!err) {
            err.send(res);
            return;
        }

        res.send(report);
    });
};


exports.list = function (req, res) {
    findLesson(req, res, function () {
        managers.lessonsInvitations.find({ 'lessonId': req.lesson._id }, function (err, result) {
            if (!!err) {
                logger.error('unable to find invitations', err);
                err.send(res);
                return;
            } else {
                res.send(result);
            }
        });
    });

};


/**
 * <p>
 * When we generate an invite, we simply save invitation details.<br/>
 * To start the lesson from the invitation, we first construct a copy of the lesson <br/>
 * </p>
 *
 * <p>
 * We use a copy because otherwise the report might be out of sync.<br/>
 * </p>
 *
 *
 *
 *
 * @param req
 * @param res
 */
exports.build = function (req, res) {
    var id = req.params.id;
    var construct = req.query.construct;
    var constructForce = req.query.constructForce;

    logger.info('building the invitation', id, construct, constructForce);
    managers.lessonsInvitations.find({'_id': managers.db.id(id)}, {}, function (err, result) {
        if (!!err) {
            err.send(res);
            return;
        }
        if ( !result ){
            res.send(404);
            return;
        }
        if (( !!constructForce || !result.lesson ) && construct) {
            logger.info('constructing invitation');
            managers.lessonsInvitations.buildLesson(result, function (err, constructed) {
                if (!!err) {
                    logger.error('error while constructing lesson', err);
                    res.send(500);
                    return;
                }
                res.send(constructed);
            });
        } else {
            res.send(result);
        }

    });
};
