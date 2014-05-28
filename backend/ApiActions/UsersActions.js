var controllers = require('../controllers');
exports.signup = {
	'spec' : {
		'description' : 'Sign up a new user',
		'name' : 'signup',
		'path' : '/backend/users/signup',
		// 'notes': 'Returns 200 if everything went well, otherwise returns
		// error response',
		'summary' : 'Sign up a new user',
		'method' : 'POST',
		'parameters' : [ {
			'paramType' : 'body',
			'name' : 'user',
			required : true,
			'description' : 'User signup details',
			'type' : 'UserSignupForm'
		} ],
		'errorResponses' : [ {
			'code' : 500,
			'reason' : 'unable to signup'
		} ],
		'nickname' : 'signupUser'
	},
	'action' : controllers.users.signup
};

exports.login = {
	'spec' : {
		'description' : 'User login',
		'name' : 'login',
		'path' : '/backend/users/login',
		'summary' : 'user logs in and creates a new session. The backend is responsible to maintain the session.',
		'method' : 'POST',
		'parameters' : [ {
			'paramType' : 'body',
			'name' : 'loginCredentials',
			require : true,
			'description' : 'login credentials',
			'type' : 'LoginCredentials'
		} ],
		'errorResponses' : [ {
			'code' : 500,
			'reason' : 'unable to login'
		}, {
			'code' : 401,
			'reason' : 'wrong username/password'
		} ],
		'nickname' : 'login'

	},
	'action' : controllers.users.login
};

exports.validateUser = {
	'spec' : {
		'description' : 'Validate User Login',
		'name' : 'validateUserLogin',
		'path' : '/backend/users/{userId}/validate',
		'summary' : 'User validation',
		'method' : 'POST',
		'parameters' : [ {
			'paramType' : 'body',
			require : true,
			'description' : 'user validation data',
			'type' : 'UserValidationData'
		} ],
		'errorResponses' : [ {
			'code' : 500,
			'reason' : 'unable to validate'
		}, {
			'code' : 401,
			'reason' : 'invalid user details'
		} ],
		'nickname' : 'validateUser'

	},
	'action' : controllers.users.validateUser
};

exports.resendValidateEmail = {
	'spec' : {
		'description' : 'Send validation email again',
		'name' : 'resendValidationEmail',
		'path' : '/backend/users/validate/resend',
		'summary' : 'Resend user validation email',
		'method' : 'POST',
		'parameters' : [ {
			'paramType' : 'body',
			require : true,
			'description' : 'login credentials',
			'type' : 'LoginCredentials'
		} ],
		'errorResponses' : [ {
			'code' : 500,
			'reason' : 'unable to send email'
		}, {
			'code' : 401,
			'reason' : 'invalid user details'
		} ],
		'nickname' : 'resendValidationEmail'

	},
	'action' : controllers.users.resendValidationEmail
};

exports.changePassword = {
	'spec' : {
		'description' : 'Change Password',
		'name' : 'changePassword',
		'path' : '/backend/users/changePassword',
		'summary' : 'user changes password after clicking "request password reset" email.',
		'method' : 'POST',
		'parameters' : [ {
			'paramType' : 'body',
			'name' : 'reset password details',
			require : true,
			'description' : 'details for resetting password',
			'type' : 'ChangePasswordDetails'
		} ],
		'errorResponses' : [ {
			'code' : 500,
			'reason' : 'unable to login'
		}, {
			'code' : 401,
			'reason' : 'wrong username/password'
		} ],
		'nickname' : 'login'

	},
	'action' : controllers.users.changePassword
};

exports.resetPasswordRequest = {
	'spec' : {
		'description' : 'Request Password Reset',
		'name' : 'resetPasswordRequest',
		'path' : '/backend/users/requestPasswordReset',
		'summary' : 'user requests a password reset. A link is delivered to the user that leads to the password reset page.',
		'method' : 'POST',
		'parameters' : [ {
			'paramType' : 'body',
			'name' : 'resetPasswordDetails',
			require : true,
			'description' : 'an object containing optional username and optional email. One of the two is required.',
			'type' : 'RequestResetPasswordDetails'
		} ],
		'errorResponses' : [ {
			'code' : 500,
			'reason' : 'unable to login'
		}, {
			'code' : 401,
			'reason' : 'wrong username/password'
		} ],
		'nickname' : 'resetPasswordRequest'

	},
	'action' : controllers.users.requestPasswordReset
};

exports.logout = {
	'spec' : {
		'description' : 'Logout. Ends session.',
		'name' : 'logout',
		'path' : '/backend/users/logout',
		'summary' : 'logs out user. removes session. returns 200',
		'method' : 'POST',
		'parameters' : [],
		'errorResponses' : [],
		'nickname' : 'logout'

	},
	'action' : controllers.users.logout
};

exports.isLoggedIn = {
	'spec' : {
		'description' : 'Is User Logged In?',
		'name' : 'isLoggedIn',
		'path' : '/backend/user/loggedin',
		'summary' : 'returns user public details iff user is logged in. Otherwise 401.',
		'method' : 'GET',
		'parameters' : [],
		'errorResponses' : [ {
			'code' : 401,
			'reason' : 'not logged in'
		} ],
		'nickname' : 'isLoggedIn'

	},
	'action' : controllers.users.isLoggedIn
};

exports.createQuestion = {
	'spec' : {
		'description' : 'Create question',
		'name' : 'create',
		'path' : '/backend/user/questions',
		'summary' : 'Create new question',
		'method' : 'POST',
		'parameters' : [ {
			'paramType' : 'body',
			'name' : 'question',
			required : true,
			'description' : 'Question details',
			'type' : 'Question'
		} ],
		'errorResponses' : [ {
			'code' : 500,
			'reason' : 'unable to create'
		} ],
		'nickname' : 'createQuestion'
	},
	'action' : controllers.questions.createQuestion
};
exports.getQuestions = {
	'spec' : {
		'description' : 'Get questions',
		'name' : 'getQuestions',
		'path' : '/backend/user/questions',
		'summary' : 'Get all questions',
		'method' : 'GET',
		'parameters' : [],
		'errorResponses' : [ {
			'code' : 500,
			'reason' : 'unable to get question'
		} ],
		'nickname' : 'getQuestions'
	},
	'action' : controllers.questions.getQuestions
};

exports.findQuestionsByIds = {
	'spec' : {
		'description' : 'Finds multiple questions by list of ids',
		'name' : 'findQuestionsById',
		'path' : '/backend/questions/find',
		'summary' : 'Finds multiple questions by list of ids',
		'method' : 'GET',
		'parameters' : [ {
			'paramType' : 'query',
			'name' : 'ids',
			'required' : false,
			'description' : 'list of ids to find',
			'type' : 'array',
			'items' : {
				'type' : 'string'
			}

		} ],
		'nickname' : 'findQuestionsById'

	},
	'action' : controllers.questions.findUserQuestionsByIds
};

exports.getQuestionById = {
	'spec' : {
		'description' : 'Get question by id',
		'name' : 'getQuestions',
		'path' : '/backend/user/questions/{id}',
		'summary' : 'Get question by id',
		'method' : 'GET',
		'parameters' : [ {
			'paramType' : 'path',
			'name' : 'id',
			required : true,
			'description' : 'ID of question that needs to be fetched',
			'type' : 'string'
		} ],
		'errorResponses' : [ {
			'code' : 500,
			'reason' : 'unable to get question'
		} ],
		'nickname' : 'getQuestionById'
	},
	'action' : controllers.questions.getQuestionById
};
exports.updateQuestion = {
	'spec' : {
		'description' : 'Updates question',
		'name' : 'update question',
		'path' : '/backend/user/questions/{id}',
		'summary' : 'Update question',
		'method' : 'POST',
		'parameters' : [ {
			'paramType' : 'body',
			'name' : 'question',
			required : true,
			'description' : 'Question details',
			'type' : 'Question'
		}, {
			'paramType' : 'path',
			'name' : 'id',
			required : true,
			'description' : 'ID of question that needs to be updated',
			'type' : 'string'
		} ],
		'errorResponses' : [ {
			'code' : 500,
			'reason' : 'unable to update'
		} ],
		'nickname' : 'updateQuestion'
	},
	'action' : controllers.questions.updateQuestion
};
exports.findQuestionUsages = {
	'spec' : {
		'description' : 'find question usages',
		'name' : 'findQuestionUsages',
		'path' : '/backend/user/questions/{id}/usages',
		'summary' : 'find question usages',
		'method' : 'GET',
		'parameters' : [ {
			'paramType' : 'path',
			'name' : 'id',
			required : true,
			'description' : 'ID of question that usages to be find',
			'type' : 'string'
		} ],
		'errorResponses' : [ {
			'code' : 500,
			'reason' : 'unable to find Usages'
		} ],
		'nickname' : 'findQuestionUsages'
	},
	'action' : controllers.questions.findUsages
};

exports.createLesson = {
	'spec' : {
		'description' : 'Create lesson',
		'name' : 'create',
		'path' : '/backend/user/lessons',
		'summary' : 'Create new lesson',
		'method' : 'POST',
		'parameters' : [ {
			'paramType' : 'body',
			'name' : 'lesson',
			required : true,
			'description' : 'Lesson details',
			'type' : 'Lesson'
		} ],
		'errorResponses' : [ {
			'code' : 500,
			'reason' : 'unable to create'
		} ],
		'nickname' : 'createLesson'
	},
	'action' : controllers.lessons.createLesson
};
exports.getUserLessons = {
	'spec' : {
		'description' : 'Get lessons',
		'name' : 'getLessons',
		'path' : '/backend/user/lessons',
		'summary' : 'Get all lessons',
		'method' : 'GET',
		'parameters' : [],
		'errorResponses' : [ {
			'code' : 500,
			'reason' : 'unable to get lesson'
		} ],
		'nickname' : 'getLessons'
	},
	'action' : controllers.lessons.getUserLessons
};
exports.getUserLessonById = {
	'spec' : {
		'description' : 'Get user lesson by id',
		'name' : 'getUserLessonsById',
		'path' : '/backend/user/lessons/{id}',
		'summary' : 'Get lesson by id',
		'method' : 'GET',
		'parameters' : [ {
			'paramType' : 'path',
			'name' : 'id',
			required : true,
			'description' : 'ID of lesson that needs to be fetched',
			'type' : 'string'
		} ],
		'errorResponses' : [ {
			'code' : 500,
			'reason' : 'unable to get lesson'
		} ],
		'nickname' : 'getUserLessonById'
	},
	'action' : controllers.lessons.getUserLessonById
};
exports.updateLesson = {
	'spec' : {
		'description' : 'Create lesson',
		'name' : 'create',
		'path' : '/backend/user/lessons/{id}',
		'summary' : 'Update lesson',
		'method' : 'POST',
		'parameters' : [ {
			'paramType' : 'body',
			'name' : 'lesson',
			required : true,
			'description' : 'Lesson details',
			'type' : 'Lesson'
		}, {
			'paramType' : 'path',
			'name' : 'id',
			required : true,
			'description' : 'ID of lesson that needs to be updated',
			'type' : 'string'
		} ],
		'errorResponses' : [ {
			'code' : 500,
			'reason' : 'unable to update'
		} ],
		'nickname' : 'updateLesson'
	},
	'action' : controllers.lessons.updateLesson
};

exports.deleteLesson = {
	'spec' : {
		'description' : 'Delete lesson corresponding to the id',
		'name' : 'deleteLesson',
		'path' : '/backend/user/lessons/{id}/delete',
		'summary' : 'Delete lesson corresponding to the id',
		'method' : 'POST',
		'parameters' : [ {
			'paramType' : 'path',
			'name' : 'id',
			required : true,
			'description' : 'ID of lesson that needs to be deleted',
			'type' : 'string'
		} ],
		'errorResponses' : [ {
			'code' : 500,
			'reason' : 'unable to delete lesson'
		} ],
		'nickname' : 'deleteLesson'
	},
	'action' : controllers.lessons.deleteLesson
};

exports.lessonInviteCreate = {
	'spec' : {
		'description' : 'Create a lesson invitation',
		'name' : 'lessonInviteCreate',
		'path' : '/backend/user/lessons/{id}/invite/create',
		'summary' : 'create a lesson invitation instance and sends an email',
		'method' : 'POST',
		'parameters' : [ {
			'paramType' : 'path',
			'name' : 'id',
			required : true,
			'description' : 'ID of lesson to invite to',
			'type' : 'string'
		} ],
		'errorResponses' : [ {
			'code' : 500,
			'reason' : 'unable to create lesson invitation'
		} ],
		'nickname' : 'lessonInviteCreate'
	},
	'action' : controllers.lessonsInvitations.create
};

exports.checkQuestionAnswer = {
	'spec' : {
		'description' : 'Check Question Answer',
		'name' : 'checkQuestionAnswer',
		'path' : '/backend/questions/checkAnswer',
		'summary' : 'checks if user answered question correctly',
		'method' : 'POST',
		'parameters' : [ {
			'paramType' : 'body',
			'name' : 'question with answer',
			required : true,
			'type' : 'Question'
		} ],
		'errorResponses' : [ {
			'code' : 500,
			'reason' : 'unable to check answer'
		} ],
		'nickname' : 'checkQuestionAnswer'
	},
	'action' : controllers.questions.checkQuestionAnswer
};