module.exports = function (actions) {
  describe('{User Profile Functionality',function(){
    describe('Profile navigation',function(){
      actions.iAmLoggedInFor('profileuser1');
      actions.goToPage('#/');
      actions.clickOnElement('#user-menu');
      actions.clickOnElementWithText(' Profile');
      actions.checkingUrlIamOn("#/profile/view");
      actions.iSeeText("User Profile");
      actions.iSeeValueIn("#profile-username","Username: ${profileuser1.name}");
      actions.iSeeValueIn("#profile-email","Email: ${profileuser1.email}");
      actions.clickOnElementWithText('Edit');
      actions.waitForActionToComplete(500);
      actions.iSeeText("Name");
      actions.iSeeValueIn('#fullName','${empty}');
      actions.iSeeText("Username");
      actions.iSeeValueIn("#name","${profileuser1.name}");
      actions.iSeeText("Email");
      actions.iSeeValueIn("#email","${profileuser1.email}");
      actions.iSeeText("Password");
      actions.iSeeValueIn('#password','${empty}');
      actions.clickOnElementWithText('Payment Info');
      actions.iSeeTextIn(".alert","We never store your credit card number.");
    });
    describe('Update fullname',function(){
      actions.iAmLoggedInFor('profileuser1');
      actions.goToPage('#/profile/edit');
      actions.waitForActionToComplete(500);
      actions.iSeeText("Name");
      actions.enterTextInField('.profile-edit-page #fullName','${random-fullName>profileuser1.fullName}');
      actions.clickOnElementWithText('Submit');
      actions.iSeeTextIn(".alert","Submission was created.");
      actions.valueUpdate('profileuser1','${random}','fullName');
      actions.valueChanged('profileuser1');
    });
    describe('Update username',function(){
      actions.iAmLoggedInFor('profileuser1');
      actions.goToPage('#/profile/edit');
      actions.iSeeText("Username");
      actions.enterTextInField('.profile-edit-page #name','${random-name>profileuser1.name}');
      actions.clickOnElementWithText('Submit');
      actions.iSeeTextIn(".alert","Submission was created.");
      actions.valueUpdate('profileuser1','${random}','name');
      actions.valueChanged('profileuser1');
    });
    describe('Update email',function(){
      actions.iAmLoggedInFor('profileuser1');
      actions.goToPage('#/profile/edit');
      actions.waitForActionToComplete(500);
      actions.iSeeText("Email");
      actions.enterTextInField('.profile-edit-page #email','${random-email>profileuser1.email}');
      actions.clickOnElementWithText('Submit');
      actions.iSeeTextIn(".alert","Submission was created.");
      actions.valueUpdate('profileuser1','${random}','email');
      actions.valueChanged('profileuser1');
    });
    describe('Update password',function(){
      actions.iAmLoggedInFor('profileuser1');
      actions.goToPage('#/profile/edit');
      actions.iSeeText("Password");
      actions.enterTextInField('.profile-edit-page #password','${random-password>profileuser1.password}');
      actions.clickOnElementWithText('Submit');
      actions.waitForActionToComplete(1000);
      actions.iSeeTextIn(".alert","Submission was created.");
      actions.valueUpdate('profileuser1','${random}','password');
      actions.valueChanged('profileuser1');
    });
    describe('Update all profile settings',function(){
      actions.iAmLoggedInFor('profileuser1');
      actions.goToPage('#/profile/edit');
      actions.waitForActionToComplete(500);
      actions.iSeeText("Name");
      actions.iSeeText("Username");
      actions.iSeeText("Email");
      actions.iSeeText("Password");
      actions.enterTextInField('.profile-edit-page #fullName','${random-fullName>profileuser1.fullName}');
      actions.enterTextInField('.profile-edit-page #name','${random-name>profileuser1.name}');
      actions.enterTextInField('.profile-edit-page #email','${random-email>profileuser1.email}');
      actions.enterTextInField('.profile-edit-page #password','${random-password>profileuser1.password}');
      actions.clickOnElementWithText('Submit');
      actions.waitForActionToComplete(1000);
      actions.iSeeTextIn(".alert","Submission was created.");
      actions.valueChanged('profileuser1');
    });
  });
};
