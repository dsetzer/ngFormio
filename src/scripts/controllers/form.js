'use strict';

/* global _: false, jQuery: false, document: false */
var app = angular.module('formioApp.controllers.form', [
  'ngDialog',
  'ui.bootstrap.tabs',
  'ui.bootstrap.tpls',
  'ui.bootstrap.accordion',
  'ngFormBuilder',
  'formio',
  'bgf.paginateAnything',
  'ngTagsInput'
]);

app.config([
  '$stateProvider',
  function(
    $stateProvider
  ) {
    var typeInfo = {
      form: {
        type: 'form',
        title: 'Forms',
        name: 'Form',
        icon: 'fa fa-tasks',
        help: 'https://help.form.io/userguide/forms/',
        description: 'Forms serve as an input interface for Resources as well as free-form user input within your Application. Example: Login Form, Contact Form, etc.'
      },
      resource: {
        type: 'resource',
        title: 'Resources',
        name: 'Resource',
        icon: 'fa fa-database',
        help: 'https://help.form.io/userguide/resources/',
        description: 'Resources are the objects within your Application. Example: User, Company, Vehicle, etc.'
      }
    };

    // Create states for both forms and resources.
    angular.forEach(['resource', 'form'], function(type) {
      var parentName = 'project.' + type;
      $stateProvider
        .state(parentName, {
          abstract: true,
          url: '/' + type,
          templateUrl: 'views/form/base.html',
          controller: [
            '$scope',
            '$state',
            function(
              $scope,
              $state
            ) {
              $scope.formInfo = $state.current.data;
              $scope.infoTemplate = 'views/form/' + $scope.formInfo.type + '-info.html';
              $scope.currentSection.title = _.capitalize($scope.formInfo.type) + 's';
              $scope.currentSection.icon = ($scope.formInfo.type === 'form') ? 'fa fa-tasks' : 'fa fa-database';
              $scope.currentSection.help = $scope.formInfo.help;
            }
          ],
          data: typeInfo[type]
        })
        .state(parentName + '.index', {
          url: '/',
          templateUrl: 'views/form/' + type + 's.html'
        })
        .state(parentName + '.create', {
          url: '/create/' + type,
          templateUrl: 'views/form/form-edit.html',
          controller: 'FormController',
          params: {formType: type}
        })
        .state(parentName + '.form', {
          abstract: true,
          url: '/:formId',
          templateUrl: 'views/form/form.html',
          controller: 'FormController'
        })
        .state(parentName + '.form.view', {
          url: '/',
          templateUrl: 'views/form/form-view.html'
        })
        .state(parentName + '.form.edit', {
          url: '/edit',
          controller: 'FormEditController',
          templateUrl: 'views/form/form-edit.html'
        })
        .state(parentName + '.form.embed', {
          url: '/embed',
          templateUrl: 'views/form/form-embed.html'
        })
        .state(parentName + '.form.share', {
          url: '/share',
          templateUrl: 'views/form/form-share.html',
          controller: 'FormShareController'
        })
        .state(parentName + '.form.delete', {
          url: '/delete',
          controller: 'FormDeleteController',
          templateUrl: 'views/form/form-delete.html'
        })
        .state(parentName + '.form.permission', {
          url: '/permission',
          templateUrl: 'views/form/permission/index.html'
        })
        .state(parentName + '.form.api', {
          url: '/api',
          templateUrl: 'views/form/form-api.html'
        });

      var formStates = {};
      formStates[parentName + '.form.submission'] = {
        path: '/submission',
        id: 'subId',
        indexController: 'FormSubmissionsController',
        itemController: 'FormSubmissionController',
        editController: 'FormSubmissionEditController',
        deleteController: 'FormSubmissionDeleteController'
      };
      formStates[parentName + '.form.action'] = {
        path: '/action',
        id: 'actionId',
        indexController: 'FormActionIndexController',
        editController: 'FormActionEditController',
        deleteController: 'FormActionDeleteController'
      };

      angular.forEach(formStates, function(info, state) {
        $stateProvider
          .state(state, {
            abstract: true,
            url: info.path,
            template: '<div ui-view></div>'
          })
          .state(state + '.index', {
            url: '',
            templateUrl: 'views/form' + info.path + '/index.html',
            controller: info.indexController
          })
          .state(state + '.item', {
            abstract: true,
            url: '/:' + info.id,
            controller: info.itemController,
            templateUrl: 'views/form' + info.path + '/item.html'
          })
          .state(state + '.item.view', {
            url: '',
            templateUrl: 'views/form' + info.path + '/view.html'
          })
          .state(state + '.item.edit', {
            url: '/edit',
            templateUrl: 'views/form' + info.path + '/edit.html',
            controller: info.editController
          })
          .state(state + '.item.delete', {
            url: '/delete',
            templateUrl: 'views/form' + info.path + '/delete.html',
            controller: info.deleteController
          });
      });

      // Add the action adding state.
      $stateProvider.state(parentName + '.form.action.add', {
        url: '/add/:actionName',
        templateUrl: 'views/form/action/add.html',
        controller: 'FormActionEditController',
        params: {actionInfo: null}
      });
    });
  }
]);

// The form list directive.
app.directive('formList', function() {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'views/form/form-list.html',
    scope: {
      formName: '=',
      forms: '=',
      project: '=',
      formType: '=',
      numPerPage: '=',
      listMode: '='
    },
    compile: function(element, attrs) {
      if (!attrs.numPerPage) { attrs.numPerPage = 25; }
    },
    controller: [
      '$scope',
      '$rootScope',
      '$http',
      'AppConfig',
      'FormioUtils',
      function(
        $scope,
        $rootScope,
        $http,
        AppConfig,
        FormioUtils
      ) {
        $rootScope.activeSideBar = 'projects';
        $rootScope.noBreadcrumb = false;
        $rootScope.currentForm = false;
        $scope.search = {};
        $scope.formsUrl = AppConfig.apiBase + '/project/' + $scope.project._id + '/form?limit=9999999';
        if ($scope.formType) {
          $scope.formsUrl += '&type=' + $scope.formType;
        }
        $http.get($scope.formsUrl).then(function(response) {
          $scope.forms = response.data;
          $scope.formsFinished = true;
        });
        $scope.$watch('project', function(newProject, oldProject) {
          $scope.projectApi = AppConfig.protocol + '//' + $scope.project.name + '.' + AppConfig.serverHost;
        });
        $scope.export = function(form, type) {
          window.open(AppConfig.apiBase + '/project/' + $scope.project._id + '/form/' + form._id + '/export?format=' + type + '&x-jwt-token=' + $rootScope.userToken);
        };
        $scope.componentCount = function(components) {
          return _(FormioUtils.flattenComponents(components)).filter(function (o) {
            return o.input === true && o.type !== 'button';
          }).size();
        };
      }
    ]
  };
});

app.controller('FormController', [
  '$scope',
  '$state',
  '$stateParams',
  '$rootScope',
  'Formio',
  'FormioAlerts',
  'FormioUtils',
  'AppConfig',
  'SubmissionAccessLabels',
  'AccessLabels',
  'ResourceAccessLabels',
  'GoogleAnalytics',
  '$q',
  function(
    $scope,
    $state,
    $stateParams,
    $rootScope,
    Formio,
    FormioAlerts,
    FormioUtils,
    AppConfig,
    SubmissionAccessLabels,
    AccessLabels,
    ResourceAccessLabels,
    GoogleAnalytics,
    $q
  ) {
    // Project information.
    $scope.projectId = $stateParams.projectId;

    // Resource information.
    $scope.formId = $stateParams.formId;
    $scope.formUrl = '/project/' + $scope.projectId + '/form';
    $scope.formUrl += $stateParams.formId ? ('/' + $stateParams.formId) : '';
    $scope.formDisplays = [
      {
        name: 'form',
        title: 'Form'
      },
      {
        name: 'wizard',
        title: 'Wizard'
      }
    ];
    var formType = $stateParams.formType || 'form';
    $scope.capitalize = _.capitalize;
    $scope.form = {
      title: '',
      display: 'form',
      type: formType,
      components: [],
      access: [],
      submissionAccess: []
    };

    // Match name of form to title if not customized.
    $scope.titleChange = function(oldTitle) {
      if (!$scope.form.name || $scope.form.name === _.camelCase(oldTitle)) {
        $scope.form.name = _.camelCase($scope.form.title);
      }
    };

    // Load the form and submissions.
    $scope.formio = new Formio($scope.formUrl);

    // The url to goto for embedding.
    $scope.embedCode = '';
    $scope.setEmbedCode = function(gotoUrl) {
      var embedCode = '<script type="text/javascript">';
      embedCode += '(function a(d, w, u) {';
      embedCode +=    'var h = d.getElementsByTagName("head")[0];';
      embedCode +=    'var s = d.createElement("script");';
      embedCode +=    's.type = "text/javascript";';
      embedCode +=    's.src = "' + AppConfig.appBase + '/lib/seamless/seamless.parent.min.js";';
      embedCode +=    's.onload = function b() {';
      embedCode +=        'var f = d.getElementById("formio-form-' + $scope.form._id + '");';
      embedCode +=        'if (!f || (typeof w.seamless === u)) {';
      embedCode +=            'return setTimeout(b, 100);';
      embedCode +=        '}';
      embedCode +=        'w.seamless(f, {fallback:false}).receive(function(d, e) {';
      embedCode +=            gotoUrl ? 'window.location.href = "' + gotoUrl + '";' : '';
      embedCode +=        '});';
      embedCode +=    '};';
      embedCode +=    'h.appendChild(s);';
      embedCode += '})(document, window);';
      embedCode += '</script>';
      embedCode += '<iframe id="formio-form-' + $scope.form._id + '" style="width:100%;border:none;" height="600px" src="https://formview.io/#/' + $scope.currentProject.name + '/' + $scope.form.path + '?iframe=1&header=0"></iframe>';
      $scope.embedCode = embedCode;
    };

    // Keep track of the form tags.
    $scope.formTags = [];
    $scope.addTag = function(tag) {
      if (!$scope.form) {
        return;
      }
      if (!$scope.form.tags) {
        $scope.form.tags = [];
      }
      $scope.form.tags.push(tag.text);
    };
    $scope.removeTag = function(tag) {
      if ($scope.form.tags && $scope.form.tags.length) {
        var tagIndex = $scope.form.tags.indexOf(tag.text);
        if (tagIndex !== -1) {
          $scope.form.tags.splice(tagIndex, 1);
        }
      }
    };

    // Keep track of the self access permissions.
    $scope.selfAccessPermissions = false;

    /**
     * Util function to get or set the selfAccess value. If selfAccess is present, the value is set, otherwise returned.
     *
     * @param {Boolean} setValue
     *   The value to set for selfAccess.
     *
     * @returns {boolean}
     */
    var selfAccess = function(setValue) {
      var found = false;
      for(var a = 0; a < $scope.form.submissionAccess.length; a++) {
        if (!found && $scope.form.submissionAccess[a].type === 'self') {
          // If we're setting the value to false when it exists, remove it.
          if (typeof setValue !== 'undefined' && setValue === false) {
            found = false;
            delete $scope.form.submissionAccess[a];
            $scope.form.submissionAccess = _.filter($scope.form.submissionAccess);
            break;
          }
          // If we're getting the value, flag it as found.
          // If we're setting the value to true when it exists, do nothing.
          else {
            found = true;
            break;
          }
        }
      }

      // The permission wasn't found but we're enabling it, add it to the access.
      if (!found && typeof setValue !== 'undefined' && setValue === true) {
        $scope.form.submissionAccess.push({
          type: 'self'
        });
      }

      return found;
    };

    // ng-change function to help modify the value of self access permissions.
    $scope.toggleSelfAccessPermissions = function() {
      $scope.selfAccessPermissions = !$scope.selfAccessPermissions;
      selfAccess($scope.selfAccessPermissions);
    };

    $scope.$watch('form.display', function(display) {
      $scope.$broadcast('formDisplay', display);
    });

    $scope.$watch('form', function() {
      $scope.setEmbedCode();
    });

    $scope.$watch('currentProject', function() {
      $scope.setEmbedCode();
    });

    $scope.updateCurrentFormResources = function(form) {
      // Build the list of selectable resources for the submission resource access ui.
      $scope.currentFormResources = _(FormioUtils.flattenComponents(form.components))
        .filter(function(component) {
          if (component.type === 'resource') {
            return true;
          }
          if (component.type === 'select' && component.dataSrc === 'resource') {
            return true;
          }

          return false;
        })
        .map(function(component) {
          return {
            label: component.label || '',
            key: component.key || '',
            defaultPermission: component.defaultPermission || ''
          };
        })
        .value();
    };

    // Load the form.
    if ($scope.formId) {
      $scope.loadFormPromise = $scope.formio.loadForm()
        .then(function(form) {
          // Ensure the display is form.
          if (!form.display) {
            form.display = 'form';
          }

          $scope.updateCurrentFormResources(form);

          $scope.form = form;
          $scope.formTags = _.map(form.tags, function(tag) {
            return {text: tag};
          });

          $rootScope.currentForm = $scope.form;
        }, FormioAlerts.onError.bind(FormioAlerts))
        .catch(FormioAlerts.onError.bind(FormioAlerts));

      $scope.formio.loadActions()
        .then(function(actions) {
          // Get the available actions for the form, to check if premium actions are present.
          $scope.formio.availableActions().then(function(available) {
            var premium = _.map(_.filter(available, function(action) {
              return (action.hasOwnProperty('premium') && action.premium === true);
            }), 'name');

            $scope.hasPremAction = _.some(actions, function(action) {
              return (action.hasOwnProperty('name') && action.name && premium.indexOf(action.name) !== -1);
            });
          });

          $scope.actions = actions;
          $scope.hasAuthAction = actions.some(function(action) {
            return action.name === 'login' || action.name === 'oauth';
          });
        }, FormioAlerts.onError.bind(FormioAlerts))
        .catch(FormioAlerts.onError.bind(FormioAlerts));
    }
    else {
      $scope.loadFormPromise = $q.when();
    }

    $scope.loadFormPromise
      .then(function() {
        // Watch for the first load of the form. Used to parse self access permissions once.
        var loaded = $scope.$watch('form.submissionAccess', function() {
          $scope.selfAccessPermissions = selfAccess();
          loaded();
        });
      });

    $scope.submissionAccessLabels = SubmissionAccessLabels;
    $scope.resourceAccessLabels = ResourceAccessLabels;
    $scope.accessLabels = AccessLabels;

    // Get the swagger URL.
    $scope.getSwaggerURL = function(format) {
      return AppConfig.apiBase + '/project/' + $scope.projectId + '/form/' + $scope.formId + '/spec.json';
    };

    // When a submission is made.
    $scope.$on('formSubmission', function(event, submission) {
      event.stopPropagation();
      FormioAlerts.addAlert({
        type: 'success',
        message: 'New submission added!'
      });
      GoogleAnalytics.sendEvent('Submission', 'create', null, 1);
      if (submission._id) {
        $state.go('project.' + $scope.formInfo.type + '.form.submission.item.view', {subId: submission._id});
      }
    });

    // Save a form.
    $scope.saveForm = function() {
      angular.element('.has-error').removeClass('has-error');

      // Copy to remove angular $$hashKey
      $scope.formio.saveForm(angular.copy($scope.form), {
        getHeaders: true
      })
      .then(function(response) {
        $scope.form = response.result;
        var headers = response.headers;
        var method = $stateParams.formId ? 'updated' : 'created';
        GoogleAnalytics.sendEvent('Form', method.substring(0, method.length - 1), null, 1);

        if (headers.hasOwnProperty('x-form-merge')) {
          FormioAlerts.addAlert({
            type: 'warning',
            message: 'This form has been modified by another user. All form changes have been merged and saved.'
          });
        }
        else {
          FormioAlerts.addAlert({
            type: 'success',
            message: 'Successfully ' + method + ' form!'
          });
        }

        // Reload page when a form is created or merged.
        if (method === 'created' || headers.hasOwnProperty('x-form-merge')) {
          $state.go('project.' + $scope.formInfo.type + '.form.edit', {formId: $scope.form._id}, {reload: true});
        }
      })
      .catch(function(err) {
        if (err) {
          FormioAlerts.onError.call(FormioAlerts, err);
        }

        // FOR-128 - if we're editing a form, make note of the components with issues.
        try {
          var issues = (/Component keys must be unique: (.*)/.exec(_.get(err, 'errors.components.message'))).slice(1);
          if (($state.includes('project.form.form.edit') || $state.includes('project.form.create')) && (issues.length > 0)) {
            issues = (issues.shift()).toString().split(', ');
            issues.forEach(function(issue) {
              angular.element('div.dropzone #' + issue).parent().addClass('has-error');
            });
          }
        }
        catch (e) {}
      });
    };

    // Delete a form.
    $scope.deleteForm = function() {
      var type = $scope.form.type;
      $scope.formio.deleteForm()
        .then(function() {
          FormioAlerts.addAlert({
            type: 'success',
            message: 'Delete successful'
          });
          $state.go('project.' + type + '.form.index');
        }, FormioAlerts.onError.bind(FormioAlerts))
        .catch(FormioAlerts.onError.bind(FormioAlerts));
    };

    // Called when the form is updated.
    $scope.$on('formUpdate', function(event, form) {
      event.stopPropagation();
      $scope.updateCurrentFormResources(form);
      $scope.form.components = form.components;
    });

    $rootScope.currentForm = $scope.form;
  }
]);

app.controller('FormEditController', [
  '$scope',
  '$q',
  function(
    $scope,
    $q
  ) {
    // Clone original form after it has loaded, or immediately
    // if we're not loading a form
    ($scope.loadFormPromise || $q.when()).then(function() {
      $scope.originalForm = _.cloneDeep($scope.form);
    });

    // Revert to original form and go back
    $scope.cancel = function() {
      _.assign($scope.form, $scope.originalForm);
      $scope.back('project.' + $scope.formInfo.type + '.form.view');
    };
  }
]);

app.controller('FormShareController', ['$scope', function($scope) {
  $scope.publicForm = null;
  $scope.previewUrl = '';
  $scope.preview = '';
  $scope.options = {
    theme: '',
    showHeader: true,
    showWizard: false
  };
  $scope.themes = [
    'Cerulean',
    'Cosmo',
    'Cyborg',
    'Darkly',
    'Flatly',
    'Journal',
    'Lumen',
    'Paper',
    'Readable',
    'Sandstone',
    'Simplex',
    'Slate',
    'Spacelab',
    'Superhero',
    'United',
    'Yeti'
  ];

  // Method to load the preview.
  var loadPreview = function() {
    $scope.previewUrl = 'https://formview.io/#/';
    $scope.previewUrl += $scope.currentProject.name + '/' + $scope.currentForm.path + '?';
    $scope.previewUrl += $scope.options.showHeader ? 'header=1' : 'header=0';
    if ($scope.options.theme) {
      $scope.previewUrl += '&theme=' + $scope.options.theme.toLowerCase();
    }
    if ($scope.options.showWizard) {
      $scope.previewUrl += '&wizard=1';
    }
    jQuery('#form-preview').html(jQuery(document.createElement('iframe')).attr({
      style: 'width: 100%;',
      id: 'share-preview',
      src: $scope.previewUrl
    }));
    jQuery('#share-preview').seamless({
      spinner: '',
      loading: 'Loading ...'
    });
  };

  // The default role.
  var defaultRole = null;

  // Make a form public.
  $scope.makePublic = function() {
    angular.forEach($scope.form.submissionAccess, function(access, index) {
      if (access.type === 'create_own') {
        $scope.form.submissionAccess[index].roles.push(defaultRole._id);
      }
      if(access.type === 'read_all') {
        if($scope.form.access[index].roles !=  defaultRole._id) {
          $scope.form.access[index].roles.push(defaultRole._id);
        }
      }
    });
    $scope.publicForm = true;
    $scope.saveForm();
  };

  // Make a form private.
  $scope.makePrivate = function() {
    angular.forEach($scope.form.submissionAccess, function(access, index) {
      if (access.type === 'create_own' || access.type === 'create_all') {
        _.pull($scope.form.submissionAccess[index].roles, defaultRole._id);
      }
      if (access.type === 'read_all') {
        _.pull($scope.form.access[index].roles, defaultRole._id);
      }
    });
    $scope.publicForm = false;
    $scope.saveForm();
  };

  $scope.loadProjectPromise.then(function() {
    $scope.loadFormPromise.then(function() {
      $scope.$watch('currentProjectRoles', function(roles) {
        if (!roles) { return; }
        angular.forEach(roles, function(role) {
          if (role.default) {
            defaultRole = role;
          }
        });

        if (defaultRole !== null) {
          $scope.publicForm = false;
          angular.forEach($scope.form.submissionAccess, function(access) {
            if (
              (access.type === 'create_own' || access.type === 'create_all') &&
              (_.indexOf(access.roles, defaultRole._id) !== -1)
            ) {
              $scope.publicForm = true;
            }
          });
          angular.forEach($scope.form.access, function(access) {
            if ((access.type === 'read_all') &&
            (_.indexOf(access.roles, defaultRole._id) !== -1)) {
              $scope.publicForm = true;
            }
          });
        }
      });

      $scope.$watch('options', function() {
        loadPreview();
      }, true);
    });
  });
}]);

app.factory('FormioAlerts', [
  '$rootScope',
  'toastr',
  function (
    $rootScope,
    toastr
  ) {
    return {
      addAlert: function (alert) {
        switch (alert.type) {
          case 'danger':
            toastr.error(alert.message);
            break;
          case 'info':
            toastr.info(alert.message);
            break;
          case 'success':
            toastr.success(alert.message);
            break;
          case 'warning':
            toastr.warning(alert.message);
            break;
        }

        if (alert.element) {
          angular.element('#form-group-' + alert.element).addClass('has-error');
        }
      },
      warn: function (warning) {
        if(!warning) {
          return;
        }
        this.addAlert({
          type: 'warning',
          message: warning.message || warning
        });
      },
      onError: function (error) {
        console.log(error);
        var errors = error.hasOwnProperty('errors') ? error.errors : error.data && error.data.errors;
        if(errors && (Object.keys(errors).length || errors.length) > 0) {
          _.each(errors, (function(e) {
            if(e.message || _.isString(e)) {
              this.addAlert({
                type: 'danger',
                message: e.message || e,
                element: e.path
              });
            }
          }).bind(this));
        }
        else if (error.message) {
          this.addAlert({
            type: 'danger',
            message: error.message,
            element: error.path
          });
        }
        else {
          this.addAlert({
            type: 'danger',
            message: error
          });
        }
      }
    };
  }
]);

app.controller('FormDeleteController', [
  '$scope',
  '$state',
  'FormioAlerts',
  'GoogleAnalytics',
  function(
    $scope,
    $state,
    FormioAlerts,
    GoogleAnalytics
  ) {
    $scope.$on('delete', function(event) {
      event.stopPropagation();
      FormioAlerts.addAlert({
        type: 'success',
        message: _.capitalize($scope.form.type) + ' was deleted.'
      });
      GoogleAnalytics.sendEvent('Form', 'delete', null, 1);
      $scope.back('project.' + $scope.formInfo.type + '.form.view');
    });

    $scope.$on('cancel', function(event) {
      event.stopPropagation();
      $scope.back('project.' + $scope.formInfo.type + '.form.view');
    });

    $scope.$on('formError', function(event, error) {
      event.stopPropagation();
      FormioAlerts.onError(error);
    });
  }
]);

app.controller('FormActionIndexController', [
  '$scope',
  '$state',
  'Formio',
  'FormioAlerts',
  function(
    $scope,
    $state,
    Formio,
    FormioAlerts
  ) {
    $scope.newAction = {name: '', title: 'Select an Action'};
    $scope.availableActions = {};
    $scope.addAction = function() {
      if ($scope.newAction.name) {
        $state.go('project.' + $scope.formInfo.type + '.form.action.add', {
          actionName: $scope.newAction.name
        });
      }
      else {
        FormioAlerts.onError({
          message: 'You must select an action to add.',
          element: 'action-select'
        });
      }
    };
    $scope.formio.loadActions()
      .then(function(actions) {
        $scope.actions = actions;
      }, FormioAlerts.onError.bind(FormioAlerts))
      .catch(FormioAlerts.onError.bind(FormioAlerts));
    $scope.formio.availableActions().then(function(available) {
      if (!available[0].name) {
        available.shift();
      }
      available.unshift($scope.newAction);
      $scope.availableActions = _.filter(available, function(action) {
        return action.name !== 'sql';
      });
    });
  }
]);

app.factory('ActionInfoLoader', [
  '$q',
  'Formio',
  function(
    $q,
    Formio
  ) {
    return {
      /**
       * Load the action and action information.
       *
       * @param $scope
       * @param $stateParams
       */
      load: function($scope, $stateParams) {
        // Get the action information.
        $scope.actionUrl = $scope.formio.formUrl + '/action';
        if ($stateParams.actionId) {
          $scope.actionUrl += ('/' + $stateParams.actionId);
        }
        $scope.actionInfo = $stateParams.actionInfo || {settingsForm: {}};
        $scope.action = {data: {settings: {}, condition: {}}};

        // Get the action information.
        var getActionInfo = function(name) {
          return $scope.formio.actionInfo(name).then(function(actionInfo) {
            if (!actionInfo) {
              return $scope.actionInfo;
            }
            $scope.actionInfo = _.cloneDeep(actionInfo);
            if ($scope.actionUrl) {
              $scope.actionInfo.settingsForm.action = $scope.actionUrl;
            }
            return $scope.actionInfo;
          });
        };

        /**
         * Load an action into the scope.
         * @param defaults
         */
        var loadAction = function(defaults) {
          if ($stateParams.actionId) {
            var loader = new Formio($scope.actionUrl);
            return loader.loadAction().then(function(action) {
              $scope.action = _.merge($scope.action, {data: action});
              return getActionInfo(action.name);
            });
          }
          else if (defaults) {
            $scope.action = _.merge($scope.action, {data: defaults});
            $scope.action.data.settings = {};
            return $q.when($scope.actionInfo);
          }
        };

        // Get the action information.
        if (!$stateParams.actionInfo && $stateParams.actionName) {
          return getActionInfo($stateParams.actionName).then(function(info) {
            return loadAction(info.defaults);
          }).catch(function(error) {
            $scope.error = error;
          });
        }
        else {
          // Load the action.
          return loadAction($scope.actionInfo.defaults);
        }
      }
    };
  }
]);

app.controller('FormActionEditController', [
  '$scope',
  '$stateParams',
  '$state',
  '$cacheFactory',
  'FormioAlerts',
  'ActionInfoLoader',
  'FormioUtils',
  'GoogleAnalytics',
  '$timeout',
  function(
    $scope,
    $stateParams,
    $state,
    $cacheFactory,
    FormioAlerts,
    ActionInfoLoader,
    FormioUtils,
    GoogleAnalytics,
    $timeout
  ) {
    // Invalidate cache so actions fetch fresh request for
    // component selection inputs.
    $cacheFactory.get('$http').removeAll();

    // Helpful warnings for certain actions
    ActionInfoLoader.load($scope, $stateParams).then(function(actionInfo) {
      // SQL Action missing sql server warning
      if(actionInfo && actionInfo.name === 'sql') {
        var typeComponent = FormioUtils.getComponent(actionInfo.settingsForm.components, 'type');
        if(JSON.parse(typeComponent.data.json).length === 0) {
          FormioAlerts.warn('<i class="glyphicon glyphicon-exclamation-sign"></i> You do not have any SQL servers configured. You can add a SQL server in your <a href="#/project/'+$scope.projectId+'/settings/databases">Project Settings</a>.');
        }
      }

      // Email action missing transports (other than the default one).
      if(actionInfo && actionInfo.name === 'email') {
        var transportComponent = FormioUtils.getComponent(actionInfo.settingsForm.components, 'transport');
        if(JSON.parse(transportComponent.data.json).length <= 1) {
          FormioAlerts.warn('<i class="glyphicon glyphicon-exclamation-sign"></i> You do not have any email transports configured. You can add an email transport in your <a href="#/project/'+$scope.projectId+'/settings/email">Project Settings</a>, or you can use the default transport (charges may apply).');
        }
      }

      // Oauth action alert for new resource missing role assignment.
      if (actionInfo && actionInfo.name === 'oauth') {
        var providers = FormioUtils.getComponent(actionInfo.settingsForm.components, 'provider');
        if (providers.data && providers.data.json && providers.data.json === '[]') {
          FormioAlerts.warn('<i class="glyphicon glyphicon-exclamation-sign"></i> The OAuth Action requires a provider to be configured, before it can be used. You can add an OAuth provider in your <a href="#/project/'+$scope.projectId+'/settings/oauth">Project Settings</a>.');
        }
      }

      // Google Sheets action alert for missing settings.
      if (actionInfo && actionInfo.name === 'googlesheet') {
        var settings = _.get($scope, 'currentProject.settings.google');
        if (!_.has(settings, 'clientId')) {
          FormioAlerts.warn('<i class="glyphicon glyphicon-exclamation-sign"></i> The Google Sheets Action requires a Client ID to be configured, before it can be used. You can add all Google Data Connection settings in your <a href="#/project/'+$scope.projectId+'/settings/oauth">Project Settings</a>.');
        }
        if (!_.has(settings, 'cskey')) {
          FormioAlerts.warn('<i class="glyphicon glyphicon-exclamation-sign"></i> The Google Sheets Action requires a Client Secret Key to be configured, before it can be used. You can add all Google Data Connection settings in your <a href="#/project/'+$scope.projectId+'/settings/oauth">Project Settings</a>.');
        }
        if (!_.has(settings, 'refreshtoken')) {
          FormioAlerts.warn('<i class="glyphicon glyphicon-exclamation-sign"></i> The Google Sheets Action requires a Refresh Token to be configured, before it can be used. You can add all Google Data Connection settings in your <a href="#/project/'+$scope.projectId+'/settings/oauth">Project Settings</a>.');
        }
      }

      // Hubspot action missing settings due to missing API key.
      if(actionInfo && actionInfo.name === 'hubspotContact') {
        var showFields = function(key, value) {
          var fields = {
            '_value': 'none',
            '_field': 'none'
          };
          switch(value) {
            case 'field':
              fields._field = '';
              break;
            case 'value':
            case 'increment':
            case 'decrement':
              fields._value = '';
              break;
          }
          angular.element('#form-group-' + key + '_value').css('display', fields._value);
          angular.element('#form-group-' + key + '_field').css('display', fields._field);
        };

        if(!$scope.currentProject.settings || !$scope.currentProject.settings.hubspot || !$scope.currentProject.settings.hubspot.apikey) {
          FormioAlerts.warn('<i class="glyphicon glyphicon-exclamation-sign"></i> You have not yet configured your Hubspot API key. You can configure your Hubspot API key in your <a href="#/project/'+$scope.projectId+'/settings/hubspot">Project Settings</a>.');
          $scope.formDisabled = true;
        }
        FormioUtils.eachComponent(actionInfo.settingsForm.components, function(component) {
          if (!component.key) {
            return;
          }

          var result = component.key.match(/(.*)_action/);
          if (result) {
            $timeout(function() {
              showFields(result[1], $scope.action.data.settings[result[0]]);
            });
            $scope.$watch('action.data.settings.' + result[0], function(current) {
              showFields(result[1], current);
            });
          }
        });
      }

      // Hide role settings component as needed
      var toggleVisible = function(association) {
        if(!association) {
          return;
        }

        angular.element('#form-group-role').css('display', (association === 'new' ? '' : 'none'));
        angular.element('#form-group-resource').css('display', (association === 'link' ? 'none' : ''));
      };

      // Find the role settings component, and require it as needed.
      var toggleRequired = function(association, formComponents) {
        if(!formComponents || !association) {
          return;
        }

        var roleComponent = FormioUtils.getComponent(formComponents, 'role');
        var resourceComponent = FormioUtils.getComponent(formComponents, 'resource');
        // Update the validation settings.
        if (roleComponent) {
          roleComponent.validate = roleComponent.validate || {};
          roleComponent.validate.required = (association === 'new' ? true : false);
        }
        if (resourceComponent) {
          resourceComponent.validate = resourceComponent.validate || {};
          resourceComponent.validate.required = (association === 'link' ? false : true);
        }
      };

      // Auth action validation changes for new resource missing role assignment.
      if(actionInfo && actionInfo.name === 'auth') {
        // Force the validation to be run on page load.
        $timeout(function() {
          var action = $scope.action.data.settings || {};
          toggleVisible(action.association);
          toggleRequired(action.association, actionInfo.settingsForm.components);
        });

        // Watch for changes to the action settings.
        $scope.$watch('action.data.settings', function(current, old) {
          // Make the role setting required if this is for new resource associations.
          if(current.association !== old.association) {
            toggleVisible(current.association);
            toggleRequired(current.association, actionInfo.settingsForm.components);

            // Dont save the old role settings if this is an existing association.
            current.role = (current.role && (current.association === 'new')) || '';
          }
        }, true);
      }

      var showProviderFields = function(association, provider) {
        angular.element('[id^=form-group-autofill-]').css('display', 'none');
        if(association === 'new' && provider) {
          angular.element('[id^=form-group-autofill-' + provider + ']').css('display', '');
        }
      };

      if(actionInfo && actionInfo.name === 'oauth') {
        // Show warning if button component has no options
        var buttonComponent = FormioUtils.getComponent(actionInfo.settingsForm.components, 'button');
        if(JSON.parse(buttonComponent.data.json).length === 0) {
          FormioAlerts.warn('<i class="glyphicon glyphicon-exclamation-sign"></i> You do not have any Button components with the `oauth` action on this form, which is required to use this action. You can add a Button component on the <a href="#/project/'+$scope.projectId+'/form/'+$scope.formId+'/edit">form edit page</a>.');
        }
        // Force the validation to be run on page load.
        $timeout(function() {
          var action = $scope.action.data.settings || {};
          toggleVisible(action.association);
          toggleRequired(action.association, actionInfo.settingsForm.components);
          showProviderFields(action.association, action.provider);
        });

        // Watch for changes to the action settings.
        $scope.$watch('action.data.settings', function(current, old) {
          // Make the role setting required if this is for new resource associations.
          if(current.association !== old.association) {
            toggleVisible(current.association);
            toggleRequired(current.association, actionInfo.settingsForm.components);
            showProviderFields(current.association, current.provider);

            // Dont save the old role settings if this is an existing association.
            current.role = (current.role && (current.association === 'new')) || '';
          }

          if(current.provider !== old.provider) {
            showProviderFields(current.association, current.provider);
          }
        }, true);
      }

      // Check for, and warn about premium actions being present.
      if(
        actionInfo &&
        actionInfo.hasOwnProperty('premium') &&
        actionInfo.premium === true &&
        $scope.currentProject &&
        $scope.currentProject.hasOwnProperty('plan') &&
        $scope.currentProject.plan === 'basic'
      ) {
        FormioAlerts.warn('<i class="glyphicon glyphicon-exclamation-sign"></i> This is a Premium Action, please upgrade your <a ui-sref="project.settings.plan">project plan</a> to enable it.');
      }
    });

    $scope.$on('formSubmission', function(event) {
      event.stopPropagation();
      var method = $scope.actionUrl ? 'updated' : 'created';
      FormioAlerts.addAlert({type: 'success', message: 'Action was ' + method + '.'});
      $state.go('project.' + $scope.formInfo.type + '.form.action.index');
      var eventAction = $scope.actionUrl ? 'update' : 'create';
      GoogleAnalytics.sendEvent('Action', eventAction, null, 1);
    });
  }
]);

app.controller('FormActionDeleteController', [
  '$scope',
  '$stateParams',
  '$state',
  'FormioAlerts',
  'GoogleAnalytics',
  function(
    $scope,
    $stateParams,
    $state,
    FormioAlerts,
    GoogleAnalytics
  ) {
    $scope.actionUrl = $scope.formio.formUrl + '/action/' + $stateParams.actionId;
    $scope.$on('delete', function(event) {
      event.stopPropagation();
      FormioAlerts.addAlert({type: 'success', message: 'Action was deleted.'});
      GoogleAnalytics.sendEvent('Action', 'delete', null, 1);
      $state.go('project.' + $scope.formInfo.type + '.form.action.index');
    });
    $scope.$on('cancel', function(event) {
      event.stopPropagation();
      $state.go('project.' + $scope.formInfo.type + '.form.action.index');
    });

  }
]);

app.controller('FormSubmissionsController', [
  '$scope',
  '$state',
  '$http',
  '$timeout',
  '$window',
  '$q',
  'Formio',
  'FormioUtils',
  'FormioAlerts',
  'formioComponents',
  'GoogleAnalytics',
  'ngDialog',
  '$interpolate',
  function(
    $scope,
    $state,
    $http,
    $timeout,
    $window,
    $q,
    Formio,
    FormioUtils,
    FormioAlerts,
    formioComponents,
    GoogleAnalytics,
    ngDialog,
    $interpolate
  ) {
    // Returns true if component should appear in table
    $scope.tableView = function(component) {
      return !component.protected &&
        (!component.hasOwnProperty('persistent') || component.persistent) &&
        (component.tableView);
    };

    // Creates resourcejs sort query from kendo datasource read options
    var getSortQuery = function(options) {
      return _.map(options, function(opt) {
        return (opt.dir === 'desc' ? '-' : '') + opt.field;
      }).join(' ');
    };

    // Kendo Grids aren't horizontally scrollable unless you give
    // them a fixed width. 100% stretches the page.
    // This manually resizes the grid so that we can have scrollbars
    $scope.$on('kendoWidgetCreated', function(event, widget) {
      var resizeGrid = function() {
        widget.element.width(0);
        widget.element.width(widget.element.parent().width());
      };
      resizeGrid();
      angular.element($window).bind('resize', resizeGrid);
      $scope.$on('$destroy', function() {
        angular.element($window).unbind('resize', resizeGrid);
      });
    });

    $scope.selected = function() {
      return $scope.grid && _.map($scope.grid.select(), $scope.grid.dataItem.bind($scope.grid));
    };

    $scope.view = function() {
      $state.go('project.' + $scope.formInfo.type + '.form.submission.item.view', {
        subId: $scope.selected()[0]._id
      });
    };

    $scope.edit = function() {
      $state.go('project.' + $scope.formInfo.type + '.form.submission.item.edit', {
        subId: $scope.selected()[0]._id
      });
    };

    // Kendo ain't give us promises!!
    $scope.recentlyDeletedPromises = [];

    $scope.delete = function() {
      ngDialog.open({
        template: 'views/form/submission/delete-confirmation.html',
        showClose: false,
        scope: $scope
      }).closePromise.then(function(e) {
        var cancelled = e.value === false || e.value === '$closeButton' || e.value === '$document';
        if(!cancelled) {
          var dataSource = $scope.gridOptions.dataSource;
          $scope.recentlyDeletedPromises = [];
          _.each($scope.selected(), dataSource.remove.bind(dataSource));
          dataSource.sync();
          $q.all($scope.recentlyDeletedPromises).finally(dataSource.read.bind(dataSource));
        }
      });
    };

    var stopScroll = function(element) {
      var activeElement;

      angular.element($window.document).bind('mousewheel DOMMouseScroll', function(e) {
          var scrollTo = null;

          if (!angular.element(activeElement).closest('.k-popup').length) {
            return;
          }

          if (e.type === 'mousewheel') {
              scrollTo = (e.originalEvent.wheelDelta * -1);
          }
          else if (e.type === 'DOMMouseScroll') {
              scrollTo = 40 * e.originalEvent.detail;
          }

          if (scrollTo) {
              e.preventDefault();
              element.scrollTop(scrollTo + element.scrollTop());
          }
      });

      angular.element($window.document).on('mouseover', function(e) {
            activeElement = e.target;
      });
    };

    var getKendoCell = function(component, path) {
      var filterable;
      switch(component.type) {
        case 'datetime': filterable = { ui: 'datetimepicker' };
          break;
        // Filtering is not supported for these data types in resourcejs yet
        case 'address':
        case 'resource':
        case 'signature':
          filterable = false;
          break;
        default: filterable = true;
      }

      var field = path
        ? '["data.' + path + '.' + component.key.replace(/\./g, '.data.') + '"]'
        : '["data.' + component.key.replace(/\./g, '.data.') + '"]';

      return {
        field: field,
        title: component.label || component.key,
        template: function(dataItem) {
          var val = dataItem.data;
          if (path && _.has(val, path)) {
            val = _.get(val, path)
          }

          var value = Formio.fieldData(val.toJSON(), component);
          var componentInfo = formioComponents.components[component.type] || formioComponents.components.custom;
          if (!componentInfo || !componentInfo.tableView) {
            if (value === undefined) {
              return '';
            }
            if (component.multiple) {
              return value.join(', ');
            }
            return value;
          }
          if (component.multiple && (value.length > 0)) {
            var values = [];
            angular.forEach(value, function(arrayValue) {
              arrayValue = componentInfo.tableView(arrayValue, component, $interpolate, formioComponents);
              if (arrayValue === undefined) {
                return values.push('');
              }
              values.push(arrayValue);
            });
            return values.join(', ');
          }
          value = componentInfo.tableView(value, component, $interpolate, formioComponents);
          if (value === undefined) {
            return '';
          }
          return value;
        },
        // Disabling sorting on embedded fields because it doesn't work in resourcejs yet
        width: '200px',
        filterable: filterable
      };
    };

    // When form is loaded, create the columns
    $scope.loadFormPromise.then(function() {
      // Load the grid on the next digest.
      $timeout(function() {
        // Define DataSource
        var dataSource = new kendo.data.DataSource({
          page: 1,
          pageSize: 10,
          serverPaging: true,
          serverSorting: true,
          serverFiltering: true,
          sort: {
            dir: 'desc',
            field: 'created'
          },
          schema: {
            model: {
              id: '_id',
              fields: _(FormioUtils.flattenComponents($scope.form.components))
                .filter(function(component, path) {
                  // Don't include fields that are nested.
                  return path.indexOf('.') === -1;
                })
                .filter($scope.tableView)
                .map(function(component) {
                  var type;
                  switch(component.type) {
                    case 'checkbox': type = 'boolean';
                      break;
                    case 'datetime': type = 'date';
                      break;
                    case 'number': type = 'number';
                      break;
                    default: type = 'string';
                  }

                  // FOR-323 - Escape data to fix keys with - in them, because they are not valid js identifiers.
                  return ['["data.' + component.key.replace(/\./g, '.data.') + '"]', {type: type}];
                })
                .concat([
                  ['created', {type: 'date'}],
                  ['modified', {type: 'date'}]
                ])
                .fromPairs()
                .value()
            },
            total: function(result) {
              var match = result.headers('content-range').match(/\d+-\d+\/(\d+)/);
              return (match && match[1]) || 0;
            },
            data: 'data'
          },
          transport: {
            read: function(options) {
              var filters = options.data.filter && options.data.filter.filters;
              var params = {
                limit: options.data.take,
                skip: options.data.skip,
                sort: getSortQuery(options.data.sort)
              };
              _.each(filters, function(filter) {
                switch(filter.operator) {
                  case 'eq': params[filter.field] = filter.value;
                    break;
                  case 'neq': params[filter.field + '__ne'] = filter.value;
                    break;
                  case 'startswith': params[filter.field + '__regex'] = '/^' + filter.value + '/i';
                    break;
                  case 'endswith': params[filter.field + '__regex'] = '/' + filter.value + '$/i';
                    break;
                  case 'contains': params[filter.field + '__regex'] = '/' + _.escapeRegExp(filter.value) + '/i';
                    break;
                  case 'doesnotcontain': params[filter.field + '__regex'] = '/^((?!' + _.escapeRegExp(filter.value) + ').)*$/i';
                    break;
                  case 'matchesregex': params[filter.field + '__regex'] = filter.value;
                    break;
                  case 'gt': params[filter.field + '__gt'] = filter.value;
                    break;
                  case 'gte': params[filter.field + '__gte'] = filter.value;
                    break;
                  case 'lt': params[filter.field + '__lt'] = filter.value;
                    break;
                  case 'lte': params[filter.field + '__lte'] = filter.value;
                    break;
                }
              });

              $http.get($scope.formio.submissionsUrl, {
                params: params
              })
              .then(options.success)
              .catch(function(err) {
                FormioAlerts.onError(err);
                options.error(err);
              });
            },
            destroy: function(options) {
              $scope.recentlyDeletedPromises.push($http.delete($scope.formio.submissionsUrl + '/' + options.data._id)
              .then(function(result) {
                GoogleAnalytics.sendEvent('Submission', 'delete', null, 1);
                options.success();
              })
              .catch(function(err) {
                FormioAlerts.onError(err);
                options.error(err);
              }));
            }
          }
        });

        // Track component keys inside objects, so they dont appear in the grid more than once.
        var componentHistory = [];

        // Generate columns
        var columns = [];
        FormioUtils.eachComponent($scope.form.components, function(component, componentPath) {
          if (component.tableView === false || !component.key) {
            return;
          }
          // FOR-310 - If this component was already added to the grid, dont add it again.
          if (component.key && componentHistory.indexOf(component.key) !== -1) {
            return;
          }

          if (['container', 'datagrid'].indexOf(component.type) !== -1) {
            FormioUtils.eachComponent(component.components, function(component) {
              if (component.key) {
                componentHistory.push(component.key)
              }
            }, true);
          }

          columns.push(getKendoCell(component));
        }, true);

        columns.push(
          {
            field: 'created',
            title: 'Submitted',
            width: '200px',
            filterable: {
              ui: 'datetimepicker'
            },
            template: function(dataItem) {
              return moment(dataItem.created).format('lll');
            }
          },
          {
            field: 'modified',
            title: 'Updated',
            width: '200px',
            filterable: {
              ui: 'datetimepicker'
            },
            template: function(dataItem) {
              return moment(dataItem.modified).format('lll');
            }
          }
        );

        // Define grid options
        $scope.gridOptions = {
          allowCopy: {
            delimiter: ','
          },
          filterable: {
            operators: {
              string: {
                eq: 'Is equal to',
                neq: 'Is not equal to',
                startswith: 'Starts with',
                contains: 'Contains',
                doesnotcontain: 'Does not contain',
                endswith: 'Ends with',
                matchesregex: 'Matches (RegExp)',
                gt: 'Greater than',
                gte: 'Greater than or equal to',
                lt: 'Less than',
                lte: 'Less than or equal to'
              },
              date: {
                gt: 'Is after',
                lt: 'Is before'
              }
            },
            messages: {
              isTrue: 'True',
              isFalse: 'False'
            },
            mode: 'menu',
            extra: false
          },
          pageable: {
            numeric: false,
            input: true,
            refresh: true,
            pageSizes: [5, 10, 25, 50, 100, 'all']
          },
          sortable: true,
          resizable: true,
          reorderable: true,
          selectable: 'multiple, row',
          columnMenu: true,
          // This defaults to 'data' and screws everything up,
          // so we set it to something that isn't a property on submissions
          templateSettings: { paramName: 'notdata' },
          toolbar:
            '<div>' +
              '<button class="btn btn-default btn-xs" ng-click="view()" ng-disabled="selected().length != 1" ng-class="{\'btn-primary\':selected().length == 1}">' +
                '<span class="glyphicon glyphicon-eye-open"></span> View' +
              '</button>&nbsp;' +
              '<button class="btn btn-default btn-xs" ng-click="edit()" ng-disabled="selected().length != 1" ng-class="{\'btn-primary\':selected().length == 1}">' +
                '<span class="glyphicon glyphicon-edit"></span> Edit' +
              '</button>&nbsp;' +
              '<button class="btn btn-default btn-xs" ng-click="delete()" ng-disabled="selected().length < 1" ng-class="{\'btn-danger\':selected().length >= 1}">' +
                '<span class="glyphicon glyphicon-remove-circle"></span> Delete' +
              '</button>' +
            '</div>',
          change: $scope.$apply.bind($scope),
          dataSource: dataSource,
          columns: columns,
          columnMenuInit: function(e) {
            e.container.find('[data-role=dropdownlist]').each(function() {
              var widget = angular.element(this).data('kendoDropDownList');
              stopScroll(widget.ul.parent());
            });
          }
        };
      });
    });
  }
]);

app.controller('FormSubmissionController', [
  '$scope',
  '$state',
  '$stateParams',
  'Formio',
  function(
    $scope,
    $state,
    $stateParams,
    Formio
  ) {
    // Submission information.
    $scope.submissionId = $stateParams.subId;
    $scope.submissionUrl = $scope.formUrl;
    $scope.submissionUrl += $stateParams.subId ? ('/submission/' + $stateParams.subId) : '';
    $scope.submissionData = Formio.submissionData;
    $scope.submission = {};

    // Load the form and submissions.
    $scope.formio = new Formio($scope.submissionUrl);

    // Load the submission.
    $scope.formio.loadSubmission().then(function(submission) {
      $scope.submission = submission;
    });
  }
]);

app.controller('FormSubmissionEditController', [
  '$scope',
  '$state',
  'FormioAlerts',
  'GoogleAnalytics',
  function(
    $scope,
    $state,
    FormioAlerts,
    GoogleAnalytics
  ) {
    $scope.$on('formSubmission', function(event, submission) {
      event.stopPropagation();
      var message = (submission.method === 'put') ? 'updated' : 'created';
      FormioAlerts.addAlert({
        type: 'success',
        message: 'Submission was ' + message + '.'
      });
      GoogleAnalytics.sendEvent('Submission', 'update', null, 1);
      $state.go('project.' + $scope.formInfo.type + '.form.submission.index', {formId: $scope.formId});
    });
  }
]);

app.controller('FormSubmissionDeleteController', [
  '$scope',
  '$state',
  'FormioAlerts',
  'GoogleAnalytics',
  function(
    $scope,
    $state,
    FormioAlerts,
    GoogleAnalytics
  ) {
    $scope.$on('delete', function(event) {
      event.stopPropagation();
      FormioAlerts.addAlert({
        type: 'success',
        message: 'Submission was deleted.'
      });
      GoogleAnalytics.sendEvent('Submission', 'delete', null, 1);
      $state.go('project.' + $scope.formInfo.type + '.form.submission.index');
    });

    $scope.$on('cancel', function(event) {
      event.stopPropagation();
      $scope.back('project.' + $scope.formInfo.type + '.form.submission.item.view');
    });

    $scope.$on('formError', function(event, error) {
      event.stopPropagation();
      FormioAlerts.onError(error);
    });
  }
]);

app.constant('SubmissionAccessLabels', {
  'create_all': {
    label: 'Create All Submissions',
    tooltip: 'The Create All Submissions permission will allow a user, with one of the given Roles, to create a new Submission and assign ownership of that Submission.'
  },
  'read_all': {
    label: 'Read All Submissions',
    tooltip: 'The Read All Submissions permission will allow a user, with one of the given Roles, to read a Submission, regardless of who owns the Submission.'
  },
  'update_all': {
    label: 'Update All Submissions',
    tooltip: 'The Update All Submissions permission will allow a user, with one of the given Roles, to update a Submission, regardless of who owns the Submission. Additionally with this permission, a user can change the owner of a Submission.'
  },
  'delete_all': {
    label: 'Delete All Submissions',
    tooltip: 'The Delete All Submissions permission will allow a user, with one of the given Roles, to delete a Submission, regardless of who owns the Submission.'
  },
  'create_own': {
    label: 'Create Own Submissions',
    tooltip: 'The Create Own Submissions permission will allow a user, with one of the given Roles, to create a Submission. Upon creating the Submission, the user will be defined as its owner.'
  },
  'read_own': {
    label: 'Read Own Submissions',
    tooltip: 'The Read Own Submissions permission will allow a user, with one of the given Roles, to read a Submission. A user can only read a Submission if they are defined as its owner.'
  },
  'update_own': {
    label: 'Update Own Submissions',
    tooltip: 'The Update Own Submissions permission will allow a user, with one of the given Roles, to update a Submission. A user can only update a Submission if they are defined as its owner.'
  },
  'delete_own': {
    label: 'Delete Own Submissions',
    tooltip: 'The Delete Own Submissions permission will allow a user, with one of the given Roles, to delete a Submission. A user can only delete a Submission if they are defined as its owner.'
  }
});

app.constant('ResourceAccessLabels', {
  'read': {
    label: 'Read',
    tooltip: 'The Read permission will allow a resource, defined in the submission, to read all of the submission data.'
  },
  'write': {
    label: 'Write',
    tooltip: 'The Write permission will allow a resource, defined in the submission, to read all of the submission data and edit all of the data except for the Submission Resource Access and Owner information.'
  },
  'admin': {
    label: 'Admin',
    tooltip: 'The Admin permission will allow a resource, defined in the submission, to read and edit all of the submission data.'
  }
});

app.constant('AccessLabels', {
  'read_all': {
  label: 'Read Form Definition',
  tooltip: 'The Read permission will allow a user, with one of the given Roles, to read the form.'
  },
  'update_all': {
  label: 'Update Form Definition',
  tooltip: 'The Update permission will allow a user, with one of the given Roles, to read and edit the form.'
  },
  'delete_all': {
  label: 'Delete Form Definition',
  tooltip: 'The Delete permission will allow a user, with one of the given Roles, to delete the form.'
  },
  'read_own': {
  label: 'Read Form Definition (Restricted to owners)',
  tooltip: 'The Read Own permission will allow a user, with one of the given Roles, to read a form. A user can only read a form if they are defined as its owner.'
  },
  'update_own': {
  label: 'Update Form Definition (Restricted to owners)',
  tooltip: 'The Update Own permission will allow a user, with one of the given Roles, to update a form. A user can only update a form if they are defined as its owner.'
  },
  'delete_own': {
  label: 'Delete Form Definition (Restricted to owners)',
  tooltip: 'The Delete Own permission will allow a user, with one of the given Roles, to delete a form. A user can only delete a form if they are defined as its owner.'
  }
});

app.controller('ApiController', [
  '$scope',
  '$state',
  'Formio',
  function(
    $scope,
    $state,
    Formio
  ) {
    $scope.currentSection.title = 'API Explorer';
    $scope.currentSection.icon = 'fa fa-code';
    $scope.currentSection.help = '';
    $scope.token = Formio.getToken();
  }
]);
