module.exports = function (actions,tags) {
  describe('On-Premise Environment',function(){
    describe('Testing on-premise environment functionality',function() {
      actions.logout();
      actions.iAmLoggedInFor('authProfile');
      actions.goToPage('#/');
      // actions.iAmLoggedInFor('onPremise');
      // actions.goToPage('#/');
      // actions.clickOnClass('#user-menu');
      // actions.clickOnElementWithText(' Payment Info');
      // actions.checkingUrlEndsWith('#/profile/payment/view');
      // actions.clickOnElementWithText('Add Credit Card');
      // actions.enterTextInField('#cardholderName', 'Test');
      // actions.enterTextInField('#ccNumber', '4111111111111111');
      // actions.enterTextInField('#securityCode', '411');
      // actions.clickOnClass('#form-group-ccExpiryMonth');
      // actions.clickOnElementWithText('01');
      // actions.clickOnClass('#form-group-ccExpiryYear');
      // actions.clickOnElementWithText('25');
      // actions.clickOnClass('#submit');
      // actions.waitForActionToComplete(2000);
      // actions.goToPage('#/');
      actions.projectExisting('onPremiseProject', 'This is a test project');
      actions.clickOnElementWithText('onPremiseProject');
      actions.clickOnElementWithText('Trial');
      actions.upgradeToPlan("Enterprise");
      actions.clickOnElementWithText(' Confirm Billing Change');
      actions.waitForActionToComplete(2000);
      actions.iSeeTextIn("a.project-plan.label-commercial", "Enterprise");
      actions.clickOnElementWithText('Settings');
      actions.clickOnElementWithText('On-Premise Environment');
      actions.enterTextInField('#serverURL', 'https://remote.form.io');
      actions.enterTextInField('#portalSecret', 'remotesecret');
      actions.clickOnElementWithText('Continue ');
      actions.iSeeText('Connect to an On-Premise Environment');
      actions.clickOnClass('.ui-select-match.ng-scope');
      actions.clickOnClass('.ui-select-choices-row-inner');
      actions.clickOnElementWithText('Connect Stage ');
      actions.waitForActionToComplete(2000);
      actions.iSeeText('https://remote.form.io');
      actions.waitForActionToComplete(5000);
      actions.pageReload();
      actions.iSeeText('https://remote.form.io/');
      actions.clickOnElementWithText('Forms');
      actions.iSeeTextCount('https://remote.form.io/', '6');
      actions.clickOnElementWithText(' New Form');
      actions.clickOnElementWithText('API Web Form');
      actions.enterTextInField('#title', 'Test Form');
      actions.dragTo('Text Field', 'formarea');
      actions.iSeeText('Text Field Component');
      actions.enterTextInField('#label', 'Text Field');
      actions.clickOnElementWithText('Save');
      actions.waitForActionToComplete(1000);
      actions.clickOnElementWithText('Create Form');
      actions.clickOnClass('.toast-message');
      actions.clickOnElementWithText('Forms');
      actions.clickOnClass('.glyphicon.glyphicon-trash');
      actions.iSeeText('User Login Form ');
      actions.iSeeText('Are you sure you wish to delete the form?');
      actions.clickOnButton('No');
      actions.checkingUrlEndsWith('/form/');
      actions.iSeeText('User Login');
      actions.clickOnClass('.glyphicon.glyphicon-trash');
      actions.iSeeText('Are you sure you wish to delete the form?');
      actions.clickOnButton('Yes');
      actions.checkingUrlEndsWith('/form/');
      actions.clickOnClass('.toast-message');
      actions.iDonotSeeText('User Login');
      actions.clickOnElementWithText('+ New Stage');
      actions.btnDisabled(' Add Stage');
      actions.enterTextInField('#title', 'Dev');
      actions.clickOnElementWithText(' Add Stage');
      actions.clickOnClass('.toast-message');
      actions.iSeeText('Dev Project Url:');
      actions.checkingUrlEndsWith('/overview');
      actions.clickOnElementWithText('Settings');
      actions.clickOnElementWithText('Delete Dev Stage');
      actions.clickOnElementWithText(' Yes');
      actions.iDonotSeeText('Dev');
    });
    tags('smoke').describe('',function(){
      actions.clickOnElementWithText('Resources');
      actions.clickOnElementWithText(' New Resource');
      actions.checkingUrlEndsWith('/resource/create/resource');
      actions.enterTextInField('#title','Test Resource');
      actions.iSeeValueIn('#name','testResource');
      actions.iSeeValueIn('#path','testresource');
      actions.dragTo('Text Field', 'formarea');
      actions.iSeeText('Text Field Component');
      actions.enterTextInField('#label', 'Text Field');
      actions.clickOnElementWithText('Save');
      actions.clickOnButton('Create Resource');
      actions.iSeeTextIn(".toast-message", 'Successfully created form!');
      actions.iSeeText('Save Resource');
      actions.clickOnElementWithText('Forms');
      actions.clickOnElementWithText('Test Form');
      actions.clickOnElementWithText(' Use');
      actions.iSeeText('Submit Form');
      actions.iSeeText('Text Field');
      actions.enterTextInField('#textField','Test Submission');
      actions.clickOnButton('Submit');
      actions.iSeeTextIn(".toast-message",'New submission added!');
      actions.clickOnElementWithText(' Data');
      actions.iSeeText('Test Submission');
      actions.clickOnElementWithText('Test Submission');
      actions.clickOnElementWithTextIndex(' Edit',1);
      actions.checkingUrlEndsWith('/edit');
      actions.enterTextInField('#textField','Updated Submission');
      actions.clickOnButton('Submit');
      actions.checkingUrlEndsWith('/submission');
      actions.iSeeText('Updated Submission');
      actions.clickOnElementWithText('Updated Submission');
      actions.clickOnElementWithText(' Delete');
      actions.iSeeText('Are you sure you want to delete this submission?');
      actions.clickOnElementWithText('Cancel');
      actions.iDonotSeeText('Are you sure you want to delete this submission?');
      actions.iSeeText('Updated Submission');
      actions.clickOnElementWithText(' Delete');
      actions.iSeeText('Are you sure you want to delete this submission?');
      actions.clickOnElementWithText('Delete');
      actions.iDonotSeeText('Updated Submission');
      actions.clickOnElementWithText('Resources');
      actions.clickOnElementWithTextIndex(' Use',2);
      actions.iSeeText('Submit Form');
      actions.iSeeText('Text Field');
      actions.enterTextInField('#textField','Test Submission');
      actions.clickOnButton('Submit');
      actions.iSeeTextIn(".toast-message",'New submission added!');
      actions.clickOnElementWithText(' Data');
      actions.iSeeText('Test Submission');
      actions.clickOnElementWithText('Test Submission');
      actions.clickOnElementWithTextIndex(' Edit',1);
      actions.checkingUrlEndsWith('/edit');
      actions.enterTextInField('#textField','Updated Submission');
      actions.clickOnButton('Submit');
      actions.checkingUrlEndsWith('/submission');
      actions.iSeeText('Updated Submission');
      actions.clickOnElementWithText('Updated Submission');
      actions.clickOnElementWithText(' Delete');
      actions.iSeeText('Are you sure you want to delete this submission?');
      actions.clickOnElementWithText('Cancel');
      actions.iDonotSeeText('Are you sure you want to delete this submission?');
      actions.iSeeText('Updated Submission');
      actions.clickOnElementWithText(' Delete');
      actions.iSeeText('Are you sure you want to delete this submission?');
      actions.clickOnElementWithText('Delete');
      actions.iDonotSeeText('Updated Submission');
      actions.clickOnElementWithText('Settings');
      actions.iSeeText(' Live ');
      actions.iDonotSeeText('Delete Live Stage');
      actions.checkElement('//*[@id="protect"]');
      actions.clickOnElementWithText(' Save Stage');
      actions.waitForActionToComplete(1000);
      actions.clickOnElementWithText('Forms');
      actions.checkElementWithTextIsDisabled(' New Form');
      actions.checkElementWithTextIsDisabled(' Edit');
      actions.checkElementWithTextIsDisabled(' Actions');
      actions.checkElementWithTextIsDisabled(' Access');
      actions.checkElementWithTextIsNotDisabled(' Use');
      actions.checkElementWithTextIsNotDisabled(' Embed');
      actions.clickOnElementWithText('Settings');
      actions.checkElement('//*[@id="protect"]');
      actions.clickOnElementWithText(' Save Stage');
      actions.waitForActionToComplete(1000);
      actions.clickOnElementWithText('Forms');
      actions.clickOnElementWithText('Test Form');
      actions.clickOnElementWithText(' Actions');
      actions.clickOnElementWithText('Select an Action');
      actions.clickOnElementWithText('Email');
      actions.clickOnElementWithText(' Add Action');
      actions.enterTextInField('#emails','test@test.com');
      actions.clickOnElementWithText('Save Action');
      actions.iSeeText('Email');
      actions.clickOnElementWithText('+ New Stage');
      actions.btnDisabled(' Add Stage');
      actions.enterTextInField('#title', 'Dev');
      actions.clickOnElementWithText(' Add Stage');
      actions.waitForActionToComplete(1000);
      actions.iSeeText('Dev Project Url:');
      actions.checkingUrlEndsWith('/overview');
      // actions.clickOnElementWithText('Forms');
      // actions.iSeeText('Test Form');
      // actions.clickOnElementWithText('Resources');
      // actions.iSeeText('Test Resource');
      actions.clickOnElementWithText('Settings');
      actions.enterTextInField('#title','Updated Dev');
      actions.clickOnElementWithText(' Save Stage');
      actions.waitForActionToComplete(2000);
      actions.iSeeText('Updated Dev Project Url:');
      actions.clickOnElementWithText(' Live ');
      actions.clickOnElementWithText('Forms');
      actions.clickOnElementWithText(' New Form');
      actions.clickOnElementWithText('API Web Form');
      actions.enterTextInField('#title','Test Form 2');
      actions.clickOnElementWithText('Create Form');
      actions.clickOnClass('.toast-message');
      actions.clickOnElementWithText('Settings');
      actions.clickOnElementWithText('Staging');
      actions.clickOnElementWithText('Create');
      actions.iSeeText('Create version tag from Live');
      actions.enterTextInField('#tag','0.0.1');
      actions.clickOnElementWithText(' Create version tag');
      actions.clickOnClass('.toast-message');
      actions.iSeeTextIn('.badge', '0.0.1');
      actions.clickOnElementWithText(' Updated Dev ');
      actions.clickOnElementWithText('Forms');
      actions.iDonotSeeText('Test Form 2');
      actions.clickOnElementWithText('Settings');
      actions.clickOnElementWithText('Staging');
      actions.clickOnClass('select.form-control');
      actions.clickOnElementWithTextIndex('0.0.1',1);
      actions.clickOnElementWithText(' Deploy version tag to Updated Dev');
      actions.clickOnClass('.toast-message');
      actions.iSeeTextIn('.badge', '0.0.1');
      actions.clickOnElementWithText('Forms');
      actions.iSeeText('Test Form 2');
      actions.clickOnElementWithText('Settings');
      actions.clickOnElementWithText('Delete Updated Dev Stage');
      actions.clickOnElementWithText(' Yes');
      actions.iDonotSeeText('Updated Dev');
      actions.clickOnElementWithText('Settings');
      actions.clickOnElementWithText('API Keys');
      actions.clickOnElementWithText('Add New Key');
      actions.iSeeElement('i.fa.fa-trash');
      actions.pageReload();
      actions.waitForActionToComplete(1000);
      actions.iSeeElement('i.fa.fa-trash');
      actions.enterTextInField('xpath://input','New Key');
      actions.waitForActionToComplete(1000);
      actions.pageReload();
      actions.waitForActionToComplete(1000);
      actions.iSeeValueIn('input','New Key');
      actions.clickOnElementWithText('Add New Key');
      actions.iSeeValueInIndex('input','Key 2',1);
      actions.clickOnClass('.fa.fa-trash');
      actions.iDonotSeeText('New Key');
      actions.clickOnElementWithText('CORS');
      actions.enterTextInField('#cors','testCORS');
      actions.clickOnElementWithText('Save Settings');
      actions.clickOnClass('.toast-message');
      actions.pageReload();
      actions.iSeeValueIn('#cors','testCORS');
      actions.enterTextInField('#cors','*');
      actions.clickOnElementWithText('Save Settings');
      actions.clickOnClass('.toast-message');
      actions.clickOnElementWithText('Security');
      actions.iDonotSeeText('Upgrade your project to a paid plan to enable security settings.');
      actions.enterTextInField('#secret','testSecurity');
      actions.clickOnElementWithText('Save Settings');
      actions.clickOnClass('.toast-message');
      actions.pageReload();
      actions.iSeeValueIn('#secret','testSecurity');
      actions.clickOnElementWithText('Custom JS and CSS');
      actions.checkingUrlEndsWith('/env/settings/customjscss');
      actions.clickOnElementWithText('Settings');
      actions.clickOnElementWithText('PDF Management');
      // actions.checkingUrlEndsWith('env/pdf');
      // actions.iSeeText('1');
      // actions.iSeeText('10');
      // actions.clickOnElementWithText('Change Plan');
      // actions.checkingUrlEndsWith('/billing');
      // actions.iSeeText('$15/month');
      // actions.clickOnElementWithText('Select');
      // actions.iSeeText('$65/month');
      // actions.clickOnElementWithText(' Confirm Billing Change');
      // actions.waitForActionToComplete(4000);
      // actions.iSeeText('$65/month');
      // actions.clickOnElementWithText('Settings');
      // actions.clickOnElementWithText('PDF Management');
      // actions.checkingUrlEndsWith('env/pdf');
      // actions.iSeeText('25');
      // actions.iSeeText('1,000');
      actions.clickOnElementWithText('Integrations');
      actions.checkingUrlEndsWith('env/integrations/info');
      actions.clickOnElementWithText('Email Providers');
      actions.iSeeText('SMTP Settings');
      actions.iSeeText('SendGrid Settings');
      actions.iSeeText('Mailgun Settings');
      actions.iSeeText('Custom Email Server');
      actions.clickOnElementWithText('SMTP Settings');
      actions.checkElement('//*[@id="smtpSecure"]');
      actions.enterTextInField('#smtpHost','smtpHost');
      actions.enterTextInField('#smtpPort','smtpPort');
      actions.enterTextInField('#smtpUser','smtpUser');
      actions.enterTextInField('#smtpPass','smtpPass');
      actions.clickOnElementWithText('Save Settings');
      actions.clickOnElementWithText('Forms');
      actions.clickOnElementWithText(' Actions');
      actions.clickOnElementWithText('Select an Action');
      actions.clickOnElementWithText('Email');
      actions.clickOnElementWithText(' Add Action');
      actions.clickOnClass('#transport');
      actions.iSeeText('SMTP');
      actions.clickOnElementWithText('Settings');
      actions.clickOnElementWithText('Integrations');
      actions.clickOnElementWithText('Email Providers');
      actions.clickOnElementWithText('SendGrid Settings');
      actions.clickOnElementWithText('SendGrid');
      actions.switchTab();
      actions.checkingUrlIamOn('https://sendgrid.com/');
      actions.closeWindow();
      actions.checkingUrlEndsWith('/env/integrations/email');
      actions.enterTextInField('#sendGridPassword','sendGridPassword');
      actions.clickOnElementWithText('Save Settings');
      actions.clickOnElementWithText('Forms');
      actions.clickOnElementWithText(' Actions');
      actions.clickOnElementWithText('Select an Action');
      actions.clickOnElementWithText('Email');
      actions.clickOnElementWithText(' Add Action');
      actions.clickOnClass('#transport');
      actions.iSeeText('SendGrid');
      actions.clickOnElementWithText('Settings');
      actions.clickOnElementWithText('Integrations');
      actions.clickOnElementWithText('Email Providers');
      actions.clickOnElementWithText('Mailgun Settings');
      actions.clickOnElementWithText('Mailgun');
      actions.switchTab();
      actions.checkingUrlIamOn('https://www.mailgun.com/');
      actions.closeWindow();
      actions.checkingUrlEndsWith('/env/integrations/email');
      actions.enterTextInField('#mailgunAPIKey','mailgunAPIKey');
      actions.enterTextInField('#mailgunDomain','mailgunDomain');
      actions.clickOnElementWithText('Save Settings');
      actions.clickOnElementWithText('Forms');
      actions.clickOnElementWithText(' Actions');
      actions.clickOnElementWithText('Select an Action');
      actions.clickOnElementWithText('Email');
      actions.clickOnElementWithText(' Add Action');
      actions.clickOnClass('#transport');
      actions.iSeeText('Mailgun');
      actions.clickOnElementWithText('Settings');
      actions.clickOnElementWithText('Integrations');
      actions.clickOnElementWithText('Email Providers');
      actions.clickOnElementWithText('Custom Email Server');
      actions.clickOnElementWithText('https://github.com/formio/formio-webhook-receiver');
      actions.checkingUrlIamOn('https://github.com/formio/formio-webhook-receiver');
      actions.goBack();
      actions.checkingUrlEndsWith('/env/integrations/email');
      actions.clickOnElementWithText('Custom Email Server');
      actions.enterTextInField('#customUrl','customUrl');
      actions.enterTextInField('#customPassword','customPassword');
      actions.clickOnElementWithText('Save Settings');
      actions.clickOnElementWithText('Forms');
      actions.clickOnElementWithText(' Actions');
      actions.clickOnElementWithText('Select an Action');
      actions.clickOnElementWithText('Email');
      actions.clickOnElementWithText(' Add Action');
      actions.clickOnClass('#transport');
      actions.iSeeText('Custom');
      actions.clickOnElementWithText('Settings');
      actions.clickOnElementWithText('Integrations');
      actions.clickOnElementWithText('File Storage');
      actions.iDonotSeeText('Upgrade your project to a paid plan to access file storage settings.');
      actions.iSeeText('Amazon S3 / Minio (On-Premise, Private Cloud)');
      actions.iSeeText('Dropbox');
      actions.clickOnElementWithText('Amazon S3 / Minio (On-Premise, Private Cloud)');
      actions.enterTextInField('#bucket','testbucket');
      actions.iSeeValueIn('#bucketUrl','https://testbucket.s3.amazonaws.com/');
      actions.clickOnClass('#acl');
      actions.iSeeText('Any');
      actions.iSeeText('Public');
      actions.iSeeText('Private');
      actions.enterTextInField('#AWSAccessKeyId','AWSAccessKeyId');
      actions.enterTextInField('#AWSSecretKey','AWSSecretKey');
      actions.enterTextInField('#startsWith','startsWith');
      actions.enterTextInField('#maxSize','100');
      actions.enterTextInField('#expiration','100');
      actions.clickOnElementWithText('Save Settings');
      actions.clickOnClass('.toast-message');
      actions.waitForActionToComplete(500);
      actions.pageReload();
      actions.waitForActionToComplete(500);
      actions.iSeeValueIn('#AWSAccessKeyId','AWSAccessKeyId');
      actions.iSeeValueIn('#bucket','testbucket');
      actions.iSeeValueIn('#startsWith','startsWith');
      actions.iSeeValueIn('#maxSize','100');
      actions.iSeeValueIn('#expiration','100');
      actions.clickOnElementWithText('Dropbox');
      actions.iSeeText('Use this button to connect this project to a Dropbox account and store uploaded files within that account.');
      actions.iSeeText('Connect to Dropbox');
      actions.clickOnElementWithText('Data Connections');
      actions.clickOnElementWithText('Microsoft Office 365');
      actions.enterTextInField('#tenant','tenant');
      actions.enterTextInField('#clientId','clientId');
      actions.enterTextInField('#email','email');
      actions.enterTextInField('#cert','cert');
      actions.enterTextInField('#thumbprint','thumbprint');
      actions.clickOnElementWithText('Save Settings');
      actions.clickOnClass('.toast-message');
      actions.waitForActionToComplete(500);
      actions.pageReload();
      actions.waitForActionToComplete(500);
      actions.clickOnElementWithText('Microsoft Office 365');
      actions.iSeeValueIn('#tenant','tenant');
      actions.iSeeValueIn('#clientId','clientId');
      actions.iSeeValueIn('#email','email');
      actions.iSeeValueIn('#thumbprint','thumbprint');
      actions.iSeeValueIn('#cert','cert');
      actions.clickOnElementWithText('Google Drive');
      actions.enterTextInFieldIndex('#clientId',1,'clientId');
      actions.enterTextInField('#cskey','cskey');
      actions.enterTextInField('#refreshtoken','refreshtoken');
      actions.clickOnElementWithText('Save Settings');
      actions.clickOnClass('.toast-message');
      actions.waitForActionToComplete(500);
      actions.pageReload();
      actions.waitForActionToComplete(500);
      actions.clickOnElementWithText('Google Drive');
      actions.iSeeValueIn('#clientId','clientId');
      actions.iSeeValueIn('#cskey','cskey');
      actions.iSeeValueIn('#refreshtoken','refreshtoken');
      actions.clickOnElementWithText('Kickbox');
      actions.enterTextInField('#kickbox-apikey','kickbox-apikey');
      actions.clickOnElementWithText('Save Settings');
      actions.clickOnClass('.toast-message');
      actions.waitForActionToComplete(500);
      actions.pageReload();
      actions.waitForActionToComplete(500);
      actions.clickOnElementWithText('Kickbox');
      actions.iSeeValueIn('#kickbox-apikey','kickbox-apikey');
      actions.clickOnElementWithText('Hubspot');
      actions.enterTextInField('#apikey','apikey');
      actions.clickOnElementWithText('Save Settings');
      actions.clickOnClass('.toast-message');
      actions.waitForActionToComplete(500);
      actions.pageReload();
      actions.waitForActionToComplete(500);
      actions.clickOnElementWithText('Hubspot');
      actions.iSeeValueIn('#apikey','apikey');
      actions.clickOnElementWithText('SQL Connector');
      actions.enterTextInField('#connectorHost','connectorHost');
      actions.clickOnElementWithText('Select the SQL Type');
      actions.clickOnElementWithText('MySQL');
      actions.enterTextInField('#connectorUser','connectorUser');
      actions.enterTextInField('#connectorPassword','connectorPassword');
      actions.clickOnElementWithText('Save Settings');
      actions.clickOnClass('.toast-message');
      actions.waitForActionToComplete(500);
      actions.pageReload();
      actions.waitForActionToComplete(500);
      actions.clickOnElementWithText('SQL Connector');
      actions.iSeeValueIn('#connectorHost','connectorHost');
      actions.iSeeValueIn('#connectorUser','connectorUser');
      actions.iSeeValueIn('#connectorPassword','connectorPassword');
      actions.clickOnElementWithText('Atlassian');
      actions.enterTextInField('#url','url');
      actions.clickOnElementWithText('Save Settings');
      actions.clickOnClass('.toast-message');
      actions.waitForActionToComplete(500);
      actions.pageReload();
      actions.waitForActionToComplete(500);
      actions.clickOnElementWithText('Atlassian');
      actions.iSeeValueIn('#url','url');
      actions.clickOnElementWithText('Moxtra');
      actions.enterTextInFieldIndex('#clientId',2,'clientId');
      actions.enterTextInField('#clientSecret','clientSecret');
      actions.enterTextInField('#orgId','orgId');
      actions.clickOnElementWithText('Save Settings');
      actions.clickOnClass('.toast-message');
      actions.waitForActionToComplete(500);
      actions.pageReload();
      actions.waitForActionToComplete(500);
      actions.clickOnElementWithText('Moxtra');
      actions.iSeeValueIn('#clientId','clientId');
      actions.iSeeValueIn('#clientSecret','clientSecret');
      actions.iSeeValueIn('#orgId','orgId');
      actions.clickOnElementWithText('Authentication');
      actions.checkingUrlEndsWith('env/authentication/info');
      actions.iSeeText('Form.io Auth');
      actions.clickOnElementWithText('Form.io Auth');
      actions.checkingUrlEndsWith('/env/authentication/formio');
      actions.clickOnElementWithText('Login');
      actions.checkingUrlIamOn('https://help.form.io/userguide/actions/#action-authentication');
      actions.goBack();
      actions.checkingUrlEndsWith('/env/authentication/formio');
      actions.clickOnElementWithText('roles');
      actions.switchTab();
      actions.checkingUrlIamOn('https://help.form.io/userguide/roles-and-permissions/');
      actions.closeWindow();
      actions.checkingUrlEndsWith('/env/authentication/formio');
      actions.clickOnElementWithText('Role Assignment');
      actions.switchTab();
      actions.checkingUrlIamOn('https://help.form.io/userguide/actions/#action-role-assignment');
      actions.closeWindow();
      actions.checkingUrlEndsWith('/env/authentication/formio');
      actions.clickOnElementWithText('OAuth');
      actions.checkingUrlEndsWith('/env/authentication/oauth');
      actions.clickOnElementWithText('OpenID');
      actions.enterTextInField('#openidauthURI','openidauthURI');
      actions.enterTextInField('#openidtokenURI','openidtokenURI');
      actions.enterTextInField('#openidClientId','openidClientId');
      actions.enterTextInField('#openidClientSecret','openidClientSecret');
      actions.enterTextInField('#openiduserInfoURI','openiduserInfoURI');
      actions.enterTextInField('#openidscope','openidscope');
      actions.clickOnElementWithText('Save Settings');
      actions.clickOnClass('.toast-message');
      actions.waitForActionToComplete(500);
      actions.pageReload();
      actions.waitForActionToComplete(500);
      actions.clickOnElementWithText('OpenID');
      actions.iSeeValueIn('#openidauthURI','openidauthURI');
      actions.iSeeValueIn('#openidtokenURI','openidtokenURI');
      actions.iSeeValueIn('#openidClientId','openidClientId');
      actions.iSeeValueIn('#openidClientSecret','openidClientSecret');
      actions.iSeeValueIn('#openiduserInfoURI','openiduserInfoURI');
      actions.iSeeValueIn('#openidscope','openidscope');
      actions.clickOnElementWithText('GitHub');
      actions.enterTextInField('#githubClientId','githubClientId');
      actions.enterTextInField('#githubClientSecret','githubClientSecret');
      actions.clickOnElementWithText('Save Settings');
      actions.clickOnClass('.toast-message');
      actions.waitForActionToComplete(500);
      actions.pageReload();
      actions.waitForActionToComplete(500);
      actions.clickOnElementWithText('GitHub');
      actions.iSeeValueIn('#githubClientId','githubClientId');
      actions.iSeeValueIn('#githubClientSecret','githubClientSecret');
      actions.clickOnElementWithText('Facebook');
      actions.enterTextInField('#facebookClientId','facebookClientId');
      actions.enterTextInField('#facebookClientSecret','facebookClientSecret');
      actions.clickOnElementWithText('Save Settings');
      actions.clickOnClass('.toast-message');
      actions.waitForActionToComplete(500);
      actions.pageReload();
      actions.waitForActionToComplete(500);
      actions.clickOnElementWithText('Facebook');
      actions.iSeeValueIn('#facebookClientId','facebookClientId');
      actions.iSeeValueIn('#facebookClientSecret','facebookClientSecret');
      actions.clickOnElementWithText('Dropbox');
      actions.enterTextInField('#dropboxClientId','dropboxClientId');
      actions.enterTextInField('#dropboxClientSecret','dropboxClientSecret');
      actions.clickOnElementWithText('Save Settings');
      actions.clickOnClass('.toast-message');
      actions.waitForActionToComplete(500);
      actions.pageReload();
      actions.waitForActionToComplete(500);
      actions.clickOnElementWithText('Dropbox');
      actions.iSeeValueIn('#dropboxClientId','dropboxClientId');
      actions.iSeeValueIn('#dropboxClientSecret','dropboxClientSecret');
      actions.clickOnElementWithText('Office 365');
      actions.enterTextInField('#office365Tenant','office365Tenant');
      actions.enterTextInField('#office365ClientId','office365ClientId');
      actions.enterTextInField('#office365ClientSecret','office365ClientSecret');
      actions.clickOnElementWithText('Save Settings');
      actions.clickOnClass('.toast-message');
      actions.waitForActionToComplete(500);
      actions.pageReload();
      actions.waitForActionToComplete(500);
      actions.clickOnElementWithText('Office 365');
      actions.iSeeValueIn('#office365Tenant','office365Tenant');
      actions.iSeeValueIn('#office365ClientId','office365ClientId');
      actions.iSeeValueIn('#office365ClientSecret','office365ClientSecret');
      actions.clickOnElementWithText('Google');
      actions.enterTextInField('#googleClientId','googleClientId');
      actions.enterTextInField('#googleClientSecret','googleClientSecret');
      actions.clickOnElementWithText('Save Settings');
      actions.clickOnClass('.toast-message');
      actions.waitForActionToComplete(500);
      actions.pageReload();
      actions.waitForActionToComplete(500);
      actions.clickOnElementWithText('Google');
      actions.iSeeValueIn('#googleClientId','googleClientId');
      actions.iSeeValueIn('#googleClientSecret','googleClientSecret');
      actions.clickOnElementWithText('Twitter');
      actions.enterTextInField('#twitterClientId','twitterClientId');
      actions.enterTextInField('#twitterClientSecret','twitterClientSecret');
      actions.clickOnElementWithText('Save Settings');
      actions.clickOnClass('.toast-message');
      actions.waitForActionToComplete(500);
      actions.pageReload();
      actions.waitForActionToComplete(500);
      actions.clickOnElementWithText('Twitter');
      actions.iSeeValueIn('#twitterClientId','twitterClientId');
      actions.iSeeValueIn('#twitterClientSecret','twitterClientSecret');
      actions.clickOnElementWithText('Linkedin');
      actions.enterTextInField('#linkedinClientId','linkedinClientId');
      actions.enterTextInField('#linkedinClientSecret','linkedinClientSecret');
      actions.clickOnElementWithText('Save Settings');
      actions.clickOnClass('.toast-message');
      actions.waitForActionToComplete(500);
      actions.pageReload();
      actions.waitForActionToComplete(500);
      actions.clickOnElementWithText('Linkedin');
      actions.iSeeValueIn('#linkedinClientId','linkedinClientId');
      actions.iSeeValueIn('#linkedinClientSecret','linkedinClientSecret');
      actions.clickOnElementWithText('Forms');
      actions.clickOnElementWithText(' Actions');
      actions.clickOnElementWithText('Select an Action');
      actions.clickOnElementWithText('OAuth (Premium)');
      actions.clickOnElementWithText(' Add Action');
      actions.clickOnClass('.toast-message');
      actions.clickOnClass('#provider');
      actions.iSeeText('OpenID');
      actions.iSeeText('GitHub');
      actions.iSeeText('Facebook');
      actions.iSeeText('Dropbox');
      actions.iSeeText('Office 365');
      actions.iSeeText('Google');
      // actions.iSeeText('Twitter');
      actions.iSeeText('LinkedIn ');
      actions.clickOnElementWithText('Settings');
      actions.clickOnElementWithText('Authentication');
      actions.iSeeText('LDAP');
      actions.clickOnElementWithText('LDAP');
      actions.checkingUrlEndsWith('/env/authentication/ldap');
      actions.iSeeText('SAML');
      actions.clickOnElementWithText('SAML');
      actions.checkingUrlEndsWith('/env/authentication/saml');
      actions.iSeeText('Support for SAML authentication is coming soon. Please contact us for more information.');
      actions.clickOnElementWithText('Access');
      actions.clickOnElementWithText(' New Role');
      actions.enterTextInField('#title','Test Versioning Role');
      actions.clickOnElementWithText('Create Role');
      actions.clickOnClass('.toast-message');
      actions.clickOnElementWithText('Forms');
      actions.clickOnElementWithText('Test Form');
      actions.clickOnElementWithText(' Access');
      actions.clickOnClassWithIndex('.ui-select-search',0);
      actions.clickOnElementWithText('Test Versioning Role');
      actions.clickOnClass('.toast-message');
      actions.clickOnElementWithText('Access');
      actions.clickOnClassWithIndex('.glyphicon.glyphicon-trash',3);
      actions.iSeeText('Are you sure you wish to delete the role ');
      actions.clickOnElementWithText('Yes');
      actions.iDonotSeeText('Test Versioning Role');
    });
  });
};
