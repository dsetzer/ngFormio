module.exports = function (actions) {
  describe('Project Update Setting Functionality', function () {
    describe('Project Settings', function () {

      var val = [
        ['Test Project', '#title', '.project.well>h4>a', 'Test Project'],
        ['Test Description', '#description', '.project-description', '${project3.title}']
      ];

      val.forEach(function (settings) {
        actions.logout();
        actions.iAmLoggedInFor('projuser2');
        actions.goToPage("/#");
        actions.clickOnElement('.fa.fa-close');
        actions.projectExisting('${random-title>project3.title}', '${random-description>project3.description}');
        actions.iSeeTextIn('.project.well>h4>a', '${project3.title}');
        actions.clickOnElementWithText('Manage');
        actions.portalIamOn('${project3.title}');
        actions.clickOnElement('.fa.fa-cog');
        actions.enterTextInField(settings[1], settings[0]);
        actions.clickOnElementWithText(' Save Project');
        actions.portalIamOn('${project3.title}');
        actions.clickOnElement('.fa.fa-home');
        actions.goToPage("/#");
        actions.iSeeValueIn(settings[2], settings[3]);
      });
    });
  });
}
