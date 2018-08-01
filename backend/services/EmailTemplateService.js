'use strict';

/**
 * @module EmailTemplateService
 * @type {Logger}
 */

var logger = require('log4js').getLogger('EmailTemplateService');

var _templatesDir;

// loading this module asynchronous.
// this might not be best practice - as we might get requests that require email
// before templates are loaded, but I prefer it this way as this does not hand start time
// for 80% of the scenarios.

exports.load = function( templatesDir, callback ){
    _templatesDir = templatesDir;
    if ( !callback ){
        callback = function(){};
    }
    // guy - todo - check if we still need this
    setTimeout( function(){
        var emailTemplates = require('email-templates');
        emailTemplates(templatesDir, function(err, template) {
            if (!!err ) {
                logger.error('error while trying to load email templates', err);
                throw err;
            }
            logger.info('loaded email templates successfully');
            exports.templateFunc = template;
            callback();
        });
    },0);
};

// guy - seems that saving a reference to 'template' function like we did in `load` causes trouble when function is used in parallel
exports.template = function (name, locals, callback) {

    require('email-templates')(_templatesDir, function (err, template) {
        if (!!err) {
            logger.error('error while trying to load email templates', err);
            throw err;
        }
        template(name, locals, callback);
    });
};


/**
 *
 *
 *
 *
 * @param {object} locals
 * @param {string} locals.name user name
 * @param {string} locals.link reset password link
 * @param {string} locals.lergoLogoAbsoluteUrl
 * @param {string} locals.lergoLink link to lergo site
 * @param callback
 */

exports.renderReportReady = function( locals, callback ){
    exports.template('lessonReportReady', locals, callback );
};

exports.renderResetPassword = function( locals  , callback ){
    exports.template('resetPassword', locals, callback );
};

exports.renderLessonInvitation = function( locals, callback ){
    exports.template('lessonInvite', locals, callback );
};

exports.renderUserValidationEmail = function( locals, callback ){
    exports.template('validateUser', locals, callback );
};

exports.renderAbuseReportEmail = function( locals, callback ){
    exports.template('reportAbuse', locals, callback );
};

exports.renderAbuseReportAdminEmail = function( locals, callback ){
    exports.template('reportAbuseAdmin', locals, callback );
};

exports.classReportMarkup = function(emailVars, person) {
    if(emailVars.lessonLanguage === 'hebrew') {
        return `
            <img src=${person.imageLink} style="height: 100px; width: 200px; padding: 20px; border: 2px solid black">

                    <p>
                     ${emailVars.name} שלום 
            </p>
                <p>
                    הדו"ח מוכן עכשיו
                 <b>${emailVars.className}</b>
                לחץ על הקישור להלן כדי לראות את הדוח report.The יעודכנו כמו תלמידים נוספים לסיים את השיעור
                זהו הדוא"ל היחיד שתקבל בנוגע לשיעור או לדו"ח המחלקה.
            <p>
                <a href=${emailVars.link}>${emailVars.lessonTitle}</a>
                </p>
                <p>
                Powered by <a href="http://www.lergo.org/">LerGO - Educate Yourself.</a><br/>
                <a href="https://docs.google.com/forms/d/1wyO39CkCTiNAP1BrJLti0GjA8eMq6rv-QcZu0Lw1-tE/viewform?usp=send_form">Terms of Service</a> -
                <a href="https://docs.google.com/forms/d/1YQnB8KoouFW2cJHsO_bkdxAD2ekuLYJyvaH6AuIU-Ig/viewform?usp=send_form"> Send Feedback</a> -
                <a href="https://docs.google.com/forms/d/1t_CtQxTMJlTlLRx-3lSPv8bNfw3nVXpE2B2hGkdeSMg/viewform">Report Abuse</a> -
                <a href="https://docs.google.com/forms/d/1rU6sTKskoTqrd9u1wgiX_zG0QpfWsxizxe8CdDRj4fk/viewform?usp=send_form">Suggest a Lesson</a> -
                <a href="https://docs.google.com/forms/d/e/1FAIpQLSeFtpXck4viIM7aTo7GoZST3z2Cojjn0BNsb-o2IAz627fYsw/viewform?usp=sf_link">Why am I getting this email?</a><br>
                </p>
                    `;
    }else{
        return `
        <img src=${person.imageLink} style="height: 100px; width: 200px; padding: 20px; border: 2px solid black"> 

         <p>
            Dear ${emailVars.name},
        </p>
        <p>

           the class report <b>${emailVars.className}</b> is now available!
           <br/> Click on the link below to see the  report.The report will be updated as more students finish the lesson
           <br/> This is the only email you will get regarding the lesson or class report.
        <p>
            <a href=${emailVars.link}>${emailVars.lessonTitle}</a>
        </p>
        <p>
            Powered by <a href="http://www.lergo.org/">LerGO - Educate Yourself.</a><br/>
            <a href="https://docs.google.com/forms/d/1wyO39CkCTiNAP1BrJLti0GjA8eMq6rv-QcZu0Lw1-tE/viewform?usp=send_form">Terms of Service</a> -
            <a href="https://docs.google.com/forms/d/1YQnB8KoouFW2cJHsO_bkdxAD2ekuLYJyvaH6AuIU-Ig/viewform?usp=send_form"> Send Feedback</a> -
            <a href="https://docs.google.com/forms/d/1t_CtQxTMJlTlLRx-3lSPv8bNfw3nVXpE2B2hGkdeSMg/viewform">Report Abuse</a> -
            <a href="https://docs.google.com/forms/d/1rU6sTKskoTqrd9u1wgiX_zG0QpfWsxizxe8CdDRj4fk/viewform?usp=send_form">Suggest a Lesson</a> -
            <a href="https://docs.google.com/forms/d/e/1FAIpQLSeFtpXck4viIM7aTo7GoZST3z2Cojjn0BNsb-o2IAz627fYsw/viewform?usp=sf_link">Why am I getting this email?</a><br>
        </p>
`;
    }

};
