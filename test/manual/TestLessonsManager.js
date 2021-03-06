'use strict';
var assert = require('assert');
var appContext = require('../backend/managers');
var logger = appContext.log.getLogger('TestLessonsManager');
var lessonsManager = appContext.lessons;
var dbManager = appContext.db;
var async = require('async');
before(function() {
	logger.info('Test for LessonsManager started');
	logger.info('Clearing database');

	dbManager.connect('lessons', function(db, lessons, done) {
		lessons.remove();
		done();
	});
});

after(function() {
	logger.info('Test for LessonsManager completed');
	logger.info('Clearing database');

	dbManager.connect('lessons', function(db, lessons, done) {
		lessons.remove();
		done();
	});
});

describe('LessonsManager', function() {
	describe('#createLesson', function() {
		it('should save lesson in lessons collection', function(done) {
			var lesson = {
				'lessonText' : 'Who is president of America',
				'options' : 'Bill Gates , Brack Obama,Louis Philip',
				'correctAnswer' : 'Brack Obama',
                'name': 'Test Lesson Name'
			};
			async.waterfall([
				function testCreateLesson() {
					lessonsManager.createLesson(lesson, function(err, obj) {
						logger.info('Lesson [%s] created successfully', obj);
						lessonsManager.getLesson( { '_id' : obj._id }, function(done, lesson) {
							assert(lesson);
						});
						done();
					});

				}
			]);
		});
	});
	describe('#updateLesson', function() {
		it('should update lesson in lessons collection', function(done) {
			var modifiedLesson = {
				'lessonText' : 'Who is president of America',
				'options' : 'Bill Gates ,Brack Obama,Louis Philip',
				'correctAnswer' : 'Bill Gates',
                'name': 'Test Lesson Name'
			};
			var id;

			async.waterfall([
				function testUpdateLesson() {
					lessonsManager.getLesson(function(err, returnObject) {
						assert(returnObject);
						assert.equal(returnObject.length, 1);
						id = returnObject[0]._id;
                        modifiedLesson._id = id;
					});

					lessonsManager.updateLesson(modifiedLesson, function(err, updatedObject) {
						logger.info('Lesson [%s] updated successfully', updatedObject);
						assert(updatedObject);

					});
                    logger.info('************* HELLO %s', modifiedLesson._id);
					lessonsManager.getLesson( { '_id' : id } , function(err, obj) {
						assert(obj);
						assert.equal(obj.correctAnswer, modifiedLesson.correctAnswer);
					});
					done();
				}
			]);
		});

	});
	describe('#deleteLesson', function() {
		it('should delete lesson in lessons collection', function(done) {
			var newLesson = {
				'lessonText' : 'Who is Newton ?',
				'options' : 'Scientist ,Cricketer,Politician',
				'correctAnswer' : 'Scientist',
                'name': 'Test Lesson Name'
			};
			var id;

			async.waterfall([
				function testDeleteLesson() {

					lessonsManager.createLesson(newLesson, function(done, returnObject) {
						assert(returnObject);
						id = returnObject._id;
                        newLesson._id = id;
					});

					lessonsManager.deleteLesson(id, newLesson.userId, function(/*err*/) {
                        // Commented out since when looking on LessonsManager.deleteLesson, I see that it only invokes
                        // the callback with err (and not (err, obj), as implied by this test).
//						logger.info('Lesson [%s] deleted successfully', obj);
//						assert(obj);

					});

					lessonsManager.getLesson( { 'fake' : 'guy' }, function(id, returnObject) {
						assert(!returnObject);
					});
					done();
				}
			]);
		});

	});

});
