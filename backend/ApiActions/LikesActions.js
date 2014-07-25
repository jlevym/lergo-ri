var controllers = require('../controllers');
var middlewares = require('../middlewares');
var permissions = require('../permissions');

exports.createLessonLike = {
    'spec': {
        'description': 'User likes this lesson',
        'name': 'getAllLessons',
        'path': '/likes/{itemType}/{itemId}/create',
        // 'notes': 'Returns 200 if everything went well, otherwise returns
        // error response',
        'summary': 'User likes this lesson',
        'method': 'POST',
        'parameters': [
            {
                'paramType': 'path',
                'name': 'itemId',
                'required': true,
                'description': 'item id',
                'type': 'ObjectIDHash'
            },
            {
                'paramType': 'path',
                'name': 'itemType',
                'required': true,
                'description': 'item type',
                'type': 'LikeItemType'
            }


        ],
        'errorResponses': [
            {
                'code': 500,
                'reason': 'server error'
            }
        ],
        'nickname': 'createLike'
    },
    'middlewares': [
        middlewares.users.exists,
        middlewares.likes,itemExists,
        middlewares.likes.notExists
    ],
    'action': controllers.likes.createLessonLike
};


exports.countLikes = {
    'spec': {
        'description': 'Count likes',
        'name': 'countLikes',
        'path': '/likes/{itemType}/{itemId}/count',
        // 'notes': 'Returns 200 if everything went well, otherwise returns
        // error response',
        'summary': 'Count likes',
        'method': 'GET',
        'parameters': [
            {
                'paramType': 'path',
                'name': 'itemId',
                'required': true,
                'description': 'item id',
                'type': 'ObjectIDHash'
            },
            {
                'paramType': 'path',
                'name': 'itemType',
                'required': true,
                'description': 'item type',
                'type': 'LikeItemType'
            }
        ],
        'errorResponses': [
            {
                'code': 500,
                'reason': 'server error'
            }
        ],
        'nickname': 'countLikes'
    },
    'middlewares': [
        middlewares.users.exists,
        middlewares.likes,itemExists,
        middlewares.likes,optionalLikeItemId
    ],
    'action': controllers.likes.createLessonLike
};
